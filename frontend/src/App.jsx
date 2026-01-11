import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { UserAuthProvider } from './context/UserAuthContext'
import { SettingsProvider } from './context/SettingsContext'
import Layout from './components/layout/Layout'
import PrivateRoute from './components/common/PrivateRoute'
import AIChatbot from './components/common/AIChatbot'
import ThemeProvider from './components/common/ThemeProvider'
import GoogleAnalytics from './components/common/GoogleAnalytics'
import GoogleTagManager from './components/common/GoogleTagManager'
import FacebookPixel from './components/common/FacebookPixel'
import AdminLayout from './components/layout/AdminLayout' 

// Public Pages
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import Expertise from './pages/Expertise'
import ExpertiseDetail from './pages/ExpertiseDetail'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Contact from './pages/Contact'
import TermsConditions from './pages/TermsConditions'
import Quote from './pages/Quote'
import PrivacyPolicy from './pages/PrivacyPolicy'
import RefundPolicy from './pages/RefundPolicy'
import Auth from './pages/Auth'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

// User Pages
import UserDashboard from './pages/user/UserDashboard'
import UserProfile from './pages/user/UserProfile'
import MyBookings from './pages/user/MyBookings'
import MyQuotes from './pages/user/MyQuotes'
import MyConsultations from './pages/user/MyConsultations'
import UserNotifications from './pages/user/UserNotifications'

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminConsultations from './pages/admin/AdminConsultations'
import AdminContacts from './pages/admin/AdminContacts'

// Admin - Services
import AdminServices from './pages/admin/AdminServices'
import AdminServicesForm from './pages/admin/AdminServicesAdd'

// Admin - Other Sections
import AdminBlogs from './pages/admin/AdminBlogs'
import AdminReviews from './pages/admin/AdminReviews'
import AdminUsers from './pages/admin/AdminUsers'
import AdminEmails from './pages/admin/AdminEmails'
import AdminQuotes from './pages/admin/AdminQuotes'
import AdminSettings from './pages/admin/AdminSettings'
import AdminProfile from './pages/admin/AdminProfile'
import AdminTestimonials from './pages/admin/AdminTestimonials'
import AdminBookings from './pages/admin/AdminBookings'
import AdminDigitalServices from './pages/admin/AdminDigitalServices'
import Booking from './pages/Booking'
import DigitalServices from './pages/DigitalServices'
import PackageDetail from './pages/PackageDetail'
import TestSettings from './pages/TestSettings'

// Wrapper component to conditionally show chatbot
const ChatbotWrapper = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Don't show chatbot on admin pages
  if (isAdminRoute) return null;
  
  return <AIChatbot />;
};

function App() {
  console.log('App component rendering... v2.0');
  
  // Simple test to see if React is working
  try {
    return (
      <AuthProvider>
        <UserAuthProvider>
          <SettingsProvider>
            <ThemeProvider>
              <GoogleAnalytics />
              <GoogleTagManager />
              <FacebookPixel />
              <ChatbotWrapper />

              <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Auth />} />
            <Route path="auth" element={<Auth />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:id" element={<ServiceDetail />} />
          <Route path="expertise" element={<Expertise />} />
          <Route path="expertise/:slug" element={<ExpertiseDetail />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:id" element={<BlogPost />} />
          {/* <Route path="portfolio" element={<Portfolio />} /> */}
          <Route path="contact" element={<Contact />} />
          <Route path="terms-conditions" element={<TermsConditions />} />
          <Route path="quote" element={<Quote />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="refund-policy" element={<RefundPolicy />} />
          <Route path="booking" element={<Booking />} />
          <Route path="digital-services" element={<DigitalServices />} />
          <Route path="digital-services/:slug/:packageSlug" element={<PackageDetail />} />
          <Route path="upload-documents" element={<Booking />} />
          <Route path="test-settings" element={<TestSettings />} />
          
          {/* User Dashboard Routes */}
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="dashboard/profile" element={<UserProfile />} />
          <Route path="dashboard/bookings" element={<MyBookings />} />
          <Route path="dashboard/quotes" element={<MyQuotes />} />
          <Route path="dashboard/consultations" element={<MyConsultations />} />
          <Route path="dashboard/notifications" element={<UserNotifications />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
          {/* Default redirect to dashboard */}
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="consultations" element={<AdminConsultations />} />
          
          {/* Service Routes (List, Add, Edit, View) */}
          <Route path="services" element={<AdminServices />} />
          <Route path="services/add" element={<AdminServicesForm />} />
          <Route path="services/edit/:id" element={<AdminServicesForm />} />
          <Route path="services/view/:id" element={<AdminServicesForm />} />
          
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="emails" element={<AdminEmails />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="quotes" element={<AdminQuotes />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="digital-services" element={<AdminDigitalServices />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-[#0B1530] mb-4">404</h1>
              <p className="text-xl text-gray-600 mb-8">Page Not Found</p>
              <a href="/" className="px-6 py-3 bg-[#0B1530] text-white rounded-lg hover:bg-[#C9A227] transition-colors">
                Go Home
              </a>
            </div>
          </div>
        } />
      </Routes>
          </ThemeProvider>
        </SettingsProvider>
      </UserAuthProvider>
      </AuthProvider>
    );
  } catch (error) {
    console.error('Error in App component:', error);
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Error Loading App</h1>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>Reload Page</button>
      </div>
    );
  }
}

export default App





