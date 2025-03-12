'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { AuthForm } from '@/components/auth/AuthForm'
import { Dumbbell, User } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function DashboardPage() {
  const { user, logout } = useAuth()
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
    <div className="min-h-screen bg-background select-none">
      <div className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex justify-between items-center h-14">
            <Link href="/" className="flex items-center space-x-2 text-[#6366F1]">
              <Dumbbell className="w-6 h-6" />
              <span className="font-medium">Calgary Barbell</span>
            </Link>
            <div className="flex items-center space-x-2 text-gray-600">
              <User className="w-5 h-5" />
              <span>Dashboard</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-8">Dashboard</h1>
        <div className="bg-white rounded-lg p-6">
          <p className="text-gray-500">Contenu du dashboard à venir...</p>
        </div>
      </div>
    </div>
  )
} 