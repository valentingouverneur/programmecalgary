'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { signIn: login, signUp: signup } = useAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    try {
      if (isLogin) {
        await login(email, password)
      } else {
        await signup(email, password)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-sm text-destructive mb-4">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="bg-secondary rounded-xl h-12"
        />

        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          required
          className="bg-secondary rounded-xl h-12"
        />
      </div>

      <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl h-12">
        {isLogin ? 'Se connecter' : "S'inscrire"}
      </Button>

      <button
        type="button"
        onClick={() => setIsLogin(!isLogin)}
        className="text-sm text-accent hover:text-accent/90 w-full text-center mt-2"
      >
        {isLogin
          ? "Pas encore de compte ? S'inscrire"
          : 'Déjà un compte ? Se connecter'}
      </button>
    </form>
  )
} 