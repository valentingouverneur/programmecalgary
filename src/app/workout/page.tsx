'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { AuthForm } from '@/components/auth/AuthForm'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import Link from 'next/link'

export default function WorkoutPage() {
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
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">
              Entraînement du Jour
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/settings">
              <Button variant="ghost" size="sm" className="text-sm">
                Paramètres
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={logout} className="text-sm">
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-lg mx-auto p-4">
        <div className="bg-card rounded-2xl p-6 mb-4">
          <h2 className="text-lg font-medium mb-4">Semaine 1 - Jour 1</h2>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-base font-medium">Squat</h3>
              <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span>Échauffement</span>
                  <span>5 × 60kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Série 1</span>
                  <span>5 × 80kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Série 2</span>
                  <span>5 × 90kg</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-medium">Bench Press</h3>
              <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span>Échauffement</span>
                  <span>5 × 40kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Série 1</span>
                  <span>5 × 60kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Série 2</span>
                  <span>5 × 70kg</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Link href="/history">
            <Button variant="outline">Historique</Button>
          </Link>
          <Link href="/program">
            <Button variant="outline">Programme Complet</Button>
          </Link>
        </div>
      </main>
    </div>
  )
} 