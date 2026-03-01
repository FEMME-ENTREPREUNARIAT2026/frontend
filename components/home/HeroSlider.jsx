'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { HERO_SLIDES } from '@/data/mockData'

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [wordIdx, setWordIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  // Avance automatiquement toutes les 6 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % HERO_SLIDES.length)
        setWordIdx(0)
        setVisible(true)
      }, 500)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  // Fait tourner les mots du slide actif
  useEffect(() => {
    setWordIdx(0)
    const timer = setInterval(() => {
      setWordIdx(prev => (prev + 1) % HERO_SLIDES[current].rotatingWords.length)
    }, 2000)
    return () => clearInterval(timer)
  }, [current])

  function goTo(idx) {
    setVisible(false)
    setTimeout(() => { setCurrent(idx); setWordIdx(0); setVisible(true) }, 400)
  }

  const slide = HERO_SLIDES[current]

  return (
    <div className="relative h-screen min-h-[600px] overflow-hidden">

      {/* Images de fond */}
      {HERO_SLIDES.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img
            src={s.image}
            alt=""
            className="w-full h-full object-cover"
            onError={e => { e.target.src = '/images/img1.jpg' }}
          />
        </div>
      ))}

      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(135deg, rgba(0,105,92,0.6) 0%, rgba(233,30,99,0.3) 100%)'
      }} />

      {/* Contenu */}
      <div
        className="absolute inset-0 flex items-center transition-all duration-500"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-2xl">

            {/* Texte introductif du slide (leadText) */}
            <p className="text-lavender text-sm font-semibold tracking-widest uppercase mb-4">
              {slide.leadText}
            </p>

            {/* Mot tournant en grand */}
            <div className="mb-6">
              <h1
                key={`${current}-${wordIdx}`}
                className="font-display text-5xl md:text-7xl font-bold text-gold leading-none"
                style={{ animation: 'fadeUp 0.4s ease forwards' }}
              >
                {slide.rotatingWords[wordIdx]}
              </h1>
            </div>

            {/* Description */}
            <p className="text-white/90 text-lg md:text-xl mb-8 max-w-lg leading-relaxed">
              {slide.caption}
            </p>

            {/* Boutons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={slide.ctaLink}
                className="bg-fuchsia text-white px-8 py-4 rounded-full font-semibold text-center hover:bg-fuchsia/90 transition-all shadow-lg hover:shadow-fuchsia/30 hover:-translate-y-0.5"
              >
                {slide.cta}
              </Link>
              <Link
                href="/auth/register"
                className="border-2 border-white/70 text-white px-8 py-4 rounded-full font-semibold text-center hover:bg-white hover:text-petrol transition-all"
              >
                Rejoindre la plateforme
              </Link>
            </div>

            {/* Statistiques */}
            <div className="flex gap-8 mt-12">
              {[
                { value: '100+', label: 'Prestations' },
                { value: '70+', label: 'Prestataires' },
                { value: '30+', label: 'Evenements' },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="text-2xl font-display font-bold text-gold">{stat.value}</div>
                  <div className="text-white/60 text-xs mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fleches navigation */}
      <button
        onClick={() => goTo((current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-fuchsia transition-all"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => goTo((current + 1) % HERO_SLIDES.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-fuchsia transition-all"
      >
        <ChevronRight size={20} />
      </button>

      {/* Indicateurs de slide */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i === current ? '2rem' : '0.5rem',
              backgroundColor: i === current ? '#E91E63' : 'rgba(255,255,255,0.4)'
            }}
          />
        ))}
      </div>
    </div>
  )
}
