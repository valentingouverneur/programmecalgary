import { utils, write, read } from 'xlsx'
import type { Program, Week, Day, Exercise } from '@/types/program'

const TEMPLATE_STRUCTURE = {
  headers: [
    'Exercice',
    'Sets',
    'Reps',
    'RPE',
    'Intensité (%)',
    'Notes'
  ],
  weeks: 16,
  daysPerWeek: 4
}

export function generateTemplate() {
  // Créer un nouveau workbook
  const wb = utils.book_new()
  
  // Pour chaque semaine
  for (let week = 1; week <= TEMPLATE_STRUCTURE.weeks; week++) {
    // Pour chaque jour
    for (let day = 1; day <= TEMPLATE_STRUCTURE.daysPerWeek; day++) {
      const wsName = `S${week}J${day}`
      const wsData = [
        TEMPLATE_STRUCTURE.headers,
        // Exemple d'exercice pré-rempli
        ['Squat', '', '5', '8', '75', 'Échauffement inclus'],
        // Lignes vides pour plus d'exercices
        ...Array(10).fill(Array(6).fill(''))
      ]
      
      const ws = utils.aoa_to_sheet(wsData)
      utils.book_append_sheet(wb, ws, wsName)
    }
  }
  
  // Générer le fichier
  const excelBuffer = write(wb, { bookType: 'xlsx', type: 'array' })
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
}

export function parseExcel(file: File): Promise<Program> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = read(data, { type: 'array' })
        
        const weeks: Week[] = []
        
        // Pour chaque feuille (S1J1, S1J2, etc.)
        for (let weekNum = 1; weekNum <= TEMPLATE_STRUCTURE.weeks; weekNum++) {
          const days: Day[] = []
          
          for (let dayNum = 1; dayNum <= TEMPLATE_STRUCTURE.daysPerWeek; dayNum++) {
            const sheetName = `S${weekNum}J${dayNum}`
            const worksheet = workbook.Sheets[sheetName]
            
            if (!worksheet) {
              throw new Error(`Feuille manquante: ${sheetName}`)
            }
            
            const rawData = utils.sheet_to_json<string[]>(worksheet, { header: 1 })
            const exercises: Exercise[] = rawData.slice(1) // Skip header
              .filter((row): row is string[] => Boolean(row?.[0])) // Filter empty rows
              .map(row => ({
                name: row[0] || '',
                sets: parseInt(row[1]) || 0,
                reps: row[2] || '',
                rpe: row[3] ? parseInt(row[3]) : undefined,
                intensity: row[4] ? parseInt(row[4]) : undefined,
                notes: row[5]
              }))
            
            days.push({
              number: dayNum,
              exercises
            })
          }
          
          weeks.push({
            number: weekNum,
            days
          })
        }
        
        resolve({
          name: 'Programme Calgary Barbell',
          weeks
        })
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'))
    reader.readAsArrayBuffer(file)
  })
} 