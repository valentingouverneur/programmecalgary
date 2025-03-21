import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface WorkoutHistoryDialogProps {
  open: boolean
  onClose: () => void
  workouts: Array<{
    date: Date
    week: number
    day: number
    stats: {
      totalSets: number
      totalVolume: number
    }
  }>
  onSelectWorkout: (date: Date) => void
}

export function WorkoutHistoryDialog({
  open,
  onClose,
  workouts,
  onSelectWorkout
}: WorkoutHistoryDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date>()

  // Créer un tableau des dates avec des workouts
  const workoutDates = workouts.map(w => w.date)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Historique des entraînements</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date)
              if (date) {
                onSelectWorkout(date)
              }
            }}
            modifiers={{ workout: workoutDates }}
            modifiersStyles={{
              workout: { backgroundColor: "#6366F1", color: "white", borderRadius: "4px" }
            }}
            locale={fr}
          />
        </div>
        {selectedDate && (
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">
              {format(selectedDate, "d MMMM yyyy", { locale: fr })}
            </h3>
            {workouts.find(w => w.date.toDateString() === selectedDate.toDateString()) && (
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Volume total: {workouts.find(w => w.date.toDateString() === selectedDate.toDateString())?.stats.totalVolume} kg</p>
                <p>Séries complétées: {workouts.find(w => w.date.toDateString() === selectedDate.toDateString())?.stats.totalSets}</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 