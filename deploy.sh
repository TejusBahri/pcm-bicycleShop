#!/bin/bash

echo "🚴‍♂️ PCM Bicycle Shop - Deployment Script"
echo "=========================================="

# Check if Go is installed
if ! command -v go &> /dev/null; then
    echo "❌ Go is not installed. Please install Go 1.21+ first."
    echo "Visit: https://golang.org/doc/install"
    exit 1
fi

echo "✅ Go is installed: $(go version)"

# Install Go dependencies
echo "📦 Installing Go dependencies..."
cd backend
go mod tidy
if [ $? -ne 0 ]; then
    echo "❌ Failed to install Go dependencies"
    exit 1
fi
echo "✅ Go dependencies installed"

# Build the application
echo "🔨 Building Go application..."
go build -o main .
if [ $? -ne 0 ]; then
    echo "❌ Failed to build Go application"
    exit 1
fi
echo "✅ Go application built"

# Create database directory if it doesn't exist
cd ..
if [ ! -d "database" ]; then
    mkdir database
    echo "✅ Created database directory"
fi

# Start the server
echo "🚀 Starting server..."
echo "📱 Website will be available at: http://localhost:8080"
echo "🔌 API endpoints: http://localhost:8080/api/*"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

cd backend
./main 