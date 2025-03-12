import { useState, useEffect } from 'react'
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
  const { user } = useAuth()
  const [programs, setPrograms] = useState<ProgramWithId[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPrograms = async () => {
      if (!user) return

      try {
        const q = query(collection(db, 'programs'), where('createdBy', '==', user.uid))
        const querySnapshot = await getDocs(q)
        const programsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ProgramWithId[]
        setPrograms(programsData)
      } catch (error) {
        console.error('Erreur lors de la récupération des programmes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPrograms()
  }, [user])

  return { programs, loading }
} 