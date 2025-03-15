'use client'

import { Header } from '@/components/layout/Header'

interface AuthenticatedLayoutProps {
  children: React.ReactNode
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {children}
    </div>
  )
} 