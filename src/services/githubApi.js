/**
 * GitHub API service for fetching copilot instruction templates
 * from the awesome-copilot repository
 */

const REPO_URL = 'https://api.github.com/repos/github/awesome-copilot/contents/instructions';
const CACHE_KEY = 'copilot-templates-cache';
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

/**
 * Fetches the list of available instruction templates from GitHub
 * @returns {Promise<Array>} Array of template objects with name, downloadUrl, and fileName
 */
export async function fetchTemplateList() {
  try {
    // Check cache first
    const cached = getCachedTemplates();
    if (cached) {
      return cached;
    }

    console.log('Fetching template list from GitHub API...');
    const response = await fetch(REPO_URL);
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const files = await response.json();
    
    const templates = files
      .filter(file => file.name.endsWith('.instructions.md'))
      .map(file => ({
        name: file.name.replace('.instructions.md', ''),
        downloadUrl: file.download_url,
        fileName: file.name,
        size: file.size
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    // Cache the results
    setCachedTemplates(templates);
    
    return templates;
  } catch (error) {
    console.error('Error fetching template list:', error);
    throw new Error(`Failed to fetch templates: ${error.message}`);
  }
}

/**
 * Fetches the content of a specific template
 * @param {Object} template - Template object with downloadUrl
 * @returns {Promise<string>} Template content as markdown string
 */
export async function fetchTemplateContent(template) {
  try {
    console.log(`Fetching content for template: ${template.name}`);
    const response = await fetch(template.downloadUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch template content: ${response.status} ${response.statusText}`);
    }
    
    const content = await response.text();
    return content;
  } catch (error) {
    console.error(`Error fetching template content for ${template.name}:`, error);
    throw new Error(`Failed to fetch ${template.name}: ${error.message}`);
  }
}

/**
 * Get cached templates if they exist and are still valid
 * @returns {Array|null} Cached templates or null if not available/expired
 */
function getCachedTemplates() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > CACHE_DURATION;
    
    if (isExpired) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    console.log('Using cached template list');
    return data;
  } catch (error) {
    console.error('Error reading cached templates:', error);
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
}

/**
 * Cache the templates list in localStorage
 * @param {Array} templates - Array of template objects to cache
 */
function setCachedTemplates(templates) {
  try {
    const cacheData = {
      data: templates,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    console.log(`Cached ${templates.length} templates`);
  } catch (error) {
    console.error('Error caching templates:', error);
  }
}
