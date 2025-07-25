# Feature Specification: Copilot Instructions Generator

## Overview
A single-page web application that helps developers create customized `copilot-instructions.md` files by merging multiple instruction templates from the GitHub awesome-copilot repository. The app provides a gitignore.io-style interface where users can search, select, and combine different instruction sets into a unified configuration file.

## User Journey
1. User opens the web application
2. User types in the search box to filter available instruction templates (e.g., "python", "react", "azure")
3. User selects instruction templates from the filtered list, which are added to their selection
4. User can add multiple templates to build a comprehensive instruction set
5. User clicks "Generate" to merge all selected templates into a single copilot-instructions.md file
6. User can either download the generated file or copy the raw markdown content

## Functional Requirements

1. **FR-01**: Template Discovery and Search
   - **Description**: The application shall provide a searchable interface to discover available instruction templates from the awesome-copilot repository
   - **Acceptance Criteria**:
     - [x] Display a search input box prominently on the page
     - [x] Show a list of all available instruction templates below the search box
     - [x] Filter the list in real-time as user types in the search box
     - [x] Each template displays its name/tag (derived from filename without .instructions.md)
     - [x] Templates are sorted alphabetically for easy browsing

2. **FR-02**: Template Selection Management
   - **Description**: Users shall be able to select multiple instruction templates and manage their selection
   - **Acceptance Criteria**:
     - [x] Clicking on a template adds it to the user's selection
     - [x] Selected templates appear as tags/chips in the search input area
     - [x] Users can remove selected templates by clicking an 'x' on each tag
     - [x] Prevent duplicate selection of the same template
     - [x] Show visual feedback when templates are selected/deselected

3. **FR-03**: Template Content Retrieval
   - **Description**: The application shall fetch the actual content of selected instruction templates
   - **Acceptance Criteria**:
     - [x] Retrieve template content from GitHub awesome-copilot repository
     - [x] Handle API rate limits gracefully
     - [x] Show loading states during content retrieval
     - [x] Display error messages if templates cannot be fetched

4. **FR-04**: Intelligent Template Merging
   - **Description**: The application shall merge multiple instruction templates into a cohesive single file
   - **Acceptance Criteria**:
     - [x] Combine multiple instruction files while avoiding duplicate sections
     - [x] Preserve the formatting and structure of individual instructions
     - [x] Add clear section headers to identify the source of each instruction set
     - [x] Handle overlapping or conflicting instructions appropriately
     - [x] Generate a header comment indicating the merged templates and generation date

5. **FR-05**: File Generation and Export
   - **Description**: Users shall be able to obtain the merged instruction file in multiple formats
   - **Acceptance Criteria**:
     - [x] Provide a "Generate" button that creates the merged file
     - [x] Show a preview of the generated content
     - [x] Offer a download button to save as `copilot-instructions.md`
     - [x] Provide a "Copy to Clipboard" button for the raw markdown content
     - [x] Display success feedback when copy/download actions complete

6. **FR-06**: User Experience Enhancements
   - **Description**: The application shall provide a smooth and intuitive user experience
   - **Acceptance Criteria**:
     - [ ] Responsive design that works on desktop and mobile devices
     - [ ] Fast search filtering with no noticeable delay
     - [ ] Clear visual hierarchy and professional styling
     - [ ] Helpful placeholder text and tooltips
     - [ ] Keyboard navigation support for accessibility

## Non-Functional Requirements
- **Performance**: Search filtering should respond within 100ms
- **Accessibility**: Support keyboard navigation and screen readers
- **Browser Compatibility**: Work on modern browsers (Chrome, Firefox, Safari, Edge)
- **Responsive Design**: Functional on mobile devices and various screen sizes

## Out of Scope
- User accounts or authentication
- Saving/sharing generated configurations online
- Custom instruction template creation
- Version control or history of generated files
- Integration with VS Code or other editors
- Advanced merging algorithms beyond basic concatenation with conflict detection

---

# Implementation Plan: Copilot Instructions Generator

## Architecture Overview

The application will be built as a React SPA using Vite for fast development and optimized builds. It will use the GitHub API to dynamically fetch instruction templates from the awesome-copilot repository. The app will implement client-side template merging with smart deduplication logic and provide export functionality through browser APIs.

**Key Components:**
- **Template Service**: Handles GitHub API interactions and caching
- **Search Component**: Provides real-time filtering of templates
- **Selection Manager**: Manages selected templates state
- **Merger Engine**: Implements smart deduplication and merging logic
- **Export Handler**: Manages file download and clipboard operations

## Implementation Steps

