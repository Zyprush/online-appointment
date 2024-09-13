'use client'

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

//TODO: Change it later
const firebaseConfig = {
    apiKey: "AIzaSyAB5M2Ye80p-Pb3a0G7e68usSkiYonRfJo",
    authDomain: "appoint-59d47.firebaseapp.com",
    projectId: "appoint-59d47",
    storageBucket: "appoint-59d47.appspot.com",
    messagingSenderId: "957262335773",
    appId: "1:957262335773:web:1ca61c755236a60f84dbf4"
  };

export const firebaseApp = initializeApp(firebaseConfig)
export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)
export const storage = getStorage(firebaseApp)