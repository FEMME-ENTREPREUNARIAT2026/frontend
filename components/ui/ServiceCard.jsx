'use client'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { Eye, Play, Star, MapPin } from 'lucide-react'
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
      {/* Media zone */}
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
              <div className="w-12 h-12 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center ring-2 ring-white/30">
                <Play size={18} className="text-white ml-0.5" fill="white" />
              </div>
            </div>
            <span className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
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

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/95 text-petrol shadow-sm backdrop-blur-sm">
            {catLabel}
          </span>
        </div>

        {/* Like button */}
        <button
          onClick={handleLike}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
        >
          <HeartIcon filled={liked} size={13} />
        </button>

        {/* Hover stats overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
          <div className="flex gap-3 text-white text-xs">
            <span className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
              <Eye size={11} />{service.views || 0}
            </span>
            <span className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
              <HeartIcon filled size={11} />{likesCount}
            </span>
          </div>
        </div>
      </div>

      {/* Text content */}
      <div className="p-4">
        <p className="text-xs text-gray-400 mb-1 truncate font-medium">{service.providerName}</p>
        <h3 className="font-display font-semibold text-sm text-petrol leading-snug line-clamp-2 mb-3 min-h-[2.4rem]">
          {service.title}
        </h3>

        <div className="flex items-center gap-1.5 mb-3">
          <Star size={12} className="fill-gold text-gold" />
          <span className="text-xs font-semibold text-gray-700">{service.rating}</span>
          {service.city && (
            <>
              <span className="text-gray-200 text-xs">·</span>
              <span className="flex items-center gap-0.5 text-xs text-gray-400">
                <MapPin size={10} />{service.city}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <span className="font-bold text-fuchsia text-sm">
            {(service.price || 0).toLocaleString('fr-FR')} FCFA
          </span>
          <span className="text-xs text-gray-300 group-hover:text-fuchsia transition-colors">→</span>
        </div>
      </div>
    </Link>
  )
}
