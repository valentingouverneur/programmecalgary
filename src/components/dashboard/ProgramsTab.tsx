'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ProgramEditor } from '@/components/program/ProgramEditor'
import { Program } from '@/types/program'
import { usePrograms } from '@/lib/hooks/usePrograms'

interface ProgramWithId extends Program {
  id: string
  createdAt: string
  updatedAt: string
  createdBy: string
}

export function ProgramsTab() {
  const { programs, loading } = usePrograms()
  const [isCreating, setIsCreating] = useState(false)

  if (isCreating) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Créer un programme</h2>
          <Button variant="ghost" onClick={() => setIsCreating(false)}>
            Retour
          </Button>
        </div>
        <ProgramEditor onSave={() => setIsCreating(false)} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mes Programmes</h2>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Créer un programme
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : programs.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Vous n'avez pas encore créé de programme</p>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Créer mon premier programme
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {programs.map((program: ProgramWithId) => (
            <Card 
              key={program.id} 
              className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => {/* TODO: Ajouter la visualisation/édition du programme */}}
            >
              <h3 className="text-xl font-semibold mb-2">{program.name}</h3>
              <p className="text-muted-foreground">
                {program.weeks.length} semaines, {program.weeks.reduce((acc: number, week) => acc + week.days.length, 0)} jours
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 