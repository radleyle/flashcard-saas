// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; // Import Firestore functions
// import { getAnalytics } from 'firebase/analytics'; // Optional, if you use Analytics

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBbn6Rg7nHLmMejQIknqN1X_WN_4rXxrGc",
//   authDomain: "flashcardsaas-1b1ba.firebaseapp.com",
//   projectId: "flashcardsaas-1b1ba",
//   storageBucket: "flashcardsaas-1b1ba.appspot.com",
//   messagingSenderId: "827881320139",
//   appId: "1:827881320139:web:6292b7a6c86ab0ddcf754e",
//   measurementId: "G-7P47C9DRE7"
// };
const firebaseConfig = {
  apiKey: "AIzaSyDRvv_c6R4GP-pL2g15WPMP7tDwVEEDY28",
  authDomain: "flashcard-saas-cb092.firebaseapp.com",
  projectId: "flashcard-saas-cb092",
  storageBucket: "flashcard-saas-cb092.appspot.com",
  messagingSenderId: "559032292919",
  appId: "1:559032292919:web:df7d71788886f33384d1b2",
  measurementId: "G-W4JE48T6TR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };