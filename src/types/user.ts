export interface ExerciseMax {
  exerciseName: string
  maxWeight: number
  updatedAt: string
}

export interface UserSettings {
  exerciseMaxes: ExerciseMax[]
}

export interface User {
  id: string
  email: string
  settings: UserSettings
} 