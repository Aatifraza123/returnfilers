# reCAPTCHA v3 Implementation Guide

## ✅ Setup Complete:

### 1. Configuration:
- **Site Key**: `6LeW0WEsAAAAAAubmmyYk9thYatIUnueFkg-V5Pr` (Frontend)
- **Secret Key**: `6LeW0WEsAAAAAPzZi2Q_032RYblngMeEj0uA4Zuw` (Backend)

### 2. Files Created:
- ✅ `frontend/src/hooks/useRecaptcha.js` - Custom hook for token generation
- ✅ `backend/middleware/recaptchaMiddleware.js` - Verification middleware
- ✅ Updated `frontend/.env` - Added VITE_RECAPTCHA_SITE_KEY
- ✅ Updated `backend/.env` - Added RECAPTCHA_SECRET_KEY
- ✅ Updated `frontend/src/App.jsx` - Wrapped with GoogleReCaptchaProvider

### 3. Package Installed:
```bash
npm install react-google-recaptcha-v3
```

---

## 📋 Forms to Implement:

1. ✅ Contact Form (`frontend/src/pages/Contact.jsx`)
2. ✅ Quote Form (`frontend/src/pages/Quote.jsx`)
3. ✅ Booking Form (`frontend/src/pages/Booking.jsx`)
4. ✅ Consultation Form (in ConsultationModal component)
5. ✅ Admin Login (`frontend/src/pages/admin/AdminLogin.jsx`)

---

## 🔧 How to Use:

### Frontend (React Component):

```javascript
import { useRecaptcha } from '../hooks/useRecaptcha';

const MyForm = () => {
  const getRecaptchaToken = useRecaptcha('form_submit');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get reCAPTCHA token
    const recaptchaToken = await getRecaptchaToken();
    
    if (!recaptchaToken) {
      toast.error('reCAPTCHA verification failed');
      return;
    }

    // Send with form data
    const response = await api.post('/api/contact', {
      ...formData,
      recaptchaToken
    });
  };
};
```

### Backend (Express Route):

```javascript
const { verifyRecaptcha } = require('../middleware/recaptchaMiddleware');

// Add middleware to route (minScore: 0.5 default, 0.3 for lenient, 0.7 for strict)
router.post('/contact', verifyRecaptcha(0.5), contactController.submitContact);
```

---

## 🎯 Score Thresholds:

- **0.9 - 1.0**: Very likely a human
- **0.7 - 0.9**: Likely a human
- **0.5 - 0.7**: Neutral (default threshold)
- **0.3 - 0.5**: Suspicious
- **0.0 - 0.3**: Very likely a bot

### Recommended Scores:
- **Contact/Quote Forms**: 0.5 (balanced)
- **Admin Login**: 0.7 (strict)
- **Booking/Consultation**: 0.5 (balanced)

---

## 🚀 Next Steps:

1. Implement in Contact Form
2. Implement in Quote Form
3. Implement in Booking Form
4. Implement in Consultation Modal
5. Implement in Admin Login
6. Test all forms
7. Deploy to VPS

---

## 🔐 Security Features:

- ✅ Invisible - No user interaction needed
- ✅ Score-based verification
- ✅ Action-specific tokens
- ✅ Server-side verification
- ✅ Development mode fallback
- ✅ Detailed logging

---

## 📝 VPS Deployment:

```bash
# 1. Update .env files on VPS
nano backend/.env
# Add: RECAPTCHA_SECRET_KEY=6LeW0WEsAAAAAPzZi2Q_032RYblngMeEj0uA4Zuw

nano frontend/.env  
# Add: VITE_RECAPTCHA_SITE_KEY=6LeW0WEsAAAAAAubmmyYk9thYatIUnueFkg-V5Pr

# 2. Restart services
pm2 restart backend
npm run build (in frontend)
```

---

**Status**: ✅ Setup Complete - Ready for Form Implementation
**Last Updated**: January 26, 2026
