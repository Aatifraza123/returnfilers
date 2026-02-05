# reCAPTCHA v3 Implementation - Complete ✅

## Overview
reCAPTCHA v3 has been successfully implemented across the application to protect forms from spam and bot submissions. The implementation is **completely invisible** to users (no badge or checkbox).

---

## Configuration

### Frontend (.env)
```env
VITE_RECAPTCHA_SITE_KEY=6LeW0WEsAAAAAAubmmyYk9thYatIUnueFkg-V5Pr
```

### Backend (.env)
```env
RECAPTCHA_SECRET_KEY=6LeW0WEsAAAAAPzZi2Q_032RYblngMeEj0uA4Zuw
```

---

## Protected Forms

### 1. Contact Form (`/contact`)
- **Score Threshold**: 0.5
- **Action**: `contact_form`
- **File**: `frontend/src/pages/Contact.jsx`
- **Backend Route**: `POST /api/contacts`

### 2. Quote Form (`/quote`)
- **Score Threshold**: 0.5
- **Action**: `quote_form`
- **File**: `frontend/src/pages/Quote.jsx`
- **Backend Route**: `POST /api/quotes`

### 3. Booking Form (`/booking`)
- **Score Threshold**: 0.5
- **Action**: `booking_form`
- **File**: `frontend/src/pages/Booking.jsx`
- **Backend Route**: `POST /api/bookings`

### 4. Consultation Modal
- **Score Threshold**: 0.5
- **Action**: `consultation_form`
- **File**: `frontend/src/components/common/ConsultationModal.jsx`
- **Backend Route**: `POST /api/consultations`

### 5. Admin Login (`/admin/login`)
- **Score Threshold**: 0.7 (stricter)
- **Action**: `admin_login`
- **File**: `frontend/src/pages/admin/AdminLogin.jsx`
- **Backend Route**: `POST /api/admin/auth/login`

---

## Technical Implementation

### Frontend Setup

#### 1. App.jsx - Provider Wrapper
```jsx
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

<GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}>
  {/* App content */}
</GoogleReCaptchaProvider>
```

#### 2. Custom Hook (`frontend/src/hooks/useRecaptcha.js`)
```javascript
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export const useRecaptcha = (action = 'submit') => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const getRecaptchaToken = async () => {
    if (!executeRecaptcha) return null;
    
    try {
      const token = await executeRecaptcha(action);
      return token;
    } catch (error) {
      console.error('reCAPTCHA error:', error);
      return null;
    }
  };

  return getRecaptchaToken;
};
```

#### 3. Form Usage Example
```javascript
import { useRecaptcha } from '../hooks/useRecaptcha';

const MyForm = () => {
  const getRecaptchaToken = useRecaptcha('my_form_action');

  const handleSubmit = async (data) => {
    // Get token
    const recaptchaToken = await getRecaptchaToken();
    
    if (!recaptchaToken) {
      toast.error('Security verification failed');
      return;
    }

    // Send with form data
    await api.post('/endpoint', {
      ...data,
      recaptchaToken
    });
  };
};
```

### Backend Setup

#### 1. Middleware (`backend/middleware/recaptchaMiddleware.js`)
```javascript
const axios = require('axios');

const verifyRecaptcha = (minScore = 0.5) => {
  return async (req, res, next) => {
    const recaptchaToken = req.body.recaptchaToken;

    if (!recaptchaToken) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ reCAPTCHA token missing - skipping in development');
        return next();
      }
      return res.status(400).json({ message: 'reCAPTCHA token is required' });
    }

    try {
      const response = await axios.post(
        'https://www.google.com/recaptcha/api/siteverify',
        null,
        {
          params: {
            secret: process.env.RECAPTCHA_SECRET_KEY,
            response: recaptchaToken
          }
        }
      );

      const { success, score } = response.data;

      if (!success || score < minScore) {
        return res.status(400).json({ 
          message: 'Suspicious activity detected',
          recaptchaError: true 
        });
      }

      req.recaptchaScore = score;
      next();
    } catch (error) {
      console.error('❌ reCAPTCHA verification error:', error.message);
      
      if (process.env.NODE_ENV === 'production') {
        return res.status(500).json({ message: 'reCAPTCHA verification failed' });
      }
      
      next(); // Allow in development
    }
  };
};

module.exports = { verifyRecaptcha };
```

