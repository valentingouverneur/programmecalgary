export type Exercise = {
  id: string
  name: string
  category: 'MAIN' | 'ACCESSORY'
  defaultSets: number
  defaultReps: number
  restTime: number
}

export type Set = {
  id: string
  weight: number
  reps: number
  rpe?: number
  completed: boolean
}

export type WorkoutExercise = {
  id: string
  exerciseId: string
  sets: Set[]
  notes?: string
}

export type Workout = {
  id: string
  date: Date
  exercises: WorkoutExercise[]
  completed: boolean
}

export type UserSettings = {
  id: string
  userId: string
  oneRepMaxes: {
    [key: string]: number // exerciseId: weight
  }
  preferredUnits: 'KG' | 'LB'
  restTimerDuration: number
}

export type Program = {
  id: string
  name: string
  description?: string
  weeks: Week[]
}

export type Week = {
  id: string
  number: number
  days: Day[]
}

export type Day = {
  id: string
  number: number
  exercises: ProgramExercise[]
}

export type ProgramExercise = {
  id: string
  exerciseId: string
  sets: number
  reps: number
  intensity: number // percentage of 1RM
  rpe?: number
} 