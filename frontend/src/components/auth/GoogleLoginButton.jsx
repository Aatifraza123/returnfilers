import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import UserAuthContext from '../../context/UserAuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const GoogleLoginButton = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { login } = useContext(UserAuthContext);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/auth/google`,
        { credential: credentialResponse.credential }
      );

      if (response.data.success) {
        // Store token and user data
        localStorage.setItem('userToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Update context
        login(response.data.user, response.data.token);
        
        toast.success(`Welcome back, ${response.data.user.name}!`);
        
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(error.response?.data?.message || 'Google login failed');
    }
  };

  const handleGoogleError = () => {
    toast.error('Google login failed');
  };

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap
        theme="outline"
        size="large"
        text="continue_with"
        shape="rectangular"
        width="100%"
      />
    </div>
  );
};

export default GoogleLoginButton;
