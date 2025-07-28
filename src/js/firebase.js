// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// This configuration is for the Notedly app
const firebaseConfig = {
    apiKey: "AIzaSyCm98ugTapZ1SbqT_l4maB3XMwBXnGl8oE",
    authDomain: "notedly-2825jy.firebaseapp.com",
    projectId: "notedly-2825jy",
    //storageBucket: "notedly-2825jy.firebasestorage.app",
    storageBucket: "notedly-2825jy.appspot.com",
    messagingSenderId: "348533817564",
    appId: "1:348533817564:web:df8bc751bd25e20696f419"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Export the services for use in other parts of the application
export { app, auth, db };