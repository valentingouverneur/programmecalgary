'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { AuthForm } from '@/components/auth/AuthForm'
import { Button } from '@/components/ui/button'
import { Timer, Check, MoreVertical, PlayCircle, Calculator, ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { useActiveProgram } from '@/lib/hooks/useActiveProgram'
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout'
import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore'
import { ExerciseMax } from '@/types/user'
import { getMainExercise } from '@/lib/exerciseMapping'

export default function Home() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [timer, setTimer] = useState('00:00')
  const { activeProgram, maxScores, loading: activeProgramLoading } = useActiveProgram()
  const [completedSets, setCompletedSets] = useState<Record<string, boolean[]>>({})
  const [setValues, setSetValues] = useState<Record<string, { weight: number; reps: number }[]>>({})

  useEffect(() => {
    const checkAuth = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(checkAuth)
  }, [])

  // Charger les séries complétées au chargement
  useEffect(() => {
    const loadCompletedSets = async () => {
      if (!user || !activeProgram) return

      try {
        const workoutRef = doc(db, 'users', user.uid, 'workouts', new Date().toISOString().split('T')[0])
        const workoutDoc = await getDoc(workoutRef)
        
        if (workoutDoc.exists()) {
          const data = workoutDoc.data()
          const sets = data.sets || []
          
          // Convertir les séries en état local
          const newCompletedSets: Record<string, boolean[]> = {}
          const newSetValues: Record<string, { weight: number; reps: number }[]> = {}
          
          sets.forEach((set: any) => {
            const exerciseIndex = activeProgram.weeks[0].days[0].exercises.findIndex(
              ex => ex.name === set.exerciseName
            )
            if (exerciseIndex !== -1) {
              const exerciseKey = `exercise_${exerciseIndex}`
              
              // Marquer la série comme complétée
              if (!newCompletedSets[exerciseKey]) {
                newCompletedSets[exerciseKey] = []
              }
              newCompletedSets[exerciseKey][set.setNumber - 1] = true
              
              // Sauvegarder les valeurs
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

    loadCompletedSets()
  }, [user, activeProgram])

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

  // Fonction pour valider une série
  const validateSet = async (exerciseIndex: number, setIndex: number, weight: number, reps: number) => {
    if (!user || !activeProgram) return

    try {
      // Mettre à jour l'état local
      setCompletedSets(prev => {
        const exerciseKey = `exercise_${exerciseIndex}`
        const newSets = { ...prev }
        if (!newSets[exerciseKey]) {
          newSets[exerciseKey] = []
        }
        newSets[exerciseKey][setIndex] = true
        return newSets
      })

      // Créer l'objet de données pour la série
      const setData = {
        exerciseName: activeProgram.weeks[0].days[0].exercises[exerciseIndex].name,
        setNumber: setIndex + 1,
        weight,
        reps,
        timestamp: Timestamp.now(),
        programId: activeProgram.id,
        week: 1,
        day: 1
      }

      // Sauvegarder dans Firestore
      const workoutRef = doc(db, 'users', user.uid, 'workouts', new Date().toISOString().split('T')[0])
      await setDoc(workoutRef, {
        programId: activeProgram.id,
        week: 1,
        day: 1,
        sets: arrayUnion(setData)
      }, { merge: true })

    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la série:', error)
      // TODO: Afficher une notification d'erreur à l'utilisateur
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366F1]"></div>
      </div>
    )
  }

  if (!user) {
    return (
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
                {activeProgramLoading ? (
                  <div className="animate-pulse h-8 w-48 bg-muted rounded" />
                ) : activeProgram ? (
                  activeProgram.name
                ) : (
                  "Aucun programme actif"
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {activeProgramLoading ? (
                  <div className="animate-pulse h-6 w-24 bg-muted rounded" />
                ) : activeProgram ? (
                  `Semaine 1, Jour 1`
                ) : (
                  "Créez ou sélectionnez un programme"
                )}
              </div>
            </div>
            <button className="px-4 py-2 rounded-lg transition-colors duration-200 bg-[#6366F1] hover:bg-[#6366F1]/90 text-white font-semibold">
              Terminer
            </button>
          </div>
        </div>

        {activeProgramLoading ? (
          <div className="p-4">
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-muted rounded" />
              <div className="h-48 bg-muted rounded" />
              <div className="h-48 bg-muted rounded" />
            </div>
          </div>
        ) : activeProgram ? (
          <div className="p-4 space-y-6">
            {activeProgram.weeks[0].days[0].exercises.map((exercise, index) => (
              <div key={index} className="border rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-base font-semibold text-[#6366F1]">{index + 1}</span>
                  <span className="text-base font-semibold text-[#6366F1]">{exercise.name}</span>
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
                        const targetWeight = calculateWeight(exercise)
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
                                id={`weight_${index}_${setIndex}`}
                                type="number" 
                                inputMode="decimal"
                                className={`w-14 sm:w-16 p-1 border rounded text-sm ${
                                  completedSets[`exercise_${index}`]?.[setIndex] 
                                    ? 'bg-muted text-muted-foreground'
                                    : ''
                                }`}
                                defaultValue={setValues[`exercise_${index}`]?.[setIndex]?.weight || targetWeight || ''} 
                                disabled={completedSets[`exercise_${index}`]?.[setIndex]}
                              />
                            </td>
                            <td className="py-2">
                              <input 
                                id={`reps_${index}_${setIndex}`}
                                type="number"
                                inputMode="numeric"
                                className={`w-14 sm:w-16 p-1 border rounded text-sm ${
                                  completedSets[`exercise_${index}`]?.[setIndex] 
                                    ? 'bg-muted text-muted-foreground'
                                    : ''
                                }`}
                                defaultValue={setValues[`exercise_${index}`]?.[setIndex]?.reps || exercise.reps || ''} 
                                disabled={completedSets[`exercise_${index}`]?.[setIndex]}
                              />
                            </td>
                            <td className="py-2 pr-3 sm:pr-0">
                              <button 
                                className="w-8 h-8 flex items-center justify-center border rounded transition-colors duration-200 hover:bg-[#6366F1]/10 data-[state=checked]:bg-[#6366F1] data-[state=checked]:text-white"
                                data-state={completedSets[`exercise_${index}`]?.[setIndex] ? 'checked' : 'unchecked'}
                                onClick={() => {
                                  const weightInput = document.querySelector(`#weight_${index}_${setIndex}`) as HTMLInputElement
                                  const repsInput = document.querySelector(`#reps_${index}_${setIndex}`) as HTMLInputElement
                                  if (weightInput?.value && repsInput?.value) {
                                    validateSet(index, setIndex, Number(weightInput.value), Number(repsInput.value))
                                  }
                                }}
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
                <button className="mt-3 text-sm text-[#6366F1]">+ Ajouter une série</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center">
            <p className="text-muted-foreground">Aucun programme actif</p>
            <a href="/programs" className="text-[#6366F1] hover:underline">
              Sélectionner un programme
            </a>
          </div>
        )}
      </div>

      <div className="fixed bottom-4 right-4">
        <button className="bg-white border border-[#6366F1] text-[#6366F1] px-4 py-2 rounded-lg shadow-lg">
          Rest Timer
        </button>
      </div>
    </main>
  )
} 