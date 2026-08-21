import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCdP3iMfjmgW7ArGWUQWeyn-HeqPAN1CQ8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ojs-prime.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ojs-prime",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ojs-prime.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "797636180645",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:797636180645:web:e49fffa725512695dd2b4c",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-D89DX9B6E9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize analytics if supported in browser
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Silently ignore if analytics is not supported in current environment
  });
}

export { analytics, signInWithPopup };
export default app;
