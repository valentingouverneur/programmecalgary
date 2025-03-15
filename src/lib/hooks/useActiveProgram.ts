import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { db } from '../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { Program } from '@/types/program'
import { ExerciseMax } from '@/types/user'

interface ActiveProgram extends Program {
  id: string
}

export function useActiveProgram() {
  const { user } = useAuth()
  const [activeProgram, setActiveProgram] = useState<ActiveProgram | null>(null)
  const [maxScores, setMaxScores] = useState<ExerciseMax[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setActiveProgram(null)
        setMaxScores([])
        setLoading(false)
        return
      }

      try {
        // Récupérer les maxima
        const maxScoresDoc = await getDoc(doc(db, 'maxScores', user.uid))
        if (maxScoresDoc.exists()) {
          setMaxScores(maxScoresDoc.data().exerciseMaxes || [])
        }

        // Récupérer le programme actif
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (!userDoc.exists()) return

        const activeProgramId = userDoc.data().activeProgram
        if (!activeProgramId) {
          setActiveProgram(null)
          return
        }

        const programDoc = await getDoc(doc(db, 'programs', activeProgramId))
        if (!programDoc.exists()) {
          setActiveProgram(null)
          return
        }

        setActiveProgram({
          id: programDoc.id,
          ...programDoc.data()
        } as ActiveProgram)
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const setUserActiveProgram = async (programId: string | null) => {
    if (!user) throw new Error('Utilisateur non connecté')

    try {
      await setDoc(doc(db, 'users', user.uid), {
        activeProgram: programId
      }, { merge: true })

      if (programId) {
        const programDoc = await getDoc(doc(db, 'programs', programId))
        if (programDoc.exists()) {
          setActiveProgram({
            id: programDoc.id,
            ...programDoc.data()
          } as ActiveProgram)
        }
      } else {
        setActiveProgram(null)
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du programme actif:', error)
      throw error
    }
  }

  return { activeProgram, maxScores, loading, setUserActiveProgram }
} 