'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowLeft, Check, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import Logo from '@/components/layout/Logo'
import { register, initStore } from '@/data/store'
import { apiSendVerification, apiVerifyEmail } from '@/lib/api'

const CATEGORIES_PRESTA = [
  'Coiffure', 'Maquillage/Beaute', 'Decoration', 'Restauration/Traiteur',
  'Cinematographie/Photo', 'Sonorisation/DJ', 'Hotesses/Protocole',
  'Maitre de ceremonie', 'Manucure/Pedicure', 'Autre'
]

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)        // 1=choix type, 1.5=catégorie, 2=info, 3=vérif email, 4=done
  const [type, setType] = useState('')
  const [categorie, setCategorie] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    prenom: '', nom: '', email: '', telephone: '', motDePasse: '', whatsapp: ''
  })

  // ── Vérification email ──────────────────────────────────────
  const [verifCode, setVerifCode] = useState(['', '', '', '', '', ''])
  const [verifError, setVerifError] = useState('')
  const [verifLoading, setVerifLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [devCode, setDevCode] = useState(null)
  const inputRefs = useRef([])

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setError('')
  }

  function chooseType(t) {
    setType(t)
    setStep(t === 'prestataire' ? 1.5 : 2)
  }

  function chooseCategorie(cat) {
    setCategorie(cat)
    setStep(2)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (type === 'prestataire' && !form.whatsapp) {
      setError('Le numéro WhatsApp est obligatoire pour les prestataires')
      return
    }
    if (form.motDePasse.length < 6) {
      setError('Le mot de passe doit faire au moins 6 caractères')
      return
    }

    setLoading(true)
    initStore()

    const result = await register({
      prenom: form.prenom,
      nom: form.nom,
      email: form.email.trim().toLowerCase(),
      telephone: form.telephone,
      motDePasse: form.motDePasse,
      whatsapp: form.whatsapp || '+237694872823',
      type,
      categorie: type === 'prestataire' ? categorie : null,
      description: '',
      image: '/images/img1.jpg',
    })
    setLoading(false)

    if (result.success) {
      await sendVerifCode(form.email.trim().toLowerCase())
      setStep(3)
    } else {
      setError(result.error)
    }
  }

  async function sendVerifCode(email) {
    try {
      const res = await apiSendVerification(email)
      if (res.devCode) setDevCode(res.devCode)
    } catch {}
  }

  async function handleResend() {
    if (resendCooldown > 0) return
    setVerifError('')
    await sendVerifCode(form.email.trim().toLowerCase())
    setResendCooldown(60)
    const timer = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  function handleCodeChange(index, value) {
    if (!/^[0-9]?$/.test(value)) return
    const newCode = [...verifCode]
    newCode[index] = value
    setVerifCode(newCode)
    setVerifError('')
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
  }

  function handleCodeKeyDown(index, e) {
    if (e.key === 'Backspace' && !verifCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handleCodePaste(e) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newCode = [...verifCode]
    for (let i = 0; i < pasted.length; i++) newCode[i] = pasted[i]
    setVerifCode(newCode)
    inputRefs.current[Math.min(pasted.length, 5)]?.focus()
  }

  async function handleVerify(e) {
    e.preventDefault()
    const code = verifCode.join('')
    if (code.length < 6) { setVerifError('Veuillez entrer les 6 chiffres du code'); return }
    setVerifLoading(true)
    try {
      await apiVerifyEmail(form.email.trim().toLowerCase(), code)
      setStep(4)
      setTimeout(() => router.push('/profile/provider'), 1800)
    } catch (err) {
      setVerifError(err.message || 'Code invalide ou expiré')
    }
    setVerifLoading(false)
  }

  function skipVerif() {
    router.push('/profile/provider')
  }

  return (
    <div className="min-h-screen flex">
      {/* Panneau gauche */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-petrol to-petrol/80 items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(circle at 70% 30%, #E91E63 0%, transparent 60%)' }} />
        <div className="text-white text-center px-10 relative z-10">
          <Logo />
          <p className="mt-6 text-white/70 leading-relaxed">
            Rejoignez la premiere plateforme d'entrepreneuriat féminin du Cameroun.
          </p>
          <div className="mt-8 space-y-3 text-left">
            {['Gratuit et sans engagement', 'Visibilité immédiate', 'Clients vérifiés'].map(avantage => (
              <div key={avantage} className="flex items-center gap-2 text-white/80 text-sm">
                <Check size={16} className="text-gold flex-shrink-0" />
                {avantage}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Panneau formulaire */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50 overflow-y-auto"
      >
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-6 flex justify-center">
            <Logo dark />
          </div>

          {/* ─── ÉTAPE 1 : Choisir client ou prestataire ─── */}
          {step === 1 && (
            <>
              <h1 className="font-display text-3xl font-bold text-petrol mb-2">Je suis...</h1>
              <p className="text-gray-500 mb-8">Choisissez votre type de compte.</p>
              <div className="space-y-4">
                {[
                  { type: 'client', emoji: '🛍️', titre: 'Cliente', desc: 'Je cherche des prestataires pour mon événement' },
                  { type: 'prestataire', emoji: '💼', titre: 'Prestataire', desc: 'Je propose mes services événementiels' },
                ].map(opt => (
                  <button
                    key={opt.type}
                    onClick={() => chooseType(opt.type)}
                    className="w-full text-left p-5 border-2 border-gray-200 rounded-2xl hover:border-fuchsia hover:bg-fuchsia/5 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{opt.emoji}</span>
                      <div>
                        <p className="font-bold text-petrol group-hover:text-fuchsia">{opt.titre}</p>
                        <p className="text-sm text-gray-500">{opt.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-center text-sm text-gray-500 mt-8">
                Déjà un compte ?{' '}
                <Link href="/auth/login" className="text-fuchsia font-semibold hover:underline">
                  Se connecter
                </Link>
              </p>
            </>
          )}

          {/* ─── ÉTAPE 1.5 : Catégorie prestataire ─── */}
          {step === 1.5 && (
            <>
              <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-gray-400 hover:text-fuchsia mb-6 transition-colors">
                <ArrowLeft size={16} /> Retour
              </button>
              <h1 className="font-display text-2xl font-bold text-petrol mb-2">Votre spécialité</h1>
              <p className="text-gray-500 mb-6">Dans quel domaine exercez-vous ?</p>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES_PRESTA.map(cat => (
                  <button
                    key={cat}
                    onClick={() => chooseCategorie(cat)}
                    className={`py-3 px-4 rounded-xl text-sm font-medium text-left border-2 transition-all ${
                      categorie === cat
                        ? 'border-fuchsia bg-fuchsia/5 text-fuchsia'
                        : 'border-gray-200 text-gray-600 hover:border-fuchsia hover:text-fuchsia'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ─── ÉTAPE 2 : Informations personnelles ─── */}
          {step === 2 && (
            <>
              <button onClick={() => setStep(type === 'prestataire' ? 1.5 : 1)}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-fuchsia mb-6 transition-colors">
                <ArrowLeft size={16} /> Retour
              </button>
              <h1 className="font-display text-2xl font-bold text-petrol mb-1">Vos informations</h1>
              <p className="text-gray-500 mb-6">
                {type === 'prestataire' ? `Prestataire — ${categorie}` : 'Compte cliente'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Prénom *</label>
                    <input type="text" required value={form.prenom} onChange={e => set('prenom', e.target.value)}
                      placeholder="Aïcha"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Nom *</label>
                    <input type="text" required value={form.nom} onChange={e => set('nom', e.target.value)}
                      placeholder="Diallo"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Email *</label>
                  <input type="email" required value={form.email} onChange={e => set('email', e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Téléphone</label>
                  <input type="tel" value={form.telephone} onChange={e => set('telephone', e.target.value)}
                    placeholder="+237 6XX XX XX XX"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia" />
                </div>

                {type === 'prestataire' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Numéro WhatsApp <span className="text-fuchsia">* (les clients vous contactent ici)</span>
                    </label>
                    <input type="tel" required value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)}
                      placeholder="+237694872823"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia" />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Mot de passe *</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={form.motDePasse}
                      onChange={e => set('motDePasse', e.target.value)}
                      placeholder="Minimum 6 caractères"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading}
                  className="w-full bg-fuchsia text-white py-3.5 rounded-full font-semibold hover:bg-fuchsia/90 transition-all disabled:opacity-60 shadow-lg mt-2">
                  {loading ? 'Création...' : 'Créer mon compte'}
                </button>
              </form>
            </>
          )}

          {/* ─── ÉTAPE 3 : Vérification email ─── */}
          {step === 3 && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-fuchsia/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📧</span>
                </div>
                <h1 className="font-display text-2xl font-bold text-petrol mb-2">Vérifiez votre email</h1>
                <p className="text-gray-500 text-sm">
                  Un code à 6 chiffres a été envoyé à<br />
                  <strong className="text-petrol">{form.email}</strong>
                </p>
              </div>

              {devCode && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-center">
                  <p className="text-xs text-amber-700 font-semibold">Mode développement — Code :</p>
                  <p className="text-2xl font-bold font-mono text-amber-700 tracking-widest mt-1">{devCode}</p>
                </div>
              )}

              <form onSubmit={handleVerify} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">Entrez votre code</label>
                  <div className="flex gap-2 justify-center" onPaste={handleCodePaste}>
                    {verifCode.map((digit, i) => (
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

                {verifError && (
                  <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl text-center">
                    {verifError}
                  </div>
                )}

                <button type="submit" disabled={verifLoading}
                  className="w-full bg-fuchsia text-white py-3.5 rounded-full font-semibold hover:bg-fuchsia/90 transition-all disabled:opacity-60 shadow-lg">
                  {verifLoading ? 'Vérification...' : 'Confirmer'}
                </button>
              </form>

              <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                <button
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  className="flex items-center gap-1.5 hover:text-fuchsia transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw size={13} />
                  {resendCooldown > 0 ? `Renvoyer (${resendCooldown}s)` : 'Renvoyer le code'}
                </button>
                <button onClick={skipVerif} className="text-gray-400 hover:text-gray-600 transition-colors">
                  Ignorer pour l'instant
                </button>
              </div>
            </>
          )}

          {/* ─── ÉTAPE 4 : Succès ─── */}
          {step === 4 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-petrol/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-petrol" />
              </div>
              <h2 className="font-display text-2xl font-bold text-petrol mb-2">Email vérifié !</h2>
              <p className="text-gray-500">Bienvenue sur Fempreneur Hub. Redirection...</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
