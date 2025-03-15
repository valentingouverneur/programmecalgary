import { Week } from '@/types/program'

const defaultExercises = [
  { name: 'Competition Squat', sets: 4, reps: '8', intensity: 75, notes: '1.0.1' },
  { name: 'Competition Pause Bench', sets: 4, reps: '8', intensity: 75, notes: '1.1.1' },
  { name: 'Competition Deadlift', sets: 4, reps: '8', intensity: 75, notes: '1.0.1' },
  { name: 'Accessory Work', sets: 3, reps: '8-12', intensity: 0, notes: 'As needed' }
]

export const calgaryWeeks: Week[] = Array.from({ length: 16 }, (_, i) => ({
  number: i + 1,
  days: Array.from({ length: 4 }, (_, j) => ({
    number: j + 1,
    exercises: defaultExercises
  }))
})) 