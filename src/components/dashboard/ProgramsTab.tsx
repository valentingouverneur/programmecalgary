'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ProgramEditor } from '@/components/program/ProgramEditor'
import { Program } from '@/types/program'
import { usePrograms } from '@/lib/hooks/usePrograms'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { db } from '@/lib/firebase'
import { doc, deleteDoc, getDoc, setDoc } from 'firebase/firestore'
import { useToast } from '@/components/ui/use-toast'

interface ProgramWithId extends Program {
  id: string
  createdAt: string
  updatedAt: string
  createdBy: string
}

export function ProgramsTab() {
  const router = useRouter()
  const { user } = useAuth()
  const { programs, loading, refresh } = usePrograms()
  const [isCreating, setIsCreating] = useState(false)
  const [programToDelete, setProgramToDelete] = useState<ProgramWithId | null>(null)
  const [activeProgram, setActiveProgram] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchActiveProgram = async () => {
      if (!user) return
      
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          const data = userDoc.data()
          setActiveProgram(data.activeProgram || null)
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du programme actif:', error)
      }
    }

    fetchActiveProgram()
  }, [user])

  const handleSetActiveProgram = async (programId: string) => {
    if (!user) return

    try {
      const userRef = doc(db, 'users', user.uid)
      const userDoc = await getDoc(userRef)
      const userData = userDoc.exists() ? userDoc.data() : {}

      if (activeProgram === programId) {
        // Désactiver le programme
        await setDoc(userRef, { ...userData, activeProgram: null }, { merge: true })
        setActiveProgram(null)
        toast({
          title: 'Programme désactivé',
          description: 'Le programme a été désactivé avec succès.',
        })
      } else {
        // Activer le programme
        await setDoc(userRef, { ...userData, activeProgram: programId }, { merge: true })
        setActiveProgram(programId)
        toast({
          title: 'Programme activé',
          description: 'Le programme a été défini comme actif avec succès.',
        })
      }
    } catch (error) {
      console.error('Erreur lors de la modification du programme actif:', error)
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la modification du programme actif.',
      })
    }
  }

  const handleEditProgram = (programId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/programs/${programId}`)
  }

  const handleDeleteClick = (program: ProgramWithId, e: React.MouseEvent) => {
    e.stopPropagation()
    setProgramToDelete(program)
  }

  const handleDeleteProgram = async () => {
    if (!programToDelete) return

    try {
      await deleteDoc(doc(db, 'programs', programToDelete.id))
      toast({
        title: 'Programme supprimé',
        description: 'Le programme a été supprimé avec succès.',
      })
      setProgramToDelete(null)
      refresh()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la suppression du programme.',
      })
    }
  }

  if (isCreating) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Créer un programme</h2>
          <Button variant="ghost" onClick={() => setIsCreating(false)}>
            Retour
          </Button>
        </div>
        <ProgramEditor onSave={() => {
          setIsCreating(false)
          refresh()
        }} />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {programs.map((program: ProgramWithId) => (
            <Card 
              key={program.id} 
              className="p-4 hover:bg-muted/50 transition-colors flex flex-col"
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <h3 className="text-xl font-semibold mb-2">{program.name}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>{program.weeks.length} semaines</span>
                    <span>•</span>
                    <span>{program.weeks.reduce((acc: number, week) => acc + week.days.length, 0)} jours</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleEditProgram(program.id, e)}
                    className="h-8 w-8"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleDeleteClick(program, e)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button
                className={`mt-4 w-full ${activeProgram === program.id ? 'border-primary text-primary' : ''}`}
                variant={activeProgram === program.id ? "outline" : "default"}
                onClick={(e) => {
                  e.stopPropagation()
                  handleSetActiveProgram(program.id)
                }}
              >
                {activeProgram === program.id ? "Programme actif" : "Définir comme actif"}
              </Button>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!programToDelete} onOpenChange={() => setProgramToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le programme</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le programme "{programToDelete?.name}" ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setProgramToDelete(null)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteProgram}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 