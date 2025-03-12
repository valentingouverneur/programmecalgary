'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useAuth } from '@/lib/hooks/useAuth'

interface OneRepMaxes {
  squat: number
  bench: number
  deadlift: number
}

export function OneRepMaxForm() {
  const [oneRMs, setOneRMs] = useState<OneRepMaxes>({
    squat: 0,
    bench: 0,
    deadlift: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    const loadOneRMs = async () => {
      if (!user) return
      try {
        const docRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data()
          setOneRMs({
            squat: data.oneRMs?.squat || 0,
            bench: data.oneRMs?.bench || 0,
            deadlift: data.oneRMs?.deadlift || 0,
          })
        }
      } catch (error) {
        console.error('Erreur lors du chargement des 1RMs:', error)
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger vos 1RMs.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadOneRMs()
  }, [user, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const docRef = doc(db, 'users', user.uid)
      await setDoc(docRef, { oneRMs }, { merge: true })
      
      toast({
        title: "Succès",
        description: "Vos 1RMs ont été mis à jour.",
      })
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des 1RMs:', error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder vos 1RMs.",
      })
    }
  }

  const handleChange = (exercise: keyof OneRepMaxes) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Number(e.target.value))
    setOneRMs(prev => ({ ...prev, [exercise]: value }))
  }

  if (isLoading) {
    return <div className="flex justify-center p-8">Chargement...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vos 1 Rep Max</CardTitle>
        <CardDescription>
          Configurez vos maximums sur une répétition pour chaque exercice principal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="squat">Squat (kg)</Label>
              <Input
                id="squat"
                type="number"
                min="0"
                step="0.5"
                value={oneRMs.squat}
                onChange={handleChange('squat')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bench">Développé couché (kg)</Label>
              <Input
                id="bench"
                type="number"
                min="0"
                step="0.5"
                value={oneRMs.bench}
                onChange={handleChange('bench')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadlift">Soulevé de terre (kg)</Label>
              <Input
                id="deadlift"
                type="number"
                min="0"
                step="0.5"
                value={oneRMs.deadlift}
                onChange={handleChange('deadlift')}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Sauvegarder
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 