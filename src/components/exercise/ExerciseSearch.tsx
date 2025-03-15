'use client'

import { useState, useEffect } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { DBExercise } from '@/types/exercise'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

interface ExerciseSearchProps {
  onSelect: (exercise: DBExercise) => void
  defaultValue?: string
  placeholder?: string
}

export function ExerciseSearch({ onSelect, defaultValue = '', placeholder = 'Rechercher un exercice...' }: ExerciseSearchProps) {
  const [open, setOpen] = useState(false)
  const [exercises, setExercises] = useState<DBExercise[]>([])
  const [selectedExercise, setSelectedExercise] = useState<DBExercise | null>(null)

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const exercisesCollection = collection(db, 'exercises')
        const exercisesSnapshot = await getDocs(exercisesCollection)
        const exercisesList = exercisesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as DBExercise[]
        setExercises(exercisesList)

        // Si nous avons une valeur par défaut, trouvons l'exercice correspondant
        if (defaultValue) {
          const defaultExercise = exercisesList.find(ex => ex.name === defaultValue)
          if (defaultExercise) {
            setSelectedExercise(defaultExercise)
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des exercices:', error)
      }
    }

    fetchExercises()
  }, [defaultValue])

  const handleSelect = (exercise: DBExercise) => {
    setSelectedExercise(exercise)
    setOpen(false)
    onSelect(exercise)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedExercise ? selectedExercise.name : defaultValue || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandEmpty>Aucun exercice trouvé.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-y-auto">
            {exercises.map((exercise) => (
              <CommandItem
                key={exercise.id}
                value={exercise.name}
                onSelect={() => handleSelect(exercise)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedExercise?.id === exercise.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {exercise.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 