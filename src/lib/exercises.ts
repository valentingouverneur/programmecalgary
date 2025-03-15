import { DBExercise } from '@/types/exercise'
import { collection, doc, setDoc, getDocs, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export const defaultExercises: DBExercise[] = [
  // Exercices de Squat
  {
    id: 'competition-squat',
    name: 'Competition Squat',
    category: 'squat',
    primaryMuscles: ['quadriceps', 'glutes', 'hamstrings'],
    isCompetition: true,
    defaultTempo: '1.0.1',
    defaultRest: 180,
  },
  {
    id: 'ssb-pause-squat',
    name: 'SSB Pause Squat',
    category: 'squat',
    primaryMuscles: ['quadriceps', 'glutes', 'core'],
    defaultTempo: '1.2.1',
    defaultRest: 180,
  },
  {
    id: 'pin-squat',
    name: 'Pin Squat',
    category: 'squat',
    primaryMuscles: ['quadriceps', 'glutes', 'hamstrings'],
    defaultTempo: '1.1.1',
    defaultRest: 180,
    notes: 'Squat avec arrêt sur les pins à la profondeur désirée'
  },

  // Exercices de Bench
  {
    id: 'competition-pause-bench',
    name: 'Competition Pause Bench',
    category: 'bench',
    primaryMuscles: ['chest', 'shoulders', 'triceps'],
    isCompetition: true,
    defaultTempo: '1.1.1',
    defaultRest: 180,
  },
  {
    id: 'spoto-press',
    name: 'Spoto Press',
    category: 'bench',
    primaryMuscles: ['chest', 'triceps'],
    defaultTempo: '1.0.1',
    defaultRest: 120,
    notes: 'Développé couché avec arrêt à 2-3cm du torse'
  },
  {
    id: 'touch-and-go-bench',
    name: 'Touch and Go Bench',
    category: 'bench',
    primaryMuscles: ['chest', 'shoulders', 'triceps'],
    defaultTempo: '1.0.1',
    defaultRest: 120,
  },

  // Exercices de Deadlift
  {
    id: 'competition-deadlift',
    name: 'Competition Deadlift',
    category: 'deadlift',
    primaryMuscles: ['hamstrings', 'glutes', 'back'],
    isCompetition: true,
    defaultTempo: '1.0.1',
    defaultRest: 180,
  },
  {
    id: 'pause-deadlift',
    name: '2ct Pause Deadlift',
    category: 'deadlift',
    primaryMuscles: ['hamstrings', 'glutes', 'back'],
    defaultTempo: '1.2.1',
    defaultRest: 180,
    notes: 'Deadlift avec pause de 2 secondes au niveau des genoux'
  },
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift',
    category: 'deadlift',
    primaryMuscles: ['hamstrings', 'glutes', 'back'],
    defaultTempo: '1.0.1',
    defaultRest: 120,
  },

  // Exercices de Press
  {
    id: 'overhead-press',
    name: 'Overhead Press',
    category: 'press',
    primaryMuscles: ['shoulders', 'triceps'],
    defaultTempo: '1.0.1',
    defaultRest: 120,
  },
  {
    id: 'incline-press',
    name: 'Incline Press',
    category: 'press',
    primaryMuscles: ['chest', 'shoulders', 'triceps'],
    defaultTempo: '1.0.1',
    defaultRest: 120,
  },

  // Exercices de Row
  {
    id: 'bent-over-row',
    name: 'Bent Over Row',
    category: 'row',
    primaryMuscles: ['back', 'lats', 'biceps'],
    defaultTempo: '1.0.1',
    defaultRest: 90,
  },
  {
    id: 'incline-row',
    name: 'Incline Row',
    category: 'row',
    primaryMuscles: ['back', 'lats', 'biceps'],
    defaultTempo: '1.0.1',
    defaultRest: 90,
  },
  {
    id: 'db-row',
    name: '1-Arm DB Row',
    category: 'row',
    primaryMuscles: ['back', 'lats', 'biceps'],
    defaultTempo: '1.0.1',
    defaultRest: 60,
  },

  // Exercices Accessoires
  {
    id: 'chin-ups',
    name: 'Chin Ups',
    category: 'accessory',
    primaryMuscles: ['back', 'biceps', 'core'],
    defaultTempo: '1.0.1',
    defaultRest: 90,
  },
  {
    id: 'dips',
    name: 'Dips',
    category: 'accessory',
    primaryMuscles: ['chest', 'triceps', 'shoulders'],
    defaultTempo: '1.0.1',
    defaultRest: 90,
  },
  {
    id: 'side-planks',
    name: 'Side Planks',
    category: 'accessory',
    primaryMuscles: ['core'],
    defaultRest: 60,
    notes: 'Durée en secondes par côté'
  },
  {
    id: 'rolling-planks',
    name: 'Rolling Planks',
    category: 'accessory',
    primaryMuscles: ['core'],
    defaultRest: 60,
    notes: 'Nombre total de répétitions'
  }
]

export async function initializeExercisesDB() {
  try {
    const exercisesCollection = collection(db, 'exercises')
    
    // Ajouter chaque exercice à la collection
    for (const exercise of defaultExercises) {
      await setDoc(doc(exercisesCollection, exercise.id), exercise)
    }
    
    console.log('Base de données des exercices initialisée avec succès')
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données des exercices:', error)
    throw error
  }
}

// Fonction pour récupérer tous les exercices
export async function getAllExercises() {
  try {
    const exercisesCollection = collection(db, 'exercises')
    const exercisesSnapshot = await getDocs(exercisesCollection)
    return exercisesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as DBExercise[]
  } catch (error) {
    console.error('Erreur lors de la récupération des exercices:', error)
    throw error
  }
}

// Fonction pour récupérer un exercice par son ID
export async function getExerciseById(id: string) {
  try {
    const exerciseDoc = await getDoc(doc(db, 'exercises', id))
    if (exerciseDoc.exists()) {
      return { id: exerciseDoc.id, ...exerciseDoc.data() } as DBExercise
    }
    return null
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'exercice:', error)
    throw error
  }
} 