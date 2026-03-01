'use client'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { Eye, Play, Star } from 'lucide-react'
import { CATEGORIES } from '@/data/mockData'
import { getServiceImage, getServiceVideo } from '@/data/mediaUtils'
import { toggleLike, isLiked, getLikes, initStore } from '@/data/store'

function HeartIcon({ filled, size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? '#E91E63' : 'none'} stroke={filled ? '#E91E63' : 'currentColor'} strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )
}

export default function ServiceCard({ service }) {
  const catLabel = CATEGORIES.find(c => c.id === service.category)?.label || service.category
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef(null)

  const videoSrc = getServiceVideo(service)
  const imageSrc = getServiceImage(service)
  const isVideo = !!videoSrc

  useEffect(() => {
    initStore()
    setLiked(isLiked(service.id))
    setLikesCount(getLikes(service.id))
  }, [service.id])

  function onEnter() {
    if (isVideo && videoRef.current) {
      videoRef.current.play().catch(() => {})
      setPlaying(true)
    }
  }
  function onLeave() {
    if (isVideo && videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
      setPlaying(false)
    }
  }

  function handleLike(e) {
    e.preventDefault()
    const nowLiked = toggleLike(service.id)
    setLiked(nowLiked)
    setLikesCount(getLikes(service.id))
  }

  return (
    <Link
      href={`/services/${service.id}`}
      className="card group block"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* Zone media */}
      <div className="relative overflow-hidden bg-gray-100" style={{ paddingBottom: '65%' }}>
        {isVideo ? (
          <>
            <video
              ref={videoRef}
              src={videoSrc}
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${playing ? 'opacity-0' : 'opacity-100'}`}>
              <div className="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Play size={16} className="text-white ml-0.5" fill="white" />
              </div>
            </div>
            <span className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
              <Play size={9} fill="white" />Video
            </span>
          </>
        ) : (
          <img
            src={imageSrc}
            alt={service.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={e => { e.target.src = '/images/img' + ((Math.abs(service.id || 1) % 8) + 1) + '.jpg' }}
          />
        )}

        {/* Badge categorie */}
        <div className="absolute top-2 left-2">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/90 text-petrol shadow-sm">
            {catLabel}
          </span>
        </div>

        {/* Bouton like dynamique */}
        <button
          onClick={handleLike}
          className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
        >
          <HeartIcon filled={liked} size={12} />
        </button>

        {/* Stats au survol */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
          <div className="flex gap-3 text-white text-xs">
            <span className="flex items-center gap-1"><Eye size={12} />{service.views || 0}</span>
            <span className="flex items-center gap-1"><HeartIcon filled size={12} />{likesCount}</span>
          </div>
        </div>
      </div>

      {/* Texte */}
      <div className="p-3">
        <p className="text-xs text-gray-400 mb-0.5 truncate">{service.providerName}</p>
        <h3 className="font-display font-semibold text-sm text-petrol leading-snug line-clamp-2 mb-2 min-h-[2.2rem]">
          {service.title}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          <Star size={11} className="fill-gold text-gold" />
          <span className="text-xs font-medium text-gray-600">{service.rating}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-fuchsia text-sm">
            {(service.price || 0).toLocaleString('fr-FR')} FCFA
          </span>
          <span className="text-xs text-gray-400">{service.duration}</span>
        </div>
      </div>
    </Link>
  )
}
