'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/hooks/useAuth'
import { AuthForm } from '@/components/auth/AuthForm'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export default function Home() {
  const { user, logout } = useAuth()

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Programme Calgary Barbell
        </h1>
        <AuthForm />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">
          Programme Calgary Barbell
        </h1>
        <Button variant="ghost" onClick={logout}>
          <LogOut className="w-5 h-5 mr-2" />
          Déconnexion
        </Button>
      </div>
      
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