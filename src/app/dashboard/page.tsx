'use client'

import { useState } from 'react'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { Button } from '@/components/ui/button'
import { Timer, Check, MoreVertical, PlayCircle, Dumbbell, User, ChevronDown } from 'lucide-react'
import { ProgramsTab } from '@/components/dashboard/ProgramsTab'
import { SettingsTab } from '@/components/dashboard/SettingsTab'
import { Header } from '@/components/layout/Header'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('programs')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const renderTab = () => {
    switch (activeTab) {
      case 'programs':
        return <ProgramsTab />
      case 'exercises':
        return <div>Exercices</div>
      case 'stats':
        return <div>Statistiques</div>
      case 'settings':
        return <SettingsTab />
      default:
        return null
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              className="md:hidden w-full flex items-center justify-between mb-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              Menu
              <ChevronDown className={`h-4 w-4 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
            </Button>

            {/* Sidebar */}
            <div className={`w-full md:w-64 space-y-2 ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}>
              <Button
                variant={activeTab === 'programs' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab('programs')
                  setIsMobileMenuOpen(false)
                }}
              >
                <Dumbbell className="h-4 w-4 mr-2" />
                Programmes
              </Button>
              <Button
                variant={activeTab === 'exercises' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab('exercises')
                  setIsMobileMenuOpen(false)
                }}
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                Exercices
              </Button>
              <Button
                variant={activeTab === 'stats' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab('stats')
                  setIsMobileMenuOpen(false)
                }}
              >
                <Timer className="h-4 w-4 mr-2" />
                Statistiques
              </Button>
              <Button
                variant={activeTab === 'settings' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab('settings')
                  setIsMobileMenuOpen(false)
                }}
              >
                <User className="h-4 w-4 mr-2" />
                Paramètres
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1">
              {renderTab()}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
} 