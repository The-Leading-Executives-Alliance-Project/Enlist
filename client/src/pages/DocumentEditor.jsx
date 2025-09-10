import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DocumentChatbot from '../components/chat/DocumentChatbot';
import TextAreaDocument from '../components/TextAreaDocument';
import documentChatService from '../services/documentChatService';

const DocumentEditor = () => {
    const { essayId } = useParams();
    const [essay, setEssay] = useState('');
    const [originalEssay, setOriginalEssay] = useState(''); // Keep track of original text
    const [messages, setMessages] = useState([
        { sender: 'ai', text: 'Hi! I am here to help you with your essay. Type your essay and ask me for improvements!' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [highlightedRanges, setHighlightedRanges] = useState([]);

    const textareaRef = useRef(null);

    // Helper function to get all pending changes from all messages
    const getAllPendingChanges = () => {
        return messages
            .filter(msg => msg.sender === 'ai' && msg.changes)
            .flatMap(msg => msg.changes)
            .filter(change => change.status === 'pending');
    };

    // Helper function to get changes from the latest AI message only
    const getLatestChanges = () => {
        // Find the latest AI message with changes
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].sender === 'ai' && messages[i].changes && messages[i].changes.length > 0) {
                return messages[i].changes;
            }
        }
        return [];
    };

    // Apply text changes with position calculation using our algorithm
    const applyTextChanges = (changesToApply, baseText) => {
        let newText = baseText;
        const newHighlights = [];
        let offset = 0; // Track cumulative position changes

        // Calculate positions first, then sort by position
        const changesWithPositions = changesToApply.map(change => {
            const position = findTextPosition(baseText, change.originalText);
            return { ...change, position };
        }).filter(change => change.position !== null); // Remove changes where text wasn't found

        // Sort by calculated position
        const sortedChanges = changesWithPositions.sort((a, b) => a.position.start - b.position.start);

        sortedChanges.forEach((change, index) => {
            const { newText: replacementText, originalText, position } = change;

            // Adjust positions for previous changes
            const adjustedStart = position.start + offset;
            const adjustedEnd = position.end + offset;

            console.log('Adjusted start:', adjustedStart);
            // Apply the change
            newText = newText.substring(0, adjustedStart) +
                replacementText +
                newText.substring(adjustedEnd);

            // Create highlight at the adjusted position
            newHighlights.push({
                id: `highlight-${index}`,
                start: adjustedStart,
                end: adjustedStart + replacementText.length,
                changeIndex: index,
                originalText: originalText,
                newText: replacementText
            });

            // Update offset for next changes
            offset += replacementText.length - (position.end - position.start);
        });

        setEssay(newText);
        setHighlightedRanges(newHighlights);
    };

    // Algorithm to find text position in base text
    const findTextPosition = (baseText, searchText) => {
        const start = baseText.indexOf(searchText);
        if (start === -1) return null; // Text not found

        return {
            start: start,
            end: start + searchText.length
        };
    };

    // Accept an individual change
    const handleAcceptChange = (changeIndex) => {
        console.log('Accepting change:', changeIndex);

        setMessages(prev => {
            // Find the latest AI message with changes
            let latestAiMessageIndex = -1;
            for (let i = prev.length - 1; i >= 0; i--) {
                if (prev[i].sender === 'ai' && prev[i].changes && prev[i].changes.length > 0) {
                    latestAiMessageIndex = i;
                    break;
                }
            }
            
            if (latestAiMessageIndex === -1) {
                return prev;
            }

            const latestMessage = prev[latestAiMessageIndex];

            // Update only the latest message's changes
            const updatedChanges = latestMessage.changes.map((change, index) => {
                if (index === changeIndex) {
                    return { ...change, status: 'accepted' };
                }
                return change;
            });

            // Create new messages array with only the latest message updated
            const newMessages = [...prev];
            newMessages[latestAiMessageIndex] = {
                ...latestMessage,
                changes: updatedChanges
            };

            return newMessages;
        });

        // Remove highlights for this specific change
        setHighlightedRanges(prev =>
            prev.filter(h => h.changeIndex !== changeIndex)
        );
    };

    // Reject an individual change
    const handleRejectChange = (changeIndex) => {
        console.log('Rejecting change:', changeIndex);

        setMessages(prev => {
            // Find the latest AI message with changes
            let latestAiMessageIndex = -1;
            for (let i = prev.length - 1; i >= 0; i--) {
                if (prev[i].sender === 'ai' && prev[i].changes && prev[i].changes.length > 0) {
                    latestAiMessageIndex = i;
                    break;
                }
            }
            
            if (latestAiMessageIndex === -1) {
                return prev;
            }

            const latestMessage = prev[latestAiMessageIndex];

            // Update only the latest message's changes
            const updatedChanges = latestMessage.changes.map((change, index) => {
                if (index === changeIndex) {
                    return { ...change, status: 'rejected' };
                }
                return change;
            });

            // Create new messages array with only the latest message updated
            const newMessages = [...prev];
            newMessages[latestAiMessageIndex] = {
                ...latestMessage,
                changes: updatedChanges
            };

            return newMessages;
        });

        // Remove the specific change from the current essay
        const rejectedChange = messages
            .filter(msg => msg.sender === 'ai' && msg.changes)
            .flatMap(msg => msg.changes)
            .find(change => change.changeIndex === changeIndex);
        
        if (rejectedChange) {
            // Replace the new text with the original text in the current essay
            const currentEssayText = essay;
            const updatedEssayText = currentEssayText.replace(
                rejectedChange.newText, 
                rejectedChange.originalText
            );
            
            setEssay(updatedEssayText);
        }

        // Remove the highlight for this specific change
        setHighlightedRanges(prev =>
            prev.filter(h => h.changeIndex !== changeIndex)
        );
    };

    const handleSendMessage = async (message) => {
        try {
            setIsLoading(true);

            // Add user message to chat
            const userMessage = { sender: 'user', text: message };
            setMessages(prev => [...prev, userMessage]);

            // Auto-reject any pending changes when user sends a new message
            const pendingChanges = getAllPendingChanges();
            if (pendingChanges.length > 0) {
                console.log('Auto-rejecting pending changes:', pendingChanges.length);
                
                // Mark all pending changes as rejected
                setMessages(prev =>
                    prev.map(msg => {
                        if (msg.sender === 'ai' && msg.changes) {
                            const updatedChanges = msg.changes.map(change => {
                                if (change.status === 'pending') {
                                    return { ...change, status: 'rejected' };
                                }
                                return change;
                            });
                            return { ...msg, changes: updatedChanges };
                        }
                        return msg;
                    })
                );

                // Remove only the pending changes from the essay, keep accepted ones
                let updatedEssay = essay;
                pendingChanges.forEach(change => {
                    // Replace the new text with original text for rejected changes
                    updatedEssay = updatedEssay.replace(change.newText, change.originalText);
                });
                setEssay(updatedEssay);

                // Remove highlights for rejected changes only
                setHighlightedRanges(prev =>
                    prev.filter(h => {
                        // Keep highlights for accepted changes, remove for rejected ones
                        const change = pendingChanges.find(pc => pc.originalText === h.originalText);
                        return !change; // Keep highlight if change is not in pending (rejected) list
                    })
                );
            }

            // Store original essay before AI makes changes
            const currentEssay = essay;
            console.log('Storing original essay before AI changes:', currentEssay);
            setOriginalEssay(currentEssay);

            // Prepare the prompt for AI
            const prompt = `You are an expert essay writing assistant. Your role is to help improve essays by making specific, targeted changes.

Current essay:
${currentEssay}

User request: ${message}

Please improve the essay based on the user's request. Respond with ONLY a JSON object in this exact format:
{
  "improvedText": "the complete improved essay text",
  "changes": [
    {
      "originalText": "exact original text to be replaced",
      "newText": "improved text to replace it",
      "title": "Brief title for this improvement (e.g., 'Enhanced Vocabulary', 'Improved Clarity', 'Better Flow')",
      "description": "Detailed explanation of why this change was made and how it improves the essay"
    }
  ]
}

IMPORTANT REQUIREMENTS:
- The "originalText" should be the EXACT text that was in the original essay
- The "newText" should be the EXACT text that will replace it
- Make sure the originalText exists in the current essay
- Focus on making meaningful improvements to content, clarity, and flow
- Provide clear, specific changes rather than vague suggestions

Make sure the JSON is valid and properly formatted.`;

            // Call OpenAI API
            const response = await fetch('/api/document-chat/improve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // This is the JWT token
                },
                body: JSON.stringify({
                    prompt: prompt
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get AI response');
            }

            const data = await response.json();

            // Parse AI response
            let aiResponse;
            let changes = [];

            // Log the raw AI response to see what we're getting
            console.log('Raw AI Response:', data.message);
            console.log('Response type:', typeof data.message);
            console.log('Response length:', data.message.length);

            try {
                const parsedResponse = JSON.parse(data.message);
                aiResponse = `I've analyzed your essay and made improvements based on your request.`;
                changes = parsedResponse.changes || [];

                // Don't set the essay here - let applyTextChanges handle it

            } catch (parseError) {
                console.error('Failed to parse AI response:', parseError);
                aiResponse = 'I made some improvements to your essay.';
                // Fallback: treat the response as plain text
                setEssay(data.message);
            }

            // Create changes array with proper structure
            const changesWithStatus = changes.map((change, index) => ({
                newText: change.newText,
                title: change.title || `Improvement ${index + 1}`,
                description: change.description,
                originalText: change.originalText,
                status: 'pending' // Individual change status
            }));

            // Apply all changes automatically using the current essay as the base
            applyTextChanges(changesWithStatus, currentEssay);


            // Add AI response to chat
            const aiMessage = {
                sender: 'ai',
                text: aiResponse,
                changes: changesWithStatus
            };
            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = { sender: 'ai', text: 'Sorry, I encountered an error. Please try again.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };



    const getTitle = () => {
        const titles = {
            'personal-statement': 'Personal Statement',
            'why-ubc': 'Why UBC',
            'why-sauder': 'Why Sauder',
            'why-sfu': 'Why SFU',
            'why-beedie': 'Why Beedie'
        };
        return titles[essayId] || 'Essay';
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 h-full min-h-[80vh]">
            <TextAreaDocument
                essay={essay}
                setEssay={setEssay}
                highlightedRanges={highlightedRanges}
                changes={getLatestChanges()}
                textareaRef={textareaRef}
                getTitle={getTitle}
            />

            <DocumentChatbot
                onSendMessage={handleSendMessage}
                messages={messages}
                isLoading={isLoading}
                onAcceptChange={handleAcceptChange}
                onRejectChange={handleRejectChange}
            />
        </div>
    );
};

export default DocumentEditor; 