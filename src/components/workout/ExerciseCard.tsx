import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle, Circle } from 'lucide-react'
import type { WorkoutExercise, Set } from '@/lib/types'

interface ExerciseCardProps {
  exercise: WorkoutExercise
  onComplete: (exerciseId: string) => void
}

export const ExerciseCard = ({ exercise, onComplete }: ExerciseCardProps) => {
  const [completedSets, setCompletedSets] = useState<Set[]>(exercise.sets)

  const handleSetComplete = (setIndex: number) => {
    const newSets = [...completedSets]
    newSets[setIndex] = {
      ...newSets[setIndex],
      completed: !newSets[setIndex].completed
    }
    setCompletedSets(newSets)

    if (newSets.every(set => set.completed)) {
      onComplete(exercise.id)
    }
  }

  return (
    <div className="bg-card rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">{exercise.exerciseId}</h3>
        <span className="text-sm text-muted-foreground">
          {completedSets.filter(set => set.completed).length} / {completedSets.length} séries
        </span>
      </div>

      <div className="space-y-4">
        {completedSets.map((set, index) => (
          <div
            key={set.id}
            className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
          >
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">Série {index + 1}</span>
              <span className="text-sm">{set.reps} reps</span>
              <span className="text-sm">{set.weight}kg</span>
              {set.rpe && <span className="text-sm">RPE {set.rpe}</span>}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSetComplete(index)}
              aria-label={set.completed ? "Marquer comme non complété" : "Marquer comme complété"}
            >
              {set.completed ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </Button>
          </div>
        ))}
      </div>

      {exercise.notes && (
        <div className="mt-4 text-sm text-muted-foreground">
          <p>{exercise.notes}</p>
        </div>
      )}
    </div>
  )
} 