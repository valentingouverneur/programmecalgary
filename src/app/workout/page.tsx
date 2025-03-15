'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function WorkoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const week = searchParams.get('week')
  const day = searchParams.get('day')

  useEffect(() => {
    if (!week || !day) {
      // Si pas de paramètres, rediriger vers la page principale
      router.push('/')
    }
  }, [week, day, router])

  // Rediriger vers la page principale avec les paramètres en état
  useEffect(() => {
    router.push('/')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366F1]"></div>
    </div>
  )
} 