const express = require('express');
const { exec } = require('child_process');
const crypto = require('crypto');

const app = express();
app.use(express.json());

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'your-secret-key';

app.post('/webhook/deploy', (req, res) => {
  // Verify GitHub signature
  const signature = req.headers['x-hub-signature-256'];
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = 'sha256=' + hmac.update(JSON.stringify(req.body)).digest('hex');
  
  if (signature !== digest) {
    return res.status(401).send('Invalid signature');
  }

  // Deploy
  console.log('Deploying backend...');
  
  exec('cd ~/ca-website/backend && git pull origin main && npm install && pm2 restart all', 
    (error, stdout, stderr) => {
      if (error) {
        console.error('Deployment error:', error);
        return res.status(500).send('Deployment failed');
      }
      console.log('Deployment output:', stdout);
      res.send('Deployed successfully!');
    }
  );
});

app.listen(3001, () => {
  console.log('Webhook server running on port 3001');
});
