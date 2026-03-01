'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import Logo from '@/components/layout/Logo'
import { login, initStore, resetStore } from '@/data/store'

const TEST_ACCOUNTS = [
  { label: 'Aicha (cliente)', email: 'client1@test.com', pwd: 'test123' },
  { label: 'Fatima (cliente)', email: 'client2@test.com', pwd: 'test123' },
  { label: 'Marie Beauty (presta)', email: 'marie@beauty.com', pwd: 'presta123' },
  { label: 'Deco & Co (presta)', email: 'deco@event.com', pwd: 'presta123' },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    initStore()
    setTimeout(() => {
      const result = login(email.trim().toLowerCase(), password)
      setLoading(false)
      if (result.success) {
        router.push(result.user.type === 'prestataire' ? '/profile/provider' : '/profile/client')
      } else {
        setError(result.error)
      }
    }, 400)
  }

  function fill(acc) {
    setEmail(acc.email)
    setPassword(acc.pwd)
    setError('')
  }

  function handleReset() {
    resetStore()
    setError('Base de données réinitialisée. Réessayez !')
  }

  return (
    <div className="min-h-screen flex">
      {/* Panneau gauche décoratif */}
      <div className="hidden lg:flex lg:w-1/2 bg-petrol items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(circle at 30% 50%, #E91E63 0%, transparent 60%)' }} />
        <div className="text-center text-white px-12 relative z-10">
          <Logo />
          <p className="mt-6 text-white/70 text-lg leading-relaxed">
            La plateforme qui connecte les femmes entrepreneures camerounaises avec leurs clients.
          </p>
        </div>
      </div>

      {/* Panneau formulaire */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo dark />
          </div>

          <h1 className="font-display text-3xl font-bold text-petrol mb-2">Bon retour !</h1>
          <p className="text-gray-500 mb-8">Connectez-vous à votre compte Fempreneur Hub.</p>

          {/* Comptes de test rapides */}
          <div className="bg-fuchsia/5 border border-fuchsia/20 rounded-2xl p-4 mb-6">
            <p className="text-xs font-semibold text-fuchsia uppercase tracking-wide mb-3">
              🔑 Comptes de démonstration (clic pour remplir)
            </p>
            <div className="grid grid-cols-2 gap-2">
              {TEST_ACCOUNTS.map(acc => (
                <button
                  key={acc.email}
                  onClick={() => fill(acc)}
                  className="text-left px-3 py-2 text-xs bg-white rounded-xl border border-gray-200 hover:border-fuchsia hover:text-fuchsia transition-all"
                >
                  <span className="font-medium block">{acc.label}</span>
                  <span className="text-gray-400">{acc.email}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-fuchsia text-white py-3.5 rounded-full font-semibold hover:bg-fuchsia/90 transition-all disabled:opacity-60 shadow-lg hover:shadow-fuchsia/30"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Pas encore de compte ?{' '}
            <Link href="/auth/register" className="text-fuchsia font-semibold hover:underline">
              S'inscrire gratuitement
            </Link>
          </p>

          {/* Bouton de réinitialisation (utile si données corrompues) */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <button onClick={handleReset} className="text-xs text-gray-300 hover:text-gray-500 transition-colors">
              Réinitialiser les données de test
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
