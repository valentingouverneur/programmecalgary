'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { AuthForm } from '@/components/auth/AuthForm'
import { Button } from '@/components/ui/button'
import { Timer, Check, MoreVertical, PlayCircle, Calculator, ArrowLeft, Calendar as CalendarIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { useActiveProgram } from '@/lib/hooks/useActiveProgram'
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout'
import { db, auth } from '@/lib/firebase'
import { doc, getDoc, setDoc, updateDoc, arrayUnion, Timestamp, collection, query, where, getDocs } from 'firebase/firestore'
import { ExerciseMax } from '@/types/user'
import { getMainExercise } from '@/lib/exerciseMapping'
import { WorkoutDialog } from '@/components/workout/WorkoutDialog'
import { WorkoutHistoryDialog } from '@/components/workout/WorkoutHistoryDialog'

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

export default function Home() {
  const { user, loading, initialized } = useAuth()

  // Afficher le loader tant que l'authentification n'est pas initialisée
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366F1]"></div>
      </div>
    )
  }

  // Une fois initialisé, afficher le contenu approprié
  return (
    <>
      {!user ? (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-sm">
            <h1 className="font-roboto-mono text-2xl md:text-4xl tracking-[.15em] md:tracking-[.25em] uppercase font-bold text-center mb-8">
              STUDIO 101
            </h1>
            <div className="bg-card rounded-2xl p-6">
              <AuthForm />
            </div>
          </div>
        </div>
      ) : (
        <WorkoutContent user={user} />
      )}
    </>
  )
}

