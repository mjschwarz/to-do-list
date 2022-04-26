// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVVjBd5qaeJ94i1nen7s2dC2YGgDvOH2s",
  authDomain: "to-do-list-app-99cb4.firebaseapp.com",
  projectId: "to-do-list-app-99cb4",
  storageBucket: "to-do-list-app-99cb4.appspot.com",
  messagingSenderId: "365445687994",
  appId: "1:365445687994:web:fcdedd03a4b2284de2b083",
  measurementId: "G-3KN9N1GZ1K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export const auth = getAuth(app);