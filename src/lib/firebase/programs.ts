import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { Program } from '@/types/program'

export const calgaryProgram: Omit<Program, 'id'> = {
  name: "Programme Calgary",
  createdBy: "",  // Sera rempli lors de l'initialisation
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  weeks: [
    {
      number: 1,
      days: [
        {
          number: 1,
          exercises: [
            {
              name: "Squat",
              sets: 5,
              reps: "5",
              weight: { type: "percentage", value: 70 }
            },
            {
              name: "Développé couché",
              sets: 5,
              reps: "5",
              weight: { type: "percentage", value: 70 }
            },
            {
              name: "Rowing barre",
              sets: 5,
              reps: "5",
              weight: { type: "percentage", value: 70 }
            }
          ]
        }
      ]
    }
  ]
}

export const initializeCalgaryProgram = async (userId: string) => {
  try {
    const programToCreate = {
      ...calgaryProgram,
      createdBy: userId
    }
    
    const docRef = await addDoc(collection(db, 'programs'), programToCreate)
    return docRef.id
  } catch (error) {
    console.error('Erreur lors de l\'initialisation du programme Calgary:', error)
    throw error
  }
} 