function WorkoutContent({ user }: WorkoutContentProps) {
  const [loading, setLoading] = useState(true)
  const [timer, setTimer] = useState('00:00')
  const { activeProgram, maxScores, loading: activeProgramLoading } = useActiveProgram()
  const [completedSets, setCompletedSets] = useState<Record<string, boolean[]>>({})
  const [setValues, setSetValues] = useState<Record<string, SetValue[]>>({})
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isFinishDialog, setIsFinishDialog] = useState(false)
  const [workoutStartTime, setWorkoutStartTime] = useState<Date>(new Date())
  const [incompleteSets, setIncompleteSets] = useState<Array<{ exerciseName: string, setsRemaining: number }>>([])
  const [workoutSummary, setWorkoutSummary] = useState<WorkoutSummary | undefined>(undefined)
  const [currentWeek, setCurrentWeek] = useState(1)
  const [currentDay, setCurrentDay] = useState(1)
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false)
  const [workoutHistory, setWorkoutHistory] = useState<Array<{
    date: Date
    week: number
    day: number
    stats: {
      totalSets: number
      totalVolume: number
    }
  }>>([])

  useEffect(() => {
    const checkAuth = setTimeout(() => {
      setLoading(false)
    }, 500)
    return () => clearTimeout(checkAuth)
  }, [])

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

  // Charger l'historique des workouts
  useEffect(() => {
    const loadWorkoutHistory = async () => {
      if (!user || !activeProgram) return

      try {
        const workoutsRef = collection(db, 'users', user.uid, 'workouts')
        const q = query(workoutsRef, where('programId', '==', activeProgram.id))
        const querySnapshot = await getDocs(q)
        
        const workouts = querySnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            date: new Date(doc.id.split('T')[0]),
            week: data.week,
            day: data.day,
            stats: data.stats
          }
        })

        setWorkoutHistory(workouts)
      } catch (error) {
        console.error('Erreur lors du chargement de l\'historique:', error)
      }
    }

    loadWorkoutHistory()
  }, [user, activeProgram])

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
          const exerciseIndex = activeProgram.weeks[0].days[0].exercises.findIndex(
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
      const exercise = activeProgram.weeks[0].days[0].exercises[exerciseIndex]
      
      await setDoc(workoutRef, {
        programId: activeProgram.id,
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

  const finishWorkout = async (skipRemaining = false, shouldCloseDialog = false) => {
    if (!user || !activeProgram) return

    try {
      const workoutRef = doc(db, 'users', user.uid, 'workouts', new Date().toISOString().split('T')[0])
      
      // Calculer les statistiques
      const duration = calculateWorkoutDuration()
      const totalVolume = calculateTotalVolume()
      const totalSets = Object.values(completedSets).reduce(
        (acc, sets) => acc + (sets?.filter(Boolean).length || 0),
        0
      )

      // Créer le résumé
      const summary: WorkoutSummary = {
        duration,
        totalSets,
        totalVolume,
        personalRecords: []
      }

      // Vérifier que l'utilisateur est toujours connecté
      if (!auth.currentUser) {
        throw new Error('Utilisateur non connecté')
      }

      // Sauvegarder le workout
      await setDoc(workoutRef, {
        programId: activeProgram.id,
        programName: activeProgram.name,
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

      // Mettre à jour la progression du programme
      const userProgramRef = doc(db, 'users', user.uid, 'programs', activeProgram.id)
      await setDoc(userProgramRef, {
        currentWeek,
        currentDay: currentDay + 1,
        lastUpdated: Timestamp.now()
      }, { merge: true })

      // Afficher le résumé seulement si on ne ferme pas le dialog
      if (!shouldCloseDialog) {
        setWorkoutSummary(summary)
        setIsFinishDialog(true)
        setDialogOpen(true)
      }

      // Passer au prochain jour/semaine
      const nextDay = currentDay + 1
      if (nextDay <= activeProgram.weeks[currentWeek - 1].days.length) {
        setCurrentDay(nextDay)
      } else {
        const nextWeek = currentWeek + 1
        if (nextWeek <= activeProgram.weeks.length) {
          setCurrentWeek(nextWeek)
          setCurrentDay(1)
        }
      }

      // Réinitialiser les états pour le nouveau workout
      setCompletedSets({})
      setSetValues({})
      setWorkoutStartTime(new Date())

      // Fermer le dialog si demandé
      if (shouldCloseDialog) {
        setDialogOpen(false)
      }

    } catch (error) {
      console.error('Erreur lors de la sauvegarde du workout:', error)
    }
  }

  const handleContinueWorkout = () => {
    setDialogOpen(false)
  }

  const handleSkipRemaining = async () => {
    await finishWorkout(true, true)
  }

  const handleNextDay = async () => {
    await finishWorkout(true, true)
  }

  const handleFinishClick = async () => {
    if (!user || !activeProgram) return

    // Vérifier les séries incomplètes
    const incompleteExercises: Array<{ exerciseName: string, setsRemaining: number }> = []
    
    const currentExercises = activeProgram.weeks[currentWeek - 1].days[currentDay - 1].exercises
    currentExercises.forEach((exercise, index) => {
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

    await finishWorkout(false, false)
  }

  const handleSelectWorkout = async (date: Date) => {
    if (!user || !activeProgram) return

    try {
      const workoutRef = doc(db, 'users', user.uid, 'workouts', date.toISOString().split('T')[0])
      const workoutDoc = await getDoc(workoutRef)
      
      if (workoutDoc.exists()) {
        const data = workoutDoc.data()
        setCurrentWeek(data.week)
        setCurrentDay(data.day)
        
        // Charger les séries complétées
        const sets = data.sets || []
        const newCompletedSets: Record<string, boolean[]> = {}
        const newSetValues: Record<string, SetValue[]> = {}
        
        sets.forEach((set: any) => {
          const exerciseIndex = activeProgram.weeks[data.week - 1].days[data.day - 1].exercises.findIndex(
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
      
      setHistoryDialogOpen(false)
    } catch (error) {
      console.error('Erreur lors du chargement du workout:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366F1]"></div>
      </div>
    )
  }

  if (activeProgramLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-muted rounded" />
          <div className="h-48 bg-muted rounded" />
          <div className="h-48 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (!activeProgram) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Aucun programme actif</p>
        <a href="/programs" className="text-[#6366F1] hover:underline">
          Sélectionner un programme
        </a>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto">
        <div className="border-b">
          <div className="max-w-7xl mx-auto p-4 flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <div className="text-2xl font-bold text-[#6366F1]">
                {activeProgram.name}
              </div>
              <div className="text-sm text-muted-foreground">
                Semaine {currentWeek}, Jour {currentDay}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 rounded-lg transition-colors duration-200 border border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1]/10"
                onClick={() => setHistoryDialogOpen(true)}
              >
                <CalendarIcon className="w-5 h-5" />
              </button>
              <button 
                className="px-4 py-2 rounded-lg transition-colors duration-200 bg-[#6366F1] hover:bg-[#6366F1]/90 text-white font-semibold"
                onClick={handleFinishClick}
              >
                Terminer
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {activeProgram.weeks[currentWeek - 1].days[currentDay - 1].exercises.map((exercise, exerciseIndex) => (
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

        <WorkoutDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          incompleteSets={incompleteSets}
          onContinue={handleContinueWorkout}
          onSkip={handleSkipRemaining}
          onFinish={handleNextDay}
          isFinishDialog={isFinishDialog}
          workoutSummary={workoutSummary}
        />

        <WorkoutHistoryDialog
          open={historyDialogOpen}
          onClose={() => setHistoryDialogOpen(false)}
          workouts={workoutHistory}
          onSelectWorkout={handleSelectWorkout}
        />
      </div>

      <div className="fixed bottom-4 right-4">
        <button className="bg-white border border-[#6366F1] text-[#6366F1] px-4 py-2 rounded-lg shadow-lg">
          Rest Timer
        </button>
      </div>
    </main>
  )
}