import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Inter, Roboto_Mono } from 'next/font/google'
import { Providers } from './providers'
import { ToastViewport } from '@/components/ui/toast'

const inter = Inter({ subsets: ['latin'] })
const robotoMono = Roboto_Mono({ 
  weight: '700',
  subsets: ['latin'],
  variable: '--font-roboto-mono',
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
      <body className={`${inter.className} ${robotoMono.variable} min-h-screen bg-background text-foreground antialiased`}>
        <Providers>
          {children}
          <ToastViewport />
        </Providers>
      </body>
    </html>
  )
} 