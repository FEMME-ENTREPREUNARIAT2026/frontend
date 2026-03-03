'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import Logo from '@/components/layout/Logo'
import { apiForgotPassword } from '@/lib/api'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [devCode, setDevCode] = useState(null)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await apiForgotPassword(email.trim().toLowerCase())
      if (res.devCode) setDevCode(res.devCode)
      setSent(true)
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'envoi')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Panneau gauche */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex lg:w-1/2 bg-petrol items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(circle at 30% 50%, #E91E63 0%, transparent 60%)' }} />
        <div className="text-center text-white px-12 relative z-10">
          <Logo />
          <p className="mt-6 text-white/70 text-lg leading-relaxed">
            Réinitialisez votre mot de passe en quelques secondes.
          </p>
        </div>
      </motion.div>

      {/* Formulaire */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50"
      >
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo dark />
          </div>

          <Link href="/auth/login"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-fuchsia mb-8 transition-colors">
            <ArrowLeft size={16} /> Retour à la connexion
          </Link>

          {!sent ? (
            <>
              <div className="w-14 h-14 bg-fuchsia/10 rounded-2xl flex items-center justify-center mb-6">
                <Mail size={26} className="text-fuchsia" />
              </div>
              <h1 className="font-display text-3xl font-bold text-petrol mb-2">Mot de passe oublié ?</h1>
              <p className="text-gray-500 mb-8">
                Entrez votre email et nous vous enverrons un code pour réinitialiser votre mot de passe.
              </p>

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

                {error && (
                  <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading}
                  className="w-full bg-fuchsia text-white py-3.5 rounded-full font-semibold hover:bg-fuchsia/90 transition-all disabled:opacity-60 shadow-lg">
                  {loading ? 'Envoi...' : 'Envoyer le code'}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <span className="text-3xl">✅</span>
                </div>
                <h1 className="font-display text-2xl font-bold text-petrol mb-2">Code envoyé !</h1>
                <p className="text-gray-500 text-sm mb-6">
                  Si un compte existe pour <strong className="text-petrol">{email}</strong>,<br />
                  vous recevrez un code sous peu.
                </p>

                {devCode && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 text-center">
                    <p className="text-xs text-amber-700 font-semibold">Mode développement — Code :</p>
                    <p className="text-2xl font-bold font-mono text-amber-700 tracking-widest mt-1">{devCode}</p>
                  </div>
                )}

                <button
                  onClick={() => router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`)}
                  className="w-full bg-fuchsia text-white py-3.5 rounded-full font-semibold hover:bg-fuchsia/90 transition-all shadow-lg"
                >
                  Entrer le code
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
