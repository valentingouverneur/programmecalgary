import { ProgramTemplate, Program, Week, Exercise, Day } from '@/types/program'
import { importCalgaryProgram } from '@/lib/excel'
import { defaultExercises } from '@/lib/exercises'

// Fonction utilitaire pour obtenir l'ID d'un exercice à partir de son nom
function getExerciseId(name: string): string {
  const exercise = defaultExercises.find(ex => ex.name === name)
  if (!exercise) {
    console.warn(`Exercice non trouvé dans la base de données: ${name}`)
    return name.toLowerCase().replace(/\s+/g, '-')
  }
  return exercise.id
}

// Fonction utilitaire pour ajouter les valeurs par défaut d'un exercice
function enrichExerciseWithDefaults(exercise: Partial<Exercise>): Exercise {
  const dbExercise = defaultExercises.find(ex => ex.name === exercise.name)
  if (dbExercise) {
    return {
      ...exercise,
      id: dbExercise.id,
      name: dbExercise.name,
      tempo: exercise.tempo || dbExercise.defaultTempo,
      rest: exercise.rest || dbExercise.defaultRest,
      exerciseId: dbExercise.id
    } as Exercise
  }
  return {
    ...exercise,
    id: exercise.name?.toLowerCase().replace(/\s+/g, '-') || 'unknown',
    exerciseId: exercise.name?.toLowerCase().replace(/\s+/g, '-') || 'unknown'
  } as Exercise
}

// Fonction utilitaire pour enrichir tous les exercices d'une semaine
function enrichWeekExercises(week: Partial<Week>): Week {
  return {
    ...week,
    days: week.days?.map((day: Partial<Day>) => ({
      ...day,
      exercises: day.exercises?.map(exercise => enrichExerciseWithDefaults(exercise))
    }))
  } as Week
}

const calgaryWeek1to4 = enrichWeekExercises({
  days: [
    // Jour 1
    {
      number: 1,
      exercises: [
        enrichExerciseWithDefaults({
          name: 'Competition Squat',
          sets: 4,
          reps: '7',
          intensity: 67,
          load: 82.5,
          weight: { type: 'percentage' as const, value: 67 }
        }),
        enrichExerciseWithDefaults({
          name: 'Competition Pause Bench',
          sets: 4,
          reps: '7',
          intensity: 67,
          load: 52.5,
          weight: { type: 'percentage' as const, value: 67 }
        }),
        enrichExerciseWithDefaults({
          name: 'Overhead Press',
          sets: 3,
          reps: '8'
        }),
        enrichExerciseWithDefaults({
          name: 'Bent Over Row',
          sets: 3,
          reps: '12'
        }),
        enrichExerciseWithDefaults({
          name: 'Reverse Hyper',
          sets: 4,
          reps: '12'
        })
      ]
    },
    // Jour 2
    {
      number: 2,
      exercises: [
        enrichExerciseWithDefaults({
          name: 'Competition Deadlift',
          sets: 4,
          reps: '7',
          intensity: 67,
          load: 82.5,
          tempo: '1.0.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 67 }
        }),
        enrichExerciseWithDefaults({
          name: '3ct Pause Bench',
          sets: 3,
          reps: '5',
          intensity: 60,
          load: 57.5,
          tempo: '1.3.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 60 }
        }),
        enrichExerciseWithDefaults({
          name: 'SSB Pause Squat',
          sets: 3,
          reps: '5',
          weight: { type: 'rpe' as const, value: 8 },
          load: 77.5,
          tempo: '1.2.1',
          rest: 180
        }),
        enrichExerciseWithDefaults({
          name: 'Incline Row',
          sets: 5,
          reps: '8'
        })
      ]
    },
    // Jour 3
    {
      number: 3,
      exercises: [
        {
          name: 'Pin Squat (depth)',
          sets: 3,
          reps: '6',
          intensity: 65,
          load: 80.0,
          tempo: '1.1.1',
          rest: 120,
          weight: { type: 'percentage' as const, value: 65 }
        },
        {
          name: 'Spoto Press',
          sets: 3,
          reps: '6',
          weight: { type: 'rpe' as const, value: 8 },
          load: 80.0,
          tempo: '1.0.1',
          rest: 60
        },
        {
          name: '1-Arm DB Rows',
          sets: 5,
          reps: '10',
          tempo: '1.1.1',
          rest: 90
        },
        {
          name: 'Birddogs (reps per side)',
          sets: 3,
          reps: '6',
          tempo: '1.1.1',
          rest: 90
        }
      ]
    },
    // Jour 4
    {
      number: 4,
      exercises: [
        {
          name: '2ct Pause Deadlift (floor)',
          sets: 3,
          reps: '6',
          intensity: 63,
          load: 77.5,
          tempo: 'x',
          rest: 120,
          weight: { type: 'percentage' as const, value: 63 }
        },
        {
          name: 'Rep Bench (Touch and Go)',
          sets: 4,
          reps: '10',
          intensity: 63,
          load: 60.0,
          tempo: '1.0.1',
          rest: 120,
          weight: { type: 'percentage' as const, value: 63 }
        },
        {
          name: 'Romanians',
          sets: 3,
          reps: '8',
          intensity: 40,
          load: 50.0,
          tempo: '1.0.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 40 }
        },
        {
          name: 'Chin ups',
          sets: 4,
          reps: '10',
          tempo: '1.0.1',
          rest: 90
        },
        {
          name: 'Dips',
          sets: 4,
          reps: '10',
          tempo: '1.0.1',
          rest: 90
        }
      ]
    }
  ]
})

const calgaryWeek5to8 = enrichWeekExercises({
  days: [
    // Jour 1
    {
      number: 1,
      exercises: [
        {
          name: 'Competition Squat',
          sets: 3,
          reps: '3',
          intensity: 80,
          load: 97.5,
          tempo: '1.0.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 80 }
        },
        {
          name: 'Competition Squat',
          sets: 2,
          reps: '5',
          intensity: 68,
          load: 82.5,
          tempo: '1.0.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 68 }
        },
        {
          name: 'Competition Pause Bench',
          sets: 4,
          reps: '3',
          intensity: 80,
          load: 75.0,
          tempo: '1.1.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 80 }
        },
        {
          name: 'Competition Pause Bench',
          sets: 2,
          reps: '5',
          intensity: 68,
          load: 65.0,
          tempo: '1.1.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 68 }
        },
        {
          name: 'Romanians',
          sets: 4,
          reps: '9',
          weight: { type: 'rpe' as const, value: 8 },
          load: 87.5,
          tempo: '1.0.1',
          rest: 90
        },
        {
          name: 'Side Planks (seconds per side)',
          sets: 3,
          reps: 'x',
          intensity: 30,
          tempo: 'x',
          rest: 60,
          notes: '30s'
        }
      ]
    },
    // Jour 2
    {
      number: 2,
      exercises: [
        {
          name: 'Competition Deadlift',
          sets: 3,
          reps: '3',
          intensity: 80,
          load: 97.5,
          tempo: '1.0.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 80 }
        },
        {
          name: 'Competition Deadlift',
          sets: 2,
          reps: '5',
          intensity: 68,
          load: 82.5,
          tempo: '1.0.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 68 }
        },
        {
          name: '3ct Pause Bench',
          sets: 3,
          reps: '4',
          weight: { type: 'rpe' as const, value: 8 },
          load: 85.0,
          tempo: '1.3.1',
          rest: 180
        },
        {
          name: 'Competition Squat',
          sets: 2,
          reps: '5',
          intensity: 65,
          load: 80.0,
          tempo: '1.0.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 65 }
        },
        {
          name: 'Incline Row',
          sets: 4,
          reps: '10',
          tempo: '1.0.1',
          rest: 60
        }
      ]
    },
    // Jour 3
    {
      number: 3,
      exercises: [
        {
          name: '2ct Pause Squat',
          sets: 4,
          reps: '4',
          weight: { type: 'rpe' as const, value: 8 },
          load: 102.5,
          tempo: '1.1.1',
          rest: 180
        },
        {
          name: 'Competition Pause Bench',
          sets: 6,
          reps: '5',
          intensity: 70,
          load: 67.5,
          tempo: '1.1.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 70 }
        },
        {
          name: 'Spoto Press',
          sets: 4,
          reps: '5',
          weight: { type: 'rpe' as const, value: 8 },
          load: 80.0,
          tempo: '1.0.1',
          rest: 120
        },
        {
          name: 'Competition Deadlift',
          sets: 2,
          reps: '5',
          intensity: 65,
          load: 80.0,
          tempo: '1.0.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 65 }
        },
        {
          name: 'Chin ups',
          sets: 4,
          reps: '10',
          tempo: '1.0.1',
          rest: 90
        }
      ]
    },
    // Jour 4
    {
      number: 4,
      exercises: [
        {
          name: '2ct Pause Deadlifts (floor)',
          sets: 4,
          reps: '4',
          weight: { type: 'rpe' as const, value: 8 },
          load: 102.5,
          tempo: '1.0.1',
          rest: 180
        },
        {
          name: 'Touch and Go Bench',
          sets: 3,
          reps: '6',
          weight: { type: 'rpe' as const, value: 8 },
          load: 80.0,
          tempo: '1.0.1',
          rest: 180
        },
        {
          name: 'Incline Press',
          sets: 4,
          reps: '8',
          tempo: '1.0.1',
          rest: 120
        },
        {
          name: '1-Arm DB Rows',
          sets: 6,
          reps: '10',
          tempo: '1.0.1',
          rest: 60
        }
      ]
    }
  ]
})

const calgaryWeek9to11 = enrichWeekExercises({
  days: [
    // Jour 1
    {
      number: 1,
      exercises: [
        {
          name: 'Competition Squat',
          sets: 5,
          reps: '4',
          intensity: 82,
          load: 100.0,
          tempo: '1.0.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 82 }
        },
        {
          name: 'Competition Squat',
          sets: 2,
          reps: '4',
          intensity: 71,
          load: 87.5,
          tempo: '1.0.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 71 }
        },
        {
          name: 'Competition Pause Bench',
          sets: 6,
          reps: '4',
          intensity: 82,
          load: 77.5,
          tempo: '1.1.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 82 }
        },
        {
          name: 'Competition Pause Bench',
          sets: 2,
          reps: '4',
          intensity: 71,
          load: 67.5,
          tempo: '1.1.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 71 }
        },
        {
          name: 'Bent Over Row',
          sets: 4,
          reps: '8',
          weight: { type: 'rpe' as const, value: 8 },
          load: 90.0,
          tempo: '1.0.1',
          rest: 90
        },
        {
          name: 'Rolling Planks (total reps, not per side)',
          sets: 3,
          reps: '20',
          tempo: 'x',
          rest: 60
        }
      ]
    },
    // Jour 2
    {
      number: 2,
      exercises: [
        {
          name: 'Competition Deadlift',
          sets: 4,
          reps: '4',
          intensity: 82,
          load: 100.0,
          tempo: '1.0.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 82 }
        },
        {
          name: 'Competition Deadlift',
          sets: 2,
          reps: '4',
          intensity: 71,
          load: 87.5,
          tempo: '1.0.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 71 }
        },
        {
          name: 'Pin Press (chest level)',
          sets: 4,
          reps: '4',
          weight: { type: 'rpe' as const, value: 8 },
          load: 85.0,
          tempo: '1.1.1',
          rest: 180
        },
        {
          name: 'Competition Squat',
          sets: 3,
          reps: '5',
          intensity: 68,
          load: 82.5,
          tempo: '1.0.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 68 }
        },
        {
          name: 'Incline Row',
          sets: 4,
          reps: '8',
          tempo: '1.0.1',
          rest: 60
        }
      ]
    },
    // Jour 3
    {
      number: 3,
      exercises: [
        {
          name: '2ct Pause Squats',
          sets: '1+2F',
          reps: '4',
          weight: { type: 'rpe' as const, value: 8 },
          load: 112.5,
          tempo: '1.2.1',
          rest: 180
        },
        {
          name: 'Competition Pause Bench',
          sets: 6,
          reps: '5',
          intensity: 72,
          load: 67.5,
          tempo: '1.1.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 72 }
        },
        {
          name: 'Close Grip Bench Press',
          sets: '1+2R',
          reps: '4',
          weight: { type: 'rpe' as const, value: 8 },
          load: 85.0,
          tempo: '1.0.1',
          rest: 180
        },
        {
          name: 'Competition Deadlift',
          sets: 2,
          reps: '5',
          intensity: 68,
          load: 82.5,
          tempo: '1.0.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 68 }
        },
        {
          name: 'Chin ups',
          sets: 4,
          reps: '8',
          tempo: '1.0.1',
          rest: 90
        }
      ]
    },
    // Jour 4
    {
      number: 4,
      exercises: [
        {
          name: '2ct Pause Deadlifts (floor)',
          sets: '1+2F',
          reps: '4',
          weight: { type: 'rpe' as const, value: 8 },
          load: 105.0,
          tempo: '1.0.1',
          rest: 180
        },
        {
          name: 'Bench +mini bands',
          sets: '1+1F',
          reps: '8',
          weight: { type: 'rpe' as const, value: 8 },
          load: 75.0,
          tempo: '1.0.1',
          rest: 180
        },
        {
          name: 'Barbell Overhead Press',
          sets: '1+3R',
          reps: '7',
          weight: { type: 'rpe' as const, value: 8 },
          load: 42.5,
          tempo: '1.0.1',
          rest: 120
        },
        {
          name: '1-Arm DB Rows',
          sets: 5,
          reps: '8',
          tempo: '1.0.1',
          rest: 60
        }
      ]
    }
  ]
})

const calgaryWeek12to15 = enrichWeekExercises({
  days: [
    // Jour 1
    {
      number: 1,
      exercises: [
        {
          name: 'Competition Squat',
          sets: 1,
          reps: '3',
          weight: { type: 'rpe' as const, value: 8 },
          load: 112.5,
          tempo: '1.0.1',
          rest: 180
        },
        {
          name: 'Competition Squat (% of E1RM)',
          sets: 5,
          reps: '5',
          intensity: 65,
          load: 110.0,
          tempo: '1.0.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 65 }
        },
        {
          name: 'Competition Pause Bench',
          sets: 1,
          reps: '3',
          weight: { type: 'rpe' as const, value: 8 },
          load: 85.0,
          tempo: '1.1.1',
          rest: 180
        },
        {
          name: 'Competition Pause Bench (% of E1RM)',
          sets: 5,
          reps: '5',
          intensity: 65,
          load: 0.0,
          tempo: '1.1.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 65 }
        },
        {
          name: 'Overhead Press',
          sets: '1+2F',
          reps: '6',
          weight: { type: 'rpe' as const, value: 8 },
          load: 47.5,
          tempo: '1.0.1',
          rest: 120
        }
      ]
    },
    // Jour 2
    {
      number: 2,
      exercises: [
        {
          name: 'Competition Deadlift',
          sets: 1,
          reps: '3',
          weight: { type: 'rpe' as const, value: 8 },
          load: 105.0,
          tempo: '1.0.1',
          rest: 180
        },
        {
          name: 'Competition Deadlift (% of E1RM)',
          sets: 5,
          reps: '5',
          intensity: 65,
          load: 0.0,
          tempo: '1.0.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 65 }
        },
        {
          name: '2ct Pause Bench',
          sets: '1+2F',
          reps: '4',
          weight: { type: 'rpe' as const, value: 8 },
          load: 85.0,
          tempo: '1.2.1',
          rest: 180
        },
        {
          name: 'Back Squat',
          sets: '1+2F',
          reps: '4',
          weight: { type: 'rpe' as const, value: 8 },
          load: 85.0,
          tempo: '1.0.1',
          rest: 180
        }
      ]
    },
    // Jour 3
    {
      number: 3,
      exercises: [
        {
          name: 'Pin Squat',
          sets: 1,
          reps: '3',
          weight: { type: 'rpe' as const, value: 8 },
          load: 112.5,
          tempo: '1.2.1',
          rest: 180
        },
        {
          name: 'Pin Squat',
          sets: '1+1F',
          reps: '4',
          weight: { type: 'rpe' as const, value: 8 },
          load: 112.5,
          tempo: '1.2.1',
          rest: 180
        },
        {
          name: 'Close Grip Bench',
          sets: '1+2R',
          reps: '3',
          weight: { type: 'rpe' as const, value: 8 },
          load: 90.0,
          tempo: '1.0.1',
          rest: 180
        },
        {
          name: 'Spoto Press',
          sets: '1+1F',
          reps: '5',
          weight: { type: 'rpe' as const, value: 8 },
          load: 85.0,
          tempo: '1.0.1',
          rest: 180
        }
      ]
    },
    // Jour 4
    {
      number: 4,
      exercises: [
        {
          name: '2ct Pause Deadlifts',
          sets: 1,
          reps: '3',
          weight: { type: 'rpe' as const, value: 8 },
          load: 105.0,
          tempo: 'x',
          rest: 180
        },
        {
          name: '2ct Pause Deadlifts',
          sets: '1+2F',
          reps: '5',
          weight: { type: 'rpe' as const, value: 8 },
          load: 102.5,
          tempo: 'x',
          rest: 180
        },
        {
          name: 'Touch and Go Bench',
          sets: '1+3R',
          reps: '5',
          weight: { type: 'rpe' as const, value: 8 },
          load: 80.0,
          tempo: '1.0.1',
          rest: 180
        }
      ]
    }
  ]
})

const calgaryTaperWeek = enrichWeekExercises({
  days: [
    // Jour 1 - 5 jours avant la compétition
    {
      number: 1,
      exercises: [
        {
          name: 'Competition Squat',
          sets: 1,
          reps: '1',
          notes: 'Opener',
          tempo: '1.0.1',
          rest: 180
        },
        {
          name: 'Competition Squat',
          sets: 3,
          reps: '2',
          intensity: 82,
          load: 100.0,
          tempo: '1.0.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 82 }
        },
        {
          name: 'Competition Pause Bench',
          sets: 1,
          reps: '1',
          notes: 'Opener',
          tempo: '1.1.1',
          rest: 180
        },
        {
          name: 'Competition Pause Bench',
          sets: 3,
          reps: '2',
          intensity: 84,
          load: 90.0,
          tempo: '1.1.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 84 }
        }
      ]
    },
    // Jour 2 - 4 jours avant la compétition
    {
      number: 2,
      exercises: [
        {
          name: 'Competition Deadlift',
          sets: 1,
          reps: '1',
          notes: 'Opener',
          tempo: '1.0.1',
          rest: 180
        },
        {
          name: 'Competition Deadlift',
          sets: 2,
          reps: '2',
          intensity: 82,
          load: 100.0,
          tempo: '1.0.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 82 }
        },
        {
          name: 'Competition Pause Bench',
          sets: 4,
          reps: '1',
          intensity: 85,
          load: 80.0,
          tempo: '1.1.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 85 }
        }
      ]
    },
    // Jour 3 - 3 jours avant la compétition
    {
      number: 3,
      exercises: [
        {
          name: 'Competition Squat',
          sets: 1,
          reps: '1',
          intensity: 85,
          load: 105.0,
          tempo: '1.0.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 85 }
        },
        {
          name: 'Competition Squat',
          sets: 2,
          reps: '2',
          intensity: 78,
          load: 95.0,
          tempo: '1.0.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 78 }
        },
        {
          name: 'Competition Pause Bench',
          sets: 1,
          reps: '1',
          intensity: 85,
          load: 80.0,
          tempo: '1.1.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 85 }
        },
        {
          name: 'Competition Pause Bench',
          sets: 3,
          reps: '2',
          intensity: 75,
          load: 75.0,
          tempo: '1.1.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 75 }
        },
        {
          name: 'Competition Deadlift',
          sets: 1,
          reps: '1',
          intensity: 82,
          load: 100.0,
          tempo: '1.0.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 82 }
        },
        {
          name: 'Competition Deadlift',
          sets: 2,
          reps: '2',
          intensity: 72,
          load: 92.5,
          tempo: '1.0.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 72 }
        }
      ]
    },
    // Jour 4 - 2 jours avant la compétition
    {
      number: 4,
      exercises: [
        {
          name: 'Competition Squat',
          sets: 2,
          reps: '3',
          intensity: 75,
          load: 92.5,
          tempo: '1.0.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 75 }
        },
        {
          name: 'Competition Pause Bench',
          sets: 3,
          reps: '3',
          intensity: 75,
          load: 75.0,
          tempo: '1.1.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 75 }
        },
        {
          name: 'Competition Deadlift',
          sets: 1,
          reps: '3',
          intensity: 75,
          load: 92.5,
          tempo: '1.0.1',
          rest: 180,
          weight: { type: 'percentage' as const, value: 75 }
        }
      ]
    }
  ]
})

// Fonction pour créer une semaine avec progression
function createWeekWithProgression(baseWeek: typeof calgaryWeek1to4, weekNumber: number): Week {
  const progressionRates = {
    2: { intensity: 3, load: 2.5 },
    3: { intensity: 6, load: 5.0 },
    4: { intensity: 8, load: 7.5 }
  }

  const progression = progressionRates[weekNumber as keyof typeof progressionRates]
  
  const progressedWeek = {
    number: weekNumber,
    days: baseWeek.days.map(day => ({
      number: day.number,
      exercises: day.exercises.map(ex => {
        if (!progression || !ex.intensity) return ex
        
        const newIntensity = ex.intensity + progression.intensity
        const newLoad = ex.load ? ex.load + progression.load : undefined
        
        return {
          ...ex,
          intensity: newIntensity,
          load: newLoad,
          weight: ex.weight ? {
            ...ex.weight,
            value: ex.weight.type === 'percentage' ? newIntensity : ex.weight.value
          } : undefined
        }
      })
    }))
  }

  return enrichWeekExercises(progressedWeek)
}

// Fonction pour créer une semaine avec progression pour les semaines 5-8
function createWeek5to8WithProgression(baseWeek: typeof calgaryWeek5to8, weekNumber: number): Week {
  const progressionRates = {
    6: { intensity: 2, load: 2.5 },
    7: { intensity: 4, load: 5.0 },
    8: { intensity: 5, load: 7.5 }
  }

  const progression = progressionRates[weekNumber as keyof typeof progressionRates]
  
  const progressedWeek = {
    number: weekNumber,
    days: baseWeek.days.map(day => ({
      number: day.number,
      exercises: day.exercises.map(ex => {
        if (!progression || !ex.intensity) return ex
        
        const newIntensity = ex.intensity + progression.intensity
        const newLoad = ex.load ? ex.load + progression.load : undefined
        
        return {
          ...ex,
          intensity: newIntensity,
          load: newLoad,
          weight: ex.weight ? {
            ...ex.weight,
            value: ex.weight.type === 'percentage' ? newIntensity : ex.weight.value
          } : undefined
        }
      })
    }))
  }

  return enrichWeekExercises(progressedWeek)
}

// Fonction pour créer une semaine avec progression pour les semaines 9-11
function createWeek9to11WithProgression(baseWeek: typeof calgaryWeek9to11, weekNumber: number): Week {
  const progressionRates = {
    10: { intensity: 3, load: 2.5 },
    11: { intensity: 1, load: 5.0 }
  }

  const progression = progressionRates[weekNumber as keyof typeof progressionRates]
  
  const progressedWeek = {
    number: weekNumber,
    days: baseWeek.days.map(day => ({
      number: day.number,
      exercises: day.exercises.map(ex => {
        if (!progression || !ex.intensity) return ex
        
        const newIntensity = ex.intensity + progression.intensity
        const newLoad = ex.load ? ex.load + progression.load : undefined
        
        return {
          ...ex,
          intensity: newIntensity,
          load: newLoad,
          weight: ex.weight ? {
            ...ex.weight,
            value: ex.weight.type === 'percentage' ? newIntensity : ex.weight.value
          } : undefined
        }
      })
    }))
  }

  return enrichWeekExercises(progressedWeek)
}

// Fonction pour créer une semaine avec progression pour les semaines 12-15
function createWeek12to15WithProgression(baseWeek: typeof calgaryWeek12to15, weekNumber: number): Week {
  const progressionRates = {
    13: { intensity: 2, load: 2.5 },
    14: { intensity: 3, load: 5.0 },
    15: { intensity: 1, load: 2.5 }
  }

  const progression = progressionRates[weekNumber as keyof typeof progressionRates]
  
  const progressedWeek = {
    number: weekNumber,
    days: baseWeek.days.map(day => ({
      number: day.number,
      exercises: day.exercises.map(ex => {
        if (!progression || !ex.intensity) return ex
        
        const newIntensity = ex.intensity + progression.intensity
        const newLoad = ex.load ? ex.load + progression.load : undefined
        
        return {
          ...ex,
          intensity: newIntensity,
          load: newLoad,
          weight: ex.weight ? {
            ...ex.weight,
            value: ex.weight.type === 'percentage' ? newIntensity : ex.weight.value
          } : undefined
        }
      })
    }))
  }

  return enrichWeekExercises(progressedWeek)
}

