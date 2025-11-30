# Deployment Guide - CA Associates Website

Complete guide to deploy the CA Associates website to production.

## 📋 Prerequisites

1. **MongoDB Atlas Account** (Free tier available)
   - Sign up at https://www.mongodb.com/cloud/atlas
   - Create a cluster and get connection string

2. **Backend Hosting** (Choose one):
   - **Railway** (Recommended - Free tier): https://railway.app
   - **Render**: https://render.com (Free tier available)
   - **Heroku**: https://heroku.com (Paid only now)

3. **Frontend Hosting**:
   - **Vercel** (Recommended - Free): https://vercel.com
   - **Netlify**: https://netlify.com (Free tier available)

4. **Email Service**:
   - Gmail with App Password (Free)
   - Or any SMTP service

5. **Payment Gateway** (Optional):
   - Razorpay account: https://razorpay.com

---

## 🚀 Step 1: Backend Deployment

### Option A: Deploy to Railway (Recommended)

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository
   - Select the repository

3. **Configure Backend**
   - Railway will auto-detect Node.js
   - Set root directory to: `backend`
   - Add environment variables (see below)

4. **Set Environment Variables in Railway**:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ca-website?retryWrites=true&w=majority
   JWT_SECRET=your-very-long-random-secret-key-here
   PORT=5000
   NODE_ENV=production
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   RAZORPAY_KEY_ID=your-razorpay-key
   RAZORPAY_KEY_SECRET=your-razorpay-secret
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

5. **Update package.json start script** (Already done):
   ```json
   "scripts": {
     "start": "node server.js"
   }
   ```

6. **Deploy**
   - Railway will automatically deploy
   - Copy the deployed URL (e.g., `https://your-app.railway.app`)

---

### Option B: Deploy to Render

1. **Create Render Account** at https://render.com

2. **Create New Web Service**
   - Connect GitHub repository
   - Settings:
     - **Name**: ca-website-backend
     - **Root Directory**: backend
     - **Build Command**: (leave empty, or `npm install`)
     - **Start Command**: `npm start`
     - **Environment**: Node

3. **Add Environment Variables** (same as Railway)

4. **Deploy**
   - Render will auto-deploy
   - Copy the URL (e.g., `https://ca-website-backend.onrender.com`)

---

## 🎨 Step 2: Frontend Deployment

### Option A: Deploy to Vercel (Recommended)

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy
   - Copy the deployed URL (e.g., `https://ca-website.vercel.app`)

---

### Option B: Deploy to Netlify

1. **Create Netlify Account** at https://netlify.com

2. **Add New Site from Git**
   - Connect GitHub
   - Select repository

3. **Build Settings**:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

4. **Environment Variables**:
   - Go to Site settings > Environment variables
   - Add: `VITE_API_URL=https://your-backend-url/api`

5. **Deploy**
   - Netlify will auto-deploy

---

## ⚙️ Step 3: Environment Variables Setup

### Backend Environment Variables

Create a `.env` file in `backend/` folder (or set in hosting platform):

```env
# Database (MongoDB Atlas)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ca-website?retryWrites=true&w=majority

# Server
PORT=5000
NODE_ENV=production

# JWT Secret (Generate a strong random string)
JWT_SECRET=generate-a-very-long-random-string-here-minimum-32-characters

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-specific-password

# Razorpay (Optional - if using payments)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Frontend Environment Variables

Create a `.env` file in `frontend/` folder (or set in hosting platform):

```env
VITE_API_URL=https://your-backend-url.railway.app/api
```

---

## 📧 Step 4: Email Setup (Gmail)

1. **Enable 2-Factor Authentication** on your Gmail account

2. **Generate App Password**:
   - Go to Google Account settings
   - Security > 2-Step Verification > App passwords
   - Generate password for "Mail"
   - Copy the 16-character password

3. **Use in Environment Variables**:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   ```

---

## 🔐 Step 5: Generate JWT Secret

Generate a secure random string for JWT_SECRET:

**Option 1: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2: Using Online Generator**
- Use https://generate-secret.vercel.app/32

---

## 🔄 Step 6: Update CORS in Backend

The backend has been updated to accept `FRONTEND_URL` environment variable. Make sure to:

1. Set `FRONTEND_URL` in backend environment variables
2. Include your production frontend URL

CORS is already configured to work with production URLs.

---

## 📝 Step 7: MongoDB Atlas Setup

1. **Create Cluster**
   - Go to MongoDB Atlas
   - Create a free cluster (M0)

2. **Create Database User**
   - Database Access > Add New User
   - Set username and password

3. **Whitelist IP Addresses**
   - Network Access > Add IP Address
   - Add `0.0.0.0/0` for all IPs (or specific IPs)

4. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `ca-website`

5. **Use in MONGO_URI**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/ca-website?retryWrites=true&w=majority
   ```

---

## 🧪 Step 8: Testing After Deployment

1. **Test Frontend**:
   - Visit your frontend URL
   - Check if it loads correctly
   - Try navigating pages

2. **Test Backend**:
   - Visit: `https://your-backend-url.railway.app`
   - Should see: "API is running..."

3. **Test API Connection**:
   - Open browser console on frontend
   - Check if API calls work
   - Test login functionality

4. **Test Features**:
   - Contact form
   - Consultation form
   - Newsletter subscription
   - Blog posts
   - Admin login

---

## 🐛 Common Issues & Solutions

### Issue: CORS Error
**Solution**: Make sure `FRONTEND_URL` is set correctly in backend environment variables

### Issue: MongoDB Connection Failed
**Solution**: 
- Check if IP is whitelisted in MongoDB Atlas
- Verify connection string is correct
- Check if password is URL-encoded

### Issue: Email Not Sending
**Solution**:
- Verify Gmail app password is correct
- Check if 2FA is enabled
- Test email credentials

### Issue: Environment Variables Not Working
**Solution**:
- Restart the server after adding variables
- Check variable names match exactly
- For Vite, variables must start with `VITE_`

---

## 📦 Build Commands Reference

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run build
```

---

## 🔗 Quick Links

- **Railway**: https://railway.app
- **Vercel**: https://vercel.com
- **MongoDB Atlas**: https://mongodb.com/cloud/atlas
- **Razorpay**: https://razorpay.com

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Backend deployed to Railway/Render
- [ ] Frontend deployed to Vercel/Netlify
- [ ] All environment variables set
- [ ] CORS configured with production URLs
- [ ] Email configured and tested
- [ ] Admin account created
- [ ] Payment gateway configured (if using)
- [ ] Frontend API URL updated
- [ ] All features tested

---

## 🎉 You're Live!

Once deployed, your CA Associates website will be live and accessible worldwide!

**Need Help?** Check the error logs in your hosting platform dashboard.

