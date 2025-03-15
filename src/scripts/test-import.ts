import path from 'path'
import { importCalgaryProgram } from '../lib/excel'

async function main() {
  try {
    const filePath = path.join(process.cwd(), 'Copie de Calgary Barbell 16 Week (Revised) LB + KG _ LiftVault.com.xlsx')
    const program = await importCalgaryProgram()
    console.log(JSON.stringify(program, null, 2))
  } catch (error) {
    console.error('Error:', error)
  }
}

main() 