import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaSave, FaLock } from 'react-icons/fa';
import UserAuthContext from '../../context/UserAuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const { user, token, updateUser } = useContext(UserAuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setFormData({
      name: user.name || '',
      phone: user.phone || ''
    });
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.put('/user/auth/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        updateUser(data.user);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.put('/user/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        toast.success('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordForm(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#0B1530] text-white py-6">
        <div className="container mx-auto px-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-[#C9A227] mb-4 transition-colors"
          >
            <FaArrowLeft /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-2xl">
        {/* Profile Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-bold text-[#0B1530] mb-6">Personal Information</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaUser className="inline mr-2 text-[#C9A227]" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1530]/20 focus:border-[#0B1530]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaEnvelope className="inline mr-2 text-[#C9A227]" />
                Email Address
              </label>
              <input
                type="email"
                value={user?.email}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaPhone className="inline mr-2 text-[#C9A227]" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1530]/20 focus:border-[#0B1530]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0B1530] text-white py-3 rounded-lg font-semibold hover:bg-[#C9A227] hover:text-[#0B1530] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Saving...' : (
                <>
                  <FaSave /> Save Changes
                </>
              )}
            </button>
          </form>
        </div>

        {/* Password Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#0B1530]">Password & Security</h2>
            {!showPasswordForm && (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="text-[#C9A227] hover:text-[#0B1530] font-semibold text-sm"
              >
                Change Password
              </button>
            )}
          </div>

          {showPasswordForm ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1530]/20 focus:border-[#0B1530]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1530]/20 focus:border-[#0B1530]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1530]/20 focus:border-[#0B1530]"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#0B1530] text-white py-3 rounded-lg font-semibold hover:bg-[#C9A227] hover:text-[#0B1530] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? 'Changing...' : (
                    <>
                      <FaLock /> Change Password
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <p className="text-gray-600 text-sm">
              Keep your account secure by using a strong password and changing it regularly.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
