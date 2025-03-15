export interface DBExercise {
  id: string
  name: string
  category: 'squat' | 'bench' | 'deadlift' | 'press' | 'row' | 'accessory'
  primaryMuscles: string[]
  isCompetition?: boolean
  defaultTempo?: string
  defaultRest?: number
  notes?: string
  variations?: string[]
}

export const muscleGroups = [
  'quadriceps',
  'hamstrings',
  'glutes',
  'calves',
  'chest',
  'shoulders',
  'triceps',
  'biceps',
  'back',
  'lats',
  'core',
  'forearms'
] as const

export type MuscleGroup = typeof muscleGroups[number] 