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
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-8 text-center">
            Programme Calgary Barbell
          </h1>
          <div className="bg-card rounded-2xl p-6">
            <AuthForm />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 bg-background/80 backdrop-blur-sm border-b z-50">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-xl font-semibold">
            Programme Calgary Barbell
          </h1>
          <Button variant="ghost" size="sm" onClick={logout} className="text-sm">
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </header>

      <main className="container max-w-lg mx-auto p-4 space-y-4">
        <Link 
          href="/workout"
          className="block bg-card rounded-2xl p-4 hover:bg-muted/50 transition-colors"
        >
          <h2 className="text-base font-medium">
            Entraînement du Jour
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Accédez à votre programme d'entraînement quotidien
          </p>
        </Link>

        <Link 
          href="/settings"
          className="block bg-card rounded-2xl p-4 hover:bg-muted/50 transition-colors"
        >
          <h2 className="text-base font-medium">
            Paramètres
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configurez vos 1RMs
          </p>
        </Link>

        <Link 
          href="/history"
          className="block bg-card rounded-2xl p-4 hover:bg-muted/50 transition-colors"
        >
          <h2 className="text-base font-medium">
            Historique
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Consultez vos performances passées
          </p>
        </Link>

        <Link 
          href="/program"
          className="block bg-card rounded-2xl p-4 hover:bg-muted/50 transition-colors"
        >
          <h2 className="text-base font-medium">
            Programme Complet
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Visualisez votre programme d'entraînement
          </p>
        </Link>
      </main>
    </div>
  )
} 