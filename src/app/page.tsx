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

export default function Home() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [timer, setTimer] = useState('00:00')
  const { activeProgram, maxScores, loading: activeProgramLoading } = useActiveProgram()

  useEffect(() => {
    const checkAuth = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(checkAuth)
  }, [])

  const calculateWeight = (exercise: any) => {
    if (!exercise.weight) return null
    
    if (exercise.weight.type === 'fixed') {
      return exercise.weight.value
    }
    
    // Chercher le maximum correspondant
    const max = maxScores.find(m => 
      m.exerciseName.toLowerCase() === exercise.name.toLowerCase()
    )
    
    if (!max) return null
    
    return Math.round((max.maxWeight * exercise.weight.value) / 100)
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
          <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-[#6366F1]">
                {activeProgramLoading ? (
                  <div className="animate-pulse h-8 w-48 bg-muted rounded" />
                ) : activeProgram ? (
                  activeProgram.name
                ) : (
                  "Aucun programme actif"
                )}
              </div>
              <div className="text-muted-foreground">
                {activeProgramLoading ? (
                  <div className="animate-pulse h-6 w-24 bg-muted rounded" />
                ) : activeProgram ? (
                  `Semaine 1, Jour 1`
                ) : (
                  "Créez ou sélectionnez un programme"
                )}
              </div>
            </div>
            <button className="text-[#6366F1] font-semibold">
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
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-lg font-semibold text-[#6366F1]">{index + 1}</span>
                  <span className="text-lg font-semibold text-[#6366F1]">{exercise.name}</span>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-muted-foreground">
                      <th className="pb-2">Série</th>
                      <th className="pb-2">Précédent</th>
                      <th className="pb-2">Objectif</th>
                      <th className="pb-2">Kg</th>
                      <th className="pb-2">Reps</th>
                      <th className="pb-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: Number(exercise.sets) }).map((_, setIndex) => {
                      const targetWeight = calculateWeight(exercise)
                      return (
                        <tr key={setIndex} className="border-t">
                          <td className="py-2">{setIndex + 1}</td>
                          <td className="py-2">-</td>
                          <td className="py-2">
                            {exercise.reps}
                            {exercise.weight?.type === 'percentage' && ` @ ${exercise.weight.value}%`}
                            {targetWeight && ` (${targetWeight}kg)`}
                          </td>
                          <td className="py-2">
                            <input type="number" className="w-16 p-1 border rounded" />
                          </td>
                          <td className="py-2">
                            <input type="number" className="w-16 p-1 border rounded" />
                          </td>
                          <td className="py-2">
                            <button className="px-3 py-1 border rounded hover:bg-muted">✓</button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                <button className="mt-4 text-sm text-[#6366F1]">+ Ajouter une série</button>
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