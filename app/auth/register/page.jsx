'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowLeft, Check } from 'lucide-react'
import Logo from '@/components/layout/Logo'
import { register, initStore } from '@/data/store'

const CATEGORIES_PRESTA = [
  'Coiffure', 'Maquillage/Beaute', 'Decoration', 'Restauration/Traiteur',
  'Cinematographie/Photo', 'Sonorisation/DJ', 'Hotesses/Protocole',
  'Maitre de ceremonie', 'Manucure/Pedicure', 'Autre'
]

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)        // 1=choix type, 2=info, 3=done
  const [type, setType] = useState('')       // 'client' ou 'prestataire'
  const [categorie, setCategorie] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    prenom: '', nom: '', email: '', telephone: '', motDePasse: '', whatsapp: ''
  })

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

  function handleSubmit(e) {
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

    setTimeout(() => {
      const result = register({
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
        setStep(3)
        setTimeout(() => {
          router.push(type === 'prestataire' ? '/profile/provider' : '/profile/client')
        }, 1500)
      } else {
        setError(result.error)
      }
    }, 400)
  }

  return (
    <div className="min-h-screen flex">
      {/* Panneau gauche */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-petrol to-petrol/80 items-center justify-center relative overflow-hidden">
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
      </div>

      {/* Panneau formulaire */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50 overflow-y-auto">
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

                {/* WhatsApp — obligatoire pour prestataires */}
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

          {/* ─── ÉTAPE 3 : Succès ─── */}
          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-petrol/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-petrol" />
              </div>
              <h2 className="font-display text-2xl font-bold text-petrol mb-2">Bienvenue !</h2>
              <p className="text-gray-500">Votre compte a été créé. Redirection en cours...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
