'use client'

import { ExerciseMaxes } from '@/components/settings/ExerciseMaxes'

export function SettingsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Paramètres</h2>
      <ExerciseMaxes />
    </div>
  )
} 