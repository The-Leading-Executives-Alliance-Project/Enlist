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
    const [suggestionSections, setSuggestionSections] = useState([]);
    const [highlightedRanges, setHighlightedRanges] = useState([]);

    const textareaRef = useRef(null);

    // Apply text changes with position calculation using our algorithm
    const applyTextChanges = (changes, baseText) => {
        let newText = baseText;
        const newHighlights = [];
        let offset = 0; // Track cumulative position changes

        // Calculate positions first, then sort by position
        const changesWithPositions = changes.map(change => {
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
                sectionId: change.sectionId,
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

    // Remove highlights for a specific section
    const removeSectionHighlights = (sectionId) => {
        setHighlightedRanges(prev => prev.filter(h => h.sectionId !== sectionId));
    };

    // Accept an individual change
    const handleAcceptChange = (sectionId, changeIndex) => {
        console.log('Accepting change:', sectionId, changeIndex);

        // Update the specific change status
        setSuggestionSections(prev =>
            prev.map(section =>
                section.id === sectionId
                    ? {
                        ...section,
                        changes: section.changes.map((change, index) =>
                            index === changeIndex
                                ? { ...change, status: 'accepted' }
                                : change
                        )
                    }
                    : section
            )
        );

        // Remove highlights for this specific change
        setHighlightedRanges(prev =>
            prev.filter(h => !(h.sectionId === sectionId && h.changeIndex === changeIndex))
        );
    };

    // Reject an individual change
    const handleRejectChange = (sectionId, changeIndex) => {
        console.log('Rejecting change:', sectionId, changeIndex);

        const section = suggestionSections.find(s => s.id === sectionId);
        if (!section) return;

        const change = section.changes[changeIndex];
        if (!change) return;

        console.log('Rejecting change:', change);

        // Update the specific change status
        setSuggestionSections(prev =>
            prev.map(section =>
                section.id === sectionId
                    ? {
                        ...section,
                        changes: section.changes.map((c, index) =>
                            index === changeIndex
                                ? { ...c, status: 'rejected' }
                                : c
                        )
                    }
                    : section
            )
        );

        // Get all remaining pending changes (excluding the rejected one)
        const remainingChanges = suggestionSections
            .flatMap(section =>
                section.changes
                    .filter((change, index) =>
                        change.status === 'pending' &&
                        !(section.id === sectionId && index === changeIndex)
                    )
                    .map(change => ({
                        ...change,
                        sectionId: section.id
                    }))
            );

        // Reapply all remaining changes from the original essay
        if (remainingChanges.length > 0) {
            applyTextChanges(remainingChanges, originalEssay);
        } else {
            // No active changes, revert to original
            setEssay(originalEssay);
            setHighlightedRanges([]);
        }
    };

    const handleSendMessage = async (message) => {
        try {
            setIsLoading(true);

            // Add user message to chat
            const userMessage = { sender: 'user', text: message };
            setMessages(prev => [...prev, userMessage]);

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

            // Create single suggestion section
            const suggestionSection = {
                id: 'ai-suggestions',
                title: 'AI Improvements',
                description: 'Improvements based on your request',
                changes: changes.map((change, index) => ({
                    newText: change.newText,
                    title: change.title || `Improvement ${index + 1}`,
                    description: change.description,
                    originalText: change.originalText,
                    status: 'pending' // Individual change status
                })),
                status: 'pending'
            };

            // Add section IDs to changes
            const changesWithSectionIds = suggestionSection.changes.map(change => ({
                ...change,
                sectionId: suggestionSection.id
            }));

            // Apply all changes automatically using the current essay as the base
            applyTextChanges(changesWithSectionIds, currentEssay);

            // Store suggestion section
            setSuggestionSections([suggestionSection]);

            // Add AI response to chat
            const aiMessage = {
                sender: 'ai',
                text: aiResponse,
                suggestionSections: [suggestionSection]
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
                suggestionSections={suggestionSections}
                textareaRef={textareaRef}
                getTitle={getTitle}
            />

            <DocumentChatbot
                onSendMessage={handleSendMessage}
                messages={messages}
                isLoading={isLoading}
                suggestionSections={suggestionSections}
                onAcceptChange={handleAcceptChange}
                onRejectChange={handleRejectChange}
            />
        </div>
    );
};

export default DocumentEditor; 