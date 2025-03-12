'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Dumbbell } from 'lucide-react'

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <a href="/" className="flex items-center space-x-2">
            <Dumbbell className="h-6 w-6" />
            <span className="font-roboto-mono text-xl tracking-widest uppercase">STUDIO 101</span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <Button variant="ghost" size="sm" onClick={logout}>
                Déconnexion
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
} 