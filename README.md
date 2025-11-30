# CA Associates Website

A professional website for Chartered Accountants with admin panel, blog, portfolio, and payment integration.

## 🚀 Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- Axios
- React Quill (Rich Text Editor)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Nodemailer (Email)
- Razorpay (Payments)

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (or MongoDB Atlas)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ca-website
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Setup Environment Variables**

   **Backend** (`backend/.env`):
   ```env
   MONGO_URI=mongodb://localhost:27017/ca-website
   PORT=5000
   JWT_SECRET=your-secret-key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   RAZORPAY_KEY_ID=your-key
   RAZORPAY_KEY_SECRET=your-secret
   FRONTEND_URL=http://localhost:5173
   ```

   **Frontend** (`frontend/.env`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Run the application**

   **Development mode** (runs both frontend and backend):
   ```bash
   npm start
   ```

   **Or run separately**:
   
   Backend:
   ```bash
   cd backend
   npm start
   ```

   Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

5. **Create Admin User**

   First time setup - create admin account:
   ```bash
   cd backend
   node seedAdmin.js
   ```

## 🎯 Features

- ✅ Responsive Design
- ✅ Admin Dashboard
- ✅ Blog Management
- ✅ Portfolio Showcase
- ✅ Service Pages
- ✅ Contact Forms
- ✅ Consultation Requests
- ✅ Newsletter Subscription
- ✅ Payment Integration (Razorpay)
- ✅ Email Notifications
- ✅ Rich Text Editor
- ✅ Image Upload & Management

## 📱 Pages

### Public Pages
- Home
- About
- Services
- Blog
- Portfolio
- Contact
- Privacy Policy
- Terms & Conditions
- Refund Policy

### Admin Pages
- Dashboard
- Services Management
- Blog Management
- Portfolio Management
- Contact Messages
- Consultation Requests
- Payments
- Newsletter Subscribers
- User Management

## 🔐 Default Admin Credentials

After running `seedAdmin.js`, use:
- Email: `admin@ca-associates.com`
- Password: `admin123` (Change immediately after first login!)

## 📚 Project Structure

```
ca-website/
├── backend/
│   ├── config/         # Database configuration
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Auth middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   └── server.js       # Entry point
├── frontend/
│   ├── public/         # Static files
│   └── src/
│       ├── api/        # API configuration
│       ├── components/ # React components
│       ├── pages/      # Page components
│       └── utils/      # Utility functions
└── DEPLOYMENT.md       # Deployment guide
```

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy Options

**Backend**: Railway, Render, or Heroku
**Frontend**: Vercel or Netlify
**Database**: MongoDB Atlas

## 🛠️ Development

### Available Scripts

**Root:**
- `npm start` - Run both frontend and backend concurrently

**Backend:**
- `npm start` - Start backend server
- `node seedAdmin.js` - Create admin user

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📝 Environment Variables

### Backend Required Variables
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens
- `PORT` - Server port (default: 5000)
- `EMAIL_USER` - Email address for sending emails
- `EMAIL_PASS` - Email app password
- `FRONTEND_URL` - Frontend URL for CORS

### Backend Optional Variables
- `RAZORPAY_KEY_ID` - Razorpay key (if using payments)
- `RAZORPAY_KEY_SECRET` - Razorpay secret

### Frontend Required Variables
- `VITE_API_URL` - Backend API URL

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

ISC

## 👨‍💻 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ for CA Associates


