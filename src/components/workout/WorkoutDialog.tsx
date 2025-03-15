import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface IncompleteSet {
  exerciseName: string
  setsRemaining: number
}

interface WorkoutDialogProps {
  open: boolean
  onClose: () => void
  incompleteSets?: IncompleteSet[]
  onContinue?: () => void
  onSkip?: () => void
  onFinish: () => void
  isFinishDialog?: boolean
  workoutSummary?: {
    duration: string
    totalSets: number
    totalVolume: number
    personalRecords: Array<{
      exerciseName: string
      type: 'weight' | 'reps' | 'volume'
      value: number
    }>
  }
}

export function WorkoutDialog({
  open,
  onClose,
  incompleteSets,
  onContinue,
  onSkip,
  onFinish,
  isFinishDialog,
  workoutSummary
}: WorkoutDialogProps) {
  if (isFinishDialog && workoutSummary) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Entraînement terminé ! 🎉</DialogTitle>
            <DialogDescription>
              Résumé de votre séance
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Durée totale</p>
              <p className="text-sm text-muted-foreground">{workoutSummary.duration}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Séries complétées</p>
              <p className="text-sm text-muted-foreground">{workoutSummary.totalSets} séries</p>
            </div>
            <div>
              <p className="text-sm font-medium">Volume total</p>
              <p className="text-sm text-muted-foreground">{workoutSummary.totalVolume} kg</p>
            </div>
            {workoutSummary.personalRecords.length > 0 && (
              <div>
                <p className="text-sm font-medium">Nouveaux records personnels</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {workoutSummary.personalRecords.map((record, index) => (
                    <li key={index}>
                      {record.exerciseName}: {record.value}kg ({record.type})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Voir les détails
            </Button>
            <Button
              onClick={onFinish}
              className="bg-[#6366F1] hover:bg-[#6366F1]/90"
            >
              Passer au jour suivant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Séries incomplètes</DialogTitle>
          <DialogDescription>
            Il reste des séries non complétées
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {incompleteSets && (
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              {incompleteSets.map((exercise, index) => (
                <li key={index}>
                  {exercise.exerciseName}: {exercise.setsRemaining} séries restantes
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Button
            variant="outline"
            onClick={onContinue}
            size="sm"
          >
            Continuer
          </Button>
          <Button
            variant="outline"
            onClick={onSkip}
            size="sm"
          >
            Skip séries
          </Button>
          <Button
            onClick={onFinish}
            size="sm"
            className="bg-[#6366F1] hover:bg-[#6366F1]/90"
          >
            Terminer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 