# ReturnFilers VPS Deployment Script (PowerShell)
# Usage: .\deploy-to-vps.ps1

Write-Host "🚀 ReturnFilers Backend Deployment" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$VPS_HOST = "api.returnfilers.in"
$VPS_USER = "root"  # Change if different

Write-Host "📡 Connecting to VPS: $VPS_HOST" -ForegroundColor Yellow
Write-Host ""

# Create deployment commands
$deployCommands = @"
echo '✅ Connected to VPS'
echo ''

echo '📂 Navigating to backend directory...'
cd ~/ca-website/backend || cd /home/*/ca-website/backend || cd /var/www/ca-website/backend

if [ `$? -ne 0 ]; then
    echo '❌ Backend directory not found!'
    exit 1
fi

echo '✅ Found backend directory: `$(pwd)'
echo ''

echo '📥 Pulling latest code from GitHub...'
git pull origin main

if [ `$? -ne 0 ]; then
    echo '❌ Git pull failed!'
    exit 1
fi

echo '✅ Code updated successfully'
echo ''

echo '📦 Installing/updating dependencies...'
npm install --production

echo '✅ Dependencies updated'
echo ''

echo '🔄 Restarting backend...'

if command -v pm2 &> /dev/null; then
    pm2 restart all
    pm2 save
    echo '✅ Backend restarted with PM2'
    echo ''
    echo '📊 PM2 Status:'
    pm2 status
elif systemctl list-units | grep -q backend; then
    sudo systemctl restart backend
    echo '✅ Backend restarted with systemd'
    sudo systemctl status backend
else
    echo '⚠️  Could not find PM2 or systemd service'
    echo 'Please restart backend manually'
fi

echo ''
echo '✅ Deployment completed successfully!'
echo '=================================='
"@

# Execute SSH command
ssh "$VPS_USER@$VPS_HOST" $deployCommands

Write-Host ""
Write-Host "🎉 Deployment finished!" -ForegroundColor Green
Write-Host ""
Write-Host "Test your changes at: https://returnfilers.in" -ForegroundColor Cyan
