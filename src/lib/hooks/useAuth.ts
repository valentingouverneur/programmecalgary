import { useState, useEffect } from 'react'
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from '../firebase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    console.log('useAuth: Initialisation du listener d\'authentification')
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('useAuth: État de l\'authentification changé: Utilisateur connecté', user.uid)
        // Forcer le rafraîchissement du token
        try {
          await user.getIdToken(true)
          setUser(user)
        } catch (error) {
          console.error('useAuth: Erreur lors du rafraîchissement du token:', error)
          setUser(null)
        }
      } else {
        console.log('useAuth: État de l\'authentification changé: Aucun utilisateur')
        setUser(null)
      }
      setLoading(false)
      setInitialized(true)
    })

    return () => {
      console.log('useAuth: Nettoyage du listener d\'authentification')
      unsubscribe()
    }
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
    initialized,
    signIn,
    signUp,
    logout,
  }
} 