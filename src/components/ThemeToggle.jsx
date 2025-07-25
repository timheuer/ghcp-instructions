import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
    const { theme, cycleTheme } = useTheme();

    const getThemeIcon = () => {
        switch (theme) {
            case 'light':
                return (
                    <svg className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="5" />
                        <path d="m12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                    </svg>
                );
            case 'dark':
                return (
                    <svg className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                );
            case 'system':
                return (
                    <svg className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const getThemeLabel = () => {
        switch (theme) {
            case 'light': return 'Light mode';
            case 'dark': return 'Dark mode';
            case 'system': return 'System mode';
            default: return 'Toggle theme';
        }
    };

    return (
        <button
            className="theme-toggle"
            onClick={cycleTheme}
            title={`Current: ${getThemeLabel()}. Click to cycle themes.`}
            aria-label={`Switch theme. Current: ${getThemeLabel()}`}
        >
            {getThemeIcon()}
            <span className="theme-label">{theme}</span>
        </button>
    );
};

export default ThemeToggle;
