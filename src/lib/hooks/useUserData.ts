import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from './useAuth'

export interface UserData {
  id: string
  email: string
  oneRepMaxes: {
    [key: string]: number
  }
  settings: {
    preferredUnits: 'KG' | 'LB'
    restTimerDuration: number
  }
}

export const useUserData = () => {
  const { user } = useAuth()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setUserData(null)
        setLoading(false)
        return
      }

      try {
        const userRef = doc(db, 'users', user.uid)
        const userDoc = await getDoc(userRef)

        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData)
        } else {
          // Créer un nouveau profil utilisateur
          const newUserData: UserData = {
            id: user.uid,
            email: user.email || '',
            oneRepMaxes: {},
            settings: {
              preferredUnits: 'KG',
              restTimerDuration: 180,
            },
          }
          await setDoc(userRef, newUserData)
          setUserData(newUserData)
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user])

  const updateUserData = async (data: Partial<UserData>) => {
    if (!user || !userData) return

    try {
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, data)
      setUserData(prev => prev ? { ...prev, ...data } : null)
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données:', error)
      throw error
    }
  }

  const updateOneRepMax = async (exerciseId: string, weight: number) => {
    if (!user || !userData) return

    try {
      const userRef = doc(db, 'users', user.uid)
      const update = {
        oneRepMaxes: {
          ...userData.oneRepMaxes,
          [exerciseId]: weight,
        },
      }
      await updateDoc(userRef, update)
      setUserData(prev => prev ? {
        ...prev,
        oneRepMaxes: {
          ...prev.oneRepMaxes,
          [exerciseId]: weight,
        },
      } : null)
    } catch (error) {
      console.error('Erreur lors de la mise à jour du 1RM:', error)
      throw error
    }
  }

  return {
    userData,
    loading,
    updateUserData,
    updateOneRepMax,
  }
} 