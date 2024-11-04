import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBxrPidYgm3OuElHN5EwvgjbyJeVaRgSwQ",
  authDomain: "taugor-gestao-funcionarios.firebaseapp.com",
  projectId: "taugor-gestao-funcionarios",
  storageBucket: "taugor-gestao-funcionarios.firebasestorage.app",
  messagingSenderId: "551145065297",
  appId: "1:551145065297:web:9285a5a96f83a591232170",
  measurementId: "G-TSNHB9G821"
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)
export const storage = getStorage(app)
