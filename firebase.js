// firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Required for auth()

const firebaseConfig = {
  apiKey: "AIzaSyDvwyE-hwDwFlmhct-RGEWu4L0vV1mwAOw",
  authDomain: "gym-well-app.firebaseapp.com",
  projectId: "gym-well-app",
  storageBucket: "gym-well-app.appspot.com",
  messagingSenderId: "445698063824",
  appId: "1:445698063824:web:849b7af73e607a54ee0dd5",
  measurementId: "G-73VF04018E"
};

// Only initialize if not already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app); // Use this in your components

export { auth };
