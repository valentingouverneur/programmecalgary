import { utils, write, read } from 'xlsx'
import type { Program, Week, Day, Exercise } from '@/types/program'
import fs from 'fs'
import path from 'path'

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

export function importCalgaryProgram(): Program {
  // Lire le fichier Excel
  const filePath = path.join(process.cwd(), 'Copie de Calgary Barbell 16 Week (Revised) LB + KG _ LiftVault.com.xlsx')
  const fileData = fs.readFileSync(filePath)
  const workbook = read(fileData)
  
  const weeks: Week[] = []
  let currentWeek = 1
  
  // Pour chaque bloc de semaines
  const weekBlocks = ['Weeks 1-4', 'Weeks 5-8', 'Weeks 9-11', 'Weeks 12-15']
  weekBlocks.forEach(blockName => {
    const worksheet = workbook.Sheets[blockName]
    if (!worksheet) {
      throw new Error(`Feuille manquante: ${blockName}`)
    }
    
    const rawData = utils.sheet_to_json<any>(worksheet, { header: 'A' })
    
    // Trouver les colonnes pour chaque semaine
    const weekColumns: { [key: number]: string[] } = {}
    const headerRow = rawData[0]
    
    Object.entries(headerRow).forEach(([col, value]) => {
      if (value && typeof value === 'string' && value.toLowerCase().includes('week')) {
        const weekNum = parseInt(value.match(/\d+/)?.[0] || '0')
        if (!weekColumns[weekNum]) {
          weekColumns[weekNum] = []
        }
        weekColumns[weekNum].push(col)
      }
    })
    
    // Pour chaque semaine dans le bloc
    Object.keys(weekColumns).forEach(weekNumStr => {
      const weekNum = parseInt(weekNumStr)
      const columns = weekColumns[weekNum]
      const exercises: Exercise[] = []
      
      // Parcourir les lignes pour trouver les exercices
      for (let i = 2; i < rawData.length; i++) {
        const row = rawData[i]
        if (!row.A) continue // Ignorer les lignes vides
        
        const exercise: Exercise = {
          name: row.A,
          sets: parseInt(row.B) || 0,
          reps: row.C?.toString() || '',
          intensity: row.D ? parseInt(row.D) : undefined,
          notes: `${row.E || ''} ${row.F || ''} ${row.G || ''}`.trim()
        }
        
        if (exercise.name && exercise.name !== 'Exercise') {
          exercises.push(exercise)
        }
      }
      
      if (exercises.length > 0) {
        weeks.push({
          number: currentWeek,
          days: [{
            number: 1,
            exercises
          }]
        })
        currentWeek++
      }
    })
  })
  
  return {
    name: 'Programme Calgary Barbell',
    weeks
  }
} 