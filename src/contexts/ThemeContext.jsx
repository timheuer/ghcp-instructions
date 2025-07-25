import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        // Check localStorage first, then system preference
        const saved = localStorage.getItem('theme');
        if (saved && ['light', 'dark', 'system'].includes(saved)) {
            return saved;
        }
        return 'system';
    });

    const [resolvedTheme, setResolvedTheme] = useState('light');

    useEffect(() => {
        const root = document.documentElement;

        const updateResolvedTheme = () => {
            let newResolvedTheme;

            if (theme === 'system') {
                newResolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            } else {
                newResolvedTheme = theme;
            }

            setResolvedTheme(newResolvedTheme);

            // Apply theme to root element
            root.setAttribute('data-theme', newResolvedTheme);
            root.classList.remove('light', 'dark');
            root.classList.add(newResolvedTheme);
        };

        updateResolvedTheme();

        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') {
                updateResolvedTheme();
            }
        };

        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, [theme]);

    const setThemeMode = (newTheme) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const cycleTheme = () => {
        const themes = ['light', 'dark', 'system'];
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setThemeMode(themes[nextIndex]);
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,
                resolvedTheme,
                setTheme: setThemeMode,
                cycleTheme
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};
