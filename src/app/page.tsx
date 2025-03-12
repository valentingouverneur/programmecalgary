'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { auth } from '@/lib/firebase'

export default function Home() {
  useEffect(() => {
    // Simple test de la configuration Firebase
    console.log('Firebase Auth initialized:', !!auth)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Programme Calgary Barbell
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Link 
          href="/workout"
          className="block p-6 bg-card hover:bg-card/90 rounded-lg shadow-lg transition-colors"
        >
          <h2 className="text-2xl font-semibold mb-2">Entraînement du Jour</h2>
          <p className="text-muted-foreground">
            Accédez à votre programme d'entraînement quotidien et suivez vos progrès.
          </p>
        </Link>

        <Link 
          href="/settings"
          className="block p-6 bg-card hover:bg-card/90 rounded-lg shadow-lg transition-colors"
        >
          <h2 className="text-2xl font-semibold mb-2">Paramètres</h2>
          <p className="text-muted-foreground">
            Configurez vos 1RMs et personnalisez votre expérience.
          </p>
        </Link>

        <Link 
          href="/history"
          className="block p-6 bg-card hover:bg-card/90 rounded-lg shadow-lg transition-colors"
        >
          <h2 className="text-2xl font-semibold mb-2">Historique</h2>
          <p className="text-muted-foreground">
            Consultez vos performances passées et suivez votre progression.
          </p>
        </Link>

        <Link 
          href="/program"
          className="block p-6 bg-card hover:bg-card/90 rounded-lg shadow-lg transition-colors"
        >
          <h2 className="text-2xl font-semibold mb-2">Programme Complet</h2>
          <p className="text-muted-foreground">
            Visualisez et modifiez votre programme d'entraînement.
          </p>
        </Link>
      </div>
    </div>
  )
} 