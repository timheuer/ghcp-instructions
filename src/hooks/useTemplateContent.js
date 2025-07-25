import { fetchTemplateContent } from '../services/githubApi';

/**
 * Template cache for storing fetched content
 */
const templateContentCache = new Map();

/**
 * Custom hook for fetching and caching template content
 * @returns {Object} Object containing fetch function and cache management
 */
export function useTemplateContent() {
  /**
   * Fetch content for multiple templates with caching
   * @param {Array} templates - Array of template objects to fetch content for
   * @returns {Promise<Array>} Array of content strings in the same order as templates
   */
  const fetchMultipleTemplateContents = async (templates) => {
    const contentPromises = templates.map(async (template) => {
      // Check cache first
      if (templateContentCache.has(template.name)) {
        console.log(`Using cached content for ${template.name}`);
        return templateContentCache.get(template.name);
      }

      try {
        console.log(`Fetching content for ${template.name}...`);
        const content = await fetchTemplateContent(template);
        
        // Cache the content
        templateContentCache.set(template.name, content);
        
        return content;
      } catch (error) {
        console.error(`Failed to fetch content for ${template.name}:`, error);
        throw new Error(`Failed to fetch ${template.name}: ${error.message}`);
      }
    });

    return Promise.all(contentPromises);
  };

  /**
   * Get cached content for a template if it exists
   * @param {string} templateName - Name of the template
   * @returns {string|null} Cached content or null if not cached
   */
  const getCachedContent = (templateName) => {
    return templateContentCache.get(templateName) || null;
  };

  /**
   * Clear the content cache
   */
  const clearCache = () => {
    templateContentCache.clear();
    console.log('Template content cache cleared');
  };

  /**
   * Get cache statistics
   * @returns {Object} Cache stats
   */
  const getCacheStats = () => {
    return {
      size: templateContentCache.size,
      keys: Array.from(templateContentCache.keys())
    };
  };

  return {
    fetchMultipleTemplateContents,
    getCachedContent,
    clearCache,
    getCacheStats
  };
}
