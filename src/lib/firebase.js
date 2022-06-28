import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  getAdditionalUserInfo,
  deleteUser,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  Timestamp,
  serverTimestamp,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  limit,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadString,
} from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxfKIzMGp5YdC8mpzO-TwOwDSkla-TZZg",
  authDomain: "findmissing-hackathon.firebaseapp.com",
  projectId: "findmissing-hackathon",
  storageBucket: "findmissing-hackathon.appspot.com",
  messagingSenderId: "217239813112",
  appId: "1:217239813112:web:178786ac639497fcaf340d"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
// Providers
const providerGoogle = new GoogleAuthProvider();
const providerFacebook = new FacebookAuthProvider();

// Firestore Database
const db = getFirestore(app);
// Firebase Storage
const storage = getStorage(app);

export {
  storage,
  db,
  app,
  auth,
  providerGoogle,
  providerFacebook,
  signInWithPopup,
  updateProfile,
  deleteUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAdditionalUserInfo,

  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  Timestamp,
  serverTimestamp,
  collection,
  addDoc,
  onAuthStateChanged,
  signOut,
  ref,
  getDownloadURL,
  uploadString,
  onSnapshot,
  query,
  orderBy,
  where,
  limit,
};