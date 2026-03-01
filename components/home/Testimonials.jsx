'use client'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { TESTIMONIALS } from '@/data/mockData'
import StarRating from '../ui/StarRating'

export default function Testimonials() {
  const [current, setCurrent] = useState(0)

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-fuchsia text-sm font-semibold tracking-widest uppercase mb-2">Temoignages</p>
          <h2 className="section-title">Ce qu'elles disent de nous</h2>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Large testimonial */}
          <div className="bg-gray-50 rounded-3xl p-10 md:p-16 relative">
            {/* Quote mark */}
            <div className="absolute top-6 left-8 text-8xl font-display text-fuchsia/10 leading-none select-none">"</div>

            <div className="relative">
              <p className="font-display text-xl md:text-2xl text-petrol italic leading-relaxed mb-8 text-center">
                "{TESTIMONIALS[current].text}"
              </p>
              <div className="flex flex-col items-center gap-3">
                <img
                  src={TESTIMONIALS[current].image}
                  alt={TESTIMONIALS[current].name}
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-fuchsia/20"
                />
                <div className="text-center">
                  <p className="font-semibold text-petrol">{TESTIMONIALS[current].name}</p>
                  <p className="text-sm text-gray-500">{TESTIMONIALS[current].role}</p>
                  <div className="mt-2 flex justify-center">
                    <StarRating rating={TESTIMONIALS[current].rating} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-8">
            <button onClick={() => setCurrent(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-fuchsia hover:text-fuchsia transition-all">
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2 items-center">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all ${i === current ? 'w-8 bg-fuchsia' : 'w-2 bg-gray-300'}`} />
              ))}
            </div>
            <button onClick={() => setCurrent(i => (i + 1) % TESTIMONIALS.length)}
              className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-fuchsia hover:text-fuchsia transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
