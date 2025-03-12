'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { AuthForm } from '@/components/auth/AuthForm'
import { Button } from '@/components/ui/button'
import { Timer, Check, MoreVertical, PlayCircle, Calculator, ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'

export default function Home() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [timer, setTimer] = useState('00:00')

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
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Header avec timer et bouton finish */}
        <div className="border-b">
          <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <PlayCircle className="h-5 w-5 mr-2" />
                00:00
              </Button>
            </div>
            <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white">
              Finish
            </Button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-2">Calgary Barbell (12 semaines)</h1>
            <p className="text-muted-foreground mb-6">Week 1 · Day 1</p>

            <div className="space-y-8">
              {/* Bench Press */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium flex items-center">
                    <span className="text-[#6366F1] mr-2">1</span>
                    <span className="text-[#6366F1]">Bench Press (Barbell)</span>
                  </h2>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>

                <div className="bg-card rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Set</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Previous</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Target</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">kg</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Reps</th>
                        <th className="text-center p-4 text-sm font-medium text-muted-foreground"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3].map((set) => (
                        <tr key={set} className="border-b last:border-0">
                          <td className="p-4">{set}</td>
                          <td className="p-4">75 kg × 5</td>
                          <td className="p-4">8-10 reps</td>
                          <td className="p-4">
                            <Input type="number" className="w-20" />
                          </td>
                          <td className="p-4">
                            <Input type="number" className="w-20" />
                          </td>
                          <td className="p-4 text-center">
                            <Button variant="ghost" size="sm" className="rounded-full">
                              <Check className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-4 bg-muted/50">
                    <Button variant="outline" className="w-full">
                      + Add Set
                    </Button>
                  </div>
                </div>
              </div>

              {/* Shoulder Press */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium flex items-center">
                    <span className="text-[#6366F1] mr-2">2</span>
                    <span className="text-[#6366F1]">Shoulder Press (Machine)</span>
                  </h2>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>

                <div className="bg-card rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Set</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Previous</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Target</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">kg</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Reps</th>
                        <th className="text-center p-4 text-sm font-medium text-muted-foreground"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3].map((set) => (
                        <tr key={set} className="border-b last:border-0">
                          <td className="p-4">{set}</td>
                          <td className="p-4">-</td>
                          <td className="p-4">10-12 reps</td>
                          <td className="p-4">
                            <Input type="number" className="w-20" />
                          </td>
                          <td className="p-4">
                            <Input type="number" className="w-20" />
                          </td>
                          <td className="p-4 text-center">
                            <Button variant="ghost" size="sm" className="rounded-full">
                              <Check className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-4 bg-muted/50">
                    <Button variant="outline" className="w-full">
                      + Add Set
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer avec boutons */}
        <div className="border-t p-4">
          <div className="max-w-7xl mx-auto">
            <Button variant="outline" className="w-full border-[#6366F1] text-[#6366F1]">
              <Timer className="h-5 w-5 mr-2" />
              Rest Timer
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 