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
          <h1 className="text-2xl font-bold mb-8">
            Programme Calgary Barbell
          </h1>
          <AuthForm />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center p-4 mb-8">
        <h1 className="text-2xl font-bold">
          Programme Calgary Barbell
        </h1>
        <Button variant="ghost" size="sm" onClick={logout} className="text-sm">
          <LogOut className="w-4 h-4 mr-2" />
          Déconnexion
        </Button>
      </div>

      <div className="px-4">
        <div className="grid gap-4 max-w-3xl mx-auto">
          <Link 
            href="/workout"
            className="block p-4 hover:bg-secondary rounded transition-colors"
          >
            <h2 className="text-lg font-medium mb-1">
              Entraînement du Jour
            </h2>
            <p className="text-sm text-muted-foreground">
              Accédez à votre programme d'entraînement quotidien et suivez vos progrès.
            </p>
          </Link>

          <Link 
            href="/settings"
            className="block p-4 hover:bg-secondary rounded transition-colors"
          >
            <h2 className="text-lg font-medium mb-1">
              Paramètres
            </h2>
            <p className="text-sm text-muted-foreground">
              Configurez vos 1RMs et personnalisez votre expérience.
            </p>
          </Link>

          <Link 
            href="/history"
            className="block p-4 hover:bg-secondary rounded transition-colors"
          >
            <h2 className="text-lg font-medium mb-1">
              Historique
            </h2>
            <p className="text-sm text-muted-foreground">
              Consultez vos performances passées et suivez votre progression.
            </p>
          </Link>

          <Link 
            href="/program"
            className="block p-4 hover:bg-secondary rounded transition-colors"
          >
            <h2 className="text-lg font-medium mb-1">
              Programme Complet
            </h2>
            <p className="text-sm text-muted-foreground">
              Visualisez et modifiez votre programme d'entraînement.
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
} 