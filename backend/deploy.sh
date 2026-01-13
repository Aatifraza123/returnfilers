#!/bin/bash

echo "🚀 Starting deployment..."

# Navigate to backend directory
cd ~/ca-website/backend

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Restart backend
echo "🔄 Restarting backend..."
pm2 restart all

# Save PM2 configuration
pm2 save

echo "✅ Deployment completed successfully!"
