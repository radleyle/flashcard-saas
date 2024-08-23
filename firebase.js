// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBbn6Rg7nHLmMejQIknqN1X_WN_4rXxrGc",
  authDomain: "flashcardsaas-1b1ba.firebaseapp.com",
  projectId: "flashcardsaas-1b1ba",
  storageBucket: "flashcardsaas-1b1ba.appspot.com",
  messagingSenderId: "827881320139",
  appId: "1:827881320139:web:6292b7a6c86ab0ddcf754e",
  measurementId: "G-7P47C9DRE7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);