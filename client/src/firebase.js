// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "dharmestate-42758.firebaseapp.com",
  projectId: "dharmestate-42758",
  storageBucket: "dharmestate-42758.firebasestorage.app",
  messagingSenderId: "757265569251",
  appId: "1:757265569251:web:8bb0399bebaf5f86373cd6",
  measurementId: "G-8JV25CS4DX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export { app, analytics };