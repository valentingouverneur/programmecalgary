'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { Program } from '@/types/program'
import { ProgramEditor } from '@/components/program/ProgramEditor'
import { AuthForm } from '@/components/auth/AuthForm'

interface EditProgramClientProps {
  programId: string
}

export function EditProgramClient({ programId }: EditProgramClientProps) {
  const [program, setProgram] = useState<Program | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { user, loading, initialized } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchProgram = async () => {
      if (!initialized) return
      
      if (!user) {
        setError("Vous devez être connecté pour accéder à cette page")
        return
      }

      try {
        const programRef = doc(db, 'programs', programId)
        const programDoc = await getDoc(programRef)

        if (!programDoc.exists()) {
          setError("Ce programme n'existe pas")
          return
        }

        const programData = programDoc.data() as Program
        setProgram({
          ...programData,
          id: programId
        })
      } catch (err) {
        console.error('Erreur lors de la récupération du programme:', err)
        setError("Erreur lors de la récupération du programme")
      }
    }

    fetchProgram()
  }, [user, programId, initialized])

  const handleSave = () => {
    router.push('/dashboard')
  }

  if (loading || !initialized) {
    return (
      <div className="container py-6">
        <div>Chargement...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-roboto-mono text-2xl md:text-4xl tracking-[.15em] md:tracking-[.25em] uppercase font-bold text-center mb-8">
          STUDIO 101
        </h1>
        <AuthForm />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-6">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  if (!program) {
    return (
      <div className="container py-6">
        <div>Chargement...</div>
      </div>
    )
  }

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Modifier le programme</h1>
      <ProgramEditor initialProgram={program} onSave={handleSave} />
    </div>
  )
} 