import { utils, write, read } from 'xlsx'
import type { Program, Week, Day, Exercise } from '@/types/program'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

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
                intensity: parseInt(row[4]) || 0,
                notes: row[5] || '',
                weight: row[4] ? {
                  type: 'percentage' as const,
                  value: parseInt(row[4]) || 0
                } : undefined
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
          id: uuidv4(),
          name: 'Programme Calgary Barbell',
          description: 'Programme de powerlifting sur 16 semaines',
          goal: 'Force et powerlifting',
          equipment: 'Barbell, rack, bench',
          weeks,
          createdBy: 'system',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'))
    reader.readAsArrayBuffer(file)
  })
}

interface ExcelRow {
  __EMPTY?: string
  __EMPTY_1?: string
  __EMPTY_2?: string
  __EMPTY_3?: string
  __EMPTY_4?: string
  __EMPTY_5?: string
  __EMPTY_6?: string
  __EMPTY_7?: string
  __EMPTY_8?: string
  __EMPTY_9?: string
  __EMPTY_10?: string
  __EMPTY_11?: string
  __EMPTY_12?: string
  __EMPTY_13?: string
  __EMPTY_14?: string
  __EMPTY_15?: string
  __EMPTY_16?: string
  __EMPTY_17?: string
  __EMPTY_18?: string
  __EMPTY_19?: string
  __EMPTY_20?: string
  __EMPTY_21?: string
  __EMPTY_22?: string
  __EMPTY_23?: string
  __EMPTY_24?: string
  [key: string]: any
}

export async function importCalgaryProgram(): Promise<Program> {
  try {
    console.log('Début de l\'importation du programme Calgary')
    
    // Utiliser fetch pour récupérer le fichier Excel
    const response = await fetch('/Copie de Calgary Barbell 16 Week (Revised) LB + KG _ LiftVault.com.xlsx')
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération du fichier Excel: ${response.statusText}`)
    }
    
    const arrayBuffer = await response.arrayBuffer()
    const data = new Uint8Array(arrayBuffer)
    const workbook = read(data, { type: 'array' })
    
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      throw new Error('Le fichier Excel est vide')
    }

    const program: Program = {
      id: uuidv4(),
      name: 'Calgary Barbell 16 Week Program',
      description: 'Programme de force sur 16 semaines',
      goal: 'Force',
      equipment: 'Full Gym',
      weeks: [],
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    for (const sheetName of workbook.SheetNames) {
      console.log('Traitement de la feuille:', sheetName)
      const worksheet = workbook.Sheets[sheetName]
      const rawData = utils.sheet_to_json<ExcelRow>(worksheet)
      
      let currentWeek = 1
      let currentDay = 1
      let exercises: Exercise[] = []
      
      for (const row of rawData) {
        // Check if this row indicates a new week
        if (row.__EMPTY && typeof row.__EMPTY === 'string' && row.__EMPTY.toLowerCase().includes('week')) {
          const weekMatch = row.__EMPTY.match(/week\s+(\d+)/i)
          if (weekMatch) {
            currentWeek = parseInt(weekMatch[1])
            currentDay = 1
            console.log('Nouvelle semaine détectée:', currentWeek)
            continue
          }
        }
        
        // Check if this row indicates a new day
        if (row.__EMPTY && typeof row.__EMPTY === 'string' && row.__EMPTY.toLowerCase().includes('day')) {
          const dayMatch = row.__EMPTY.match(/day\s+(\d+)/i)
          if (dayMatch) {
            currentDay = parseInt(dayMatch[1])
            console.log('Nouveau jour détecté:', currentDay)
            continue
          }
        }
        
        // Parse exercise data
        if (row.__EMPTY && typeof row.__EMPTY === 'string' && !row.__EMPTY.toLowerCase().includes('exercise')) {
          console.log('Analyse de l\'exercice:', row.__EMPTY)
          const exercise: Exercise = {
            name: row.__EMPTY,
            sets: parseInt(row.__EMPTY_1 as string) || 0,
            reps: (row.__EMPTY_2 as string)?.toString() || '0',
            intensity: parseInt(row.__EMPTY_3 as string) || 0
          }
          
          if (exercise.intensity) {
            exercise.weight = {
              type: 'percentage',
              value: exercise.intensity
            }
          }
          
          exercises.push(exercise)
        }
        
        // If we have exercises and encounter a new section, add them to the program
        if (exercises.length > 0 && (!row.__EMPTY || (typeof row.__EMPTY === 'string' && (row.__EMPTY.toLowerCase().includes('week') || row.__EMPTY.toLowerCase().includes('day'))))) {
          let week = program.weeks.find(w => w.number === currentWeek)
          if (!week) {
            week = {
              number: currentWeek,
              days: []
            }
            program.weeks.push(week)
          }
          
          let day = week.days.find(d => d.number === currentDay)
          if (!day) {
            day = {
              number: currentDay,
              exercises: []
            }
            week.days.push(day)
          }
          
          day.exercises.push(...exercises)
          exercises = []
        }
      }
    }
    
    // Sort weeks and days
    program.weeks.sort((a, b) => a.number - b.number)
    program.weeks.forEach(week => {
      week.days.sort((a, b) => a.number - b.number)
    })
    
    if (program.weeks.length === 0) {
      throw new Error('Aucune semaine n\'a été trouvée dans le programme')
    }
    
    console.log('Programme généré avec succès:', {
      weeks: program.weeks.length,
      days: program.weeks.reduce((acc, week) => acc + week.days.length, 0),
      exercises: program.weeks.reduce((acc, week) => 
        acc + week.days.reduce((dacc, day) => dacc + day.exercises.length, 0), 0)
    })
    
    return program
  } catch (error) {
    console.error('Erreur lors de l\'importation du programme:', error)
    throw error
  }
}

function parseExerciseInfo(row: ExcelRow, weekOffset: number, weekIndex: number): Exercise[] {
  // Skip header rows and empty rows
  if (!row.__EMPTY || typeof row.__EMPTY !== 'string' || 
      row.__EMPTY === 'Exercise' || 
      row.__EMPTY.toLowerCase().includes('week') ||
      row.__EMPTY === 'Sets' ||
      row.__EMPTY.startsWith('1+')) {
    return [];
  }

  const exercises: Exercise[] = [];
  const weekData = [
    { sets: '__EMPTY_1', reps: '__EMPTY_2', intensity: '__EMPTY_3' },
    { sets: '__EMPTY_7', reps: '__EMPTY_8', intensity: '__EMPTY_9' },
    { sets: '__EMPTY_13', reps: '__EMPTY_14', intensity: '__EMPTY_15' },
    { sets: '__EMPTY_19', reps: '__EMPTY_20', intensity: '__EMPTY_21' }
  ];

  const weekInfo = weekData[weekIndex];
  if (!weekInfo) return exercises;

  const sets = parseInt(row[weekInfo.sets] as string);
  const reps = row[weekInfo.reps] as string;
  const intensity = parseInt(row[weekInfo.intensity] as string);

  if (sets && reps) {
    const exercise: Exercise = {
      name: row.__EMPTY,
      sets: sets,
      reps: reps.toString(),
      intensity: intensity || 0,
      notes: row[weekInfo.intensity + 2] as string || ''
    };

    if (intensity) {
      exercise.weight = {
        type: 'percentage',
        value: intensity
      };
    }

    exercises.push(exercise);
  }

  return exercises;
} 