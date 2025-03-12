import { useState, useEffect } from 'react'
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from '../firebase'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      // Pour le développement, permettre une connexion sans email complet
      const formattedEmail = email.includes('@') ? email : `${email}@test.com`
      
      const userCredential = await signInWithEmailAndPassword(auth, formattedEmail, password)
      return userCredential.user
    } catch (error) {
      console.error('Erreur de connexion:', error)
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      // Pour le développement, permettre une création sans email complet
      const formattedEmail = email.includes('@') ? email : `${email}@test.com`
      
      const userCredential = await createUserWithEmailAndPassword(auth, formattedEmail, password)
      return userCredential.user
    } catch (error) {
      console.error('Erreur d\'inscription:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Erreur de déconnexion:', error)
      throw error
    }
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    logout,
  }
} 