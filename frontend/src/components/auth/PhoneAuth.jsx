import { useState, useEffect } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../config/firebase';
import toast from 'react-hot-toast';
import { FaPhone, FaSpinner } from 'react-icons/fa';

const PhoneAuth = ({ onSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {
          console.log('Cleanup error:', e);
        }
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  // Setup reCAPTCHA
  const setupRecaptcha = () => {
    // Clear existing verifier
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (e) {
        console.log('Recaptcha clear error:', e);
      }
      window.recaptchaVerifier = null;
    }

    // Create new verifier
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'normal',
        callback: (response) => {
          console.log('reCAPTCHA solved:', response);
        },
        'expired-callback': () => {
          toast.error('reCAPTCHA expired. Please try again.');
          if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = null;
          }
        }
      });
      
      // Render the reCAPTCHA
      window.recaptchaVerifier.render().then((widgetId) => {
        console.log('reCAPTCHA rendered with widget ID:', widgetId);
        window.recaptchaWidgetId = widgetId;
      });
    } catch (error) {
      console.error('reCAPTCHA setup error:', error);
      toast.error('Failed to initialize reCAPTCHA');
    }
  };

  // Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (phoneNumber.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const formattedPhone = `+91${phoneNumber}`;
      
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setVerificationId(confirmationResult.verificationId);
      setOtpSent(true);
      toast.success('OTP sent successfully!');
    } catch (error) {
      console.error('Error sending OTP:', error);
      
      // Better error messages
      if (error.code === 'auth/billing-not-enabled') {
        toast.error('Firebase Blaze plan required for phone authentication. Please upgrade your Firebase project.');
      } else if (error.code === 'auth/invalid-phone-number') {
        toast.error('Invalid phone number format');
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('Too many requests. Please try again later.');
      } else {
        toast.error(error.message || 'Failed to send OTP');
      }
      
      // Reset reCAPTCHA on error
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      const result = await signInWithCredential(auth, credential);
      
      toast.success('Phone verified successfully!');
      
      if (onSuccess) {
        onSuccess({
          phone: phoneNumber,
          uid: result.user.uid
        });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      
      if (error.code === 'auth/invalid-verification-code') {
        toast.error('Invalid OTP. Please check and try again.');
      } else if (error.code === 'auth/code-expired') {
        toast.error('OTP expired. Please request a new one.');
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {!otpSent ? (
        <form onSubmit={handleSendOTP} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="flex gap-2">
              <div className="flex items-center px-3 py-2 bg-gray-100 border border-gray-300 rounded-md">
                <span className="text-gray-700 font-medium text-sm">+91</span>
              </div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="9876543210"
                maxLength={10}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-sm"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter your 10-digit mobile number
            </p>
          </div>

          {/* reCAPTCHA Container */}
          <div className="flex justify-center">
            <div id="recaptcha-container"></div>
          </div>
          
          <button
            type="submit"
            disabled={loading || phoneNumber.length !== 10}
            className="w-full bg-gray-900 text-white py-2.5 rounded-md font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <><FaSpinner className="animate-spin" /> Sending OTP...</>
            ) : (
              <><FaPhone /> Send OTP</>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              maxLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-center text-2xl tracking-widest"
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              OTP sent to +91 {phoneNumber}
            </p>
          </div>
          
          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-gray-900 text-white py-2.5 rounded-md font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <><FaSpinner className="animate-spin" /> Verifying...</>
            ) : (
              'Verify OTP'
            )}
          </button>
          
          <button
            type="button"
            onClick={() => {
              setOtpSent(false);
              setOtp('');
              setVerificationId('');
            }}
            className="w-full py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Change Phone Number
          </button>
        </form>
      )}
    </div>
  );
};

export default PhoneAuth;
