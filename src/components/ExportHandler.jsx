import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { HeartIcon, EyeIcon, DownloadIcon, CopyIcon, CheckIcon } from './Icons';
import './ExportHandler.css';

/**
 * ExportHandler component - Handles file generation, preview, and export functionality
 * @param {Object} props - Component props
 * @param {string} props.mergedContent - The merged instruction content
 * @param {Array} props.templates - Array of selected templates
 * @param {Object} props.stats - Merge statistics
 * @param {Function} props.onClose - Callback to close the export modal
 */
export function ExportHandler({ mergedContent, templates, stats, onClose }) {
    const [showPreview, setShowPreview] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [downloadSuccess, setDownloadSuccess] = useState(false);

    /**
     * Download the merged content as a file
     */
    const downloadFile = () => {
        try {
            const blob = new Blob([mergedContent], { type: 'text/markdown;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.href = url;
            link.download = 'copilot-instructions.md';
            link.style.display = 'none';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(url);

            setDownloadSuccess(true);
            setTimeout(() => setDownloadSuccess(false), 3000);

            console.log('File downloaded successfully');
        } catch (error) {
            console.error('Download failed:', error);
            alert('Download failed. Please try again.');
        }
    };

    /**
     * Copy the merged content to clipboard
     */
    const copyToClipboard = async () => {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(mergedContent);
            } else {
                // Fallback for older browsers
                fallbackCopyToClipboard(mergedContent);
            }

            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 3000);

            console.log('Content copied to clipboard');
        } catch (error) {
            console.error('Copy to clipboard failed:', error);
            alert('Copy to clipboard failed. Please try selecting the text manually.');
        }
    };

    /**
     * Fallback copy method for browsers that don't support navigator.clipboard
     */
    const fallbackCopyToClipboard = (text) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Fallback copy failed:', err);
            throw err;
        } finally {
            document.body.removeChild(textArea);
        }
    };

    /**
     * Toggle preview modal
     */
    const togglePreview = () => {
        setShowPreview(!showPreview);
    };

    return (
        <div className="export-handler">
            <div className="export-header">
                <h2>🎉 Instructions Generated Successfully!</h2>
                <p>Your custom copilot-instructions.md file is ready.</p>
            </div>

            <div className="export-stats">
                <div className="stat-item">
                    <span className="stat-label">Templates Merged:</span>
                    <span className="stat-value">{stats.templateCount}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Output Size:</span>
                    <span className="stat-value">{stats.outputStats.lines} lines, {stats.outputStats.words} words</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Reading Time:</span>
                    <span className="stat-value">~{stats.outputStats.estimatedReadingTime} min</span>
                </div>
            </div>

            <div className="template-list">
                <h3>Included Templates:</h3>
                <div className="template-tags">
                    {templates.map(template => (
                        <span key={template.name} className="template-tag">
                            {template.name}
                        </span>
                    ))}
                </div>
            </div>

            <div className="export-actions">
                <button
                    className="action-btn preview-btn"
                    onClick={togglePreview}
                >
                    <EyeIcon className="w-4 h-4 mr-2" /> Preview Content
                </button>

                <button
                    className={`action-btn download-btn ${downloadSuccess ? 'success' : ''}`}
                    onClick={downloadFile}
                >
                    {downloadSuccess ? (
                        <>
                            <CheckIcon className="w-4 h-4 mr-2" /> Downloaded!
                        </>
                    ) : (
                        <>
                            <DownloadIcon className="w-4 h-4 mr-2" /> Download File
                        </>
                    )}
                </button>

                <button
                    className={`action-btn copy-btn ${copySuccess ? 'success' : ''}`}
                    onClick={copyToClipboard}
                >
                    {copySuccess ? (
                        <>
                            <CheckIcon className="w-4 h-4 mr-2" /> Copied!
                        </>
                    ) : (
                        <>
                            <CopyIcon className="w-4 h-4 mr-2" /> Copy to Clipboard
                        </>
                    )}
                </button>
            </div>

            <div className="export-footer">
                <button className="close-btn" onClick={onClose}>
                    ← Back to Generator
                </button>
                <p className="export-note">
                    Save this file as <code>copilot-instructions.md</code> in your project root or <code>.github/</code> directory.
                </p>
            </div>

            {/* Preview Modal */}
            {showPreview && (
                <PreviewModal
                    content={mergedContent}
                    onClose={() => setShowPreview(false)}
                />
            )}

            {/* Footer */}
            <footer className="export-footer-github">
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
                        Made with <HeartIcon className="inline w-4 h-4 mx-1" /> for the GitHub Copilot community
                    </span>
                </div>
            </footer>
        </div>
    );
}

/**
 * PreviewModal component - Shows a preview of the merged content
 */
function PreviewModal({ content, onClose }) {
    return (
        <div className="preview-modal-overlay" onClick={onClose}>
            <div className="preview-modal" onClick={e => e.stopPropagation()}>
                <div className="preview-header">
                    <h3>Content Preview</h3>
                    <button className="close-preview-btn" onClick={onClose}>×</button>
                </div>
                <div className="preview-content">
                    <pre>{content}</pre>
                </div>
                <div className="preview-footer">
                    <p>Scroll to view the complete content</p>
                </div>
            </div>
        </div>
    );
}
