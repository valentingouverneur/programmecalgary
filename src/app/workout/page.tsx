'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { AuthForm } from '@/components/auth/AuthForm'
import { Button } from '@/components/ui/button'
import { Timer, Check, MoreVertical, PlayCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'

export default function WorkoutPage() {
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
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center p-4 bg-white border-b">
          <div className="flex items-center space-x-2">
            <PlayCircle className="w-6 h-6" />
            <span className="text-lg">{timer}</span>
          </div>
          <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white">
            Finish
          </Button>
        </div>

        <main className="p-4 pb-24">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold mb-1">Programme Calgary Barbell</h1>
            <p className="text-gray-500">Semaine 1 · Jour 1</p>
            <div className="mt-4">
              <Input 
                placeholder="Add notes here..." 
                className="w-full bg-gray-50 border-gray-200"
              />
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium flex items-center">
                  <span className="text-[#6366F1] mr-2">1</span>
                  Bench Press (Barbell)
                </h2>
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </div>

              <div className="bg-white rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="text-sm text-gray-500">
                      <th className="text-left p-4">Set</th>
                      <th className="text-left p-4">Previous</th>
                      <th className="text-left p-4">Target</th>
                      <th className="text-left p-4">kg</th>
                      <th className="text-left p-4">Reps</th>
                      <th className="w-10 p-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3].map((set) => (
                      <tr key={set} className="border-t">
                        <td className="p-4">{set}</td>
                        <td className="p-4">75 kg × 5</td>
                        <td className="p-4">8-10 reps</td>
                        <td className="p-4">
                          <Input className="w-20" />
                        </td>
                        <td className="p-4">
                          <Input className="w-20" />
                        </td>
                        <td className="p-4">
                          <div className="w-6 h-6 rounded-full border-2 border-gray-200 flex items-center justify-center">
                            <Check className="w-4 h-4 text-gray-400" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button className="w-full p-4 text-center text-gray-500 hover:bg-gray-50 border-t">
                  + Add Set
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium flex items-center">
                  <span className="text-[#6366F1] mr-2">2</span>
                  Shoulder Press (Machine)
                </h2>
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </div>

              <div className="bg-white rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="text-sm text-gray-500">
                      <th className="text-left p-4">Set</th>
                      <th className="text-left p-4">Previous</th>
                      <th className="text-left p-4">Target</th>
                      <th className="text-left p-4">kg</th>
                      <th className="text-left p-4">Reps</th>
                      <th className="w-10 p-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3].map((set) => (
                      <tr key={set} className="border-t">
                        <td className="p-4">{set}</td>
                        <td className="p-4">-</td>
                        <td className="p-4">10-12 reps</td>
                        <td className="p-4">
                          <Input className="w-20" />
                        </td>
                        <td className="p-4">
                          <Input className="w-20" />
                        </td>
                        <td className="p-4">
                          <div className="w-6 h-6 rounded-full border-2 border-gray-200 flex items-center justify-center">
                            <Check className="w-4 h-4 text-gray-400" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button className="w-full p-4 text-center text-gray-500 hover:bg-gray-50 border-t">
                  + Add Set
                </button>
              </div>
            </div>
          </div>
        </main>

        <div className="fixed bottom-0 left-0 right-0">
          <div className="max-w-3xl mx-auto">
            <div className="p-4 bg-white border-t">
              <Button variant="outline" className="w-full flex items-center justify-center space-x-2 text-[#6366F1] border-[#6366F1]">
                <Timer className="w-5 h-5" />
                <span>Rest Timer</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 