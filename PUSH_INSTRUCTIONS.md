# 🚀 GitHub Push Instructions

## 🔐 Authentication Issue Detected

The system is trying to push as `RameshSapkota435` but needs to push as `dhrin900`.

## ✅ Option 1: Use Personal Access Token (Recommended)

### Step 1: Create Personal Access Token
1. Go to **GitHub.com** → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **"Generate new token (classic)"**
3. Give it a name: `Portfolio Deployment`
4. Select scopes: ✅ **repo** (Full control of private repositories)
5. Click **"Generate token"**
6. **Copy the token** (you won't see it again!)

### Step 2: Push with Token
```bash
# Remove existing remote
git remote remove origin

# Add remote with token (replace YOUR_TOKEN with actual token)
git remote add origin https://YOUR_TOKEN@github.com/dhrin900/dhrin900.github.io.git

# Push to GitHub
git push -u origin main
```

## ✅ Option 2: Use SSH (Alternative)

### Step 1: Generate SSH Key
```bash
ssh-keygen -t ed25519 -C "babegirl33010@gmail.com"
```

### Step 2: Add SSH Key to GitHub
1. Copy the public key: `cat ~/.ssh/id_ed25519.pub`
2. Go to **GitHub.com** → **Settings** → **SSH and GPG keys**
3. Click **"New SSH key"** and paste the public key

### Step 3: Push with SSH
```bash
# Remove existing remote
git remote remove origin

# Add SSH remote
git remote add origin git@github.com:dhrin900/dhrin900.github.io.git

# Push to GitHub
git push -u origin main
```

## ✅ Option 3: GitHub CLI (Easiest)

### Install GitHub CLI and authenticate:
```bash
# Install GitHub CLI (if not installed)
winget install GitHub.cli

# Authenticate
gh auth login

# Push the repository
gh repo create dhrin900.github.io --public --source=. --remote=origin --push
```

## 🌟 After Successful Push:

1. Go to **https://github.com/dhrin900/dhrin900.github.io**
2. Click **Settings** tab
3. Scroll to **Pages** section
4. Set **Source** to **"GitHub Actions"**
5. Wait 5-10 minutes for deployment
6. Visit **https://dhrin900.github.io** to see your portfolio!

---

🎉 **Your ultra-modern portfolio will be live at:** `https://dhrin900.github.io`