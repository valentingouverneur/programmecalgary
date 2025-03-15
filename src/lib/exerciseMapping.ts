export const exerciseMapping: Record<string, string> = {
  // Squat et ses variantes
  'squat': 'Squat',
  'competition squat': 'Squat',
  'pause squat': 'Squat',
  'tempo squat': 'Squat',
  'paused squat': 'Squat',
  'comp squat': 'Squat',
  '2 count pause squat': 'Squat',
  '3 count pause squat': 'Squat',
  '2-3 count pause squat': 'Squat',
  '2 second pause squat': 'Squat',
  '3 second pause squat': 'Squat',
  '2-3 second pause squat': 'Squat',
  'ssb pause squat': 'Squat',
  'pin squat': 'Squat',
  'pin squat (depth)': 'Squat',
  '2ct pause squat': 'Squat',
  
  // Bench press et ses variantes
  'bench press': 'Bench Press',
  'competition bench': 'Bench Press',
  'pause bench': 'Bench Press',
  'paused bench': 'Bench Press',
  'close grip bench': 'Bench Press',
  'comp bench': 'Bench Press',
  'tempo bench': 'Bench Press',
  'bench': 'Bench Press',
  '2 count pause bench': 'Bench Press',
  '3 count pause bench': 'Bench Press',
  '2-3 count pause bench': 'Bench Press',
  '2 second pause bench': 'Bench Press',
  '3 second pause bench': 'Bench Press',
  '2-3 second pause bench': 'Bench Press',
  'competition pause bench': 'Bench Press',
  'spoto press': 'Bench Press',
  'pin press': 'Bench Press',
  'touch and go bench': 'Bench Press',
  'rep bench (touch and go)': 'Bench Press',
  '3ct pause bench': 'Bench Press',
  'bench with mini bands': 'Bench Press',
  
  // Deadlift et ses variantes
  'deadlift': 'Deadlift',
  'competition deadlift': 'Deadlift',
  'pause deadlift': 'Deadlift',
  'paused deadlift': 'Deadlift',
  'deficit deadlift': 'Deadlift',
  'comp deadlift': 'Deadlift',
  'tempo deadlift': 'Deadlift',
  '2 count pause deadlift': 'Deadlift',
  '3 count pause deadlift': 'Deadlift',
  '2-3 count pause deadlift': 'Deadlift',
  '2 second pause deadlift': 'Deadlift',
  '3 second pause deadlift': 'Deadlift',
  '2-3 second pause deadlift': 'Deadlift',
  '2ct pause deadlift': 'Deadlift',
  '2ct pause deadlift (floor)': 'Deadlift',
  'romanians': 'Deadlift',
  'romanian deadlift': 'Deadlift'
}

export function getMainExercise(exerciseName: string): string {
  const normalizedName = exerciseName.toLowerCase().trim()
  return exerciseMapping[normalizedName] || exerciseName
} 