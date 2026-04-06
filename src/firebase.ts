import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWP0NYx9CNr7DAln3SFRKcGD0arqD9GG8",
  authDomain: "personalised-learining-path.firebaseapp.com",
  projectId: "personalised-learining-path",
  storageBucket: "personalised-learining-path.firebasestorage.app",
  messagingSenderId: "889632495186",
  appId: "1:889632495186:web:dce73a6d269bfdf358b18b",
  measurementId: "G-F0J9NHMFDL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);