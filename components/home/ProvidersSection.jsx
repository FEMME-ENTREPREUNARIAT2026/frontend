'use client'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PROVIDERS } from '@/data/mockData'
import ProviderCard from '../ui/ProviderCard'
import FadeIn from '@/components/ui/FadeIn'

export default function ProvidersSection() {
  const scrollRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)

  const providers = [...PROVIDERS].sort((a, b) => b.rating - a.rating).slice(0, 12)

  function checkScroll() {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 5)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5)
  }

  // Auto-scroll: saute 85% de la largeur visible → s'adapte à tous les écrans
  useEffect(() => {
    if (isHovered) return
    const interval = setInterval(() => {
      const el = scrollRef.current
      if (!el) return
      const JUMP = el.clientWidth * 0.85
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 8
      if (atEnd) {
        el.scrollLeft = 0
      } else {
        el.scrollBy({ left: JUMP, behavior: 'smooth' })
      }
      setTimeout(checkScroll, 500)
    }, 2200)
    return () => clearInterval(interval)
  }, [isHovered])

  function scrollLeft() {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: -(el.clientWidth * 0.85), behavior: 'smooth' })
    setTimeout(checkScroll, 450)
  }
  function scrollRight() {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: el.clientWidth * 0.85, behavior: 'smooth' })
    setTimeout(checkScroll, 450)
  }

  return (
    <section
      className="py-12 md:py-20 relative overflow-hidden"
      style={{ background: 'var(--cream)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 dot-grid opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Header — titre à gauche, contrôles à droite, wrapping sur mobile */}
        <FadeIn direction="up" className="flex flex-wrap items-start justify-between gap-4 mb-8 md:mb-10">
          <div>
            <span className="section-label">Top prestataires</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-petrol font-semibold leading-tight">
              Les Mieux Notées
            </h2>
            <p className="text-gray-500 mt-2 text-base md:text-lg leading-relaxed">
              Les professionnelles les plus appréciées de la plateforme
            </p>
          </div>

          {/* Contrôles — toujours visibles */}
          <div className="flex items-center gap-2 self-end">
            <button
              onClick={scrollLeft}
              disabled={!canLeft}
              className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-fuchsia hover:text-fuchsia disabled:opacity-25 transition-all"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={scrollRight}
              disabled={!canRight}
              className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-fuchsia hover:text-fuchsia disabled:opacity-25 transition-all"
            >
              <ChevronRight size={15} />
            </button>
            <Link
              href="/providers"
              className="ml-1 text-xs md:text-sm font-semibold text-fuchsia border border-fuchsia px-3 py-1.5 md:px-5 md:py-2 rounded-full hover:bg-fuchsia hover:text-white transition-all"
            >
              Voir tout
            </Link>
          </div>
        </FadeIn>

        {/* Bande scrollable :
            mobile  → ~2 cartes (44vw each)
            sm      → ~3 cartes (w-44)
            md+     → 4-5 cartes (w-48 / w-52) */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-3 md:gap-4 overflow-x-auto pb-3"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {providers.map(provider => (
            <div key={provider.id} className="flex-shrink-0 w-[44vw] sm:w-44 md:w-48 lg:w-52">
              <ProviderCard provider={provider} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
