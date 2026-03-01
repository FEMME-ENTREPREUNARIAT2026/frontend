'use client'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import StarRating from './StarRating'
import Badge from './Badge'
import { CATEGORIES } from '@/data/mockData'
import { IMAGES } from '@/data/mediaUtils'

export default function ProviderCard({ provider }) {
  const catLabel = CATEGORIES.find(c => c.id === provider.category)?.label || provider.category
  // Image du prestataire : champ image si disponible, sinon varie selon id
  const imgSrc = provider.image || IMAGES[Math.abs(provider.id || 0) % IMAGES.length]

  return (
    <Link href={`/providers/${provider.id}`} className="card group block">
      <div className="relative overflow-hidden" style={{ paddingBottom: '70%' }}>
        <img
          src={imgSrc}
          alt={provider.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={e => {
            // Fallback : image variee selon l'id (jamais de placeholder.jpg)
            e.target.src = IMAGES[Math.abs(provider.id || 0) % IMAGES.length]
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

        {/* Nom et ville en bas */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-display font-semibold text-white text-sm mb-1 line-clamp-1">
            {provider.name}
          </h3>
          <div className="flex items-center gap-1 text-white/80 text-xs">
            <MapPin size={10} />
            {provider.city}
          </div>
        </div>

        {/* Badge categorie */}
        <div className="absolute top-2 left-2">
          <Badge label={catLabel} category={provider.category} />
        </div>
      </div>

      {/* Note */}
      <div className="p-3">
        <div className="flex items-center justify-between">
          <StarRating rating={provider.rating} size={12} />
          <span className="text-xs text-gray-400">{provider.reviews} avis</span>
        </div>
      </div>
    </Link>
  )
}
