import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For now, this is a placeholder. You will need to replace this with your actual Firebase project config.
const firebaseConfig = {
  apiKey: "AIzaSy_YOUR_PLACEHOLDER_API_KEY",
  authDomain: "travelpartner-demo.firebaseapp.com",
  projectId: "travelpartner-demo",
  storageBucket: "travelpartner-demo.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef1234567890"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
