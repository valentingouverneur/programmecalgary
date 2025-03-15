'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import Link from 'next/link'
import { Program } from '@/types/program'
import { Plus } from 'lucide-react'
import { useActiveProgram } from '@/lib/hooks/useActiveProgram'
import { useToast } from '@/components/ui/use-toast'
import { initializeCalgaryProgram } from '@/lib/firebase/programs'

export default function ProgramsPage() {
  const { user } = useAuth()
  const { activeProgram, setUserActiveProgram } = useActiveProgram()
  const [programs, setPrograms] = useState<(Program & { id: string })[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchPrograms = async () => {
    if (!user) return

    try {
      const q = query(collection(db, 'programs'), where('createdBy', '==', user.uid))
      const querySnapshot = await getDocs(q)
      const programsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as (Program & { id: string })[]
      setPrograms(programsData)
    } catch (error) {
      console.error('Erreur lors de la récupération des programmes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrograms()
  }, [user])

  const handleSetActive = async (programId: string) => {
    try {
      await setUserActiveProgram(programId)
      toast({
        title: "Programme actif mis à jour",
        description: "Le programme a été défini comme actif avec succès.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du programme actif.",
      })
    }
  }

  const handleInitializeCalgary = async () => {
    if (!user) return

    try {
      const programId = await initializeCalgaryProgram(user.uid)
      await handleSetActive(programId)
      toast({
        title: "Programme Calgary initialisé",
        description: "Le programme Calgary a été créé et défini comme actif.",
      })
      // Recharger la liste des programmes
      fetchPrograms()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'initialisation du programme Calgary.",
      })
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Mes Programmes</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleInitializeCalgary}>
                <Plus className="h-4 w-4 mr-2" />
                Initialiser Calgary
              </Button>
              <Link href="/programs/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un programme
                </Button>
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : programs.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">Vous n'avez pas encore créé de programme</p>
              <Link href="/programs/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer mon premier programme
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {programs.map(program => (
                <Card key={program.id} className="p-4">
                  <div className="flex flex-col h-full">
                    <h3 className="text-xl font-semibold mb-2">{program.name}</h3>
                    <p className="text-muted-foreground flex-grow">
                      {program.weeks.length} semaines, {program.weeks.reduce((acc, week) => acc + week.days.length, 0)} jours
                    </p>
                    <div className="flex gap-2 mt-4">
                      <Link href={`/programs/${program.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          Modifier
                        </Button>
                      </Link>
                      <Button
                        variant={program.id === activeProgram?.id ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => handleSetActive(program.id)}
                      >
                        {program.id === activeProgram?.id ? "Actif" : "Définir actif"}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  )
} 