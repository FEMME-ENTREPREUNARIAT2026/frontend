'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Eye, ChevronLeft, ChevronRight, Calendar, MapPin, Users, ArrowRight } from 'lucide-react'
import { EVENTS } from '@/data/mockData'

// Calcule le ratio popularite
function getRatio(event) {
  return event.participants / event.maxParticipants
}

// Recupere les 4 evenements les plus populaires a venir
function getTop4() {
  const now = new Date()
  const upcoming = EVENTS.filter(e => new Date(e.date) > now)
  if (upcoming.length === 0) return EVENTS.slice(0, 4)
  return upcoming
    .sort((a, b) => {
      const diff = getRatio(b) - getRatio(a)
      if (Math.abs(diff) > 0.05) return diff
      return new Date(a.date) - new Date(b.date)
    })
    .slice(0, 4)
}

export default function EventsCarousel() {
  const [events, setEvents] = useState([])
  const [active, setActive] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    setEvents(getTop4())
    // Re-filtre toutes les heures au cas ou un evenement expire
    const hourly = setInterval(() => setEvents(getTop4()), 3600000)
    return () => clearInterval(hourly)
  }, [])

  const goTo = useCallback((idx) => {
    if (transitioning) return
    setTransitioning(true)
    setTimeout(() => {
      setActive(idx)
      setTransitioning(false)
    }, 350)
  }, [transitioning])

  // Autoplay toutes les 6 secondes
  useEffect(() => {
    if (events.length === 0) return
    timerRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % events.length)
    }, 6000)
    return () => clearInterval(timerRef.current)
  }, [events.length])

  function handlePrev() {
    clearInterval(timerRef.current)
    goTo((active - 1 + events.length) % events.length)
  }

  function handleNext() {
    clearInterval(timerRef.current)
    goTo((active + 1) % events.length)
  }

  if (events.length === 0) return null

  const featured = events[active]
  const spotsLeft = featured.maxParticipants - featured.participants
  const ratio = Math.round(getRatio(featured) * 100)
  const featuredDate = new Date(featured.date).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Titre de section */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-fuchsia text-xs font-bold tracking-widest uppercase mb-2">
              A ne pas manquer
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-petrol">
              Evenements Populaires
            </h2>
            <p className="text-gray-400 mt-1">
              Selectionnes par popularite et date proche
            </p>
          </div>
          <Link href="/events"
            className="hidden md:flex items-center gap-2 text-sm font-medium text-fuchsia hover:text-fuchsia-dark transition-colors">
            Voir tout <ArrowRight size={16} />
          </Link>
        </div>

        {/* Hero du carrousel : grande carte + 3 vignettes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">

          {/* Grande carte de l'evenement actif */}
          <div
            className="lg:col-span-2 relative rounded-3xl overflow-hidden cursor-pointer group"
            style={{ minHeight: '480px' }}
          >
            {/* Image de fond avec transition */}
            {events.map((e, i) => (
              <div
                key={e.id}
                className="absolute inset-0 transition-opacity duration-500"
                style={{ opacity: i === active ? 1 : 0 }}
              >
                <img
                  src={e.image}
                  alt={e.title}
                  className="w-full h-full object-cover"
                  onError={ev => { ev.target.src = '/images/img4.jpg' }}
                />
              </div>
            ))}

            {/* Gradient de lecture */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Fleches de navigation */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-fuchsia transition-all duration-200"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-fuchsia transition-all duration-200"
            >
              <ChevronRight size={20} />
            </button>

            {/* Badge type */}
            <div className="absolute top-5 left-5 z-10">
              <span className="bg-fuchsia text-white text-xs font-bold px-3 py-1.5 rounded-full">
                {featured.type}
              </span>
              {ratio >= 85 && (
                <span className="ml-2 bg-gold text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  Presque complet !
                </span>
              )}
            </div>

            {/* Icone oeil */}
            <Link
              href={`/events/${featured.id}`}
              className="absolute top-5 right-5 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white hover:text-fuchsia transition-all duration-200"
              aria-label="Voir les details"
            >
              <Eye size={18} />
            </Link>

            {/* Contenu texte en bas */}
            <div
              className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 z-10 transition-all duration-500"
              style={{ opacity: transitioning ? 0 : 1, transform: transitioning ? 'translateY(10px)' : 'translateY(0)' }}
            >
              <h3 className="font-display text-2xl lg:text-3xl font-bold text-white leading-tight mb-4">
                {featured.title}
              </h3>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <Calendar size={14} className="text-gold flex-shrink-0" />
                  <span>{featuredDate}</span>
                </div>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <Calendar size={14} className="text-gold flex-shrink-0" />
                  <span>A {featured.time}</span>
                </div>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <MapPin size={14} className="text-gold flex-shrink-0" />
                  <span className="truncate">{featured.location}</span>
                </div>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <Users size={14} className="text-gold flex-shrink-0" />
                  <span>{featured.participants} reservations · {spotsLeft} places restantes</span>
                </div>
              </div>

              {/* Barre de popularite */}
              <div className="mb-5">
                <div className="flex justify-between text-xs text-white/60 mb-1.5">
                  <span>Popularite</span>
                  <span>{ratio}% complet</span>
                </div>
                <div className="bg-white/20 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all duration-700"
                    style={{ width: `${ratio}%`, backgroundColor: ratio >= 85 ? '#FFC107' : '#E91E63' }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-gold font-display font-bold text-2xl">
                    {featured.price === 0 ? 'Gratuit' : `${featured.price.toLocaleString('fr-FR')} FCFA`}
                  </span>
                  <span className="text-white/50 text-xs ml-2">par personne</span>
                </div>
                <Link
                  href={`/events/${featured.id}`}
                  className="bg-fuchsia hover:bg-fuchsia-dark text-white font-medium px-6 py-2.5 rounded-full text-sm transition-all duration-200 flex items-center gap-2"
                >
                  <Eye size={15} />
                  Voir les details
                </Link>
              </div>
            </div>

            {/* Indicateurs de slide en bas au centre */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {events.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === active ? 'w-6 bg-fuchsia' : 'w-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Colonne des 3 vignettes (les autres evenements) */}
          <div className="flex flex-row lg:flex-col gap-3 lg:gap-4 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {events.map((event, i) => {
              if (i === active) return null
              const d = new Date(event.date)
              const shortDate = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
              const sLeft = event.maxParticipants - event.participants

              return (
                <button
                  key={event.id}
                  onClick={() => goTo(i)}
                  className={`flex-shrink-0 lg:flex-shrink relative rounded-2xl overflow-hidden text-left transition-all duration-300 group ${
                    i === active ? 'ring-2 ring-fuchsia shadow-lg' : 'hover:shadow-lg hover:scale-[1.02]'
                  }`}
                  style={{ minWidth: '200px', flex: 1, height: '140px', position: 'relative' }}
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={ev => { ev.target.src = '/images/img4.jpg' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute inset-0 p-3 flex flex-col justify-between">
                    <span className="bg-fuchsia/90 text-white text-xs font-bold px-2 py-0.5 rounded-full self-start">
                      {event.type}
                    </span>
                    <div>
                      <p className="text-white font-semibold text-xs leading-snug line-clamp-2 mb-1">
                        {event.title}
                      </p>
                      <div className="flex items-center justify-between text-white/70 text-xs">
                        <span className="flex items-center gap-1">
                          <Calendar size={9} />
                          {shortDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={9} />
                          {sLeft} places
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Icone voir */}
                  <Link
                    href={`/events/${event.id}`}
                    onClick={e => e.stopPropagation()}
                    className="absolute top-2 right-2 w-7 h-7 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-fuchsia transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Eye size={12} />
                  </Link>
                </button>
              )
            })}

            {/* Bouton Voir tout evenements */}
            <Link
              href="/events"
              className="flex-shrink-0 lg:flex-shrink rounded-2xl border-2 border-dashed border-gray-200 hover:border-fuchsia flex items-center justify-center gap-2 text-sm font-medium text-gray-400 hover:text-fuchsia transition-all duration-200 p-4 min-h-[80px]"
            >
              <ArrowRight size={16} />
              <span>Voir tout</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
