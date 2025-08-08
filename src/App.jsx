import { useState } from 'react';
import { TemplateSearch } from './components/TemplateSearch';
import { ExportHandler } from './components/ExportHandler';
import ThemeToggle from './components/ThemeToggle';
import { RocketIcon, WarningIcon, HeartIcon } from './components/Icons';
import { useTemplates } from './hooks/useTemplates';
import { useTemplateContent } from './hooks/useTemplateContent';
import { mergeTemplates, generateMergeStats } from './services/templateMerger';
import './App.css';
import Header from './components/Header';

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
                <Header />
                <div className="app-bg" aria-hidden="true" />
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
            <Header />
            <div className="app-bg" aria-hidden="true" />
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
                                <>
                                    <RocketIcon className="w-5 h-5" />
                                    Generate Instructions
                                </>
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
                    <h3><WarningIcon className="inline w-5 h-5 mr-2" />Generation Failed</h3>
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
                    <span className="footer-text">
                        Made with <HeartIcon className="inline w-4 h-4 mx-1" /> for the GitHub Copilot community
                    </span>
                </div>
            </footer>
        </div>
    );
}

export default App;
