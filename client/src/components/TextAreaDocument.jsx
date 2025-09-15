import React, { useRef, useEffect } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const TextAreaDocument = ({
    essay,
    setEssay,
    highlightedRanges,
    changes,
    textareaRef,
    getTitle
}) => {
    // Check if there are any pending changes
    const hasPendingChanges = changes.some(change => change.status === 'pending');
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

    // Enable/disable editor based on pending changes
    useEffect(() => {
        if (quillInstanceRef.current) {
            if (hasPendingChanges) {
                quillInstanceRef.current.enable(false);
            } else {
                quillInstanceRef.current.enable(true);
            }
        }
    }, [hasPendingChanges]);

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
            <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-bold text-gray-900">{getTitle()}</h2>
                {hasPendingChanges && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 border border-amber-300 rounded-full">
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-amber-800">
                            Review AI suggestions
                        </span>
                    </div>
                )}
            </div>

            {/* Quill editor */}
            <div className="flex-1 relative">
                <div
                    ref={quillRef}
                    className={`flex-1 w-full min-h-[400px] border rounded-lg ${
                        hasPendingChanges 
                            ? 'border-amber-300 bg-gray-50 cursor-not-allowed' 
                            : 'border-gray-200 bg-gray-50'
                    }`}
                    style={{
                        fontFamily: 'inherit',
                        fontSize: '1.125rem',
                        lineHeight: 'inherit'
                    }}
                />
            </div>

            {/* Show which changes have pending status */}
            {changes.length > 0 && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-sm font-medium text-blue-800 mb-2">
                        AI Changes Applied ({changes.filter(c => c.status === 'pending').length} pending)
                    </div>
                    <div className="space-y-1">
                        {changes.map((change, index) => (
                            <div key={index} className="flex items-center justify-between text-xs">
                                <span className="text-blue-700">{change.title || `Change ${index + 1}`}</span>
                                <span className={`px-2 py-1 rounded ${change.status === 'pending' ? 'bg-blue-200 text-blue-800' :
                                    change.status === 'accepted' ? 'bg-green-200 text-green-800' :
                                        'bg-red-200 text-red-800'
                                    }`}>
                                    {change.status === 'pending' ? 'Pending' :
                                        change.status === 'accepted' ? 'Accepted' : 'Rejected'}
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