# 🚀 GitHub Pages Deployment Guide

## Quick Setup Steps:

### 1. Create GitHub Repository
1. Go to [GitHub.com](https://github.com)
2. Click "New Repository"
3. Name it `dh-rin-portfolio` (or any name you prefer)
4. Make it **Public** (required for free GitHub Pages)
5. Don't initialize with README (we already have one)

### 2. Upload Your Code
```bash
# Initialize git in your project folder
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: DH Rin Portfolio"

# Add remote repository (replace 'yourusername' with your GitHub username)
git remote add origin https://github.com/yourusername/dh-rin-portfolio.git

# Push to GitHub
git push -u origin main
```

### 3. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" section
4. Under "Source", select "GitHub Actions"
5. Save the changes

### 4. Update Repository Name in Config
1. Open `vite.config.js`
2. Change this line:
   ```js
   const base = mode === 'production' ? '/dh-rin-portfolio/' : '/';
   ```
   Replace `dh-rin-portfolio` with your actual repository name

### 5. Deploy
- Push any changes to trigger automatic deployment:
  ```bash
  git add .
  git commit -m "Update configuration"
  git push
  ```

### 6. Access Your Site
Your portfolio will be available at:
`https://yourusername.github.io/repository-name/`

## 📝 Important Notes:

- **Repository must be PUBLIC** for free GitHub Pages
- **Wait 5-10 minutes** for first deployment
- **Check Actions tab** for deployment status
- **Update base path** in vite.config.js to match your repo name

## 🔧 Manual Deployment (Alternative)
If you prefer manual deployment:
```bash
npm run deploy
```

## 🆘 Troubleshooting:
- **404 Error Fixed**: Now uses hash routing for GitHub Pages compatibility
- **If site shows 404**: Check repository name in vite.config.js
- **If deployment fails**: Check GitHub Actions tab for errors
- **If CSS/JS not loading**: Verify base path configuration
- **Router Error**: The app now uses HashRouter which works perfectly with GitHub Pages

---
Your ultra-modern portfolio is ready for the world! 🌟