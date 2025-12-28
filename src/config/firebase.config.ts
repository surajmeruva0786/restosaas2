import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBKiqeMLuE5ZEljiYnSNobUNvbK6HXIkSk",
  authDomain: "restosaas2.firebaseapp.com",
  projectId: "restosaas2",
  storageBucket: "restosaas2.firebasestorage.app",
  messagingSenderId: "943322982102",
  appId: "1:943322982102:web:419d21d4b575d5de45cb77",
  measurementId: "G-CNPG60N493"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser does not support offline persistence');
  }
});

export default app;
