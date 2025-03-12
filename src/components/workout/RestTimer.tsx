import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Timer, Pause, Play, RotateCcw } from 'lucide-react'

interface RestTimerProps {
  duration: number // in seconds
  onComplete: () => void
}

export const RestTimer = ({ duration, onComplete }: RestTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            clearInterval(interval)
            onComplete()
            return 0
          }
          return time - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, onComplete])

  const handleReset = () => {
    setTimeLeft(duration)
    setIsActive(true)
  }

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed bottom-4 right-4 bg-card rounded-lg shadow-lg p-4 flex flex-col items-center space-y-4">
      <div className="flex items-center space-x-2">
        <Timer className="w-5 h-5" />
        <span className="text-2xl font-mono">{formatTime(timeLeft)}</span>
      </div>

      <div className="flex space-x-2">
        <Button
          size="sm"
          variant="outline"
          onClick={toggleTimer}
          aria-label={isActive ? 'Pause' : 'Play'}
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={handleReset}
          aria-label="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
} 