'use client'
import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import EventCard from '@/components/ui/EventCard'
import { EVENTS } from '@/data/mockData'
import { SlidersHorizontal, X, Search } from 'lucide-react'

const EVENT_TYPES = ['Tous', 'Mariage', 'Anniversaire', 'Baby Shower', 'EVJF', 'Seminaire', 'Concert', 'Festival', 'Lancement produit']
const CITIES = ['Toutes les villes', 'Yaounde', 'Douala', 'Bafoussam']

const ALL_EVENTS = [
  ...EVENTS,
  ...Array.from({ length: 22 }, (_, i) => ({
    ...EVENTS[i % EVENTS.length],
    id: 100 + i,
    title: `${EVENTS[i % EVENTS.length].title} — Edition ${i + 2}`,
    date: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    participants: Math.floor(30 + (i * 17 % 150)),
  }))
]

function EventsContent() {
  const searchParams = useSearchParams()
  const [type, setType] = useState('Tous')
  const [city, setCity] = useState('Toutes les villes')
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filtered = useMemo(() => {
    return ALL_EVENTS.filter(e => {
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
  }, [type, city, searchTerm])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-16">
        {/* Hero */}
        <div className="bg-gradient-to-br from-fuchsia to-fuchsia-dark text-white py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-gold text-xs font-bold tracking-widest uppercase mb-2">Agenda</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">Evenements</h1>
            <p className="text-white/80">{ALL_EVENTS.length} evenements au Cameroun</p>
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
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600 font-medium">
              <span className="text-fuchsia font-bold text-lg">{filtered.length}</span> evenement{filtered.length > 1 ? 's' : ''}
              {searchTerm && <span className="ml-2 text-sm text-gray-400">pour "{searchTerm}"</span>}
            </p>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 border rounded-full px-4 py-2 text-sm font-medium transition-all ${
                showFilters ? 'border-fuchsia text-fuchsia bg-fuchsia/5' : 'border-gray-200 text-gray-600 hover:border-fuchsia hover:text-fuchsia'
              }`}>
              <SlidersHorizontal size={16} />
              Filtre ville
              {showFilters && <X size={14} />}
            </button>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
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
