# Deployment Guide: GitHub Pages

This guide walks you through deploying the Copilot Instructions Generator to GitHub Pages.

## Prerequisites

- GitHub account
- Git installed locally
- Project committed to a Git repository

## Step-by-Step Deployment

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and click "New repository"
2. **Repository name**: `ghcp-instructions` (or your preferred name)
3. **Description**: "A web app to generate custom copilot-instructions.md files"
4. Make it **Public** (required for free GitHub Pages)
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### 2. Connect Local Repository to GitHub

```bash
# Add GitHub as remote origin
git remote add origin https://github.com/YOUR_USERNAME/ghcp-instructions.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Configure GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section (left sidebar)
4. Under "Source", select **GitHub Actions**
5. Save the configuration

### 4. Automatic Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically:

1. Trigger on every push to `main` branch
2. Install dependencies with `npm ci`
3. Build the application with `npm run build`
4. Deploy to GitHub Pages

### 5. Access Your Live Application

After the first deployment (usually takes 2-5 minutes):

- **URL**: `https://YOUR_USERNAME.github.io/ghcp-instructions/`
- **Example**: `https://johndoe.github.io/ghcp-instructions/`

## Verification Checklist

### ✅ Pre-Deployment
- [ ] All files committed to Git
- [ ] GitHub repository created
- [ ] Local repository connected to GitHub
- [ ] Files pushed to GitHub

### ✅ Post-Deployment
- [ ] GitHub Actions workflow completed successfully
- [ ] GitHub Pages is enabled and configured
- [ ] Live site is accessible at the GitHub Pages URL
- [ ] Application loads and functions correctly
- [ ] Templates load from GitHub API
- [ ] Search functionality works
- [ ] Template selection and generation works
- [ ] Export functionality works

## Troubleshooting

### Common Issues

**Issue**: GitHub Actions workflow fails
- **Solution**: Check the Actions tab for detailed error logs
- **Common fix**: Ensure all dependencies are in `package.json`

**Issue**: 404 Error on GitHub Pages
- **Solution**: Check that the `base` path in `vite.config.js` matches your repository name
- **Current setting**: `base: '/ghcp-instructions/'`

**Issue**: Application loads but templates don't fetch
- **Solution**: Check browser console for CORS or API errors
- **Note**: GitHub API has rate limits but should work for normal usage

**Issue**: Styles not loading correctly
- **Solution**: Verify the build completed successfully and all assets are in the `dist/` folder

### Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `public/` directory with your domain
2. Configure DNS to point to GitHub Pages
3. Update the `base` path in `vite.config.js` to `'/'`

## Monitoring and Updates

### View Deployment Status
- **GitHub Actions**: Repository → Actions tab
- **Pages Status**: Repository → Settings → Pages

### Making Updates
1. Make changes locally
2. Commit and push to `main` branch
3. GitHub Actions automatically rebuilds and deploys

### Performance Monitoring
- Use browser DevTools to check performance
- Monitor GitHub API rate limits if needed
- Check GitHub Pages usage in repository insights

## Security Notes

- All code is public (required for free GitHub Pages)
- No sensitive data should be committed
- GitHub API is used without authentication (public endpoints only)
- Consider adding a privacy policy if collecting any user data

## Support

If you encounter issues:

1. Check the [GitHub Pages documentation](https://docs.github.com/en/pages)
2. Review [GitHub Actions logs](https://docs.github.com/en/actions)
3. Consult the project's [README.md](../README.md) for additional information

---

**You're all set! Your Copilot Instructions Generator should now be live on GitHub Pages! 🎉**
