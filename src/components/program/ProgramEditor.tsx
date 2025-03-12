'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Program, Week, Day, Exercise } from '@/types/program'
import { useAuth } from '@/lib/hooks/useAuth'
import { db } from '@/lib/firebase'
import { collection, doc, setDoc } from 'firebase/firestore'
import { useToast } from '@/components/ui/use-toast'

interface ProgramEditorProps {
  onSave?: () => void
}

export function ProgramEditor({ onSave }: ProgramEditorProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [program, setProgram] = useState<Program>({
    name: 'Nouveau Programme',
    weeks: [{
      number: 1,
      days: [{
        number: 1,
        exercises: []
      }]
    }]
  })
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([1])
  const [expandedDays, setExpandedDays] = useState<string[]>(['1-1']) // format: 'week-day'

  const addWeek = () => {
    const newWeekNumber = program.weeks.length + 1
    setProgram(prev => ({
      ...prev,
      weeks: [...prev.weeks, {
        number: newWeekNumber,
        days: [{
          number: 1,
          exercises: []
        }]
      }]
    }))
    setExpandedWeeks(prev => [...prev, newWeekNumber])
  }

  const addDay = (weekIndex: number) => {
    setProgram(prev => {
      const newWeeks = [...prev.weeks]
      const week = newWeeks[weekIndex]
      const newDayNumber = week.days.length + 1
      week.days.push({
        number: newDayNumber,
        exercises: []
      })
      return { ...prev, weeks: newWeeks }
    })
    setExpandedDays(prev => [...prev, `${weekIndex + 1}-${program.weeks[weekIndex].days.length + 1}`])
  }

  const addExercise = (weekIndex: number, dayIndex: number) => {
    setProgram(prev => {
      const newWeeks = [...prev.weeks]
      newWeeks[weekIndex].days[dayIndex].exercises.push({
        name: 'Nouvel exercice',
        sets: 3,
        reps: '5',
        intensity: 70,
        notes: ''
      })
      return { ...prev, weeks: newWeeks }
    })
  }

  const updateExercise = (weekIndex: number, dayIndex: number, exerciseIndex: number, updates: Partial<Exercise>) => {
    setProgram(prev => {
      const newWeeks = [...prev.weeks]
      const exercises = newWeeks[weekIndex].days[dayIndex].exercises
      exercises[exerciseIndex] = { ...exercises[exerciseIndex], ...updates }
      return { ...prev, weeks: newWeeks }
    })
  }

  const removeExercise = (weekIndex: number, dayIndex: number, exerciseIndex: number) => {
    setProgram(prev => {
      const newWeeks = [...prev.weeks]
      newWeeks[weekIndex].days[dayIndex].exercises.splice(exerciseIndex, 1)
      return { ...prev, weeks: newWeeks }
    })
  }

  const toggleWeek = (weekNumber: number) => {
    setExpandedWeeks(prev => 
      prev.includes(weekNumber) 
        ? prev.filter(w => w !== weekNumber)
        : [...prev, weekNumber]
    )
  }

  const toggleDay = (weekDay: string) => {
    setExpandedDays(prev =>
      prev.includes(weekDay)
        ? prev.filter(d => d !== weekDay)
        : [...prev, weekDay]
    )
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const [weekId, dayId] = result.source.droppableId.split('-')
    const weekIndex = parseInt(weekId) - 1
    const dayIndex = parseInt(dayId) - 1
    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index

    setProgram(prev => {
      const newWeeks = [...prev.weeks]
      const exercises = newWeeks[weekIndex].days[dayIndex].exercises
      const [removed] = exercises.splice(sourceIndex, 1)
      exercises.splice(destinationIndex, 0, removed)
      return { ...prev, weeks: newWeeks }
    })
  }

  const saveProgram = async () => {
    if (!user) return

    try {
      const programRef = doc(collection(db, 'programs'), program.name.toLowerCase().replace(/\s+/g, '-'))
      await setDoc(programRef, {
        ...program,
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })

      toast({
        title: 'Programme sauvegardé',
        description: 'Votre programme a été sauvegardé avec succès.',
      })

      onSave?.()
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la sauvegarde du programme.',
      })
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between mb-6">
        <Input
          value={program.name}
          onChange={(e) => setProgram(prev => ({ ...prev, name: e.target.value }))}
          className="text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 px-0"
        />
        <div className="flex gap-2">
          <Button onClick={addWeek} size="sm">
            Ajouter une semaine
          </Button>
          <Button onClick={saveProgram} size="sm" variant="default">
            Sauvegarder
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="space-y-4">
          {program.weeks.map((week, weekIndex) => (
            <Card key={week.number} className="p-4">
              <div 
                className="flex items-center cursor-pointer"
                onClick={() => toggleWeek(week.number)}
              >
                {expandedWeeks.includes(week.number) ? <ChevronDown /> : <ChevronUp />}
                <h3 className="text-xl font-semibold ml-2">Semaine {week.number}</h3>
              </div>

              {expandedWeeks.includes(week.number) && (
                <div className="mt-4 space-y-4">
                  {week.days.map((day, dayIndex) => (
                    <Card key={`${week.number}-${day.number}`} className="p-4">
                      <div 
                        className="flex items-center cursor-pointer"
                        onClick={() => toggleDay(`${week.number}-${day.number}`)}
                      >
                        {expandedDays.includes(`${week.number}-${day.number}`) ? <ChevronDown /> : <ChevronUp />}
                        <h4 className="text-lg font-medium ml-2">Jour {day.number}</h4>
                      </div>

                      {expandedDays.includes(`${week.number}-${day.number}`) && (
                        <Droppable droppableId={`${week.number}-${day.number}`}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className="mt-4 space-y-4"
                            >
                              {day.exercises.map((exercise, exerciseIndex) => (
                                <Draggable
                                  key={exerciseIndex}
                                  draggableId={`${week.number}-${day.number}-${exerciseIndex}`}
                                  index={exerciseIndex}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className="flex items-center gap-4 p-2 bg-muted rounded-lg"
                                    >
                                      <div {...provided.dragHandleProps}>
                                        <GripVertical className="cursor-move text-muted-foreground" />
                                      </div>
                                      <div className="flex-1 grid grid-cols-6 gap-4">
                                        <Input
                                          value={exercise.name}
                                          onChange={(e) => updateExercise(weekIndex, dayIndex, exerciseIndex, { name: e.target.value })}
                                          className="col-span-2"
                                          placeholder="Nom de l'exercice"
                                        />
                                        <Input
                                          type="number"
                                          value={exercise.sets}
                                          onChange={(e) => updateExercise(weekIndex, dayIndex, exerciseIndex, { sets: parseInt(e.target.value) })}
                                          className="w-20"
                                          placeholder="Séries"
                                        />
                                        <Input
                                          value={exercise.reps}
                                          onChange={(e) => updateExercise(weekIndex, dayIndex, exerciseIndex, { reps: e.target.value })}
                                          className="w-20"
                                          placeholder="Reps"
                                        />
                                        <Input
                                          type="number"
                                          value={exercise.intensity}
                                          onChange={(e) => updateExercise(weekIndex, dayIndex, exerciseIndex, { intensity: parseInt(e.target.value) })}
                                          className="w-20"
                                          placeholder="%1RM"
                                        />
                                        <Input
                                          value={exercise.notes}
                                          onChange={(e) => updateExercise(weekIndex, dayIndex, exerciseIndex, { notes: e.target.value })}
                                          placeholder="Notes"
                                        />
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeExercise(weekIndex, dayIndex, exerciseIndex)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addExercise(weekIndex, dayIndex)}
                                className="w-full"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Ajouter un exercice
                              </Button>
                            </div>
                          )}
                        </Droppable>
                      )}
                    </Card>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addDay(weekIndex)}
                    className="mt-2"
                  >
                    Ajouter un jour
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
} 