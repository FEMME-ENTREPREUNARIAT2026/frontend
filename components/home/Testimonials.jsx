'use client'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { TESTIMONIALS } from '@/data/mockData'
import StarRating from '../ui/StarRating'
import FadeIn from '@/components/ui/FadeIn'

export default function Testimonials() {
  const [current, setCurrent] = useState(0)

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: 'var(--blush)' }}>
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full dot-grid opacity-60 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-gradient-to-br from-fuchsia/8 to-lavender/8 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-gradient-to-tr from-gold/8 to-fuchsia/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <FadeIn direction="up" className="text-center mb-16">
          <span className="section-label justify-center">Témoignages</span>
          <h2 className="section-title">Ce qu'elles disent de nous</h2>
          <p className="section-subtitle">Des femmes qui ont fait confiance à Fempreneur Hub</p>
        </FadeIn>

        <div className="max-w-3xl mx-auto">
          {/* Main testimonial card */}
          <FadeIn direction="up" delay={0.15} className="relative bg-white rounded-3xl p-10 md:p-14 shadow-premium border border-fuchsia/5">
            {/* Decorative quote mark */}
            <div
              className="absolute top-4 left-8 font-script leading-none select-none pointer-events-none"
              style={{ fontSize: '8rem', color: 'rgba(233,30,99,0.07)', lineHeight: 1 }}
            >
              "
            </div>

            <div className="relative text-center">
              {/* Stars */}
              <div className="flex justify-center mb-6">
                <StarRating rating={TESTIMONIALS[current].rating} size={18} />
              </div>

              {/* Quote text */}
              <p className="font-display text-xl md:text-2xl text-petrol italic leading-relaxed mb-10 font-medium">
                &ldquo;{TESTIMONIALS[current].text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <img
                    src={TESTIMONIALS[current].image}
                    alt={TESTIMONIALS[current].name}
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-fuchsia/15"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-fuchsia rounded-full flex items-center justify-center text-white text-xs font-bold">
                    ✓
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-petrol text-base">{TESTIMONIALS[current].name}</p>
                  <p className="text-sm text-fuchsia/70 font-medium mt-0.5">{TESTIMONIALS[current].role}</p>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-5 mt-8">
            <button
              onClick={() => setCurrent(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="w-10 h-10 rounded-full border-2 border-fuchsia/20 text-fuchsia/50 flex items-center justify-center hover:border-fuchsia hover:text-fuchsia transition-all"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-2 items-center">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? 'w-8 h-2.5 bg-fuchsia'
                      : 'w-2.5 h-2.5 bg-fuchsia/20 hover:bg-fuchsia/40'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrent(i => (i + 1) % TESTIMONIALS.length)}
              className="w-10 h-10 rounded-full border-2 border-fuchsia/20 text-fuchsia/50 flex items-center justify-center hover:border-fuchsia hover:text-fuchsia transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
