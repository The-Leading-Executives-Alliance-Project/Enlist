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

    // Apply text changes and create highlights
    const applyTextChanges = (changes) => {
        let newText = essay; // Start with current essay, not original
        const newHighlights = [];
        let offset = 0;

        // Sort changes by start position to apply them in order
        const sortedChanges = [...changes].sort((a, b) => a.range.start - b.range.start);

        sortedChanges.forEach((change, index) => {
            const { range, newText: replacementText } = change;

            // Adjust positions for previous changes
            const adjustedStart = range.start + offset;
            const adjustedEnd = range.end + offset;

            // Apply the change - replace original text with suggested text
            newText = newText.substring(0, adjustedStart) + replacementText + newText.substring(adjustedEnd);

            // Create highlight range for the suggested text
            newHighlights.push({
                id: `highlight-${index}`,
                start: adjustedStart,
                end: adjustedStart + replacementText.length,
                sectionId: change.sectionId,
                originalText: essay.substring(range.start, range.end), // Store original for rejection
                newText: replacementText
            });

            // Update offset for next changes
            offset += replacementText.length - (range.end - range.start);
        });

        // Update the textarea with the modified text (suggested text is now in the textarea)
        setEssay(newText);
        setHighlightedRanges(newHighlights);
    };

    // Remove highlights for a specific section
    const removeSectionHighlights = (sectionId) => {
        setHighlightedRanges(prev => prev.filter(h => h.sectionId !== sectionId));
    };

    // Accept a suggestion section
    const handleAcceptSection = (sectionId) => {
        // Remove highlights for this section (changes are already applied)
        removeSectionHighlights(sectionId);

        // Update section status
        setSuggestionSections(prev =>
            prev.map(section =>
                section.id === sectionId
                    ? { ...section, status: 'accepted' }
                    : section
            )
        );
    };

    // Reject a suggestion section
    const handleRejectSection = (sectionId) => {
        const section = suggestionSections.find(s => s.id === sectionId);
        if (!section) return;

        // Revert changes for this section
        const sectionHighlights = highlightedRanges.filter(h => h.sectionId === sectionId);

        let newText = essay;
        let offset = 0;

        // Sort highlights by position and revert them
        const sortedHighlights = [...sectionHighlights].sort((a, b) => a.start - b.start);

        sortedHighlights.forEach(highlight => {
            const adjustedStart = highlight.start + offset;
            const adjustedEnd = highlight.end + offset;

            // Revert to original text
            newText = newText.substring(0, adjustedStart) + highlight.originalText + newText.substring(adjustedEnd);

            // Update offset
            offset += highlight.originalText.length - (highlight.end - highlight.start);
        });

        setEssay(newText);
        removeSectionHighlights(sectionId);

        // Update section status
        setSuggestionSections(prev =>
            prev.map(section =>
                section.id === sectionId
                    ? { ...section, status: 'rejected' }
                    : section
            )
        );
    };

    const handleSendMessage = async (message) => {
        try {
            setIsLoading(true);

            // Add user message to chat
            const userMessage = { sender: 'user', text: message };
            setMessages(prev => [...prev, userMessage]);

            // Store original essay before AI makes changes
            setOriginalEssay(essay);

            // Simulate AI response with multiple suggestion sections
            const aiResponse = `I've analyzed your essay and made several improvements:`;

            // Create mock suggestion sections (replace with real AI response later)
            const mockSections = [
                {
                    id: 'section-1',
                    title: 'Grammar & Style',
                    description: 'Fixed grammatical errors and improved writing style',
                    changes: [
                        {
                            range: { start: 0, end: 4 },
                            newText: 'I am',
                            description: 'Fixed subject-verb agreement',
                            originalText: essay.substring(0, 4) || 'I am'
                        },
                        {
                            range: { start: Math.max(0, essay.length - 10), end: essay.length },
                            newText: 'university.',
                            description: 'Improved sentence ending',
                            originalText: essay.substring(Math.max(0, essay.length - 10), essay.length) || 'university.'
                        }
                    ],
                    status: 'pending'
                },
                {
                    id: 'section-2',
                    title: 'Content Enhancement',
                    description: 'Added more compelling and descriptive language',
                    changes: [
                        {
                            range: { start: Math.floor(essay.length / 3), end: Math.floor(essay.length / 2) },
                            newText: 'passionate about learning and',
                            description: 'Enhanced with stronger language',
                            originalText: essay.substring(Math.floor(essay.length / 3), Math.floor(essay.length / 2)) || 'like to study'
                        }
                    ],
                    status: 'pending'
                }
            ];

            // Add section IDs to changes
            const changesWithSectionIds = mockSections.flatMap(section =>
                section.changes.map(change => ({
                    ...change,
                    sectionId: section.id
                }))
            );

            // Apply all changes automatically
            applyTextChanges(changesWithSectionIds);

            // Store suggestion sections
            setSuggestionSections(mockSections);

            // Add AI response to chat
            const aiMessage = {
                sender: 'ai',
                text: aiResponse,
                suggestionSections: mockSections
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
                onAcceptSection={handleAcceptSection}
                onRejectSection={handleRejectSection}
            />
        </div>
    );
};

export default DocumentEditor; 