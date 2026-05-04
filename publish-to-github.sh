#!/bin/bash

# Open Source Project Learning Skill - GitHub Publishing Script
# This script will create a GitHub repository and push your code

echo "🚀 Open Source Project Learning Skill - GitHub Publishing"
echo ""

REPO_NAME="opensource-project-learning-skill"
GITHUB_USER="kongshan001"
REPO_DIR="/d/vscode_proj/opensource-project-learning-skill"

echo "📋 Repository Details:"
echo "   Name: $REPO_NAME"
echo "   User: $GITHUB_USER"
echo "   Directory: $REPO_DIR"
echo ""

echo "🌐 Step 1: Create GitHub Repository"
echo "   Please open this URL in your browser:"
echo "   https://github.com/new"
echo ""
echo "   Fill in the following information:"
echo "   - Repository name: $REPO_NAME"
echo "   - Description: A conversational AI skill for systematically learning open-source projects"
echo "   - Public: ✅ Select Public"
echo "   - Add a README: ❌ DON'T check this (we already have one)"
echo ""
read -p "Press Enter after you've created the repository on GitHub..."

echo ""
echo "🔧 Step 2: Configure Git Remote"
cd "$REPO_DIR"
git remote add origin https://github.com/$GITHUB_USER/$REPO_NAME.git
echo "   Remote added: https://github.com/$GITHUB_USER/$REPO_NAME.git"

echo ""
echo "📤 Step 3: Push to GitHub"
git branch -M master
git push -u origin master

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Success! Your repository is now live at:"
    echo "   https://github.com/$GITHUB_USER/$REPO_NAME"
    echo ""
    echo "✅ Next steps:"
    echo "   1. Visit your repository"
    echo "   2. Add topics: ai, learning, open-source, education, developer-tools"
    echo "   3. Share it with the community!"
else
    echo ""
    echo "❌ Push failed. Please check your GitHub credentials and try again."
    echo "   You may need to:"
    echo "   - Create a GitHub personal access token"
    echo "   - Configure git credentials"
    echo "   - Check your internet connection"
fi
