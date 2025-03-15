'use client'

import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { getFirestore, setDoc, doc } from 'firebase/firestore'
import { ExerciseMax } from '@/types/user'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

// Initialize Firebase
let app
if (!getApps().length) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApp()
}

// Initialize Auth and Firestore
const auth = getAuth(app)
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Erreur lors de la configuration de la persistance:", error)
  })

const db = getFirestore(app)

export const initializeMaxScores = async (userId: string): Promise<ExerciseMax[]> => {
  const now = new Date().toISOString()
  const initialMaxes = [
    { exerciseName: 'Squat', maxWeight: 0, updatedAt: now },
    { exerciseName: 'Bench Press', maxWeight: 0, updatedAt: now },
    { exerciseName: 'Deadlift', maxWeight: 0, updatedAt: now }
  ]

  await setDoc(doc(db, 'maxScores', userId), {
    exerciseMaxes: initialMaxes
  })

  return initialMaxes
}

export { app, auth, db } 