import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/layout/Layout'
import PrivateRoute from './components/common/PrivateRoute'
import AIChatbot from './components/common/AIChatbot'
import AdminLayout from './components/layout/AdminLayout' 

// Public Pages
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import Expertise from './pages/Expertise'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Portfolio from './pages/Portfolio'
import Contact from './pages/Contact'
import Payment from './pages/Payment'
import Quote from './pages/Quote'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsConditions from './pages/TermsConditions'
import RefundPolicy from './pages/RefundPolicy'
import Auth from "./pages/Auth"

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminConsultations from './pages/admin/AdminConsultations'
import AdminContacts from './pages/admin/AdminContacts'

// Admin - Services
import AdminServices from './pages/admin/AdminServices'
import AdminServicesForm from './pages/admin/AdminServicesAdd'
 // Ensure this file exists

// Admin - Other Sections
import AdminBlogs from './pages/admin/AdminBlogs'
import AdminPortfolio from './pages/admin/AdminPortfolio'
import AdminReviews from './pages/admin/AdminReviews'
import AdminPayments from './pages/admin/AdminPayments'
import AdminUsers from './pages/admin/AdminUsers'
import AdminEmails from './pages/admin/AdminEmails'
import AdminQuotes from './pages/admin/AdminQuotes'
import AdminSettings from './pages/admin/AdminSettings'
import AdminTestimonials from './pages/admin/AdminTestimonials'

function App() {
  console.log('App component rendering...');
  
  // Simple test to see if React is working
  try {
    return (
      <AuthProvider>
        <AIChatbot />

          <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="auth" element={<Auth />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:id" element={<ServiceDetail />} />
          <Route path="expertise" element={<Expertise />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:id" element={<BlogPost />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="contact" element={<Contact />} />
          <Route path="payment" element={<Payment />} />
          <Route path="quote" element={<Quote />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms-conditions" element={<TermsConditions />} />
          <Route path="refund-policy" element={<RefundPolicy />} />
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
          <Route path="portfolio" element={<AdminPortfolio />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="emails" element={<AdminEmails />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="quotes" element={<AdminQuotes />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-[#0B1530] mb-4">404</h1>
              <p className="text-xl text-gray-600 mb-8">Page Not Found</p>
              <a href="/" className="px-6 py-3 bg-[#0B1530] text-white rounded-lg hover:bg-[#D4AF37] transition-colors">
                Go Home
              </a>
            </div>
          </div>
        } />
      </Routes>
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





