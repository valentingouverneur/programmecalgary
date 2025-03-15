'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { AuthForm } from '@/components/auth/AuthForm'
import { WorkoutContent } from '@/components/workout/WorkoutContent'

export default function WorkoutPage() {
  const { user, loading, initialized } = useAuth()

  // Afficher le loader tant que l'authentification n'est pas initialisée
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366F1]"></div>
      </div>
    )
  }

  // Une fois initialisé, afficher le contenu approprié
  return (
    <>
      {!user ? (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-sm">
            <h1 className="font-roboto-mono text-2xl md:text-4xl tracking-[.15em] md:tracking-[.25em] uppercase font-bold text-center mb-8">
              STUDIO 101
            </h1>
            <div className="bg-card rounded-2xl p-6">
              <AuthForm />
            </div>
          </div>
        </div>
      ) : (
        <WorkoutContent user={user} />
      )}
    </>
  )
} 