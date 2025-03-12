import 'dotenv/config'
import { importCalgaryProgram } from '../lib/excel'
import { db } from '../lib/firebase'
import { collection, doc, setDoc } from 'firebase/firestore'
import { auth } from '../lib/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

async function importProgram() {
  try {
    console.log('Connexion à Firebase...')
    // Se connecter d'abord
    await signInWithEmailAndPassword(auth, 'valentin.gouverneur@gmail.com', process.env.FIREBASE_ADMIN_PASSWORD || '')
    
    console.log('Importation du programme Calgary...')
    const program = importCalgaryProgram()
    
    // Sauvegarder le programme dans Firestore
    const programRef = doc(collection(db, 'programs'), 'calgary')
    await setDoc(programRef, program)
    
    console.log('Programme importé avec succès !')
  } catch (error) {
    console.error('Erreur lors de l\'importation:', error)
  }
}

// Exécuter le script
importProgram() 