#!/bin/bash

echo "🚀 Preparing for Render Deployment..."
echo ""

# Check if we're in the right directory
if [ ! -d "backend" ]; then
    echo "❌ Error: backend directory not found!"
    echo "Make sure you're in the PCM_Site root directory"
    exit 1
fi

# Check if Go is installed
if ! command -v go &> /dev/null; then
    echo "❌ Error: Go is not installed!"
    echo "Please install Go first: https://golang.org/dl/"
    exit 1
fi

# Check if backend compiles
echo "🔨 Testing Go build..."
cd backend
if go build -o main .; then
    echo "✅ Go build successful!"
    rm main  # Clean up
else
    echo "❌ Go build failed!"
    exit 1
fi
cd ..

echo ""
echo "✅ Your project is ready for Render deployment!"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://render.com and sign up"
echo "2. Create a new Web Service"
echo "3. Connect your GitHub repo: tejus-swiggy/pcm-bicycle-shop"
echo "4. Set Root Directory to: backend"
echo "5. Deploy!"
echo ""
echo "📖 See RENDER_DEPLOYMENT.md for detailed instructions" 