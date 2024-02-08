// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6JRmO089QP9MmZSb1ZCjL9e2Bd6-Ni7w",
  authDomain: "forum-react-app-bdd-9.firebaseapp.com",
  projectId: "forum-react-app-bdd-9",
  storageBucket: "forum-react-app-bdd-9.appspot.com",
  messagingSenderId: "738712641120",
  appId: "1:738712641120:web:eaf49cd4ef491cb939ed05",
  databaseURL: "https://forum-react-app-bdd-9-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
// the Realtime Database handler
export const db = getDatabase(app);