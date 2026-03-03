'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { HERO_SLIDES } from '@/data/mockData'

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [wordIdx, setWordIdx] = useState(0)
  const [visible, setVisible] = useState(true)

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
    <div className="relative h-screen min-h-[640px] overflow-hidden">

      {/* Background images */}
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

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(125deg, rgba(0,69,58,0.65) 0%, rgba(173,20,87,0.25) 60%, transparent 100%)'
      }} />

      {/* Decorative floating elements */}
      <div className="absolute top-1/4 right-12 w-24 h-24 rounded-full border border-white/10 animate-spin-slow pointer-events-none hidden lg:block" />
      <div className="absolute top-1/3 right-20 w-12 h-12 rounded-full border border-gold/20 animate-float pointer-events-none hidden lg:block" style={{ animationDelay: '1.5s' }} />
      <div className="absolute bottom-1/3 right-1/4 w-4 h-4 rounded-full bg-fuchsia/30 animate-float pointer-events-none hidden lg:block" style={{ animationDelay: '0.8s' }} />

      {/* Content */}
      <div
        className="absolute inset-0 flex items-center transition-all duration-600"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-2xl">

            {/* Script accent + lead text */}
            <div className="flex items-center gap-3 mb-5">
              <span className="font-script text-gold text-2xl opacity-90">{slide.leadText || 'Fempreneur Hub'}</span>
              <div className="h-px flex-1 max-w-16 bg-gold/40" />
            </div>

            {/* Rotating headline word */}
            <div className="mb-5">
              <h1
                key={`${current}-${wordIdx}`}
                className="font-display font-semibold text-gold leading-none"
                style={{ fontSize: 'clamp(3rem, 9vw, 6rem)', animation: 'fadeUp 0.45s ease forwards' }}
              >
                {slide.rotatingWords[wordIdx]}
              </h1>
            </div>

            {/* Caption */}
            <p className="text-white/85 text-lg md:text-xl mb-10 max-w-lg leading-relaxed font-light">
              {slide.caption}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={slide.ctaLink}
                className="btn-primary text-sm"
              >
                {slide.cta}
              </Link>
              <Link
                href="/auth/register"
                className="border-2 border-white/60 text-white px-7 py-3.5 rounded-full font-semibold text-sm text-center hover:bg-white hover:text-petrol transition-all backdrop-blur-sm"
              >
                Rejoindre la plateforme
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-10 mt-14">
              {[
                { value: '100+', label: 'Prestations' },
                { value: '70+', label: 'Prestataires' },
                { value: '30+', label: 'Événements' },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="font-display font-bold text-gold text-3xl gradient-text-gold">{stat.value}</div>
                  <div className="text-white/50 text-xs mt-0.5 font-medium tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => goTo((current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-fuchsia hover:scale-105 transition-all border border-white/20"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => goTo((current + 1) % HERO_SLIDES.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-fuchsia hover:scale-105 transition-all border border-white/20"
      >
        <ChevronRight size={20} />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i === current ? '2.5rem' : '0.5rem',
              backgroundColor: i === current ? '#C9A84C' : 'rgba(255,255,255,0.35)'
            }}
          />
        ))}
      </div>
    </div>
  )
}
