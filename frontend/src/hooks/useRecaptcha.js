import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

/**
 * Custom hook for reCAPTCHA v3 token generation
 * @param {string} action - Action name for reCAPTCHA (e.g., 'contact_form', 'login')
 * @returns {Function} executeRecaptcha - Function to get reCAPTCHA token
 */
export const useRecaptcha = (action = 'submit') => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const getRecaptchaToken = async () => {
    if (!executeRecaptcha) {
      console.warn('reCAPTCHA not loaded yet');
      return null;
    }

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
