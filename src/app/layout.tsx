import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Inter, Archivo_Black } from 'next/font/google'
import { Providers } from './providers'
import { ToastViewport } from '@/components/ui/toast'

const inter = Inter({ subsets: ['latin'] })
const archivoblack = Archivo_Black({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-archivo-black',
})

export const metadata: Metadata = {
  title: 'Programme Calgary',
  description: 'Application de suivi du programme Calgary Barbell',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <title>Studio 101</title>
      </head>
      <body className={`${inter.className} ${archivoblack.variable} min-h-screen bg-background text-foreground antialiased`}>
        <Providers>
          {children}
          <ToastViewport />
        </Providers>
      </body>
    </html>
  )
} 