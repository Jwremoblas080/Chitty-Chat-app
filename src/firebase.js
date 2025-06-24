// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD8s42KX_SqIqDV4E6nJC3XFPJydjmB0yU",
  authDomain: "chat-app-3d60b.firebaseapp.com",
  projectId: "chat-app-3d60b",
  storageBucket: "chat-app-3d60b.appspot.com",
  messagingSenderId: "1002199946035",
  appId: "1:1002199946035:web:a86b82abbeb21970542446",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
