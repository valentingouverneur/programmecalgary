'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Plus, Trash2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/lib/hooks/useAuth'
import { db, initializeMaxScores } from '@/lib/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { ExerciseMax } from '@/types/user'

export function ExerciseMaxes() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [exerciseMaxes, setExerciseMaxes] = useState<ExerciseMax[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExerciseMaxes = async () => {
      if (!user) return

      try {
        const maxScoresDoc = await getDoc(doc(db, 'maxScores', user.uid))
        if (maxScoresDoc.exists()) {
          const data = maxScoresDoc.data()
          setExerciseMaxes(data.exerciseMaxes || [])
        } else {
          // Initialiser la collection maxScores si elle n'existe pas
          await initializeMaxScores(user.uid)
          setExerciseMaxes([])
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des maxima:', error)
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible de charger vos maxima d\'exercices.'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchExerciseMaxes()
  }, [user, toast])

  const addExerciseMax = () => {
    setExerciseMaxes(prev => [...prev, {
      exerciseName: '',
      maxWeight: 0,
      updatedAt: new Date().toISOString()
    }])
  }

  const updateExerciseMax = (index: number, updates: Partial<ExerciseMax>) => {
    setExerciseMaxes(prev => {
      const newMaxes = [...prev]
      newMaxes[index] = {
        ...newMaxes[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      return newMaxes
    })
  }

  const removeExerciseMax = (index: number) => {
    setExerciseMaxes(prev => prev.filter((_, i) => i !== index))
  }

  const saveExerciseMaxes = async () => {
    if (!user) return

    try {
      const maxScoresRef = doc(db, 'maxScores', user.uid)
      await setDoc(maxScoresRef, {
        exerciseMaxes: exerciseMaxes.filter(max => max.exerciseName && max.maxWeight > 0),
        lastUpdated: new Date()
      }, { merge: true })

      toast({
        title: 'Maxima sauvegardés',
        description: 'Vos maxima d\'exercices ont été mis à jour avec succès.'
      })
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des maxima:', error)
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de sauvegarder vos maxima d\'exercices.'
      })
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Maxima des exercices</h2>
        <Button onClick={addExerciseMax}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un exercice
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          {exerciseMaxes.map((max, index) => (
            <div key={index} className="flex items-center gap-4">
              <Input
                value={max.exerciseName}
                onChange={(e) => updateExerciseMax(index, { exerciseName: e.target.value })}
                placeholder="Nom de l'exercice"
                className="flex-1"
              />
              <Input
                type="number"
                value={max.maxWeight}
                onChange={(e) => updateExerciseMax(index, { maxWeight: parseFloat(e.target.value) })}
                placeholder="Poids max (kg)"
                className="w-32"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeExerciseMax(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {exerciseMaxes.length === 0 && (
            <p className="text-center text-muted-foreground">
              Aucun maximum d'exercice enregistré
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={saveExerciseMaxes}>
            Sauvegarder
          </Button>
        </div>
      </Card>
    </div>
  )
} 