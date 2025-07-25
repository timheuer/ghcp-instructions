import { useState, useEffect } from 'react';
import { fetchTemplateList } from '../services/githubApi';

/**
 * Custom hook for managing template data and loading states
 * @returns {Object} Object containing templates, loading, error, and refresh function
 */
export function useTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const templateList = await fetchTemplateList();
      setTemplates(templateList);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load templates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  return {
    templates,
    loading,
    error,
    refresh: loadTemplates
  };
}
