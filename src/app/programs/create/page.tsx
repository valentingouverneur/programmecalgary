'use client'

import { useState } from 'react'
import { ProgramEditor } from '@/components/program/ProgramEditor'
import { ProgramTemplates } from '@/components/program/ProgramTemplates'
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout'
import { useRouter } from 'next/navigation'
import { Program, ProgramTemplate } from '@/types/program'
import { v4 as uuidv4 } from 'uuid'
import { useAuth } from '@/lib/hooks/useAuth'

export default function CreateProgramPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<Program | null>(null)
  const router = useRouter()
  const { user } = useAuth()

  const handleSelectTemplate = (template: ProgramTemplate) => {
    const now = new Date().toISOString()
    setSelectedTemplate({
      ...template.program,
      id: uuidv4(),
      createdBy: user?.uid || 'system',
      createdAt: now,
      updatedAt: now,
      goal: template.goal,
      equipment: template.equipment
    })
  }

  const handleSave = () => {
    router.push('/dashboard')
  }

  if (selectedTemplate) {
    return (
      <AuthenticatedLayout>
        <div className="container py-6">
          <h1 className="text-2xl font-bold mb-6">Créer un programme</h1>
          <ProgramEditor initialProgram={selectedTemplate} onSave={handleSave} />
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Créer un programme</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Partir d'un template</h2>
            <ProgramTemplates onSelectTemplate={handleSelectTemplate} />
          </section>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Ou</span>
            </div>
          </div>

          <section>
            <h2 className="text-xl font-semibold mb-4">Créer un programme vide</h2>
            <ProgramEditor onSave={handleSave} />
          </section>
        </div>
      </div>
    </AuthenticatedLayout>
  )
} 