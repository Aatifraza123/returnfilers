# Vercel Deployment Guide

## Current Issue: Google OAuth Error

**Error**: `Missing required parameter: client_id`

**Cause**: The `VITE_GOOGLE_CLIENT_ID` environment variable is not set on Vercel.

---

## Step-by-Step Fix

### 1. Add Environment Variables on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **returnfilers-83q8**
3. Click **Settings** → **Environment Variables**
4. Add these variables:

#### Required Variables:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://your-backend.onrender.com` |
| `VITE_GOOGLE_CLIENT_ID` | `652251128665-qlsqialt6p208t06qdqm1s15fl45auvh.apps.googleusercontent.com` |

**Important**: 
- Select **All Environments** (Production, Preview, Development)
- Click **Save** after adding each variable

### 2. Update Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to: **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Add these URLs:

#### Authorized JavaScript origins:
```
https://returnfilers-83q8.vercel.app
http://localhost:5173
```

#### Authorized redirect URIs:
```
https://returnfilers-83q8.vercel.app
https://returnfilers-83q8.vercel.app/login
http://localhost:5173
http://localhost:5173/login
```

6. Click **Save**

### 3. Update Backend Environment Variables (Render)

On your Render backend service, update:

```
FRONTEND_URL=https://returnfilers-83q8.vercel.app
```

This is needed for:
- CORS configuration
- Password reset email links
- OTP verification emails

### 4. Redeploy

After adding environment variables:

1. **Vercel**: Go to **Deployments** → Click **⋯** on latest deployment → **Redeploy**
2. **Render**: Will auto-redeploy when you update environment variables

---

## Verification Checklist

After deployment, verify:

- [ ] Frontend loads without errors
- [ ] Google login button appears
- [ ] Clicking Google login opens Google OAuth popup
- [ ] After login, redirects to dashboard
- [ ] No console errors about missing client_id
- [ ] Forms submit successfully to backend
- [ ] Email notifications work

---

## Common Issues

### Issue 1: "Origin not allowed" error
**Solution**: Make sure your Vercel URL is added to Google Cloud Console authorized origins

### Issue 2: CORS errors
**Solution**: Update `FRONTEND_URL` on Render to match your Vercel URL

### Issue 3: API calls fail
**Solution**: Check that `VITE_API_URL` on Vercel points to your Render backend URL

### Issue 4: Environment variables not working
**Solution**: 
- Make sure variable names start with `VITE_` for frontend
- Redeploy after adding variables
- Check that variables are set for all environments

---

## Environment Variables Summary

### Frontend (Vercel)
```env
VITE_API_URL=https://your-backend.onrender.com
VITE_GOOGLE_CLIENT_ID=652251128665-qlsqialt6p208t06qdqm1s15fl45auvh.apps.googleusercontent.com
```

### Backend (Render)
```env
PORT=5000
MONGO_URI=mongodb+srv://aatif:raza123@cluster0.2qrfq15.mongodb.net/ca-website?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=578e6c6891396a092aec353657dd6b6821e944c68ceae7cde48ac767e0a173ac
FRONTEND_URL=https://returnfilers-83q8.vercel.app

GOOGLE_CLIENT_ID=652251128665-qlsqialt6p208t06qdqm1s15fl45auvh.apps.googleusercontent.com

SMTP_HOST=smtppro.zoho.in
EMAIL_USER=info@returnfilers.in
EMAIL_PASS=rdwnce0XQPa5

ADMIN_EMAIL=razaahmadwork@gmail.com

OPENROUTER_API_KEY=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
GROQ_API_KEY=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

RESEND_API_KEY=re_JgZ15sv1_DJbrD6VWmU3HRsEf4FDZ1s2c
RESEND_FROM=ReturnFilers <onboarding@resend.dev>

GNEWS_API_KEY=98efbd1dba0c573f54130b71443c1b1c
```

---

## Testing Locally

To test before deploying:

1. Update `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=652251128665-qlsqialt6p208t06qdqm1s15fl45auvh.apps.googleusercontent.com
```

2. Update `backend/.env`:
```env
FRONTEND_URL=http://localhost:5173
```

3. Run both servers:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

4. Test Google login at `http://localhost:5173`

---

## Need Help?

If you're still facing issues:

1. Check browser console for errors (F12)
2. Check Vercel deployment logs
3. Check Render backend logs
4. Verify all environment variables are set correctly
5. Make sure Google Cloud Console URLs match your deployment URLs
