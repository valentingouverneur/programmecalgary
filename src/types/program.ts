export type Exercise = {
  name: string
  sets: number
  reps: string // ex: "8-10" ou "5"
  rpe?: number
  intensity?: number // pourcentage du 1RM
  notes?: string
}

export type Day = {
  number: number
  exercises: Exercise[]
}

export type Week = {
  number: number
  days: Day[]
}

export type Program = {
  name: string
  weeks: Week[]
} 