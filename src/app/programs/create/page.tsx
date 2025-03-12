'use client'

import { ProgramEditor } from '@/components/program/ProgramEditor'
import { AuthGuard } from '@/components/auth/AuthGuard'

export default function CreateProgramPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <ProgramEditor />
      </div>
    </AuthGuard>
  )
} 