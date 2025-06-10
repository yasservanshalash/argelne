import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBPf7Udsq6SRj2Z1QInVRguiNwcp2LQFAc",
    authDomain: "argelne.firebaseapp.com",
    projectId: "argelne",
    storageBucket: "argelne.firebasestorage.app",
    messagingSenderId: "482306770955",
    appId: "1:482306770955:web:bfebea55c548de75a11f0e"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app; 