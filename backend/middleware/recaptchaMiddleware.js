const axios = require('axios');

/**
 * Middleware to verify reCAPTCHA v3 token
 * @param {number} minScore - Minimum score required (0.0 to 1.0, default: 0.5)
 */
const verifyRecaptcha = (minScore = 0.5) => {
  return async (req, res, next) => {
    const recaptchaToken = req.body.recaptchaToken;

    // Skip verification in development if token not provided
    if (!recaptchaToken) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ reCAPTCHA token missing - skipping in development');
        return next();
      }
      return res.status(400).json({ message: 'reCAPTCHA token is required' });
    }

    try {
      const secretKey = process.env.RECAPTCHA_SECRET_KEY;
      
      if (!secretKey) {
        console.error('❌ RECAPTCHA_SECRET_KEY not configured');
        return res.status(500).json({ message: 'reCAPTCHA not configured' });
      }

      // Verify token with Google
      const response = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify`,
        null,
        {
          params: {
            secret: secretKey,
            response: recaptchaToken
          }
        }
      );

      const { success, score, action } = response.data;

      console.log(`🔐 reCAPTCHA verification - Success: ${success}, Score: ${score}, Action: ${action}`);

      if (!success) {
        return res.status(400).json({ 
          message: 'reCAPTCHA verification failed',
          recaptchaError: true 
        });
      }

      if (score < minScore) {
        console.warn(`⚠️ Low reCAPTCHA score: ${score} (min: ${minScore})`);
        return res.status(400).json({ 
          message: 'Suspicious activity detected. Please try again.',
          recaptchaError: true,
          score 
        });
      }

      // Store score in request for logging
      req.recaptchaScore = score;
      next();

    } catch (error) {
      console.error('❌ reCAPTCHA verification error:', error.message);
      
      // In production, fail closed (reject request)
      // In development, fail open (allow request)
      if (process.env.NODE_ENV === 'production') {
        return res.status(500).json({ message: 'reCAPTCHA verification failed' });
      }
      
      console.warn('⚠️ Allowing request in development despite reCAPTCHA error');
      next();
    }
  };
};

module.exports = { verifyRecaptcha };
