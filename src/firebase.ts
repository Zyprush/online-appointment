"use client";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBCu4lNtIzH0o-V8RWKLYLhMLt40FKpfg0",
  authDomain: "appoint-33ea9.firebaseapp.com",
  projectId: "appoint-33ea9",
  storageBucket: "appoint-33ea9.appspot.com",
  messagingSenderId: "483302661089",
  appId: "1:483302661089:web:8c47438d73f47bb4afd0a0",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
