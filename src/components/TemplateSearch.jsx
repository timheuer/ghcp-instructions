import { useState, useEffect, useMemo } from 'react';
import './TemplateSearch.css';

/**
 * TemplateSearch component - Provides search and filtering for instruction templates
 * @param {Object} props - Component props
 * @param {Array} props.templates - Array of available templates
 * @param {Function} props.onSelect - Callback when a template is selected
 * @param {Array} props.selectedTemplates - Array of currently selected templates
 * @param {boolean} props.loading - Whether templates are loading
 * @param {string} props.error - Error message if any
 */
export function TemplateSearch({ templates, onSelect, selectedTemplates, loading, error }) {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter templates based on search term
    const filteredTemplates = useMemo(() => {
        if (!searchTerm.trim()) {
            return templates;
        }

        const term = searchTerm.toLowerCase();
        return templates.filter(template => {
            const name = template.name.toLowerCase();
            return name.includes(term) || name.startsWith(term);
        });
    }, [templates, searchTerm]);

    // Check if a template is already selected
    const isTemplateSelected = (template) => {
        return selectedTemplates.some(selected => selected.name === template.name);
    };

    const handleTemplateClick = (template) => {
        if (!isTemplateSelected(template)) {
            onSelect(template);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    if (error) {
        return (
            <div className="search-container">
                <div className="error-message">
                    <h3>⚠️ Error Loading Templates</h3>
                    <p>{error}</p>
                    <p>Please check your internet connection and try again.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="search-container">
            <div className="search-header">
                <h1>Copilot Instructions Generator</h1>
                <p className="search-description">
                    Search and select instruction templates to create your custom copilot-instructions.md file
                </p>
            </div>

            <div className="search-input-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search templates (e.g., python, react, azure)..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    disabled={loading}
                />
                <div className="search-icon">🔍</div>
            </div>

            <div className="search-results">
                {loading && (
                    <div className="loading-message">
                        <div className="loading-spinner"></div>
                        <p>Loading templates from GitHub...</p>
                    </div>
                )}

                {!loading && filteredTemplates.length > 0 && (
                    <>
                        <div className="results-header">
                            <p>
                                {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
                                {searchTerm && ` for "${searchTerm}"`}
                            </p>
                        </div>
                        <div className="template-grid">
                            {filteredTemplates.map((template) => (
                                <TemplateCard
                                    key={template.name}
                                    template={template}
                                    isSelected={isTemplateSelected(template)}
                                    onClick={() => handleTemplateClick(template)}
                                />
                            ))}
                        </div>
                    </>
                )}

                {!loading && searchTerm && filteredTemplates.length === 0 && (
                    <div className="no-results">
                        <p>No templates found for "{searchTerm}"</p>
                        <p className="no-results-hint">Try different keywords or check the spelling</p>
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * TemplateCard component - Displays individual template information
 */
function TemplateCard({ template, isSelected, onClick }) {
    return (
        <div
            className={`template-card ${isSelected ? 'selected' : ''}`}
            onClick={onClick}
        >
            <div className="template-card-header">
                <h3 className="template-name">{template.name}</h3>
                {isSelected && <span className="selected-indicator">✓</span>}
            </div>
            <div className="template-card-meta">
                <span className="template-size">{formatFileSize(template.size)}</span>
                <span className="template-type">.instructions.md</span>
            </div>
        </div>
    );
}

/**
 * Format file size in bytes to human readable format
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
