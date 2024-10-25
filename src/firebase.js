// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfPFRv228wBkfk7GMO4MgOjE4lCuQM6sY",
  authDomain: "finance-tracker-50485.firebaseapp.com",
  projectId: "finance-tracker-50485",
  storageBucket: "finance-tracker-50485.appspot.com",
  messagingSenderId: "1083021898853",
  appId: "1:1083021898853:web:74a2fd982fcb7cca46428c",
  measurementId: "G-NYF7P9FTTV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };
