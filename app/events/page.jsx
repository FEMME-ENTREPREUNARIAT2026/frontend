'use client'
import { useState, useMemo, useEffect, Suspense } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import EventCard from '@/components/ui/EventCard'
import { EVENTS } from '@/data/mockData'
import { SlidersHorizontal, X, Search, Plus, Calendar, MapPin, Users, Clock } from 'lucide-react'
import { getEvenements, normalizeEvenement } from '@/lib/api'
import FadeIn from '@/components/ui/FadeIn'
import { StaggerContainer, StaggerItem } from '@/components/ui/StaggerChildren'
import { getCurrentUser, initStore } from '@/data/store'
import Link from 'next/link'

const EVENT_TYPES = ['Tous', 'Mariage', 'Anniversaire', 'Baby Shower', 'EVJF', 'Seminaire', 'Concert', 'Festival', 'Lancement produit']
const CITIES = ['Toutes les villes', 'Yaounde', 'Douala', 'Bafoussam']

const MOCK_EVENTS = [
  ...EVENTS,
  ...Array.from({ length: 22 }, (_, i) => ({
    ...EVENTS[i % EVENTS.length],
    id: 100 + i,
    title: `${EVENTS[i % EVENTS.length].title} — Edition ${i + 2}`,
    date: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    participants: Math.floor(30 + (i * 17 % 150)),
  }))
]

const EVENT_TYPES_FORM = ['Mariage', 'Anniversaire', 'Baby Shower', 'EVJF', 'Seminaire', 'Concert', 'Festival', 'Lancement produit', 'Autre']

