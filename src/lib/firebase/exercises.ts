import { db } from '@/lib/firebase'
import { collection, getDocs, addDoc, query, where, deleteDoc } from 'firebase/firestore'

export interface Exercise {
  id?: string
  name: string
  type: 'squat' | 'bench' | 'deadlift' | 'accessory'
  defaultTempo?: string
  defaultRest?: number
  defaultSets?: number
  defaultReps?: number
  defaultIntensity?: number
  defaultLoad?: number
}

const defaultExercises: Exercise[] = [
  // Mouvements de compétition
  {
    name: 'Competition Squat',
    type: 'squat',
    defaultTempo: '2-1-0',
    defaultRest: 180,
    defaultSets: 4,
    defaultReps: 7,
    defaultIntensity: 67,
  },
  {
    name: 'Paused Bench',
    type: 'bench',
    defaultTempo: '2-1-1',
    defaultRest: 180,
    defaultSets: 4,
    defaultReps: 7,
    defaultIntensity: 67,
  },
  {
    name: 'Competition Bench',
    type: 'bench',
    defaultTempo: '2-1-0',
    defaultRest: 180,
    defaultSets: 3,
    defaultReps: 3,
    defaultIntensity: 80,
  },
  {
    name: 'Competition Deadlift',
    type: 'deadlift',
    defaultTempo: '2-1-0',
    defaultRest: 180,
    defaultSets: 3,
    defaultReps: 3,
    defaultIntensity: 80,
  },
  // Variantes Squat
  {
    name: 'Pause Squat',
    type: 'squat',
    defaultTempo: '2-3-0',
    defaultRest: 180,
    defaultSets: 3,
    defaultReps: 3,
    defaultIntensity: 70,
  },
  {
    name: 'Tempo Squat',
    type: 'squat',
    defaultTempo: '4-1-0',
    defaultRest: 180,
    defaultSets: 3,
    defaultReps: 3,
    defaultIntensity: 65,
  },
  // Variantes Bench
  {
    name: 'Touch and Go Bench',
    type: 'bench',
    defaultTempo: '2-0-0',
    defaultRest: 120,
    defaultSets: 3,
    defaultReps: 5,
    defaultIntensity: 70,
  },
  {
    name: 'Close Grip Bench',
    type: 'bench',
    defaultTempo: '2-1-0',
    defaultRest: 120,
    defaultSets: 3,
    defaultReps: 8,
    defaultIntensity: 65,
  },
  {
    name: 'Pin Press',
    type: 'bench',
    defaultTempo: '1-0-0',
    defaultRest: 120,
    defaultSets: 3,
    defaultReps: 3,
    defaultIntensity: 75,
  },
  {
    name: 'Bench with Mini Bands',
    type: 'bench',
    defaultTempo: '2-1-0',
    defaultRest: 120,
    defaultSets: 3,
    defaultReps: 5,
    defaultLoad: 60,
  },
  // Variantes Deadlift
  {
    name: 'Pause Deadlift',
    type: 'deadlift',
    defaultTempo: '2-3-0',
    defaultRest: 180,
    defaultSets: 3,
    defaultReps: 3,
    defaultIntensity: 70,
  },
  {
    name: 'Tempo Deadlift',
    type: 'deadlift',
    defaultTempo: '4-1-0',
    defaultRest: 180,
    defaultSets: 3,
    defaultReps: 3,
    defaultIntensity: 65,
  },
  // Accessoires
  {
    name: 'Side Plank',
    type: 'accessory',
    defaultTempo: '0-0-0',
    defaultRest: 60,
    defaultSets: 3,
    defaultReps: 30,
  },
  {
    name: 'Rolling Plank',
    type: 'accessory',
    defaultTempo: '0-0-0',
    defaultRest: 60,
    defaultSets: 3,
    defaultReps: 30,
  },
  {
    name: 'Bent Over Row',
    type: 'accessory',
    defaultTempo: '2-0-1',
    defaultRest: 90,
    defaultSets: 3,
    defaultReps: 12,
    defaultLoad: 60,
  },
  {
    name: 'Barbell Overhead Press',
    type: 'accessory',
    defaultTempo: '2-0-1',
    defaultRest: 120,
    defaultSets: 3,
    defaultReps: 8,
    defaultLoad: 40,
  },
  {
    name: 'Dumbbell Row',
    type: 'accessory',
    defaultTempo: '2-0-1',
    defaultRest: 60,
    defaultSets: 3,
    defaultReps: 12,
    defaultLoad: 20,
  },
  {
    name: 'Overhead Press',
    type: 'accessory',
    defaultTempo: '2-0-1',
    defaultRest: 120,
    defaultSets: 3,
    defaultReps: 8,
    defaultLoad: 40,
  },
  {
    name: 'Reverse Hyper',
    type: 'accessory',
    defaultTempo: '2-0-1',
    defaultRest: 60,
    defaultSets: 4,
    defaultReps: 12,
  },
]

export async function initializeExercisesDB() {
  try {
    const exercisesRef = collection(db, 'exercises')
    const snapshot = await getDocs(exercisesRef)
    const existingExercises = snapshot.docs.map(doc => doc.data().name)
    
    console.log('Vérification des exercices manquants...')
    for (const exercise of defaultExercises) {
      if (!existingExercises.includes(exercise.name)) {
        console.log(`Ajout de l'exercice: ${exercise.name}`)
        await addDoc(exercisesRef, exercise)
      }
    }
    console.log('Mise à jour de la collection exercises terminée')
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la collection exercises:', error)
    throw error
  }
}

export async function getAllExercises(): Promise<Exercise[]> {
  try {
    const exercisesRef = collection(db, 'exercises')
    const snapshot = await getDocs(exercisesRef)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Exercise))
  } catch (error) {
    console.error('Erreur lors de la récupération des exercices:', error)
    throw error
  }
}

export async function searchExercises(searchTerm: string): Promise<Exercise[]> {
  try {
    const exercisesRef = collection(db, 'exercises')
    const q = query(exercisesRef, where('name', '>=', searchTerm), where('name', '<=', searchTerm + '\uf8ff'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Exercise))
  } catch (error) {
    console.error('Erreur lors de la recherche des exercices:', error)
    throw error
  }
}

export async function resetExercisesDB() {
  try {
    console.log('Suppression de la collection exercises...')
    const exercisesRef = collection(db, 'exercises')
    const snapshot = await getDocs(exercisesRef)
    
    // Supprime tous les documents existants
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref))
    await Promise.all(deletePromises)
    console.log('Collection exercises supprimée')
    
    // Réinitialise avec les exercices par défaut
    console.log('Réinitialisation de la collection exercises...')
    for (const exercise of defaultExercises) {
      await addDoc(exercisesRef, exercise)
    }
    console.log('Collection exercises réinitialisée avec succès')
  } catch (error) {
    console.error('Erreur lors de la réinitialisation de la collection exercises:', error)
    throw error
  }
} 