# Deploy to Render (Free Alternative to Railway)

## Step 1: Sign Up for Render
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Verify your email

## Step 2: Create New Web Service
1. Click "New +" button
2. Select "Web Service"
3. Connect your GitHub repository: `tejus-swiggy/pcm-bicycle-shop`

## Step 3: Configure the Service
- **Name**: `pcm-bicycle-shop-backend`
- **Environment**: `Go`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `backend`
- **Build Command**: `go build -o main .`
- **Start Command**: `./main`

## Step 4: Environment Variables
Add these environment variables:
- `PORT`: `8080`

## Step 5: Deploy
1. Click "Create Web Service"
2. Wait for build to complete (usually 2-3 minutes)
3. Your backend will be available at: `https://your-service-name.onrender.com`

## Step 6: Update Frontend
Once deployed, update your frontend JavaScript files with the new backend URL:
- Replace `http://localhost:8080` with your Render URL
- Example: `https://pcm-bicycle-shop-backend.onrender.com`

## Advantages of Render:
- ✅ **Free tier**: 750 hours/month (enough for 24/7)
- ✅ **Automatic HTTPS**: SSL certificates included
- ✅ **Custom domains**: Add your own domain later
- ✅ **Easy deployment**: Just connect GitHub repo
- ✅ **Good performance**: Fast global CDN

## Note:
- Service sleeps after 15 minutes of inactivity
- First request after sleep takes 10-15 seconds
- Perfect for development and small projects 