function EventsContent() {
  const [allEvents, setAllEvents] = useState(MOCK_EVENTS)
  const [type, setType] = useState('Tous')
  const [city, setCity] = useState('Toutes les villes')
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [user, setUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [newEvent, setNewEvent] = useState({ title:'', type:'Mariage', date:'', heure:'', location:'Yaounde', maxParticipants:'100', price:'Gratuit', description:'' })
  const [eventImage, setEventImage] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    initStore()
    setUser(getCurrentUser())
    const handler = (e) => setUser(e.detail)
    window.addEventListener('fh_auth_change', handler)
    return () => window.removeEventListener('fh_auth_change', handler)
  }, [])

  useEffect(() => {
    getEvenements({ upcoming: 'true' })
      .then(data => {
        if (data && data.length > 0) {
          setAllEvents(data.map(normalizeEvenement))
        }
      })
      .catch(() => {})
  }, [])

  function handleOpenCreate() {
    if (!user) { setShowAuthModal(true); return }
    setShowModal(true)
  }

  function handleEventImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setEventImage(ev.target.result)
    reader.readAsDataURL(file)
  }

  function handleSubmitEvent(e) {
    e.preventDefault()
    const created = {
      id: Date.now(),
      title: newEvent.title,
      type: newEvent.type,
      date: newEvent.date,
      time: newEvent.heure,
      location: newEvent.location,
      organizer: `${user.prenom} ${user.nom}`,
      participants: 0,
      maxParticipants: parseInt(newEvent.maxParticipants) || 100,
      price: newEvent.price,
      description: newEvent.description,
      tags: [newEvent.type],
      image: eventImage,
    }
    setAllEvents(prev => [created, ...prev])
    const key = 'fh_user_events_' + user.id
    const existing = JSON.parse(localStorage.getItem(key) || '[]')
    localStorage.setItem(key, JSON.stringify([created, ...existing]))
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setShowModal(false)
      setNewEvent({ title:'', type:'Mariage', date:'', heure:'', location:'Yaounde', maxParticipants:'100', price:'Gratuit', description:'' })
      setEventImage(null)
    }, 1800)
  }

  const filtered = useMemo(() => {
    return allEvents.filter(e => {
      if (new Date(e.date) <= new Date()) return false
      if (type !== 'Tous' && e.type !== type) return false
      if (city !== 'Toutes les villes' && !e.location.toLowerCase().includes(city.toLowerCase())) return false
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim()
        if (!e.title.toLowerCase().includes(q) &&
            !(e.location || '').toLowerCase().includes(q) &&
            !(e.organizer || '').toLowerCase().includes(q)) return false
      }
      return true
    }).sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [allEvents, type, city, searchTerm])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-16">
        {/* Hero */}
        <div className="bg-gradient-to-br from-fuchsia to-fuchsia-dark text-white py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn direction="up">
              <p className="text-gold text-xs font-bold tracking-widest uppercase mb-2">Agenda</p>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">Evenements</h1>
              <p className="text-white/80">{allEvents.length} evenements au Cameroun</p>
            </FadeIn>
            {/* Barre de recherche */}
            <div className="relative mt-6 max-w-lg">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Rechercher un evenement, un lieu..."
                className="w-full pl-11 pr-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:bg-white/20 transition-all text-sm"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white">
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filtre type */}
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-6 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {EVENT_TYPES.map(t => (
                <button key={t} onClick={() => setType(t)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    type === t ? 'bg-fuchsia text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Barre resultats */}
          <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
            <p className="text-gray-600 font-medium">
              <span className="text-fuchsia font-bold text-lg">{filtered.length}</span> evenement{filtered.length > 1 ? 's' : ''}
              {searchTerm && <span className="ml-2 text-sm text-gray-400">pour "{searchTerm}"</span>}
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 border rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  showFilters ? 'border-fuchsia text-fuchsia bg-fuchsia/5' : 'border-gray-200 text-gray-600 hover:border-fuchsia hover:text-fuchsia'
                }`}>
                <SlidersHorizontal size={16} />
                Filtre ville
                {showFilters && <X size={14} />}
              </button>
              <button onClick={handleOpenCreate}
                className="flex items-center gap-2 btn-primary text-sm">
                <Plus size={16} /> Ajouter un evenement
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ville</label>
              <select value={city} onChange={e => setCity(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia max-w-xs w-full">
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          )}

          {filtered.length > 0 ? (
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map(event => (
                <StaggerItem key={event.id}>
                  <EventCard event={event} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <div className="text-center py-24">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-gray-300" />
              </div>
              <p className="font-display text-xl text-gray-500 mb-2">Aucun evenement trouve</p>
              <p className="text-sm text-gray-400">Essayez d'autres criteres de recherche</p>
              <button onClick={() => { setType('Tous'); setSearchTerm(''); setCity('Toutes les villes') }}
                className="mt-4 btn-outline text-sm">Voir tous les evenements</button>
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* ── MODAL AUTH ── */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowAuthModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 bg-fuchsia/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={28} className="text-fuchsia" />
            </div>
            <h2 className="font-display text-xl font-bold text-petrol mb-2">Connexion requise</h2>
            <p className="text-gray-500 text-sm mb-6">Vous devez etre connecte(e) pour ajouter un evenement.</p>
            <div className="flex flex-col gap-3">
              <Link href="/auth/login" className="btn-primary text-sm text-center">Se connecter</Link>
              <Link href="/auth/register" className="btn-outline text-sm text-center">Creer un compte</Link>
              <button onClick={() => setShowAuthModal(false)} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CREATION EVENEMENT ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => !submitted && setShowModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-3xl">
              <div>
                <h2 className="font-display text-xl font-bold text-petrol">Nouvel evenement</h2>
                <p className="text-xs text-gray-400 mt-0.5">Remplissez les informations de votre evenement</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all">
                <X size={16} />
              </button>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar size={28} className="text-green-500" />
                </div>
                <h3 className="font-display text-lg font-bold text-petrol mb-1">Evenement publie !</h3>
                <p className="text-gray-400 text-sm">Il apparait maintenant dans la liste.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitEvent} className="p-6">
                {/* Image de couverture en premier */}
                <div className="mb-5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                    Image de couverture <span className="text-gray-400 normal-case font-normal">(optionnel)</span>
                  </label>
                  <label className="relative block w-full rounded-2xl overflow-hidden cursor-pointer border-2 border-dashed border-gray-200 hover:border-fuchsia transition-all group"
                    style={{ paddingBottom: eventImage ? '0' : '35%' }}>
                    {eventImage ? (
                      <img src={eventImage} alt="couverture" className="w-full h-48 object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 group-hover:text-fuchsia transition-colors">
                        <div className="w-10 h-10 border-2 border-current rounded-xl flex items-center justify-center mb-2">
                          <Plus size={18} />
                        </div>
                        <span className="text-sm font-medium">Ajouter une image</span>
                        <span className="text-xs mt-0.5">JPG, PNG — recommandé 1200×630</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleEventImageChange} />
                    {eventImage && (
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                        <span className="text-white text-sm font-semibold bg-black/50 px-4 py-2 rounded-full">Changer l'image</span>
                      </div>
                    )}
                  </label>
                  {eventImage && (
                    <button type="button" onClick={() => setEventImage(null)}
                      className="text-xs text-red-400 hover:text-red-600 mt-1 transition-colors">
                      Supprimer l'image
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Titre */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Titre *</label>
                    <input required type="text" value={newEvent.title} onChange={e => setNewEvent(v=>({...v, title:e.target.value}))}
                      placeholder="Ex: Gala de bienfaisance 2026"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia" />
                  </div>

                  {/* Type + Ville */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Type</label>
                      <select value={newEvent.type} onChange={e => setNewEvent(v=>({...v, type:e.target.value}))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia">
                        {EVENT_TYPES_FORM.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Ville</label>
                      <select value={newEvent.location} onChange={e => setNewEvent(v=>({...v, location:e.target.value}))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia">
                        {['Yaounde','Douala','Bafoussam','Autre'].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Date + Heure */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Date *</label>
                      <input required type="date" value={newEvent.date} min={new Date().toISOString().split('T')[0]}
                        onChange={e => setNewEvent(v=>({...v, date:e.target.value}))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Heure</label>
                      <input type="time" value={newEvent.heure} onChange={e => setNewEvent(v=>({...v, heure:e.target.value}))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia" />
                    </div>
                  </div>

                  {/* Places + Prix */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Places max</label>
                      <input type="number" min="1" value={newEvent.maxParticipants} onChange={e => setNewEvent(v=>({...v, maxParticipants:e.target.value}))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Prix</label>
                      <input type="text" value={newEvent.price} onChange={e => setNewEvent(v=>({...v, price:e.target.value}))}
                        placeholder="Gratuit ou montant FCFA"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia" />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Description</label>
                    <textarea value={newEvent.description} onChange={e => setNewEvent(v=>({...v, description:e.target.value}))} rows={3}
                      placeholder="Decrivez votre evenement..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia" />
                  </div>

                  <div className="flex gap-3 pt-1">
                    <button type="submit" className="btn-primary text-sm flex-1">Publier l'evenement</button>
                    <button type="button" onClick={() => setShowModal(false)} className="btn-outline text-sm px-5">Annuler</button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default function EventsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-fuchsia border-t-transparent rounded-full animate-spin"/></div>}>
      <EventsContent />
    </Suspense>
  )
}
