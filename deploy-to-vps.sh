#!/bin/bash

# ReturnFilers VPS Deployment Script
# Usage: ./deploy-to-vps.sh

echo "🚀 ReturnFilers Backend Deployment"
echo "=================================="
echo ""

# Configuration
VPS_HOST="api.returnfilers.in"
VPS_USER="root"  # Change if different
BACKEND_PATH="~/ca-website/backend"  # Change if different

echo "📡 Connecting to VPS: $VPS_HOST"
echo ""

# SSH and deploy
ssh $VPS_USER@$VPS_HOST << 'ENDSSH'
    echo "✅ Connected to VPS"
    echo ""
    
    # Navigate to backend directory
    echo "📂 Navigating to backend directory..."
    cd ~/ca-website/backend || cd /home/*/ca-website/backend || cd /var/www/ca-website/backend
    
    if [ $? -ne 0 ]; then
        echo "❌ Backend directory not found!"
        exit 1
    fi
    
    echo "✅ Found backend directory: $(pwd)"
    echo ""
    
    # Pull latest code
    echo "📥 Pulling latest code from GitHub..."
    git pull origin main
    
    if [ $? -ne 0 ]; then
        echo "❌ Git pull failed!"
        exit 1
    fi
    
    echo "✅ Code updated successfully"
    echo ""
    
    # Install dependencies
    echo "📦 Installing/updating dependencies..."
    npm install --production
    
    echo "✅ Dependencies updated"
    echo ""
    
    # Restart backend
    echo "🔄 Restarting backend..."
    
    # Try PM2 first
    if command -v pm2 &> /dev/null; then
        pm2 restart all
        pm2 save
        echo "✅ Backend restarted with PM2"
        echo ""
        echo "📊 PM2 Status:"
        pm2 status
    # Try systemd
    elif systemctl list-units | grep -q backend; then
        sudo systemctl restart backend
        echo "✅ Backend restarted with systemd"
        sudo systemctl status backend
    else
        echo "⚠️  Could not find PM2 or systemd service"
        echo "Please restart backend manually"
    fi
    
    echo ""
    echo "✅ Deployment completed successfully!"
    echo "=================================="
ENDSSH

echo ""
echo "🎉 Deployment finished!"
echo ""
echo "Test your changes at: https://returnfilers.in"
