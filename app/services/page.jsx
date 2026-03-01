'use client'
import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ServiceCard from '@/components/ui/ServiceCard'
import { SERVICES, CATEGORIES } from '@/data/mockData'
import { enrichServices } from '@/data/mediaUtils'
import { SlidersHorizontal, X, Search } from 'lucide-react'

const CITIES = ['Toutes les villes', 'Yaounde', 'Douala', 'Bafoussam', 'Garoua', 'Bertoua']

// Toutes les prestations avec images et videos correctement assignees
// enrichServices varie les images et place des videos toutes les 10 cartes
const ALL_SERVICES = enrichServices(SERVICES)

// -------------------------------------------------------
// Composant principal (doit etre dans Suspense pour useSearchParams)
// -------------------------------------------------------
function ServicesContent() {
  const searchParams = useSearchParams()
  // Lire la categorie depuis l'URL si on vient de l'accueil (?category=coiffure)
  const urlCategory = searchParams.get('category') || 'all'

  const [category, setCategory] = useState(urlCategory)
  const [city, setCity] = useState('Toutes les villes')
  const [maxPrice, setMaxPrice] = useState(1000000)
  const [minRating, setMinRating] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // ---- Filtrage : recalcule a chaque changement de filtre ----
  const filtered = useMemo(() => {
    return ALL_SERVICES.filter(s => {
      if (category !== 'all' && s.category !== category) return false
      if (city !== 'Toutes les villes' && s.city !== city) return false
      if (s.price > maxPrice) return false
      if (s.rating < minRating) return false
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim()
        const inTitle = (s.title || '').toLowerCase().includes(q)
        const inProvider = (s.providerName || '').toLowerCase().includes(q)
        const inDesc = (s.description || '').toLowerCase().includes(q)
        if (!inTitle && !inProvider && !inDesc) return false
      }
      return true
    }).sort((a, b) => b.views - a.views)
  }, [category, city, maxPrice, minRating, searchTerm])

  function resetFilters() {
    setCategory('all')
    setCity('Toutes les villes')
    setMaxPrice(1000000)
    setMinRating(0)
    setSearchTerm('')
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-16">

        {/* Hero */}
        <div className="bg-petrol text-white py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-gold text-xs font-bold tracking-widest uppercase mb-2">Explorer</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
              Toutes les Prestations
            </h1>
            <p className="text-white/70">{ALL_SERVICES.length} prestations disponibles au Cameroun</p>

            {/* Barre de recherche */}
            <div className="relative mt-6 max-w-lg">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Rechercher une prestation, un prestataire..."
                className="w-full pl-11 pr-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:bg-white/20 transition-all text-sm"
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Sous-menu categories — scrollable horizontalement sur mobile */}
          <div className="bg-white rounded-2xl shadow-sm mb-6 overflow-x-auto">
            <div className="flex gap-1 p-3 min-w-max">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    category === cat.id
                      ? 'bg-fuchsia text-white shadow-md shadow-fuchsia/20'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-petrol'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Barre resultats + bouton filtres avances */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600 font-medium">
              <span className="text-fuchsia font-bold text-lg">{filtered.length}</span>
              {' '}prestation{filtered.length > 1 ? 's' : ''}
              {category !== 'all' && (
                <span className="ml-2 text-sm text-gray-400">
                  dans {CATEGORIES.find(c => c.id === category)?.label}
                </span>
              )}
            </p>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 border rounded-full px-4 py-2 text-sm font-medium transition-all ${
                showFilters
                  ? 'border-fuchsia text-fuchsia bg-fuchsia/5'
                  : 'border-gray-200 text-gray-600 hover:border-fuchsia hover:text-fuchsia'
              }`}
            >
              <SlidersHorizontal size={16} />
              Filtres avances
              {showFilters && <X size={14} className="ml-1" />}
            </button>
          </div>

          {/* Panneau de filtres avances */}
          {showFilters && (
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Filtre ville */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ville</label>
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia"
                >
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* Filtre prix */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Prix max : {maxPrice.toLocaleString('fr-FR')} FCFA
                </label>
                <input
                  type="range"
                  min={0}
                  max={1000000}
                  step={10000}
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-fuchsia"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0</span>
                  <span>1 000 000 FCFA</span>
                </div>
              </div>

              {/* Filtre note */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Note min : {minRating > 0 ? `${minRating} ★` : 'Toutes'}
                </label>
                <input
                  type="range"
                  min={0}
                  max={5}
                  step={0.5}
                  value={minRating}
                  onChange={e => setMinRating(Number(e.target.value))}
                  className="w-full accent-fuchsia"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Toutes</span>
                  <span>5 ★</span>
                </div>
              </div>

              {/* Bouton reinitialiser */}
              <div className="md:col-span-3 pt-2 border-t border-gray-100">
                <button
                  onClick={resetFilters}
                  className="text-sm text-gray-400 hover:text-fuchsia transition-colors underline"
                >
                  Reinitialiser tous les filtres
                </button>
              </div>
            </div>
          )}

          {/* Grille des prestations */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-gray-300" />
              </div>
              <p className="font-display text-xl text-gray-500 mb-2">Aucune prestation trouvee</p>
              <p className="text-sm text-gray-400 mb-4">
                Essayez une autre categorie ou modifiez vos filtres
              </p>
              <button onClick={resetFilters} className="btn-outline text-sm">
                Tout reinitialiser
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

// Wrapper Suspense obligatoire pour useSearchParams (requis par Next.js)
export default function ServicesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-fuchsia border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Chargement des prestations...</p>
        </div>
      </div>
    }>
      <ServicesContent />
    </Suspense>
  )
}
