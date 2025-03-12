export interface Exercise {
  name: string
  sets: number
  reps: string // ex: "8-10" ou "5"
  rpe?: number
  intensity?: number // pourcentage du 1RM
  notes?: string
}

export interface Day {
  number: number
  exercises: Exercise[]
}

export interface Week {
  number: number
  days: Day[]
}

export interface Program {
  name: string
  weeks: Week[]
} 