'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { AuthForm } from '@/components/auth/AuthForm'
import { Button } from '@/components/ui/button'
import { Timer, Check, MoreVertical, PlayCircle, Dumbbell, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'

export default function Home() {
  const { user, logout } = useAuth()
  const [timer, setTimer] = useState('00:00')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(checkAuth)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366F1]"></div>
      </div>
    )
  }

  if (!user) {
    return (
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
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Séance en cours</h2>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Timer className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Check className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <div>
                  <h3 className="font-medium">Squat</h3>
                  <p className="text-sm text-muted-foreground">3 séries × 5 répétitions</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input type="number" className="w-20" placeholder="0" />
                  <span className="text-sm text-muted-foreground">kg</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Timer</h2>
              <div className="text-2xl font-mono">{timer}</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="h-12">1:00</Button>
              <Button variant="outline" className="h-12">2:00</Button>
              <Button variant="outline" className="h-12">3:00</Button>
              <Button variant="outline" className="h-12">5:00</Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/dashboard" className="bg-card hover:bg-accent hover:text-accent-foreground transition-colors rounded-2xl p-6 flex items-center gap-4">
            <PlayCircle className="h-6 w-6" />
            <div>
              <h3 className="font-medium">Commencer une séance</h3>
              <p className="text-sm text-muted-foreground">Suivre votre programme</p>
            </div>
          </Link>

          <Link href="/dashboard" className="bg-card hover:bg-accent hover:text-accent-foreground transition-colors rounded-2xl p-6 flex items-center gap-4">
            <Dumbbell className="h-6 w-6" />
            <div>
              <h3 className="font-medium">Exercices</h3>
              <p className="text-sm text-muted-foreground">Gérer vos exercices</p>
            </div>
          </Link>

          <Link href="/dashboard" className="bg-card hover:bg-accent hover:text-accent-foreground transition-colors rounded-2xl p-6 flex items-center gap-4">
            <User className="h-6 w-6" />
            <div>
              <h3 className="font-medium">Profil</h3>
              <p className="text-sm text-muted-foreground">Gérer vos paramètres</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
} 