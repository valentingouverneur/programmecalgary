import { NextResponse } from 'next/server'
import { importCalgaryProgram } from '@/lib/excel'
import path from 'path'

export async function GET() {
  try {
    console.log('Démarrage de l\'importation du programme Calgary')
    console.log('Répertoire courant:', process.cwd())
    
    const program = await importCalgaryProgram()
    
    if (!program || !program.weeks || program.weeks.length === 0) {
      throw new Error('Programme invalide : aucune semaine trouvée')
    }
    
    return NextResponse.json(program)
  } catch (error) {
    console.error('Erreur lors de l\'importation du programme Calgary:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur inconnue lors de l\'importation du programme' },
      { status: 500 }
    )
  }
} 