- [x] **Step 1**: Project Setup and Basic Structure
  - **Objective**: Create a React + Vite project with GitHub Pages deployment configuration
  - **Technical Approach**: Initialize Vite React project, configure GitHub Actions for deployment, set up basic routing and layout
  - **Pseudocode**:
    ```bash
    npm create vite@latest copilot-instructions-generator -- --template react
    # Configure vite.config.js for GitHub Pages base path
    # Set up GitHub Actions workflow for deployment
    # Install dependencies: axios, react-query, lucide-react (icons)
    ```
  - **Manual Developer Action**: Create GitHub repository and configure Pages settings

- [x] **Step 2**: GitHub API Integration and Template Discovery
  - **Objective**: Fetch available instruction templates from the awesome-copilot repository
  - **Technical Approach**: Use GitHub Contents API to list files in instructions directory, implement caching and error handling
  - **Pseudocode**:
    ```javascript
    // services/githubApi.js
    const REPO_URL = 'https://api.github.com/repos/github/awesome-copilot/contents/instructions'
    
    async function fetchTemplateList() {
      const response = await fetch(REPO_URL)
      const files = await response.json()
      return files
        .filter(file => file.name.endsWith('.instructions.md'))
        .map(file => ({
          name: file.name.replace('.instructions.md', ''),
          downloadUrl: file.download_url,
          fileName: file.name
        }))
        .sort((a, b) => a.name.localeCompare(b.name))
    }
    ```
  - **Manual Developer Action**: Test API endpoints and handle rate limiting

- [x] **Step 3**: Search and Filter Interface
  - **Objective**: Create the gitignore.io-style search interface with real-time filtering
  - **Technical Approach**: Implement debounced search with fuzzy matching, responsive design with template cards
  - **Pseudocode**:
    ```javascript
    // components/TemplateSearch.jsx
    function TemplateSearch({ templates, onSelect, selectedTemplates }) {
      const [searchTerm, setSearchTerm] = useState('')
      const [filteredTemplates, setFilteredTemplates] = useState(templates)
      
      useEffect(() => {
        const filtered = templates.filter(template => 
          template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.name.toLowerCase().startsWith(searchTerm.toLowerCase())
        )
        setFilteredTemplates(filtered)
      }, [searchTerm, templates])
      
      return (
        <div>
          <SearchInput value={searchTerm} onChange={setSearchTerm} />
          <TemplateGrid templates={filteredTemplates} onSelect={onSelect} />
        </div>
      )
    }
    ```
  - **Manual Developer Action**: Design and implement responsive CSS styling

- [x] **Step 4**: Template Selection Management
  - **Objective**: Implement multi-select functionality with visual feedback and selection state management
  - **Technical Approach**: Use React state management with visual chips/tags, prevent duplicates, keyboard navigation
  - **Pseudocode**:
    ```javascript
    // hooks/useTemplateSelection.js
    function useTemplateSelection() {
      const [selectedTemplates, setSelectedTemplates] = useState([])
      
      const addTemplate = (template) => {
        if (!selectedTemplates.find(t => t.name === template.name)) {
          setSelectedTemplates(prev => [...prev, template])
        }
      }
      
      const removeTemplate = (templateName) => {
        setSelectedTemplates(prev => prev.filter(t => t.name !== templateName))
      }
      
      return { selectedTemplates, addTemplate, removeTemplate }
    }
    ```
  - **Manual Developer Action**: Implement keyboard shortcuts and accessibility features

- [x] **Step 5**: Template Content Fetching with Caching
  - **Objective**: Efficiently fetch and cache template content from GitHub
  - **Technical Approach**: Implement lazy loading with React Query, cache responses, handle rate limits
  - **Pseudocode**:
    ```javascript
    // services/templateCache.js
    const templateCache = new Map()
    
    async function fetchTemplateContent(template) {
      if (templateCache.has(template.name)) {
        return templateCache.get(template.name)
      }
      
      try {
        const response = await fetch(template.downloadUrl)
        const content = await response.text()
        templateCache.set(template.name, content)
        return content
      } catch (error) {
        throw new Error(`Failed to fetch ${template.name}: ${error.message}`)
      }
    }
    ```
  - **Manual Developer Action**: Implement loading states and error boundaries

