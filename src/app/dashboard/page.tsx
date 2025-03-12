'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { AuthForm } from '@/components/auth/AuthForm'
import { Dumbbell, User, BarChart3, Dumbbell as Exercise, Calendar, Settings } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('programs')

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

  const tabs = [
    { id: 'programs', label: 'Programmes', icon: Calendar },
    { id: 'exercises', label: 'Exercices', icon: Exercise },
    { id: 'stats', label: 'Statistiques', icon: BarChart3 },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-background select-none">
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex justify-between items-center h-14">
            <Link href="/" className="flex items-center space-x-2 text-[#6366F1]">
              <Dumbbell className="w-6 h-6" />
              <span className="font-medium">Calgary Barbell</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{user.email}</span>
              <Button variant="ghost" size="sm" onClick={logout}>
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          {activeTab === 'programs' && (
            <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white">
              Nouveau Programme
            </Button>
          )}
          {activeTab === 'exercises' && (
            <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white">
              Nouvel Exercice
            </Button>
          )}
        </div>

        <div className="bg-white rounded-lg overflow-hidden">
          <div className="border-b">
            <div className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium ${
                      activeTab === tab.id
                        ? 'text-[#6366F1] border-b-2 border-[#6366F1]'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'programs' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Programme Calgary Barbell</h3>
                    <p className="text-sm text-gray-500">16 semaines · 4 jours par semaine</p>
                  </div>
                  <Button variant="outline">Modifier</Button>
                </div>
              </div>
            )}

            {activeTab === 'exercises' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Bench Press</h3>
                    <p className="text-sm text-gray-500">Barbell · Push</p>
                  </div>
                  <Button variant="outline">Modifier</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Shoulder Press</h3>
                    <p className="text-sm text-gray-500">Machine · Push</p>
                  </div>
                  <Button variant="outline">Modifier</Button>
                </div>
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="text-gray-500">
                Statistiques d'utilisation à venir...
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Paramètres du compte</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={user.email || ''}
                        disabled
                        className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 