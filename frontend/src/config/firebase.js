// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnPdGun5HHRdPGb6jNceEuMeGyG0QyD8I",
  authDomain: "returnfilers-auth.firebaseapp.com",
  projectId: "returnfilers-auth",
  storageBucket: "returnfilers-auth.firebasestorage.app",
  messagingSenderId: "209561741445",
  appId: "1:209561741445:web:652271786476d58b2721ec",
  measurementId: "G-YBJBRX7FV7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };
