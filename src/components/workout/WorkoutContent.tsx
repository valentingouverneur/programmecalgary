'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { useActiveProgram } from '@/lib/hooks/useActiveProgram'
import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc, arrayUnion, Timestamp } from 'firebase/firestore'
import { WorkoutDialog } from '@/components/workout/WorkoutDialog'
import { Button } from '@/components/ui/button'
import { Timer } from 'lucide-react'
import { getMainExercise } from '@/lib/exerciseMapping'

interface SetValue {
  weight: number
  reps: number
}

interface WorkoutSummary {
  duration: string
  totalSets: number
  totalVolume: number
  personalRecords: Array<{
    exerciseName: string
    type: 'weight' | 'reps' | 'volume'
    value: number
  }>
}

interface WorkoutContentProps {
  user: any // TODO: Remplacer par le bon type d'utilisateur de Firebase
}

export function WorkoutContent({ user }: WorkoutContentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [timer, setTimer] = useState('00:00')
  const { activeProgram, maxScores, loading: activeProgramLoading } = useActiveProgram()
  const [completedSets, setCompletedSets] = useState<Record<string, boolean[]>>({})
  const [setValues, setSetValues] = useState<Record<string, SetValue[]>>({})
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isFinishDialog, setIsFinishDialog] = useState(false)
  const [workoutStartTime] = useState<Date>(new Date())
  const [incompleteSets, setIncompleteSets] = useState<Array<{ exerciseName: string, setsRemaining: number }>>([])
  const [workoutSummary, setWorkoutSummary] = useState<WorkoutSummary | undefined>(undefined)
  
  const currentWeek = Number(searchParams.get('week')) || 1
  const currentDay = Number(searchParams.get('day')) || 1

  // Réinitialiser les états quand les paramètres changent
  useEffect(() => {
    setCompletedSets({})
    setSetValues({})
    loadCompletedSets()
  }, [currentWeek, currentDay])

  // Mettre à jour le timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const diffInMinutes = Math.floor((now.getTime() - workoutStartTime.getTime()) / (1000 * 60))
      const hours = Math.floor(diffInMinutes / 60)
      const minutes = diffInMinutes % 60
      setTimer(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`)
    }, 1000)

    return () => clearInterval(interval)
  }, [workoutStartTime])

  const loadCompletedSets = async () => {
    if (!user || !activeProgram) return

    try {
      const workoutRef = doc(db, 'users', user.uid, 'workouts', new Date().toISOString().split('T')[0])
      const workoutDoc = await getDoc(workoutRef)
      
      if (workoutDoc.exists()) {
        const data = workoutDoc.data()
        const sets = data.sets || []
        
        const newCompletedSets: Record<string, boolean[]> = {}
        const newSetValues: Record<string, SetValue[]> = {}
        
        sets.forEach((set: any) => {
          const exerciseIndex = activeProgram.weeks[currentWeek - 1].days[currentDay - 1].exercises.findIndex(
            ex => ex.name === set.exerciseName
          )
          if (exerciseIndex !== -1) {
            const exerciseKey = `exercise_${exerciseIndex}`
            
            if (!newCompletedSets[exerciseKey]) {
              newCompletedSets[exerciseKey] = []
            }
            newCompletedSets[exerciseKey][set.setNumber - 1] = true
            
            if (!newSetValues[exerciseKey]) {
              newSetValues[exerciseKey] = []
            }
            newSetValues[exerciseKey][set.setNumber - 1] = {
              weight: set.weight,
              reps: set.reps
            }
          }
        })
        
        setCompletedSets(newCompletedSets)
        setSetValues(newSetValues)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des séries complétées:', error)
    }
  }

  const calculateWeight = (exercise: any) => {
    const mainExercise = getMainExercise(exercise.name)
    const maxWeight = maxScores.find(max => 
      getMainExercise(max.exerciseName) === mainExercise
    )?.maxWeight || 0

    if (exercise.weight) {
      if (exercise.weight.type === 'percentage') {
        return Math.round((maxWeight * exercise.weight.value) / 100)
      } else if (exercise.weight.type === 'rpe') {
        return maxWeight // Pour l'instant, on retourne juste le max pour RPE
      } else if (exercise.weight.type === 'kg') {
        return exercise.weight.value
      }
    }
    return 0
  }

  const handleGoToNextDay = () => {
    setDialogOpen(false)
    const nextDay = currentDay + 1
    if (!activeProgram) return

    if (nextDay <= activeProgram.weeks[currentWeek - 1].days.length) {
      const params = new URLSearchParams()
      params.set('week', currentWeek.toString())
      params.set('day', nextDay.toString())
      router.replace(`/workout?${params.toString()}`)
    } else {
      const nextWeek = currentWeek + 1
      if (nextWeek <= activeProgram.weeks.length) {
        const params = new URLSearchParams()
        params.set('week', nextWeek.toString())
        params.set('day', '1')
        router.replace(`/workout?${params.toString()}`)
      } else {
        router.push('/dashboard')
      }
    }
  }

  const validateSet = async (exerciseIndex: number, setIndex: number, weight: string | number, reps: string | number) => {
    if (!user || !activeProgram) return

    try {
      const weightNum = Number(weight)
      const repsNum = Number(reps)

      if (isNaN(weightNum) || isNaN(repsNum)) return

      const newCompletedSets = { ...completedSets }
      const exerciseKey = `exercise_${exerciseIndex}`
      
      if (!newCompletedSets[exerciseKey]) {
        newCompletedSets[exerciseKey] = []
      }
      
      newCompletedSets[exerciseKey][setIndex] = true
      
      const newSetValues = { ...setValues }
      if (!newSetValues[exerciseKey]) {
        newSetValues[exerciseKey] = []
      }
      
      newSetValues[exerciseKey][setIndex] = {
        weight: weightNum,
        reps: repsNum
      }
      
      setCompletedSets(newCompletedSets)
      setSetValues(newSetValues)

      // Sauvegarder dans Firestore
      const workoutRef = doc(db, 'users', user.uid, 'workouts', new Date().toISOString().split('T')[0])
      const exercise = activeProgram.weeks[currentWeek - 1].days[currentDay - 1].exercises[exerciseIndex]
      
      await setDoc(workoutRef, {
        programId: activeProgram.id,
        week: currentWeek,
        day: currentDay,
        sets: arrayUnion({
          exerciseName: exercise.name,
          setNumber: setIndex + 1,
          weight: weightNum,
          reps: repsNum,
          timestamp: Timestamp.now()
        })
      }, { merge: true })

    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la série:', error)
    }
  }

  const calculateWorkoutDuration = () => {
    const endTime = new Date()
    const durationInMinutes = Math.round((endTime.getTime() - workoutStartTime.getTime()) / (1000 * 60))
    return `${Math.floor(durationInMinutes / 60)}h${durationInMinutes % 60}min`
  }

  const calculateTotalVolume = (): number => {
    return Object.values(setValues).reduce((total, sets) => {
      return total + sets.reduce((setTotal, set) => {
        if (set) {
          return setTotal + (set.weight * set.reps)
        }
        return setTotal
      }, 0)
    }, 0)
  }

  const finishWorkout = async (skipRemaining = false) => {
    if (!user || !activeProgram) return

    try {
      const duration = calculateWorkoutDuration()
      const totalVolume = calculateTotalVolume()
      const totalSets = Object.values(completedSets).reduce(
        (acc, sets) => acc + (sets?.filter(Boolean).length || 0),
        0
      )

      const summary: WorkoutSummary = {
        duration,
        totalSets,
        totalVolume,
        personalRecords: []
      }

      const workoutRef = doc(db, 'users', user.uid, 'workouts', new Date().toISOString().split('T')[0])
      await setDoc(workoutRef, {
        programId: activeProgram.id,
        week: currentWeek,
        day: currentDay,
        completedAt: Timestamp.now(),
        duration: duration,
        stats: {
          totalSets,
          totalVolume,
          personalRecords: []
        }
      }, { merge: true })

      setWorkoutSummary(summary)
      setIsFinishDialog(true)
      setDialogOpen(true)

    } catch (error) {
      console.error('Erreur lors de la sauvegarde du workout:', error)
    }
  }

  // Rediriger vers la page workout si on est sur la racine
  useEffect(() => {
    if (pathname === '/') {
      const params = new URLSearchParams()
      params.set('week', currentWeek.toString())
      params.set('day', currentDay.toString())
      router.replace(`/workout?${params.toString()}`)
    }
  }, [pathname, currentWeek, currentDay])

  // Si on est sur la page workout sans paramètres, rediriger vers jour 1
  useEffect(() => {
    if (pathname === '/workout' && !searchParams.get('week') && !searchParams.get('day')) {
      router.replace('/workout?week=1&day=1')
    }
  }, [pathname, searchParams])

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Jour {currentDay} - Semaine {currentWeek}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5" />
              <span className="font-mono">{timer}</span>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          {activeProgram?.weeks[currentWeek - 1].days[currentDay - 1].exercises.map((exercise, exerciseIndex) => (
            <div key={exerciseIndex} className="border rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-base font-semibold text-[#6366F1]">{exerciseIndex + 1}</span>
                <span className="text-base font-semibold">{exercise.name}</span>
              </div>
              <div className="overflow-x-auto -mx-3 sm:mx-0">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs sm:text-sm text-muted-foreground">
                      <th className="pb-2 pl-3 sm:pl-0">Série</th>
                      <th className="pb-2">Objectif</th>
                      <th className="pb-2">Kg</th>
                      <th className="pb-2">Reps</th>
                      <th className="pb-2 pr-3 sm:pr-0"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: Number(exercise.sets) }).map((_, setIndex) => {
                      const exerciseKey = `exercise_${exerciseIndex}`
                      const targetWeight = calculateWeight(exercise)
                      const isCompleted = completedSets[exerciseKey]?.[setIndex]
                      const currentSetValues = setValues[exerciseKey]?.[setIndex]

                      return (
                        <tr key={setIndex} className="border-t">
                          <td className="py-2 pl-3 sm:pl-0 text-sm">{setIndex + 1}</td>
                          <td className="py-2 text-sm whitespace-nowrap">
                            {exercise.reps} reps
                            {exercise.weight?.type === 'percentage' && ` @ ${exercise.weight.value}%`}
                            {exercise.weight?.type === 'rpe' && ` @ RPE ${exercise.weight.value}`}
                          </td>
                          <td className="py-2">
                            <input 
                              type="number"
                              inputMode="decimal"
                              className={`w-14 sm:w-16 p-1 border rounded text-sm ${
                                isCompleted ? 'bg-muted text-muted-foreground' : ''
                              }`}
                              value={currentSetValues?.weight || targetWeight || ''} 
                              onChange={(e) => {
                                const newSetValues = { ...setValues }
                                if (!newSetValues[exerciseKey]) {
                                  newSetValues[exerciseKey] = []
                                }
                                newSetValues[exerciseKey][setIndex] = {
                                  ...newSetValues[exerciseKey][setIndex],
                                  weight: Number(e.target.value)
                                }
                                setSetValues(newSetValues)
                              }}
                              disabled={isCompleted}
                            />
                          </td>
                          <td className="py-2">
                            <input 
                              type="number"
                              inputMode="numeric"
                              className={`w-14 sm:w-16 p-1 border rounded text-sm ${
                                isCompleted ? 'bg-muted text-muted-foreground' : ''
                              }`}
                              value={currentSetValues?.reps || exercise.reps || ''} 
                              onChange={(e) => {
                                const newSetValues = { ...setValues }
                                if (!newSetValues[exerciseKey]) {
                                  newSetValues[exerciseKey] = []
                                }
                                newSetValues[exerciseKey][setIndex] = {
                                  ...newSetValues[exerciseKey][setIndex],
                                  reps: Number(e.target.value)
                                }
                                setSetValues(newSetValues)
                              }}
                              disabled={isCompleted}
                            />
                          </td>
                          <td className="py-2 pr-3 sm:pr-0">
                            <button 
                              className={`w-8 h-8 flex items-center justify-center border rounded transition-colors duration-200 ${
                                isCompleted 
                                  ? 'bg-[#6366F1] text-white' 
                                  : 'hover:bg-[#6366F1]/10'
                              }`}
                              onClick={() => {
                                if (!isCompleted) {
                                  const weight = currentSetValues?.weight || targetWeight
                                  const reps = currentSetValues?.reps || exercise.reps
                                  if (weight && reps) {
                                    validateSet(exerciseIndex, setIndex, weight, reps)
                                  }
                                }
                              }}
                              disabled={isCompleted}
                            >
                              ✓
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-end">
          <Button
            onClick={() => {
              if (!activeProgram) return
              
              const incompleteExercises: Array<{ exerciseName: string, setsRemaining: number }> = []
              
              activeProgram.weeks[currentWeek - 1].days[currentDay - 1].exercises.forEach((exercise, index) => {
                const exerciseKey = `exercise_${index}`
                const completedSetsCount = completedSets[exerciseKey]?.filter(Boolean).length || 0
                const totalSets = Number(exercise.sets)
                
                if (completedSetsCount < totalSets) {
                  incompleteExercises.push({
                    exerciseName: exercise.name,
                    setsRemaining: totalSets - completedSetsCount
                  })
                }
              })

              if (incompleteExercises.length > 0) {
                setIncompleteSets(incompleteExercises)
                setIsFinishDialog(false)
                setDialogOpen(true)
                return
              }

              finishWorkout()
            }}
            className="bg-[#6366F1] hover:bg-[#6366F1]/90"
          >
            Terminer l'entraînement
          </Button>
        </div>
      </div>
      <WorkoutDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        incompleteSets={incompleteSets}
        onContinue={() => {
          setDialogOpen(false)
          setIsFinishDialog(false)
        }}
        onSkip={() => finishWorkout(true)}
        onFinish={() => finishWorkout()}
        isFinishDialog={isFinishDialog}
        workoutSummary={workoutSummary}
      />
    </main>
  )
} 