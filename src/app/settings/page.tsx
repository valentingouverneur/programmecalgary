'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { ExerciseMaxes } from '@/components/settings/ExerciseMaxes'

export default function SettingsPage() {
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
        <ExerciseMaxes />
      </div>
    </div>
  )
} 