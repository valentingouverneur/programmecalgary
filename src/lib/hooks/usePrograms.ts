import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import { db } from '../firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { Program } from '@/types/program'

interface ProgramWithId extends Program {
  id: string
  createdAt: string
  updatedAt: string
  createdBy: string
}

export function usePrograms() {
  const { user, initialized } = useAuth()
  const [programs, setPrograms] = useState<ProgramWithId[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const fetchPrograms = useCallback(async () => {
    try {
      if (!initialized) {
        console.log('usePrograms: En attente de l\'initialisation de l\'authentification')
        return
      }

      if (!user) {
        console.log('usePrograms: Aucun utilisateur connecté')
        setPrograms([])
        setLoading(false)
        setError(null)
        return
      }

      setLoading(true)
      console.log('usePrograms: Début du chargement des programmes pour', user.uid)
      
      const token = await user.getIdToken(true)
      console.log('usePrograms: Token rafraîchi:', token.substring(0, 20) + '...')
      
      const programsRef = collection(db, 'programs')
      const q = query(programsRef, where('createdBy', '==', user.uid))
      const querySnapshot = await getDocs(q)
      
      const programsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ProgramWithId[]
      
      console.log('usePrograms: Programmes chargés avec succès:', programsData.length)
      
      setPrograms(programsData)
      setError(null)
    } catch (error) {
      console.error('usePrograms: Erreur lors de la récupération des programmes:', error)
      setError(error instanceof Error ? error.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }, [user, initialized])

  useEffect(() => {
    if (initialized) {
      fetchPrograms()
    }
  }, [initialized, refreshTrigger, fetchPrograms])

  const refresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1)
  }, [])

  return { programs, loading, error, refresh }
} 