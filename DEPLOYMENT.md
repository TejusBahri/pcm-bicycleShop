# 🚀 PCM Bicycle Shop - Deployment Guide

## 🌟 **100% Free Deployment Options**

### **Backend**: Railway (500 hours/month free)
### **Frontend**: GitHub Pages (always free)

---

## 📋 **Step 1: Prepare GitHub Repository**

1. **Create a new repository on GitHub**
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name: `pcm-bicycle-shop`
   - Make it public
   - Don't initialize with README (we already have one)

2. **Connect your local repository**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/pcm-bicycle-shop.git
   git branch -M main
   git push -u origin main
   ```

---

## 🚂 **Step 2: Deploy Backend to Railway**

1. **Sign up for Railway**
   - Go to [railway.app](https://railway.app)
   - Sign in with GitHub
   - Click "New Project"

2. **Deploy from GitHub**
   - Select "Deploy from GitHub repo"
   - Choose your `pcm-bicycle-shop` repository
   - Railway will automatically detect it's a Go project

3. **Configure the service**
   - **Service Name**: `pcm-bicycle-shop-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `go build -o main .`
   - **Start Command**: `./main`

4. **Set Environment Variables**
   - Go to your service settings
   - Add these variables:
     ```
     PORT=8080
     CORS_ORIGIN=https://YOUR_USERNAME.github.io
     ```

5. **Deploy**
   - Railway will automatically build and deploy
   - Wait for deployment to complete
   - Note your Railway URL (e.g., `https://pcm-bicycle-shop-backend-production.up.railway.app`)

---

## 🌐 **Step 3: Deploy Frontend to GitHub Pages**

1. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click "Settings" → "Pages"
   - **Source**: Deploy from a branch
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
   - Click "Save"

2. **Update Frontend API URLs**
   - Edit `frontend/js/main.js`
   - Replace `/api/` with your Railway URL + `/api/`
   - Example: `https://pcm-bicycle-shop-backend-production.up.railway.app/api/`

3. **Deploy Frontend**
   - Push your changes to GitHub
   - GitHub Actions will automatically deploy to Pages
   - Your site will be available at: `https://YOUR_USERNAME.github.io/pcm-bicycle-shop`

---

## 🔧 **Step 4: Configure CORS (Important!)**

1. **Get your Railway URL**
   - From Railway dashboard
   - Format: `https://your-app-name.up.railway.app`

2. **Update CORS settings**
   - In Railway, go to your service
   - Add environment variable:
     ```
     CORS_ORIGIN=https://YOUR_USERNAME.github.io
     ```

3. **Redeploy**
   - Railway will automatically redeploy with new settings

---

## 🌍 **Step 5: Test Your Live Website**

1. **Frontend**: `https://YOUR_USERNAME.github.io/pcm-bicycle-shop`
2. **Backend API**: `https://your-app-name.up.railway.app/api/products`

### **Test these endpoints:**
- ✅ `/api/products` - Product catalog
- ✅ `/api/categories` - Product categories  
- ✅ `/api/contact` - Shop information

---

## 🎯 **Alternative Deployment Options**

### **Backend Alternatives:**
- **Render**: Free tier, good for development
- **Heroku**: Free tier (limited but sufficient)

### **Frontend Alternatives:**
- **Netlify**: Drag & drop, always free
- **Vercel**: Excellent performance, always free

---

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **CORS Errors**
   - Check CORS_ORIGIN environment variable
   - Ensure frontend URL is correct

2. **Build Failures**
   - Check Go version compatibility
   - Verify all dependencies in go.mod

3. **Frontend Not Loading**
   - Check browser console for errors
   - Verify API URLs are correct

4. **Database Issues**
   - Railway uses ephemeral storage
   - Data resets on redeploy (good for demo)

---

## 📱 **Your Live Website Features**

Once deployed, your website will have:
- ✅ **Live product catalog** with real API data
- ✅ **Working wishlist** (local storage)
- ✅ **Search and filtering** functionality
- ✅ **Responsive design** on all devices
- ✅ **Professional appearance** with cycling theme
- ✅ **Fast loading** with CDN hosting

---

## 🎉 **Success!**

Your PCM Bicycle Shop website is now:
- **Live on the internet** for free
- **Accessible worldwide** 24/7
- **Professional and responsive**
- **Ready for customers** to browse

**Visit your live website and start sharing it with customers! 🚴‍♂️✨**

---

## 📞 **Need Help?**

- Check Railway logs for backend issues
- Check GitHub Actions for deployment status
- Review browser console for frontend errors
- Verify all environment variables are set correctly 