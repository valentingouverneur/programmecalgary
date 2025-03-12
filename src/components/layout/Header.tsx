'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { CircleUserRound, LogOut } from 'lucide-react'
import Link from 'next/link'

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <a href="/" className="flex items-center">
            <span className="font-roboto-mono text-lg md:text-2xl tracking-[.15em] md:tracking-[.25em] uppercase font-bold">STUDIO 101</span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {user && (
            <div className="flex items-center gap-2">
              <Link 
                href="/dashboard" 
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                title="Espace membre"
              >
                <CircleUserRound className="w-5 h-5 text-gray-600" />
              </Link>
              <button
                onClick={logout}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                title="Déconnexion"
              >
                <LogOut className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
} 