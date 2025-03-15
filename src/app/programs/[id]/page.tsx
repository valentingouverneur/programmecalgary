import { Suspense } from 'react'
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout'
import { EditProgramClient } from '@/components/program/EditProgramClient'

export default function EditProgramPage({ params }: { params: { id: string } }) {
  return (
    <AuthenticatedLayout>
      <Suspense fallback={<div className="container py-6">Chargement...</div>}>
        <EditProgramClient programId={params.id} />
      </Suspense>
    </AuthenticatedLayout>
  )
} 