'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { programTemplates } from '@/lib/templates/programs'
import { loadCalgaryProgram } from '@/lib/templates/programs'
import { ProgramTemplate } from '@/types/program'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Dumbbell, Timer, Zap } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

const categoryIcons = {
  Strength: Dumbbell,
  Hypertrophy: Dumbbell,
  Endurance: Timer,
  PowerBuilding: Zap,
  CrossTraining: Zap,
}

const difficultyColors = {
  Beginner: 'bg-green-500',
  Intermediate: 'bg-yellow-500',
  Advanced: 'bg-red-500',
}

interface ProgramTemplatesProps {
  onSelectTemplate: (template: ProgramTemplate) => void
}

export function ProgramTemplates({ onSelectTemplate }: ProgramTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const filteredTemplates = programTemplates.filter(template => {
    if (selectedCategory && template.category !== selectedCategory) return false
    if (selectedDifficulty && template.difficulty !== selectedDifficulty) return false
    return true
  })

  const handleSelectTemplate = async (template: ProgramTemplate) => {
    if (template.id === 'calgary-barbell-16-week') {
      setIsLoading(true)
      try {
        onSelectTemplate(template)
      } catch (error) {
        console.error('Erreur lors du chargement du programme Calgary:', error)
        toast({
          title: 'Erreur',
          description: 'Impossible de charger le programme Calgary.',
          variant: 'destructive'
        })
      } finally {
        setIsLoading(false)
      }
    } else {
      onSelectTemplate(template)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => setSelectedCategory(null)}
        >
          Toutes les catégories
        </Button>
        {Array.from(new Set(programTemplates.map(t => t.category))).map(category => {
          const IconComponent = categoryIcons[category as keyof typeof categoryIcons]
          return (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
            >
              {IconComponent && <IconComponent className="h-4 w-4 mr-2" />}
              {category}
            </Button>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedDifficulty === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedDifficulty(null)}
        >
          Tous les niveaux
        </Button>
        {Array.from(new Set(programTemplates.map(t => t.difficulty))).map(difficulty => (
          <Button
            key={difficulty}
            variant={selectedDifficulty === difficulty ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDifficulty(difficulty === selectedDifficulty ? null : difficulty)}
          >
            {difficulty}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map(template => {
          const IconComponent = categoryIcons[template.category as keyof typeof categoryIcons] || Dumbbell

          return (
            <Dialog key={template.id}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <IconComponent className="h-5 w-5" />
                      <Badge>{template.difficulty}</Badge>
                    </div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      <div className="text-sm">Durée: {template.duration} semaines</div>
                      <div className="text-sm">Fréquence: {template.daysPerWeek} jours/semaine</div>
                      <div className="text-sm">Équipement: {template.equipment}</div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{template.name}</DialogTitle>
                  <DialogDescription>{template.description}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Détails du programme:</h4>
                    <ul className="list-disc pl-4 mt-2">
                      <li>Niveau: {template.difficulty}</li>
                      <li>Catégorie: {template.category}</li>
                      <li>Durée: {template.duration} semaines</li>
                      <li>Fréquence: {template.daysPerWeek} jours/semaine</li>
                      <li>Équipement nécessaire: {template.equipment}</li>
                      <li>Objectif: {template.goal}</li>
                    </ul>
                  </div>
                  <Button 
                    onClick={() => handleSelectTemplate(template)} 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Chargement...' : 'Utiliser ce template'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )
        })}
      </div>
    </div>
  )
} 