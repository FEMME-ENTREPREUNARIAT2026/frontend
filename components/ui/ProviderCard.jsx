'use client'
import Link from 'next/link'
import { MapPin, CheckCircle } from 'lucide-react'
import StarRating from './StarRating'
import Badge from './Badge'
import { CATEGORIES } from '@/data/mockData'
import { IMAGES } from '@/data/mediaUtils'

export default function ProviderCard({ provider }) {
  const catLabel = CATEGORIES.find(c => c.id === provider.category)?.label || provider.category
  const imgSrc = provider.image || IMAGES[Math.abs(provider.id || 0) % IMAGES.length]

  return (
    <Link href={`/providers/${provider.id}`} className="card group block">
      {/* Image zone */}
      <div className="relative overflow-hidden" style={{ paddingBottom: '72%' }}>
        <img
          src={imgSrc}
          alt={provider.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={e => { e.target.src = IMAGES[Math.abs(provider.id || 0) % IMAGES.length] }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <Badge label={catLabel} category={provider.category} />
        </div>

        {/* Disponible indicator */}
        {provider.disponible && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-green-500/90 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            <CheckCircle size={10} />
            Disponible
          </div>
        )}

        {/* Name and city at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-display font-semibold text-white text-base leading-snug line-clamp-1 mb-1">
            {provider.name}
          </h3>
          <div className="flex items-center gap-1 text-white/70 text-xs">
            <MapPin size={10} />
            {provider.city}
          </div>
        </div>
      </div>

      {/* Rating row */}
      <div className="px-4 py-3 flex items-center justify-between">
        <StarRating rating={provider.rating} size={12} />
        <span className="text-xs text-gray-400 font-medium">{provider.reviews} avis</span>
      </div>

      {/* Tarif min */}
      {provider.tarifMin && (
        <div className="px-4 pb-3 -mt-1">
          <span className="text-xs text-gray-400">À partir de </span>
          <span className="text-sm font-bold text-fuchsia">
            {Number(provider.tarifMin).toLocaleString('fr-FR')} FCFA
          </span>
        </div>
      )}
    </Link>
  )
}
