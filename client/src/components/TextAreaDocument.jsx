import React, { useRef, useEffect } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const TextAreaDocument = ({
    essay,
    setEssay,
    highlightedRanges,
    suggestionSections,
    textareaRef,
    getTitle
}) => {
    const quillRef = useRef(null);
    const quillInstanceRef = useRef(null);

    // Initialize Quill editor
    useEffect(() => {
        if (quillRef.current && !quillInstanceRef.current) {
            const quill = new Quill(quillRef.current, {
                theme: 'snow',
                placeholder: 'Start writing your essay here...',
                modules: {
                    toolbar: false // Disable toolbar for clean editing
                }
            });

            quillInstanceRef.current = quill;

            // Handle text changes
            quill.on('text-change', () => {
                const text = quill.getText().trim();
                setEssay(text);
            });

            // Set initial content
            if (essay) {
                quill.setText(essay);
            }
        }
    }, []);

    // Update content when essay changes (from AI suggestions)
    useEffect(() => {
        if (quillInstanceRef.current) {
            const currentText = quillInstanceRef.current.getText().trim();
            if (currentText !== essay) {
                // Set the new text content
                quillInstanceRef.current.setText(essay);

                // Apply highlights if any
                if (highlightedRanges.length > 0) {
                    applyChangesWithHighlights();
                }
            }
        }
    }, [essay]); // Only depend on essay changes

    // Handle highlighting updates (when sections are accepted/rejected)
    useEffect(() => {
        if (quillInstanceRef.current) {
            // Always re-apply highlights when they change
            if (highlightedRanges.length > 0) {
                applyChangesWithHighlights();
            } else {
                // Remove all highlighting - convert to plain text
                quillInstanceRef.current.setText(essay);
            }
        }
    }, [highlightedRanges]); // Only depend on highlight changes

    // Apply changes incrementally with proper position tracking
    const applyChangesWithHighlights = () => {
        if (!quillInstanceRef.current || highlightedRanges.length === 0) return;

        const quill = quillInstanceRef.current;

        console.log('Applying highlights to existing text:', {
            essayLength: essay.length,
            highlightedRanges: highlightedRanges,
            currentQuillText: quill.getText()
        });

        // First, ensure the text content is correct
        quill.setText(essay);

        // Then apply highlights to the existing text (don't insert new text)
        highlightedRanges.forEach((highlight, index) => {
            // Format the text that's already in the editor at the specified range
            quill.formatText(highlight.start, highlight.end - highlight.start, {
                background: '#dbeafe', // Light blue background
                color: '#1e40af' // Darker blue text
            });
        });
    };

    return (
        <div className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-gray-900">{getTitle()}</h2>

            {/* Quill editor */}
            <div className="flex-1 relative">
                <div
                    ref={quillRef}
                    className="flex-1 w-full min-h-[400px] border border-gray-200 rounded-lg bg-gray-50"
                    style={{
                        fontFamily: 'inherit',
                        fontSize: '1.125rem',
                        lineHeight: 'inherit'
                    }}
                />
            </div>

            {/* Show which sections have pending changes */}
            {suggestionSections.length > 0 && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-sm font-medium text-blue-800 mb-2">
                        AI Suggestions Applied ({suggestionSections.filter(s => s.status === 'pending').length} pending)
                    </div>
                    <div className="space-y-1">
                        {suggestionSections.map(section => (
                            <div key={section.id} className="flex items-center justify-between text-xs">
                                <span className="text-blue-700">{section.title}</span>
                                <span className={`px-2 py-1 rounded ${section.status === 'pending' ? 'bg-blue-200 text-blue-800' :
                                    section.status === 'accepted' ? 'bg-green-200 text-green-800' :
                                        'bg-red-200 text-red-800'
                                    }`}>
                                    {section.status === 'pending' ? 'Pending' :
                                        section.status === 'accepted' ? 'Accepted' : 'Rejected'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TextAreaDocument; 