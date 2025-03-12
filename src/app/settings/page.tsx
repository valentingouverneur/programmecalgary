'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { UserSettings } from '@/lib/types'

// Mock data - à remplacer par les données réelles
const mockSettings: UserSettings = {
  id: '1',
  userId: '1',
  oneRepMaxes: {
    squat: 140,
    bench: 100,
    deadlift: 180,
  },
  preferredUnits: 'KG',
  restTimerDuration: 180,
}

const mainLifts = [
  { id: 'squat', name: 'Squat' },
  { id: 'bench', name: 'Bench Press' },
  { id: 'deadlift', name: 'Deadlift' },
]

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>(mockSettings)

  const handleOneRmChange = (exerciseId: string, value: string) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      setSettings(prev => ({
        ...prev,
        oneRepMaxes: {
          ...prev.oneRepMaxes,
          [exerciseId]: numValue
        }
      }))
    }
  }

  const handleUnitChange = (unit: 'KG' | 'LB') => {
    setSettings(prev => ({
      ...prev,
      preferredUnits: unit
    }))
  }

  const handleRestTimeChange = (seconds: number) => {
    setSettings(prev => ({
      ...prev,
      restTimerDuration: seconds
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-4">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Paramètres</h1>
      </div>

      <div className="max-w-2xl mx-auto space-y-8">
        <section className="bg-card rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">1 Rep Max</h2>
          <div className="space-y-4">
            {mainLifts.map(lift => (
              <div key={lift.id} className="flex items-center justify-between">
                <label htmlFor={lift.id} className="font-medium">
                  {lift.name}
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    id={lift.id}
                    value={settings.oneRepMaxes[lift.id] || ''}
                    onChange={(e) => handleOneRmChange(lift.id, e.target.value)}
                    className="w-24 px-3 py-1 rounded border border-input bg-background"
                  />
                  <span className="text-sm text-muted-foreground">
                    {settings.preferredUnits}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-card rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Préférences</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Unités</h3>
              <div className="flex space-x-2">
                <Button
                  variant={settings.preferredUnits === 'KG' ? 'default' : 'outline'}
                  onClick={() => handleUnitChange('KG')}
                >
                  KG
                </Button>
                <Button
                  variant={settings.preferredUnits === 'LB' ? 'default' : 'outline'}
                  onClick={() => handleUnitChange('LB')}
                >
                  LB
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Temps de repos par défaut</h3>
              <div className="flex space-x-2">
                {[60, 120, 180, 240, 300].map(seconds => (
                  <Button
                    key={seconds}
                    variant={settings.restTimerDuration === seconds ? 'default' : 'outline'}
                    onClick={() => handleRestTimeChange(seconds)}
                  >
                    {seconds / 60}min
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <Button
            size="lg"
            onClick={() => {
              // Sauvegarder les paramètres
              console.log('Saving settings:', settings)
            }}
          >
            Sauvegarder
          </Button>
        </div>
      </div>
    </div>
  )
} 