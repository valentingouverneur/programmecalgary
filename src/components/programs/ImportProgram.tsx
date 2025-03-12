import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Upload, X } from 'lucide-react'
import { generateTemplate, parseExcel } from '@/lib/excel'
import type { Program } from '@/types/program'

export function ImportProgram() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<Program | null>(null)
  const [error, setError] = useState<string | null>(null)

  const downloadTemplate = () => {
    const blob = generateTemplate()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'template-programme.xlsx'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFile(file)
      setError(null)
      try {
        const program = await parseExcel(file)
        setPreview(program)
      } catch (err) {
        setError('Erreur lors de la lecture du fichier. Vérifiez que le format correspond au template.')
        setPreview(null)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Importer un programme</h2>
          <p className="text-sm text-gray-500 mt-1">
            Téléchargez le template, remplissez-le et importez-le
          </p>
        </div>
        <Button
          variant="outline"
          className="flex items-center space-x-2"
          onClick={downloadTemplate}
        >
          <Download className="w-4 h-4" />
          <span>Template Excel</span>
        </Button>
      </div>

      <div className="border-2 border-dashed rounded-lg p-8">
        <div className="flex flex-col items-center justify-center">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
            id="program-file"
          />
          {!file ? (
            <label
              htmlFor="program-file"
              className="flex flex-col items-center cursor-pointer"
            >
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">
                Cliquez pour sélectionner votre fichier Excel
              </span>
              <span className="text-xs text-gray-400 mt-1">
                Format .xlsx ou .xls
              </span>
            </label>
          ) : (
            <div className="flex items-center space-x-4">
              <span className="text-sm">{file.name}</span>
              <button
                onClick={() => {
                  setFile(null)
                  setPreview(null)
                  setError(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      {preview && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-medium mb-4">Prévisualisation</h3>
          <div className="space-y-4">
            {preview.weeks.map((week) => (
              <div key={week.number} className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Semaine {week.number}</h4>
                <div className="grid grid-cols-2 gap-4">
                  {week.days.map((day) => (
                    <div key={day.number} className="bg-white rounded p-3">
                      <h5 className="text-sm font-medium mb-2">
                        Jour {day.number}
                      </h5>
                      <div className="space-y-2">
                        {day.exercises.map((exercise, i) => (
                          <div key={i} className="text-sm">
                            <span className="font-medium">{exercise.name}</span>
                            <span className="text-gray-500">
                              {' '}
                              · {exercise.sets}×{exercise.reps}
                              {exercise.rpe && ` @RPE${exercise.rpe}`}
                              {exercise.intensity && ` @${exercise.intensity}%`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white">
              Importer le programme
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 