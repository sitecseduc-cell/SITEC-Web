// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// COLE AQUI A CONFIGURAÇÃO DO SEU PROJETO FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyAYvk5L63yBbdOwPNvM3JLEyGKdnFKBXlU",
  authDomain: "sitec-web.firebaseapp.com",
  projectId: "sitec-web",
  storageBucket: "sitec-web.firebasestorage.app",
  messagingSenderId: "734432958007",
  appId: "1:734432958007:web:44da0386112fe33d8411b2"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, app };