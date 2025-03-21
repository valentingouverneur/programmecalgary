import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Inter, Roboto_Mono } from 'next/font/google'
import { Providers } from './providers'
import { ToastViewport, Toaster } from '@/components/ui/toast'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { AuthProvider } from '@/contexts/AuthContext'

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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <Toaster />
            <Providers>
              {children}
              <ToastViewport />
            </Providers>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
} 