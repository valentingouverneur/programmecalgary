'use client'

import { useState } from 'react'
import { ExerciseCard } from '@/components/workout/ExerciseCard'
import { RestTimer } from '@/components/workout/RestTimer'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// Mock data - à remplacer par les données réelles de la base de données
const mockWorkout = {
  id: '1',
  date: new Date(),
  exercises: [
    {
      id: '1',
      exerciseId: 'Squat',
      sets: [
        { id: '1', weight: 100, reps: 5, completed: false },
        { id: '2', weight: 100, reps: 5, completed: false },
        { id: '3', weight: 100, reps: 5, completed: false },
      ],
      notes: 'Focus sur la profondeur et le contrôle',
    },
    {
      id: '2',
      exerciseId: 'Bench Press',
      sets: [
        { id: '4', weight: 80, reps: 5, completed: false },
        { id: '5', weight: 80, reps: 5, completed: false },
        { id: '6', weight: 80, reps: 5, completed: false },
      ],
    },
  ],
  completed: false,
}

export default function WorkoutPage() {
  const [workout, setWorkout] = useState(mockWorkout)
  const [showRestTimer, setShowRestTimer] = useState(false)

  const handleExerciseComplete = (exerciseId: string) => {
    setShowRestTimer(true)
  }

  const handleRestComplete = () => {
    setShowRestTimer(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-4">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Entraînement du Jour</h1>
      </div>

      <div className="space-y-6 max-w-2xl mx-auto">
        {workout.exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onComplete={handleExerciseComplete}
          />
        ))}
      </div>

      {showRestTimer && (
        <RestTimer
          duration={180}
          onComplete={handleRestComplete}
        />
      )}

      <div className="mt-8 flex justify-center">
        <Button
          size="lg"
          onClick={() => {
            // Logique pour terminer l'entraînement
          }}
        >
          Terminer l'entraînement
        </Button>
      </div>
    </div>
  )
} 