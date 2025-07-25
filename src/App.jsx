import { useState } from 'react';
import { TemplateSearch } from './components/TemplateSearch';
import { ExportHandler } from './components/ExportHandler';
import ThemeToggle from './components/ThemeToggle';
import { useTemplates } from './hooks/useTemplates';
import { useTemplateContent } from './hooks/useTemplateContent';
import { mergeTemplates, generateMergeStats } from './services/templateMerger';
import './App.css';

function App() {
    const { templates, loading, error, refresh } = useTemplates();
    const { fetchMultipleTemplateContents } = useTemplateContent();
    const [selectedTemplates, setSelectedTemplates] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = useState(null);
    const [mergeStats, setMergeStats] = useState(null);
    const [generateError, setGenerateError] = useState(null);

    const handleTemplateSelect = (template) => {
        // Prevent duplicate selection
        if (!selectedTemplates.find(t => t.name === template.name)) {
            setSelectedTemplates(prev => [...prev, template]);
        }
    };

    const handleTemplateRemove = (templateName) => {
        setSelectedTemplates(prev => prev.filter(t => t.name !== templateName));
    };

    const handleGenerateInstructions = async () => {
        if (selectedTemplates.length === 0) {
            alert('Please select at least one template to generate instructions.');
            return;
        }

        setIsGenerating(true);
        setGenerateError(null);

        try {
            console.log(`Generating instructions from ${selectedTemplates.length} templates...`);

            // Fetch content for all selected templates
            const contents = await fetchMultipleTemplateContents(selectedTemplates);

            // Merge the templates
            const mergedContent = mergeTemplates(selectedTemplates, contents);

            // Generate statistics
            const stats = generateMergeStats(selectedTemplates, mergedContent);

            setGeneratedContent(mergedContent);
            setMergeStats(stats);

            console.log('Instructions generated successfully:', stats);
        } catch (err) {
            console.error('Error generating instructions:', err);
            setGenerateError(err.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCloseExport = () => {
        setGeneratedContent(null);
        setMergeStats(null);
        setGenerateError(null);
    };

    // Show export handler if content is generated
    if (generatedContent && mergeStats) {
        return (
            <div className="app">
                <ExportHandler
                    mergedContent={generatedContent}
                    templates={selectedTemplates}
                    stats={mergeStats}
                    onClose={handleCloseExport}
                />
            </div>
        );
    }

    return (
        <div className="app">
            {/* Selected Templates Display */}
            {selectedTemplates.length > 0 && (
                <div className="selected-templates-bar">
                    <div className="selected-templates-container">
                        <h3>Selected Templates ({selectedTemplates.length})</h3>
                        <div className="selected-templates-list">
                            {selectedTemplates.map(template => (
                                <div key={template.name} className="selected-template-tag">
                                    <span>{template.name}</span>
                                    <button
                                        className="remove-template-btn"
                                        onClick={() => handleTemplateRemove(template.name)}
                                        aria-label={`Remove ${template.name}`}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            className={`generate-btn ${isGenerating ? 'generating' : ''}`}
                            onClick={handleGenerateInstructions}
                            disabled={isGenerating || selectedTemplates.length === 0}
                        >
                            {isGenerating ? (
                                <>
                                    <span className="spinner"></span>
                                    Generating Instructions...
                                </>
                            ) : (
                                '🚀 Generate Instructions'
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Main Search Interface */}
            <TemplateSearch
                templates={templates}
                onSelect={handleTemplateSelect}
                selectedTemplates={selectedTemplates}
                loading={loading}
                error={error}
            />

            {/* Generation Error */}
            {generateError && (
                <div className="generation-error">
                    <h3>⚠️ Generation Failed</h3>
                    <p>{generateError}</p>
                    <button onClick={() => setGenerateError(null)}>Dismiss</button>
                </div>
            )}

            {/* Error Retry */}
            {error && (
                <div className="error-actions">
                    <button onClick={refresh} className="retry-btn">
                        Try Again
                    </button>
                </div>
            )}

            {/* Footer */}
            <footer className="app-footer">
                <div className="footer-content">
                    <ThemeToggle />
                    <span className="footer-divider">•</span>
                    <a
                        href="https://github.com/timheuer/ghcp-instructions"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="github-link"
                    >
                        <svg
                            className="github-icon"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                        </svg>
                        <span>View on GitHub</span>
                    </a>
                    <span className="footer-divider">•</span>
                    <span className="footer-text">
                        Made with ❤️ for the GitHub Copilot community
                    </span>
                </div>
            </footer>
        </div>
    );
}

export default App;
