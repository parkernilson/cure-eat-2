// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { browserLocalPersistence, getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCnGYT2b0fZiCFPwYaWlyoE452cdpOupCA",
  authDomain: "cure-eat.firebaseapp.com",
  projectId: "cure-eat",
  storageBucket: "cure-eat.appspot.com",
  messagingSenderId: "1005463750425",
  appId: "1:1005463750425:web:1d7942bdd60729595d2788",
  measurementId: "G-44TYJ0R44B"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
auth.setPersistence(browserLocalPersistence);