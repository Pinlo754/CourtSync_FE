// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from "firebase/app";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Singleton pattern for Firebase instances
let firebaseApp: FirebaseApp | null = null;
let storageInstance: FirebaseStorage | null = null;

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const requiredEnvVars = [
    `REACT_APP_API_KEY`,
    `REACT_APP_AUTH_DOMAIN`,
    `REACT_APP_PROJECT_ID`,
    `REACT_APP_STORAGE_BUCKET`,
    `REACT_APP_MESSAGING_SENDER_ID`,
    `REACT_APP_APP_STORAGE_ID`
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('Missing Firebase environment variables:', missingVars);
    console.warn('Firebase features will be disabled. Please set the required environment variables.');
    return false;
  }
  return true;
};

// Initialize Firebase with lazy loading
const initializeFirebase = () => {
  if (firebaseApp && storageInstance) {
    return { app: firebaseApp, storage: storageInstance };
  }

  // Check if Firebase config is valid
  if (!validateFirebaseConfig()) {
    console.warn('Firebase not initialized due to missing configuration');
    return { app: null, storage: null };
  }

  try {
    const firebaseConfig = {
      apiKey: process.env.REACT_APP_API_KEY!,
      authDomain: process.env.REACT_APP_AUTH_DOMAIN!,
      projectId: process.env.REACT_APP_PROJECT_ID!,
      storageBucket: process.env.REACT_APP_STORAGE_BUCKET!,
      messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID!,
      appId: process.env.REACT_APP_APP_STORAGE_ID!
    };

    // Initialize Firebase app
    firebaseApp = initializeApp(firebaseConfig);
    
    // Initialize Firebase Storage
    storageInstance = getStorage(firebaseApp);

    console.log('Firebase initialized successfully');
    return { app: firebaseApp, storage: storageInstance };
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    return { app: null, storage: null };
  }
};

// Export storage getter function
export const getStorageInstance = (): FirebaseStorage | null => {
  if (!storageInstance) {
    const { storage } = initializeFirebase();
    return storage;
  }
  return storageInstance;
};

// Export app getter function
export const getAppInstance = (): FirebaseApp | null => {
  if (!firebaseApp) {
    const { app } = initializeFirebase();
    return app;
  }
  return firebaseApp;
};

// For backward compatibility - return null if not initialized
export const storage = getStorageInstance();
export const app = getAppInstance();