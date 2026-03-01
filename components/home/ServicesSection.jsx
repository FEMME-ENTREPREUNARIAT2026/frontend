'use client'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Play, Star, Heart, ArrowRight } from 'lucide-react'
import { SERVICES } from '@/data/mockData'

// Les 8 images et 4 videos disponibles dans /images
const ALL_IMAGES = [
  '/images/img1.jpg',
  '/images/img2.jpg',
  '/images/img3.jpg',
  '/images/img4.jpg',
  '/images/img5.jpg',
  '/images/img6.jpg',
  '/images/img7.jpg',
  '/images/img8.jpg',
]
const ALL_VIDEOS = [
  '/images/vid1.mp4',
  '/images/vid2.mp4',
  '/images/vid3.mp4',
  '/images/vid4.mp4',
]

// Calcule la source media d'une prestation en variant les images
// 3 cartes sur 12 auront une video (positions 3, 7, 11 de chaque categorie)
function getMedia(service, positionInCategory) {
  const isVideoSlot = positionInCategory === 2 || positionInCategory === 6 || positionInCategory === 10
  if (isVideoSlot) {
    return { type: 'video', src: ALL_VIDEOS[positionInCategory % ALL_VIDEOS.length] }
  }
  // Varie les images en combinant l'index de position et l'id du service
  const imageIndex = (service.id + positionInCategory) % ALL_IMAGES.length
  return { type: 'image', src: ALL_IMAGES[imageIndex] }
}

// Categories — fond blanc, accent de couleur uniquement sur le titre
const HOME_CATEGORIES = [
  { id: 'coiffure',       label: 'Coiffure',            accent: '#E91E63' },
  { id: 'restauration',   label: 'Restauration',         accent: '#FF8F00' },
  { id: 'decoration',     label: 'Decoration',           accent: '#7E57C2' },
  { id: 'makeup',         label: 'Makeup & Beaute',      accent: '#E91E63' },
  { id: 'cinematographie',label: 'Cinematographie',      accent: '#00695C' },
  { id: 'manucure',       label: 'Manucure & Pedicure',  accent: '#7E57C2' },
  { id: 'hotesses',       label: 'Hotesses & Protocole', accent: '#1565C0' },
  { id: 'mc',             label: 'Maitre de Ceremonie',  accent: '#283593' },
  { id: 'sonorisation',   label: 'Sonorisation & DJ',    accent: '#E65100' },
  { id: 'billeterie',     label: 'Billeterie',           accent: '#2E7D32' },
]

// -----------------------------------------------------------
// Carte prestation individuelle
// -----------------------------------------------------------
function ServiceCard({ service, positionInCategory }) {
  const [liked, setLiked] = useState(false)
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef(null)
  const media = getMedia(service, positionInCategory)

  function onEnter() {
    if (media.type === 'video' && videoRef.current) {
      videoRef.current.play().catch(() => {})
      setPlaying(true)
    }
  }
  function onLeave() {
    if (media.type === 'video' && videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
      setPlaying(false)
    }
  }

  return (
    <Link
      href={`/services/${service.id}`}
      className="group flex-shrink-0 w-48 sm:w-52 block rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* Zone media */}
      <div className="relative overflow-hidden bg-gray-50" style={{ paddingBottom: '78%' }}>
        {media.type === 'video' ? (
          <>
            <video
              ref={videoRef}
              src={media.src}
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Overlay play quand en pause */}
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${playing ? 'opacity-0' : 'opacity-100'}`}>
              <div className="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Play size={16} className="text-white ml-0.5" fill="white" />
              </div>
            </div>
            {/* Badge video */}
            <span className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
              <Play size={9} fill="white" />
              Video
            </span>
          </>
        ) : (
          <img
            src={media.src}
            alt={service.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={e => { e.target.src = '/images/img1.jpg' }}
          />
        )}

        {/* Bouton like */}
        <button
          onClick={e => { e.preventDefault(); setLiked(!liked) }}
          className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <Heart size={13} className={liked ? 'fill-fuchsia text-fuchsia' : 'text-gray-400'} />
        </button>
      </div>

      {/* Texte */}
      <div className="p-3">
        <p className="text-xs text-gray-400 truncate mb-0.5">{service.providerName}</p>
        <h4 className="font-display font-semibold text-xs text-petrol leading-snug line-clamp-2 mb-2 min-h-[2.2rem]">
          {service.title}
        </h4>
        <div className="flex items-center gap-1 mb-2">
          <Star size={11} className="fill-gold text-gold" />
          <span className="text-xs font-medium text-gray-600">{service.rating}</span>
          <span className="text-xs text-gray-300 ml-1">·</span>
          <span className="text-xs text-gray-400">{service.city}</span>
        </div>
        <span className="font-bold text-fuchsia text-sm">
          {service.price.toLocaleString('fr-FR')} FCFA
        </span>
      </div>
    </Link>
  )
}

// -----------------------------------------------------------
// Carrousel d'une categorie
// -----------------------------------------------------------
function CategoryCarousel({ category }) {
  const scrollRef = useRef(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)

  const items = SERVICES
    .filter(s => s.category === category.id)
    .sort((a, b) => b.views - a.views)
    .slice(0, 12)

  if (items.length === 0) return null

  function checkScroll() {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 5)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5)
  }

  function scrollLeft() {
    scrollRef.current?.scrollBy({ left: -900, behavior: 'smooth' })
    setTimeout(checkScroll, 450)
  }
  function scrollRight() {
    scrollRef.current?.scrollBy({ left: 900, behavior: 'smooth' })
    setTimeout(checkScroll, 450)
  }

  return (
    <div className="mb-12">
      {/* En-tete : trait + titre + fleches + voir tout */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          {/* Trait vertical de couleur */}
          <div className="w-1 h-7 rounded-full" style={{ backgroundColor: category.accent }} />
          <h3 className="font-display text-xl font-bold" style={{ color: category.accent }}>
            {category.label}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={scrollLeft}
            disabled={!canLeft}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-700 disabled:opacity-25 transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={scrollRight}
            disabled={!canRight}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-700 disabled:opacity-25 transition-all"
          >
            <ChevronRight size={16} />
          </button>
          <Link
            href={`/services?category=${category.id}`}
            className="hidden sm:flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-fuchsia transition-colors ml-1"
          >
            Voir tout <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Bande scrollable */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto pb-3"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((service, index) => (
          <ServiceCard key={service.id} service={service} positionInCategory={index} />
        ))}
      </div>

      {/* Separateur leger */}
      <div className="mt-8 h-px bg-gray-100" />
    </div>
  )
}

// -----------------------------------------------------------
// Section principale
// -----------------------------------------------------------
export default function ServicesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* En-tete global */}
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="text-fuchsia text-xs font-bold tracking-widest uppercase mb-2">
              Nos prestations
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-petrol">
              Services par Categorie
            </h2>
            <p className="text-gray-400 mt-1 text-lg">
              Les 12 meilleures prestations de chaque categorie
            </p>
          </div>
          <Link href="/services" className="hidden md:flex items-center gap-2 btn-outline">
            Toutes les prestations
          </Link>
        </div>

        {/* Un carrousel par categorie */}
        {HOME_CATEGORIES.map(cat => (
          <CategoryCarousel key={cat.id} category={cat} />
        ))}

        <div className="text-center mt-4 md:hidden">
          <Link href="/services" className="btn-outline">Toutes les prestations</Link>
        </div>
      </div>
    </section>
  )
}
