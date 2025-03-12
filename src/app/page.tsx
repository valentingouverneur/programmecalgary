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
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8 bg-card rounded-xl border shadow-lg p-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Programme Calgary Barbell
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Connectez-vous pour accéder à votre programme
            </p>
          </div>
          <AuthForm />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">
            Programme Calgary Barbell
          </h1>
          <Button variant="ghost" onClick={logout} className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Déconnexion
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Link 
            href="/workout"
            className="group relative overflow-hidden rounded-lg border bg-card p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex flex-col h-full">
              <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                Entraînement du Jour
              </h2>
              <p className="mt-2 text-muted-foreground">
                Accédez à votre programme d'entraînement quotidien et suivez vos progrès.
              </p>
            </div>
          </Link>

          <Link 
            href="/settings"
            className="group relative overflow-hidden rounded-lg border bg-card p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex flex-col h-full">
              <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                Paramètres
              </h2>
              <p className="mt-2 text-muted-foreground">
                Configurez vos 1RMs et personnalisez votre expérience.
              </p>
            </div>
          </Link>

          <Link 
            href="/history"
            className="group relative overflow-hidden rounded-lg border bg-card p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex flex-col h-full">
              <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                Historique
              </h2>
              <p className="mt-2 text-muted-foreground">
                Consultez vos performances passées et suivez votre progression.
              </p>
            </div>
          </Link>

          <Link 
            href="/program"
            className="group relative overflow-hidden rounded-lg border bg-card p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex flex-col h-full">
              <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                Programme Complet
              </h2>
              <p className="mt-2 text-muted-foreground">
                Visualisez et modifiez votre programme d'entraînement.
              </p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
} 