export const programTemplates: ProgramTemplate[] = [
  {
    id: 'ppl-hypertrophy',
    name: 'Push Pull Legs - Hypertrophie',
    description: 'Programme de musculation basé sur la division Push/Pull/Legs, idéal pour la prise de masse musculaire.',
    goal: 'Hypertrophie',
    equipment: 'Full Gym',
    category: 'Hypertrophy',
    difficulty: 'Intermediate',
    duration: 8,
    daysPerWeek: 6,
    program: {
      name: 'Push Pull Legs - Hypertrophie',
      description: 'Programme de musculation basé sur la division Push/Pull/Legs',
      weeks: Array.from({ length: 8 }, (_, i) => ({
        number: i + 1,
        days: [
          // Jour 1 - Push
          {
            number: 1,
            exercises: [
              { name: 'Développé couché', sets: 4, reps: '8-10', intensity: 75 },
              { name: 'Développé militaire', sets: 4, reps: '8-12', intensity: 70 },
              { name: 'Dips', sets: 3, reps: '10-12', intensity: 0 },
              { name: 'Élévations latérales', sets: 3, reps: '12-15', intensity: 60 },
              { name: 'Extensions triceps', sets: 3, reps: '12-15', intensity: 65 }
            ]
          },
          // Jour 2 - Pull
          {
            number: 2,
            exercises: [
              { name: 'Tractions', sets: 4, reps: '8-10', intensity: 0 },
              { name: 'Rowing barre', sets: 4, reps: '8-12', intensity: 70 },
              { name: 'Rowing haltère', sets: 3, reps: '10-12', intensity: 65 },
              { name: 'Curl biceps', sets: 3, reps: '12-15', intensity: 60 },
              { name: 'Face pull', sets: 3, reps: '15-20', intensity: 50 }
            ]
          },
          // Jour 3 - Legs
          {
            number: 3,
            exercises: [
              { name: 'Squat', sets: 4, reps: '8-10', intensity: 75 },
              { name: 'Romanian Deadlift', sets: 4, reps: '8-12', intensity: 70 },
              { name: 'Leg Press', sets: 3, reps: '10-12', intensity: 70 },
              { name: 'Extensions quadriceps', sets: 3, reps: '12-15', intensity: 60 },
              { name: 'Curl ischios', sets: 3, reps: '12-15', intensity: 60 }
            ]
          }
        ]
      }))
    }
  },
  {
    id: 'calgary-barbell-16-week',
    name: 'Calgary Barbell 16 Semaines',
    description: 'Programme de powerlifting sur 16 semaines conçu par Calgary Barbell, idéal pour la préparation aux compétitions.',
    goal: 'Force et Powerlifting',
    equipment: 'Full Gym',
    category: 'Strength',
    difficulty: 'Advanced',
    duration: 16,
    daysPerWeek: 4,
    program: {
      name: 'Calgary Barbell 16 Semaines',
      description: 'Programme de powerlifting sur 16 semaines',
      weeks: [
        { number: 1, days: calgaryWeek1to4.days },
        createWeekWithProgression(calgaryWeek1to4, 2),
        createWeekWithProgression(calgaryWeek1to4, 3),
        createWeekWithProgression(calgaryWeek1to4, 4),
        { number: 5, days: calgaryWeek5to8.days },
        createWeek5to8WithProgression(calgaryWeek5to8, 6),
        createWeek5to8WithProgression(calgaryWeek5to8, 7),
        createWeek5to8WithProgression(calgaryWeek5to8, 8),
        { number: 9, days: calgaryWeek9to11.days },
        createWeek9to11WithProgression(calgaryWeek9to11, 10),
        createWeek9to11WithProgression(calgaryWeek9to11, 11),
        { number: 12, days: calgaryWeek12to15.days },
        createWeek12to15WithProgression(calgaryWeek12to15, 13),
        createWeek12to15WithProgression(calgaryWeek12to15, 14),
        createWeek12to15WithProgression(calgaryWeek12to15, 15),
        { number: 16, days: calgaryTaperWeek.days }
      ]
    }
  }
]

// Fonction pour charger le programme Calgary complet
export async function loadCalgaryProgram(): Promise<Program> {
  try {
    const response = await fetch('/api/programs/calgary');
    if (!response.ok) {
      throw new Error(`Erreur lors du chargement du programme: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors du chargement du programme Calgary:', error);
    throw new Error('Échec du chargement du programme Calgary');
  }
} 