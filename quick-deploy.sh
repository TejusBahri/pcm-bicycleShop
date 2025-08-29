#!/bin/bash

echo "🚀 PCM Bicycle Shop - Quick Deployment Script"
echo "=============================================="
echo ""

echo "📋 Step 1: GitHub Repository Setup"
echo "----------------------------------"
echo "1. Go to https://github.com and create a new repository"
echo "2. Name it: pcm-bicycle-shop"
echo "3. Make it public"
echo "4. Don't initialize with README"
echo ""

read -p "Have you created the GitHub repository? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Please create the GitHub repository first, then run this script again."
    exit 1
fi

echo "✅ Great! Now let's connect to GitHub..."
echo ""

read -p "Enter your GitHub username: " github_username
echo ""

echo "🔗 Connecting to GitHub repository..."
git remote add origin https://github.com/$github_username/pcm-bicycle-shop.git
git branch -M main

echo "📤 Pushing to GitHub..."
git push -u origin main

echo ""
echo "🎉 Repository pushed to GitHub successfully!"
echo ""

echo "🚂 Step 2: Deploy Backend to Railway"
echo "------------------------------------"
echo "1. Go to https://railway.app"
echo "2. Sign in with GitHub"
echo "3. Click 'New Project'"
echo "4. Select 'Deploy from GitHub repo'"
echo "5. Choose your pcm-bicycle-shop repository"
echo "6. Railway will auto-detect it's a Go project"
echo "7. Wait for deployment to complete"
echo ""

read -p "Have you deployed to Railway? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Please deploy to Railway first, then continue."
    exit 1
fi

echo "✅ Great! Now let's get your Railway URL..."
echo ""

read -p "Enter your Railway URL (e.g., https://your-app.up.railway.app): " railway_url
echo ""

echo "🔧 Step 3: Configure CORS"
echo "-------------------------"
echo "1. In Railway dashboard, go to your service"
echo "2. Add environment variable:"
echo "   CORS_ORIGIN=https://$github_username.github.io"
echo "3. Railway will auto-redeploy"
echo ""

read -p "Have you set the CORS environment variable? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Please set the CORS variable first."
    exit 1
fi

echo "🌐 Step 4: Deploy Frontend to GitHub Pages"
echo "-------------------------------------------"
echo "1. Go to your GitHub repository"
echo "2. Click 'Settings' → 'Pages'"
echo "3. Source: Deploy from a branch"
echo "4. Branch: gh-pages"
echo "5. Folder: / (root)"
echo "6. Click 'Save'"
echo ""

read -p "Have you enabled GitHub Pages? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Please enable GitHub Pages first."
    exit 1
fi

echo "🔗 Step 5: Update API URLs"
echo "---------------------------"
echo "Updating frontend to use Railway backend..."

# Update the main.js file with Railway URL
sed -i '' "s|/api/|$railway_url/api/|g" frontend/js/main.js
sed -i '' "s|/api/|$railway_url/api/|g" frontend/js/catalog.js
sed -i '' "s|/api/|$railway_url/api/|g" frontend/js/wishlist.js
sed -i '' "s|/api/|$railway_url/api/|g" frontend/js/contact.js

echo "✅ API URLs updated to use Railway backend"
echo ""

echo "📤 Pushing updated frontend to GitHub..."
git add .
git commit -m "Update API URLs for Railway deployment"
git push

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "======================="
echo ""
echo "🌐 Your live website: https://$github_username.github.io/pcm-bicycle-shop"
echo "🔌 Backend API: $railway_url/api/products"
echo ""
echo "⏳ GitHub Pages may take a few minutes to deploy..."
echo "Check your repository's Actions tab for deployment status."
echo ""
echo "🚴‍♂️ Happy cycling! Your website is now live on the internet!" 