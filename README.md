# Copilot Instructions Generator

A single-page web application that helps developers create customized `copilot-instructions.md` files by merging multiple instruction templates from the [GitHub awesome-copilot repository](https://github.com/github/awesome-copilot/tree/main/instructions).

## 🚀 Live Demo

Visit the live application: **[Copilot Instructions Generator](https://timheuer.github.io/ghcp-instructions/)**

## ✨ Features

- **🔍 Smart Search**: Real-time filtering of 40+ instruction templates
- **📋 Multi-Select**: gitignore.io-style interface for selecting multiple templates
- **🧠 Intelligent Merging**: Smart deduplication to avoid repetitive content
- **📥 Multiple Export Options**: Download file or copy to clipboard
- **👁️ Content Preview**: Preview the merged content before export
- **📱 Responsive Design**: Works seamlessly on desktop and mobile
- **⚡ Fast Performance**: Optimized with caching and lazy loading
- **🔄 Real-time Updates**: Templates fetched dynamically from GitHub

## 🛠️ Available Templates

The app dynamically fetches instruction templates from the awesome-copilot repository, including:

- **Languages**: Python, JavaScript, TypeScript, C#, Java, Go, Ruby, etc.
- **Frameworks**: React, Angular, Next.js, ASP.NET, Spring Boot, etc.
- **Cloud Platforms**: Azure Functions, AWS, containerization, etc.
- **Best Practices**: Security, performance, testing, DevOps, etc.

## 🎯 How to Use

1. **Search Templates**: Type in the search box to filter available templates (e.g., "python", "react", "azure")
2. **Select Templates**: Click on templates to add them to your selection
3. **Generate Instructions**: Click "🚀 Generate Instructions" to merge your selected templates
4. **Export**: Download the file or copy to clipboard
5. **Use**: Save as `copilot-instructions.md` in your project root or `.github/` directory

## 🏗️ Technology Stack

- **Frontend**: React 19 + Vite
- **Styling**: Modern CSS with responsive design
- **API**: GitHub Contents API for dynamic template fetching
- **Deployment**: GitHub Pages with GitHub Actions CI/CD
- **Performance**: localStorage caching, optimized bundle

## 🚀 Local Development

### Prerequisites


### Setup

```bash
# Clone the repository
git clone https://github.com/timheuer/ghcp-instructions.git
cd ghcp-instructions

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

## End-to-end tests (Playwright)

This project includes Playwright tests that mock GitHub API calls for fast, reliable runs.

- Install browsers (first run only):
	- `npm run pw:install`
- Run all tests headless:
	- `npm run test:e2e`
- Run headed (see the browser):
	- `npm run test:e2e:headed`
- Open the Playwright UI:
	- `npm run test:e2e:ui`
- Show the last HTML report:
	- `npm run test:e2e:report`

The tests boot the Vite dev server automatically. To point tests at an already running server, set `PLAYWRIGHT_TEST_BASE_URL`.

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## 📁 Project Structure

```
ghcp-instructions/
├── src/
│   ├── components/
│   │   ├── TemplateSearch.jsx    # Main search and selection interface
│   │   ├── ExportHandler.jsx     # Export and preview functionality
│   │   └── *.css                 # Component styles
│   ├── hooks/
│   │   ├── useTemplates.js       # Template list management
│   │   └── useTemplateContent.js # Content fetching and caching
│   ├── services/
│   │   ├── githubApi.js          # GitHub API integration
│   │   └── templateMerger.js     # Smart merging logic
│   ├── App.jsx                   # Main application component
│   └── main.jsx                  # Application entry point
├── docs/
│   └── copilot-instructions-generator.md  # Feature specification
├── .github/
│   └── workflows/
│       └── deploy.yml            # GitHub Pages deployment
└── package.json
```

## 🔧 Configuration

### GitHub Pages Deployment

The app is configured for automatic deployment to GitHub Pages:

1. **Repository Settings**: Enable GitHub Pages from Actions
2. **Automatic Deployment**: Pushes to `main` branch trigger deployment
3. **Custom Domain**: Optional - configure in repository settings

### Environment Variables

No environment variables required - the app uses public GitHub APIs.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines

1. Follow existing code style and conventions
2. Add tests for new functionality
3. Update documentation for significant changes
4. Ensure responsive design compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [GitHub awesome-copilot](https://github.com/github/awesome-copilot) for the instruction templates
- [gitignore.io](https://gitignore.io) for UI/UX inspiration
- [React](https://reactjs.org/) and [Vite](https://vitejs.dev/) for the development framework

## 📈 Roadmap

- [ ] Template categories and filtering
- [ ] Custom template creation
- [ ] Template favorites and history
- [ ] Advanced merging options
- [ ] Export to multiple formats
- [ ] VS Code extension integration

---

**Made with ❤️ for the GitHub Copilot community**
