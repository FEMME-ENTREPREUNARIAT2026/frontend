'use client'
import Link from 'next/link'
import { Eye, Calendar, MapPin, Users } from 'lucide-react'
import { IMAGES } from '@/data/mediaUtils'

export default function EventCard({ event }) {
  const date = new Date(event.date)
  const isPast = date < new Date()
  // Les cartes d'evenements passes ne s'affichent pas
  if (isPast) return null

  const formattedDate = date.toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
  const participation = Math.round((event.participants / event.maxParticipants) * 100)
  // Image de l'evenement : champ image si disponible, sinon varie selon id
  const imgSrc = event.image || IMAGES[Math.abs(event.id || 0) % IMAGES.length]

  return (
    <Link href={`/events/${event.id}`} className="card group block">
      {/* Image */}
      <div className="relative overflow-hidden" style={{ paddingBottom: '56%' }}>
        <img
          src={imgSrc}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={e => { e.target.src = '/images/img4.jpg' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

        {/* Badge type */}
        <span className="absolute top-3 left-3 bg-fuchsia text-white text-xs font-bold px-3 py-1 rounded-full">
          {event.type}
        </span>

        {/* Icone oeil — clic direct vers la page detail */}
        <Link
          href={`/events/${event.id}`}
          onClick={e => e.stopPropagation()}
          className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-fuchsia transition-all"
          aria-label="Voir les details"
        >
          <Eye size={14} />
        </Link>

        {/* Titre sur l'image */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-display font-semibold text-white text-sm leading-snug line-clamp-2">
            {event.title}
          </h3>
        </div>
      </div>

      {/* Details */}
      <div className="p-4">
        <div className="flex flex-col gap-1.5 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1.5">
            <Calendar size={12} className="text-fuchsia flex-shrink-0" />
            {formattedDate} à {event.time}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={12} className="text-fuchsia flex-shrink-0" />
            {event.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={12} className="text-fuchsia flex-shrink-0" />
            {event.participants} / {event.maxParticipants} participants
          </span>
        </div>

        {/* Barre de remplissage */}
        <div className="bg-gray-100 rounded-full h-1.5 mb-3">
          <div
            className="h-1.5 rounded-full transition-all"
            style={{
              width: `${Math.min(participation, 100)}%`,
              backgroundColor: participation >= 85 ? '#FFC107' : '#E91E63'
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="font-bold text-fuchsia">
            {event.price === 0 ? 'Gratuit' : `${(event.price).toLocaleString('fr-FR')} FCFA`}
          </span>
          <span className="text-xs text-gray-400 truncate ml-2">
            par {event.organizer}
          </span>
        </div>
      </div>
    </Link>
  )
}