- [x] **Step 6**: Smart Template Merging Engine
  - **Objective**: Implement intelligent deduplication and merging of instruction templates
  - **Technical Approach**: Parse markdown sections, identify common patterns, merge with clear attribution
  - **Pseudocode**:
    ```javascript
    // services/templateMerger.js
    function mergeTemplates(templates, contents) {
      const header = generateHeader(templates)
      const sections = []
      
      contents.forEach((content, index) => {
        const template = templates[index]
        const parsedSections = parseMarkdownSections(content)
        
        // Add template header
        sections.push(`## Instructions from: ${template.name}`)
        sections.push('')
        
        // Deduplicate common sections
        parsedSections.forEach(section => {
          if (!isDuplicateSection(section, sections)) {
            sections.push(section.content)
          }
        })
        
        sections.push('') // Spacing between templates
      })
      
      return [header, ...sections].join('\n')
    }
    
    function isDuplicateSection(section, existingSections) {
      // Implement smart deduplication logic
      // Check for similar headings, content similarity, etc.
    }
    ```
  - **Manual Developer Action**: Fine-tune deduplication algorithms based on testing

- [x] **Step 7**: File Generation and Export Functionality
  - **Objective**: Generate the final copilot-instructions.md file with download and copy capabilities
  - **Technical Approach**: Use Blob API for file downloads, Clipboard API for copying, preview modal
  - **Pseudocode**:
    ```javascript
    // components/ExportHandler.jsx
    function ExportHandler({ mergedContent }) {
      const downloadFile = () => {
        const blob = new Blob([mergedContent], { type: 'text/markdown' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'copilot-instructions.md'
        a.click()
        URL.revokeObjectURL(url)
      }
      
      const copyToClipboard = async () => {
        try {
          await navigator.clipboard.writeText(mergedContent)
          showSuccessMessage('Copied to clipboard!')
        } catch (error) {
          fallbackCopyToClipboard(mergedContent)
        }
      }
      
      return (
        <div>
          <PreviewModal content={mergedContent} />
          <Button onClick={downloadFile}>Download File</Button>
          <Button onClick={copyToClipboard}>Copy to Clipboard</Button>
        </div>
      )
    }
    ```
  - **Manual Developer Action**: Test download functionality across different browsers

- [ ] **Step 8**: UI/UX Polish and Responsive Design
  - **Objective**: Implement professional styling and responsive design similar to gitignore.io
  - **Technical Approach**: Use CSS modules or styled-components, implement responsive breakpoints, accessibility features
  - **Pseudocode**:
    ```css
    /* styles/main.css */
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .search-container {
      position: sticky;
      top: 0;
      background: white;
      z-index: 100;
    }
    
    .template-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
      margin-top: 2rem;
    }
    
    @media (max-width: 768px) {
      .template-grid {
        grid-template-columns: 1fr;
      }
    }
    ```
  - **Manual Developer Action**: User testing and accessibility audit

- [ ] **Step 9**: Error Handling and Loading States
  - **Objective**: Implement comprehensive error handling and user feedback
  - **Technical Approach**: Error boundaries, loading skeletons, retry mechanisms, user-friendly error messages
  - **Pseudocode**:
    ```javascript
    // components/ErrorBoundary.jsx
    class ErrorBoundary extends React.Component {
      constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
      }
      
      static getDerivedStateFromError(error) {
        return { hasError: true, error }
      }
      
      render() {
        if (this.state.hasError) {
          return (
            <ErrorMessage 
              message="Something went wrong" 
              retry={() => window.location.reload()}
            />
          )
        }
        return this.props.children
      }
    }
    ```
  - **Manual Developer Action**: Test error scenarios and edge cases

- [ ] **Step 10**: GitHub Pages Deployment and CI/CD
  - **Objective**: Set up automated deployment to GitHub Pages with proper routing
  - **Technical Approach**: Configure GitHub Actions workflow, handle SPA routing, optimize build
  - **Pseudocode**:
    ```yaml
    # .github/workflows/deploy.yml
    name: Deploy to GitHub Pages
    on:
      push:
        branches: [ main ]
    jobs:
      deploy:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v3
          - uses: actions/setup-node@v3
          - run: npm ci
          - run: npm run build
          - uses: actions/deploy-pages@v1
            with:
              artifact_name: github-pages
              path: dist/
    ```
  - **Manual Developer Action**: Configure repository settings and test deployment

## Quality Checklist

- [ ] All functional requirements from the spec are addressed in the implementation
- [ ] Dependencies between steps are clearly identified
- [ ] Testing strategy covers all critical paths (unit tests for merger, integration tests for API)
- [ ] Error handling covers network failures, API rate limits, and invalid responses
- [ ] Performance considerations include debounced search, lazy loading, and response caching
- [ ] Security considerations include input sanitization and safe markdown rendering
- [ ] Implementation steps are appropriately sized and can be completed incrementally
- [ ] Accessibility features include keyboard navigation, screen reader support, and semantic HTML
- [ ] Mobile responsiveness ensures functionality across device sizes
- [ ] GitHub API rate limiting is handled gracefully with fallback mechanisms
