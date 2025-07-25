import { useState } from 'react';
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
                    👁️ Preview Content
                </button>

                <button
                    className={`action-btn download-btn ${downloadSuccess ? 'success' : ''}`}
                    onClick={downloadFile}
                >
                    {downloadSuccess ? '✅ Downloaded!' : '⬇️ Download File'}
                </button>

                <button
                    className={`action-btn copy-btn ${copySuccess ? 'success' : ''}`}
                    onClick={copyToClipboard}
                >
                    {copySuccess ? '✅ Copied!' : '📋 Copy to Clipboard'}
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
