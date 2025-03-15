export interface Exercise {
  name: string
  sets: number | string
  reps: string // ex: "8-10" ou "5"
  intensity?: number
  load?: number
  tempo?: string
  rest?: number
  notes?: string
  weight?: {
    type: 'percentage' | 'rpe' | 'kg'
    value: number
  }
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
  id: string
  name: string
  description?: string
  goal?: string
  equipment?: string
  weeks: Week[]
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface ProgramTemplate {
  id: string
  name: string
  description: string
  goal: string
  equipment: string
  category: string
  difficulty: string
  duration: number // en semaines
  daysPerWeek: number
  program: {
    name: string
    description: string
    weeks: Week[]
  }
} 