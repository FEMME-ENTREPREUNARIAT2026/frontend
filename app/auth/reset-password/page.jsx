'use client'
import { useState, useRef, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Eye, EyeOff, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import Logo from '@/components/layout/Logo'
import { apiResetPassword } from '@/lib/api'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailFromUrl = searchParams.get('email') || ''
  const tokenFromUrl = searchParams.get('token') || ''

  const [email, setEmail] = useState(emailFromUrl)
  const [code, setCode] = useState(tokenFromUrl ? tokenFromUrl.split('').slice(0, 6) : ['', '', '', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const inputRefs = useRef([])

  function handleCodeChange(index, value) {
    if (!/^[0-9]?$/.test(value)) return
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)
    setError('')
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
  }

  function handleCodeKeyDown(index, e) {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handleCodePaste(e) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newCode = [...code]
    for (let i = 0; i < pasted.length; i++) newCode[i] = pasted[i]
    setCode(newCode)
    inputRefs.current[Math.min(pasted.length, 5)]?.focus()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const codeStr = code.join('')
    if (codeStr.length < 6) { setError('Entrez les 6 chiffres du code'); return }
    if (newPassword.length < 6) { setError('Le mot de passe doit faire au moins 6 caractères'); return }
    if (newPassword !== confirmPassword) { setError('Les mots de passe ne correspondent pas'); return }

    setLoading(true)
    try {
      await apiResetPassword(email.trim().toLowerCase(), codeStr, newPassword)
      setDone(true)
      setTimeout(() => router.push('/auth/login'), 2000)
    } catch (err) {
      setError(err.message || 'Code invalide ou expiré')
    }
    setLoading(false)
  }

  return (
    <div className="w-full max-w-md">
      <div className="lg:hidden mb-8 flex justify-center">
        <Logo dark />
      </div>

      <Link href="/auth/forgot-password"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-fuchsia mb-8 transition-colors">
        <ArrowLeft size={16} /> Retour
      </Link>

      {done ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-petrol/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-petrol" />
          </div>
          <h2 className="font-display text-2xl font-bold text-petrol mb-2">Mot de passe modifié !</h2>
          <p className="text-gray-500">Redirection vers la connexion...</p>
        </div>
      ) : (
        <>
          <h1 className="font-display text-3xl font-bold text-petrol mb-2">Nouveau mot de passe</h1>
          <p className="text-gray-500 mb-8">Entrez le code reçu par email et choisissez un nouveau mot de passe.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!emailFromUrl && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">Code de réinitialisation</label>
              <div className="flex gap-2 justify-center" onPaste={handleCodePaste}>
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => (inputRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleCodeChange(i, e.target.value)}
                    onKeyDown={e => handleCodeKeyDown(i, e)}
                    className={`w-11 h-14 text-center text-xl font-bold border-2 rounded-xl focus:outline-none transition-all ${
                      digit
                        ? 'border-fuchsia text-fuchsia bg-fuchsia/5'
                        : 'border-gray-200 text-gray-700 focus:border-fuchsia'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nouveau mot de passe</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required minLength={6}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 caractères"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmer le mot de passe</label>
              <input
                type="password" required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Répétez le mot de passe"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-fuchsia text-white py-3.5 rounded-full font-semibold hover:bg-fuchsia/90 transition-all disabled:opacity-60 shadow-lg">
              {loading ? 'Réinitialisation...' : 'Réinitialiser'}
            </button>
          </form>
        </>
      )}
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex">
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
            Sécurisez votre compte avec un nouveau mot de passe.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50"
      >
        <Suspense fallback={<div className="text-gray-400 text-sm">Chargement...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </motion.div>
    </div>
  )
}