#### 2. Route Usage Example
```javascript
const { verifyRecaptcha } = require('../middleware/recaptchaMiddleware');

// Public route with reCAPTCHA (score 0.5)
router.post('/', verifyRecaptcha(0.5), createContact);

// Admin route with stricter reCAPTCHA (score 0.7)
router.post('/login', verifyRecaptcha(0.7), loginAdmin);
```

---

## Badge Hiding

The reCAPTCHA badge is completely hidden using CSS in `frontend/src/index.css`:

```css
/* reCAPTCHA Badge - Completely Hidden */
.grecaptcha-badge {
  visibility: hidden !important;
  opacity: 0 !important;
  display: none !important;
}
```

---

## Score Thresholds

reCAPTCHA v3 returns a score from 0.0 (bot) to 1.0 (human):

- **0.0 - 0.3**: Likely bot
- **0.3 - 0.7**: Suspicious
- **0.7 - 1.0**: Likely human

### Our Thresholds:
- **Public Forms** (Contact, Quote, Booking, Consultation): `0.5` - Balanced protection
- **Admin Login**: `0.7` - Stricter security

---

## Testing

### Test Results (from previous session):
- ✅ Contact form: Score 0.9 - Passed
- ✅ Quote form: Score 0.9 - Passed
- ✅ Booking form: Score 0.9 - Passed
- ✅ Consultation modal: Score 0.9 - Passed
- ✅ Admin login: Score 0.9 - Passed

### How to Test:
1. Open any protected form
2. Fill in the details
3. Submit the form
4. Check backend logs for reCAPTCHA score:
   ```
   🔐 reCAPTCHA verification - Success: true, Score: 0.9, Action: contact_form
   ```

---

## Dependencies

### Frontend
```json
{
  "react-google-recaptcha-v3": "^1.11.0"
}
```

### Backend
```json
{
  "axios": "^1.7.9"
}
```

---

## Environment-Specific Behavior

### Development Mode
- Missing tokens: Warning logged, request allowed
- Verification errors: Warning logged, request allowed
- Allows testing without reCAPTCHA

### Production Mode
- Missing tokens: Request rejected (400)
- Verification errors: Request rejected (500)
- Low scores: Request rejected (400)
- Full security enforcement

---

## Security Features

1. ✅ **Invisible Protection**: No user interaction required
2. ✅ **Score-Based**: Adaptive security based on behavior
3. ✅ **Multiple Actions**: Different tracking per form
4. ✅ **Configurable Thresholds**: Adjust per endpoint
5. ✅ **Development Mode**: Easy testing without blocking
6. ✅ **Error Handling**: Graceful fallbacks
7. ✅ **Badge Hidden**: Clean UI without Google branding

---

## Maintenance

### Updating Keys
1. Get new keys from [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Update `.env` files:
   - Frontend: `VITE_RECAPTCHA_SITE_KEY`
   - Backend: `RECAPTCHA_SECRET_KEY`
3. Restart both servers

### Adjusting Thresholds
Edit the score in route files:
```javascript
// More lenient (0.3)
router.post('/', verifyRecaptcha(0.3), handler);

// Stricter (0.8)
router.post('/', verifyRecaptcha(0.8), handler);
```

### Adding to New Forms
1. Use the hook: `const getRecaptchaToken = useRecaptcha('new_action');`
2. Get token before submit: `const token = await getRecaptchaToken();`
3. Send with data: `{ ...formData, recaptchaToken: token }`
4. Add middleware to route: `router.post('/', verifyRecaptcha(0.5), handler);`

---

## Status: ✅ COMPLETE

reCAPTCHA v3 is fully implemented, tested, and working across all forms. The implementation is invisible to users and provides robust protection against spam and bots.

**Last Updated**: February 6, 2026
**Tested By**: Development Team
**Status**: Production Ready
