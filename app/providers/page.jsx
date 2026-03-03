'use client'
import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProviderCard from '@/components/ui/ProviderCard'
import { PROVIDERS, CATEGORIES } from '@/data/mockData'
import { IMAGES } from '@/data/mediaUtils'
import { SlidersHorizontal, X, Search } from 'lucide-react'
import { getBoutiques, normalizeBoutiqueForCard } from '@/lib/api'
import FadeIn from '@/components/ui/FadeIn'
import { StaggerContainer, StaggerItem } from '@/components/ui/StaggerChildren'

const CITIES = ['Toutes les villes', 'Yaounde', 'Douala', 'Bafoussam', 'Garoua']

const MOCK_PROVIDERS = [
  ...PROVIDERS,
  ...Array.from({ length: 60 }, (_, i) => {
    const base = PROVIDERS[i % PROVIDERS.length]
    return {
      ...base,
      id: 100 + i,
      name: `${base.name} Pro ${i + 1}`,
      image: IMAGES[(base.id + i) % IMAGES.length],
      rating: Math.round((3.5 + (((base.id * 7 + i * 13) % 30)) / 20) * 10) / 10,
      reviews: 20 + ((base.id * 11 + i * 17) % 200),
    }
  })
].slice(0, 70)

function ProvidersContent() {
  const searchParams = useSearchParams()
  const urlCategory = searchParams.get('category') || 'all'

  const [allProviders, setAllProviders] = useState(MOCK_PROVIDERS)
  const [category, setCategory] = useState(urlCategory)
  const [city, setCity] = useState('Toutes les villes')
  const [minRating, setMinRating] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    getBoutiques()
      .then(data => {
        if (data && data.length > 0) {
          setAllProviders(data.map(normalizeBoutiqueForCard))
        }
      })
      .catch(() => {})
  }, [])

  const filtered = useMemo(() => {
    return allProviders.filter(p => {
      if (category !== 'all' && p.category !== category) return false
      if (city !== 'Toutes les villes' && p.city !== city) return false
      if (p.rating < minRating) return false
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim()
        if (!p.name.toLowerCase().includes(q) &&
            !p.category.toLowerCase().includes(q) &&
            !(p.description || '').toLowerCase().includes(q) &&
            !(p.city || '').toLowerCase().includes(q)) return false
      }
      return true
    }).sort((a, b) => b.rating - a.rating)
  }, [allProviders, category, city, minRating, searchTerm])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-16">
        {/* Hero */}
        <div className="bg-gradient-to-br from-petrol to-petrol-dark text-white py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn direction="up">
              <p className="text-gold text-xs font-bold tracking-widest uppercase mb-2">Notre reseau</p>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">Nos Prestataires</h1>
              <p className="text-white/70">{allProviders.length} professionnelles de confiance au Cameroun</p>
            </FadeIn>
            {/* Barre de recherche */}
            <div className="relative mt-6 max-w-lg">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Rechercher par nom, categorie, ville..."
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
          {/* Sous-menu categories */}
          <div className="bg-white rounded-2xl shadow-sm mb-6 overflow-x-auto">
            <div className="flex gap-1 p-3 min-w-max">
              <button
                onClick={() => setCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  category === 'all' ? 'bg-fuchsia text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                Toutes
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    category === cat.id ? 'bg-fuchsia text-white shadow-md shadow-fuchsia/20' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Barre resultats + filtres */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600 font-medium">
              <span className="text-fuchsia font-bold text-lg">{filtered.length}</span> prestataire{filtered.length > 1 ? 's' : ''}
              {searchTerm && <span className="ml-2 text-sm text-gray-400">pour "{searchTerm}"</span>}
            </p>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 border rounded-full px-4 py-2 text-sm font-medium transition-all ${
                showFilters ? 'border-fuchsia text-fuchsia bg-fuchsia/5' : 'border-gray-200 text-gray-600 hover:border-fuchsia hover:text-fuchsia'
              }`}
            >
              <SlidersHorizontal size={16} />
              Filtres
              {showFilters && <X size={14} />}
            </button>
          </div>

          {showFilters && (
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ville</label>
                <select value={city} onChange={e => setCity(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia">
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Note minimum : {minRating > 0 ? `${minRating} ★` : 'Toutes'}
                </label>
                <input type="range" min={0} max={5} step={0.5} value={minRating}
                  onChange={e => setMinRating(Number(e.target.value))}
                  className="w-full accent-fuchsia" />
              </div>
              <div className="md:col-span-2 border-t border-gray-100 pt-3">
                <button onClick={() => { setCity('Toutes les villes'); setMinRating(0); setSearchTerm(''); setCategory('all') }}
                  className="text-sm text-gray-400 hover:text-fuchsia underline">
                  Reinitialiser
                </button>
              </div>
            </div>
          )}

          {/* Grille prestataires */}
          {filtered.length > 0 ? (
            <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map(provider => (
                <StaggerItem key={provider.id}>
                  <ProviderCard provider={provider} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <div className="text-center py-24">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-gray-300" />
              </div>
              <p className="font-display text-xl text-gray-500 mb-2">Aucune prestataire trouvee</p>
              <p className="text-sm text-gray-400">Essayez un autre terme ou une autre categorie</p>
              <button onClick={() => { setSearchTerm(''); setCategory('all') }}
                className="mt-4 btn-outline text-sm">Voir toutes</button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function ProvidersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-fuchsia border-t-transparent rounded-full animate-spin"/></div>}>
      <ProvidersContent />
    </Suspense>
  )
}
