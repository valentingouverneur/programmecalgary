'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Program, Week, Day, Exercise, ProgramTemplate } from '@/types/program'
import { useAuth } from '@/lib/hooks/useAuth'
import { db } from '@/lib/firebase'
import { collection, doc, setDoc, addDoc, getDoc } from 'firebase/firestore'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { ProgramTemplates } from '@/components/program/ProgramTemplates'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ExerciseMax } from '@/types/user'
import { ExerciseSearch } from '@/components/exercise/ExerciseSearch'

interface ProgramEditorProps {
  initialProgram?: Program
  onSave?: () => void
}

interface ProgramData {
  name: string
  description: string
  goal: string
  equipment: string
  weeks: Week[]
  createdBy: string
  createdAt?: string
  updatedAt: string
}

// Type pour l'état du programme en cours d'édition
interface EditingProgram {
  id?: string
  name: string
  description?: string
  goal?: string
  equipment?: string
  weeks: Week[]
}

export function ProgramEditor({ initialProgram, onSave }: ProgramEditorProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [showTemplates, setShowTemplates] = useState(!initialProgram)
  const [program, setProgram] = useState<EditingProgram>(initialProgram || {
    name: 'Nouveau Programme',
    description: '',
    goal: '',
    equipment: 'Full Gym',
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
  const [exerciseMaxes, setExerciseMaxes] = useState<ExerciseMax[]>([])

  useEffect(() => {
    const fetchExerciseMaxes = async () => {
      if (!user) return

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          const data = userDoc.data()
          setExerciseMaxes(data.settings?.exerciseMaxes || [])
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des maxima:', error)
      }
    }

    fetchExerciseMaxes()
  }, [user])

  const handleSelectTemplate = (template: ProgramTemplate) => {
    setProgram({
      name: template.program.name,
      description: template.program.description,
      goal: template.goal,
      equipment: template.equipment,
      weeks: template.program.weeks
    })
    setShowTemplates(false)
  }

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
        notes: '',
        weight: {
          type: 'percentage',
          value: 70
        }
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
    try {
      if (!user) {
        throw new Error('Vous devez être connecté pour sauvegarder un programme.')
      }

      const token = await user.getIdToken(true)
      console.log('Token d\'authentification rafraîchi:', token.substring(0, 20) + '...')

      const programData: ProgramData = {
        name: program.name || 'Nouveau Programme',
        description: program.description || '',
        goal: program.goal || '',
        equipment: program.equipment || 'Full Gym',
        weeks: program.weeks.map(week => ({
          number: Number(week.number),
          days: week.days.map(day => ({
            number: Number(day.number),
            exercises: day.exercises.map(exercise => ({
              name: exercise.name || '',
              sets: Number(exercise.sets) || 0,
              reps: exercise.reps || '0',
              intensity: Number(exercise.intensity) || 0,
              notes: exercise.notes || '',
              weight: exercise.weight || { type: 'percentage', value: 70 }
            }))
          }))
        })),
        createdBy: user.uid,
        updatedAt: new Date().toISOString()
      }

      if (!initialProgram?.id) {
        programData.createdAt = new Date().toISOString()
        const docRef = await addDoc(collection(db, 'programs'), programData)
        console.log('Programme créé avec succès, ID:', docRef.id)
      } else {
        await setDoc(doc(db, 'programs', initialProgram.id), programData)
        console.log('Programme mis à jour avec succès')
      }

      toast({
        title: initialProgram?.id ? 'Programme mis à jour' : 'Programme créé',
        description: initialProgram?.id 
          ? 'Votre programme a été mis à jour avec succès.'
          : 'Votre programme a été créé avec succès.',
      })

      onSave?.()
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde du programme.",
      })
    }
  }

  if (showTemplates) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Choisir un template</h2>
          <Button variant="outline" onClick={() => setShowTemplates(false)}>
            Créer sans template
          </Button>
        </div>
        <ProgramTemplates onSelectTemplate={handleSelectTemplate} />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex flex-col gap-6">
        <div className="space-y-4">
          <Input
            value={program.name}
            onChange={(e) => setProgram(prev => ({ ...prev, name: e.target.value }))}
            className="text-3xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 px-0"
            placeholder="Nom du programme"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={program.description || ''}
                onChange={(e) => setProgram(prev => ({ ...prev, description: e.target.value }))}
                className="w-full h-32 p-2 rounded-md border bg-background resize-none"
                placeholder="Décrivez votre programme..."
              />
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal">Objectif</Label>
                <Input
                  id="goal"
                  value={program.goal || ''}
                  onChange={(e) => setProgram(prev => ({ ...prev, goal: e.target.value }))}
                  placeholder="Ex: Force, Hypertrophie, Endurance..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="equipment">Équipement requis</Label>
                <Input
                  id="equipment"
                  value={program.equipment || ''}
                  onChange={(e) => setProgram(prev => ({ ...prev, equipment: e.target.value }))}
                  placeholder="Ex: Full Gym, Matériel à domicile..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Structure du programme</h2>
          <Button onClick={addWeek} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une semaine
          </Button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="space-y-6">
            {program.weeks.map((week, weekIndex) => (
              <Card key={week.number} className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => toggleWeek(week.number)}
                  >
                    {expandedWeeks.includes(week.number) ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
                    <h3 className="text-xl font-semibold ml-2">Semaine {week.number}</h3>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => addDay(weekIndex)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Jour
                  </Button>
                </div>

                {expandedWeeks.includes(week.number) && (
                  <div className="space-y-4">
                    {week.days.map((day, dayIndex) => (
                      <Card key={`${week.number}-${day.number}`} className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div 
                            className="flex items-center cursor-pointer"
                            onClick={() => toggleDay(`${week.number}-${day.number}`)}
                          >
                            {expandedDays.includes(`${week.number}-${day.number}`) ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
                            <h4 className="text-lg font-medium ml-2">Jour {day.number}</h4>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => addExercise(weekIndex, dayIndex)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Exercice
                          </Button>
                        </div>

                        {expandedDays.includes(`${week.number}-${day.number}`) && (
                          <Droppable droppableId={`${week.number}-${day.number}`}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="space-y-3"
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
                                        className="flex items-center gap-4 p-3 bg-muted rounded-lg group"
                                      >
                                        <div {...provided.dragHandleProps} className="cursor-move">
                                          <GripVertical className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                          <div className="md:col-span-3">
                                            <ExerciseSearch
                                              defaultValue={exercise.name}
                                              onSelect={(selectedExercise) => {
                                                updateExercise(weekIndex, dayIndex, exerciseIndex, {
                                                  name: selectedExercise.name,
                                                  tempo: selectedExercise.defaultTempo,
                                                  rest: selectedExercise.defaultRest
                                                })
                                              }}
                                            />
                                          </div>
                                          <div className="md:col-span-7 grid grid-cols-4 gap-4">
                                            <Input
                                              type="number"
                                              value={exercise.sets}
                                              onChange={(e) => updateExercise(weekIndex, dayIndex, exerciseIndex, { sets: parseInt(e.target.value) })}
                                              className="w-full"
                                              placeholder="Séries"
                                            />
                                            <Input
                                              value={exercise.reps}
                                              onChange={(e) => updateExercise(weekIndex, dayIndex, exerciseIndex, { reps: e.target.value })}
                                              className="w-full"
                                              placeholder="Reps"
                                            />
                                            <Select
                                              value={exercise.weight?.type || 'percentage'}
                                              onValueChange={(value: 'kg' | 'percentage' | 'rpe') => {
                                                const currentValue = exercise.weight?.value || 0
                                                updateExercise(weekIndex, dayIndex, exerciseIndex, {
                                                  weight: { type: value, value: currentValue }
                                                })
                                              }}
                                            >
                                              <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Type" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="kg">Kg</SelectItem>
                                                <SelectItem value="percentage">% Max</SelectItem>
                                                <SelectItem value="rpe">RPE</SelectItem>
                                              </SelectContent>
                                            </Select>
                                            <Input
                                              type="number"
                                              value={exercise.weight?.value || 0}
                                              onChange={(e) => {
                                                const value = parseFloat(e.target.value)
                                                updateExercise(weekIndex, dayIndex, exerciseIndex, {
                                                  weight: { type: exercise.weight?.type || 'percentage', value }
                                                })
                                              }}
                                              className="w-full"
                                              placeholder={
                                                exercise.weight?.type === 'kg' ? 'Kg' : 
                                                exercise.weight?.type === 'rpe' ? 'RPE' : '% Max'
                                              }
                                            />
                                          </div>
                                          <div className="md:col-span-2 flex justify-end">
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={() => removeExercise(weekIndex, dayIndex, exerciseIndex)}
                                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </DragDropContext>

        <div className="flex justify-end gap-4 mt-8">
          <Button variant="outline" onClick={() => router.back()}>
            Annuler
          </Button>
          <Button onClick={saveProgram}>
            Sauvegarder
          </Button>
        </div>
      </div>
    </div>
  )
} 