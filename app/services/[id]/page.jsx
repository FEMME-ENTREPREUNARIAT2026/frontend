'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ServiceCard from '@/components/ui/ServiceCard'
import StarRating from '@/components/ui/StarRating'
import { SERVICES, CATEGORIES } from '@/data/mockData'
import { getServiceImage, getServiceVideo, IMAGES } from '@/data/mediaUtils'
import { getCurrentUser, getLikes, getViews, toggleLike, isLiked, incrementView, getWhatsAppUrl, WHATSAPP_NUMBER, initStore } from '@/data/store'
import {
  Heart, Eye, MapPin, Clock, ChevronLeft, ChevronRight, Play, X, ZoomIn,
  Calendar, Clock3, MessageCircle, Check
} from 'lucide-react'

// Icone WhatsApp
function WA({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

// -------------------------------------------------------
// Lightbox simple
// -------------------------------------------------------
function Lightbox({ images, startIdx, onClose }) {
  const [idx, setIdx] = useState(startIdx)
  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-white/15 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all">
        <X size={20}/>
      </button>
      <p className="absolute top-5 left-1/2 -translate-x-1/2 text-white/50 text-sm">{idx + 1} / {images.length}</p>
      <img src={images[idx]} alt="" onClick={e => e.stopPropagation()}
        className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl"
        onError={e => { e.target.src = '/images/img1.jpg' }}/>
      {idx > 0 && (
        <button onClick={e => { e.stopPropagation(); setIdx(i => i - 1) }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/15 rounded-full flex items-center justify-center text-white hover:bg-fuchsia transition-all">
          <ChevronLeft size={22}/>
        </button>
      )}
      {idx < images.length - 1 && (
        <button onClick={e => { e.stopPropagation(); setIdx(i => i + 1) }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/15 rounded-full flex items-center justify-center text-white hover:bg-fuchsia transition-all">
          <ChevronRight size={22}/>
        </button>
      )}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2" onClick={e => e.stopPropagation()}>
          {images.map((img, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={`w-12 h-9 rounded-lg overflow-hidden transition-all ${i === idx ? 'ring-2 ring-fuchsia' : 'opacity-50 hover:opacity-80'}`}>
              <img src={img} alt="" className="w-full h-full object-cover"/>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// -------------------------------------------------------
// Modal de reservation : formulaire date + heure → WhatsApp
// -------------------------------------------------------
function ReservationModal({ service, provider, onClose }) {
  const user = getCurrentUser()
  const [date, setDate] = useState('')
  const [heure, setHeure] = useState('')
  const [sent, setSent] = useState(false)

  // Date minimum = aujourd'hui
  const today = new Date().toISOString().split('T')[0]

  // Numero du prestataire (de test ou reel)
  const whatsappNum = provider?.whatsapp || WHATSAPP_NUMBER

  function handleSend(e) {
    e.preventDefault()
    if (!date || !heure) return

    const clientName = user ? `${user.prenom} ${user.nom}` : 'Client'
    const providerName = provider?.name || service.providerName || 'la prestataire'

    // Message WhatsApp formate
    const message = `Bonjour ${providerName},\n\nJe souhaite réserver la prestation suivante :\n\nPrestation : ${service.title}\nClient : ${clientName}\nDate : ${new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\nHeure : ${heure}\n\nMerci de me confirmer la disponibilité.`

    const waUrl = getWhatsAppUrl(whatsappNum, message)
    window.open(waUrl, '_blank')
    setSent(true)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6"
        onClick={e => e.stopPropagation()}
      >
        {/* En-tete */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="font-display text-xl font-bold text-petrol">Réserver cette prestation</h2>
            <p className="text-sm text-gray-400 mt-1 line-clamp-1">{service.title}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all flex-shrink-0 ml-3">
            <X size={16}/>
          </button>
        </div>

        {sent ? (
          /* Confirmation */
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-green-500"/>
            </div>
            <h3 className="font-display text-lg font-bold text-petrol mb-2">Message envoyé !</h3>
            <p className="text-sm text-gray-500 mb-6">
              Votre demande de réservation a été envoyée à la prestataire via WhatsApp. Elle vous répondra très bientôt.
            </p>
            <button onClick={onClose} className="btn-primary text-sm w-full">
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-5">
            {/* Recapitulatif prestation */}
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs text-gray-400 mb-1">Prestataire</p>
              <p className="font-semibold text-petrol text-sm">{service.providerName}</p>
              <p className="text-xs text-gray-500 mt-1">{(service.price || 0).toLocaleString('fr-FR')} FCFA · {service.duration}</p>
            </div>

            {/* Client */}
            {user && (
              <div className="bg-fuchsia/5 rounded-2xl p-4">
                <p className="text-xs text-gray-400 mb-1">Réservé par</p>
                <p className="font-semibold text-petrol text-sm">{user.prenom} {user.nom}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            )}

            {!user && (
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                <p className="text-xs text-amber-700">
                  💡 <Link href="/auth/login" className="underline font-medium">Connectez-vous</Link> pour inclure votre nom dans le message.
                </p>
              </div>
            )}

            {/* Date */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar size={15} className="text-fuchsia"/>
                Date souhaitée *
              </label>
              <input
                type="date"
                required
                min={today}
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia transition-all"
              />
            </div>

            {/* Heure */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Clock3 size={15} className="text-fuchsia"/>
                Heure souhaitée *
              </label>
              <select
                required
                value={heure}
                onChange={e => setHeure(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia transition-all"
              >
                <option value="">Choisir une heure...</option>
                {Array.from({ length: 28 }, (_, i) => {
                  const h = Math.floor(i / 2) + 7 // 7h à 20h30
                  const m = i % 2 === 0 ? '00' : '30'
                  return `${String(h).padStart(2, '0')}:${m}`
                }).filter(t => {
                  const h = parseInt(t)
                  return h >= 7 && h <= 20
                }).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Bouton envoi */}
            <button
              type="submit"
              disabled={!date || !heure}
              className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-full text-sm transition-all shadow-md shadow-green-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <WA size={18}/>
              Envoyer la demande via WhatsApp
            </button>
            <p className="text-xs text-gray-400 text-center">
              Vous serez redirigée vers WhatsApp avec le message prérempli
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

// -------------------------------------------------------
// Page detail prestation
// -------------------------------------------------------
export default function ServiceDetailPage() {
  const { id } = useParams()
  const service = SERVICES.find(s => s.id === Number(id)) || SERVICES[0]
  const provider = null // on utilise le store pour le whatsapp de toute facon

  const [activeThumb, setActiveThumb] = useState(0)
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [viewsCount, setViewsCount] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIdx, setLightboxIdx] = useState(0)
  const [showReservation, setShowReservation] = useState(false)

  const catLabel = CATEGORIES.find(c => c.id === service.category)?.label || service.category
  const similar = SERVICES.filter(s => s.category === service.category && s.id !== service.id).slice(0, 8)

  // Galerie images
  const mainImage = getServiceImage(service)
  const videoSrc = getServiceVideo(service)
  const gallery = [
    mainImage,
    IMAGES[(service.id) % IMAGES.length],
    IMAGES[(service.id + 2) % IMAGES.length],
    IMAGES[(service.id + 4) % IMAGES.length],
  ].filter((v, i, arr) => arr.indexOf(v) === i)

  useEffect(() => {
    initStore()
    setLiked(isLiked(service.id))
    setLikesCount(getLikes(service.id))
    setViewsCount(getViews(service.id))
    // Incremente les vues a l'ouverture de la page
    incrementView(service.id)
    setViewsCount(getViews(service.id))

    const handler = () => {
      setLiked(isLiked(service.id))
      setLikesCount(getLikes(service.id))
    }
    window.addEventListener('fh_data_change', handler)
    return () => window.removeEventListener('fh_data_change', handler)
  }, [service.id])

  function handleLike(e) {
    e.preventDefault()
    const nowLiked = toggleLike(service.id)
    setLiked(nowLiked)
    setLikesCount(getLikes(service.id))
  }

  function openLightbox(i) {
    setLightboxIdx(i)
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }
  function closeLightbox() {
    setLightboxOpen(false)
    document.body.style.overflow = ''
  }

  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Fil d'Ariane */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6 flex-wrap">
            <Link href="/" className="hover:text-fuchsia transition-colors">Accueil</Link>
            <ChevronRight size={14}/>
            <Link href="/services" className="hover:text-fuchsia transition-colors">Services</Link>
            <ChevronRight size={14}/>
            <Link href={`/services?category=${service.category}`} className="hover:text-fuchsia transition-colors">{catLabel}</Link>
            <ChevronRight size={14}/>
            <span className="text-gray-600 line-clamp-1">{service.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Galerie */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div
                  className={`relative overflow-hidden ${videoSrc ? '' : 'cursor-zoom-in group'}`}
                  style={{ paddingBottom: '60%' }}
                  onClick={() => !videoSrc && openLightbox(activeThumb)}
                >
                  {videoSrc ? (
                    <video src={videoSrc} controls className="absolute inset-0 w-full h-full object-cover"/>
                  ) : (
                    <>
                      <img src={gallery[activeThumb]} alt={service.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={e => { e.target.src = '/images/img1.jpg' }}/>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center shadow-lg">
                          <ZoomIn size={20} className="text-fuchsia"/>
                        </div>
                      </div>
                      <p className="absolute bottom-3 right-3 bg-black/40 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        Cliquer pour agrandir
                      </p>
                    </>
                  )}
                  <button onClick={e => { e.stopPropagation(); handleLike(e) }}
                    className="absolute top-3 right-3 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-sm">
                    <Heart size={18} className={liked ? 'fill-fuchsia text-fuchsia' : 'text-gray-500'}/>
                  </button>
                </div>

                {/* Miniatures */}
                <div className="flex gap-2 p-3 border-t border-gray-50">
                  {gallery.map((img, i) => (
                    <button key={i} onClick={() => setActiveThumb(i)}
                      className={`w-16 h-12 rounded-xl overflow-hidden flex-shrink-0 ring-2 transition-all ${i === activeThumb ? 'ring-fuchsia' : 'ring-transparent opacity-60 hover:opacity-100'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" onError={e => { e.target.src = '/images/img1.jpg' }}/>
                    </button>
                  ))}
                  {videoSrc && (
                    <div className="w-16 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Play size={16} className="text-fuchsia" fill="#E91E63"/>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl p-6 shadow-sm mt-4">
                <h2 className="font-display text-xl font-bold text-petrol mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  {[
                    { icon: Clock, label: 'Durée', value: service.duration },
                    { icon: MapPin, label: 'Ville', value: service.city },
                    { icon: Eye, label: 'Vues', value: viewsCount.toLocaleString('fr-FR') },
                    { icon: Heart, label: 'Likes', value: likesCount },
                  ].map(item => (
                    <div key={item.label} className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                      <div className="flex items-center gap-2 font-semibold text-petrol text-sm">
                        <item.icon size={15} className="text-fuchsia flex-shrink-0"/>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-20">
                <span className="text-xs font-bold uppercase tracking-widest text-fuchsia">{catLabel}</span>
                <h1 className="font-display text-xl font-bold text-petrol mt-2 mb-3 leading-tight">{service.title}</h1>
                <StarRating rating={service.rating}/>

                <div className="my-5 py-5 border-y border-gray-100">
                  <p className="text-3xl font-bold text-fuchsia font-display">
                    {(service.price || 0).toLocaleString('fr-FR')} FCFA
                  </p>
                  <p className="text-sm text-gray-400 mt-1">par prestation</p>
                </div>

                <p className="text-sm text-gray-500 mb-5">
                  Prestataire : <span className="font-semibold text-petrol">{service.providerName}</span>
                </p>

                {/* ✅ BOUTON RÉSERVÉ → ouvre le formulaire date/heure → WhatsApp */}
                <button
                  onClick={() => setShowReservation(true)}
                  className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-full text-sm transition-all shadow-md shadow-green-500/20 mb-3"
                >
                  <WA size={18}/>
                  Réservé
                </button>

                {/* Bouton voir le prestataire */}
                <Link href={`/providers/${service.providerId}`}
                  className="block w-full text-center py-3 rounded-full font-medium text-sm border-2 border-petrol text-petrol hover:bg-petrol hover:text-white transition-all mb-3">
                  Voir le prestataire
                </Link>

                <button onClick={handleLike}
                  className={`w-full py-3 rounded-full font-medium text-sm border-2 transition-all flex items-center justify-center gap-2 ${liked ? 'border-fuchsia bg-fuchsia/5 text-fuchsia' : 'border-gray-200 text-gray-500 hover:border-fuchsia hover:text-fuchsia'}`}>
                  <Heart size={16} className={liked ? 'fill-fuchsia' : ''}/>
                  {liked ? 'Dans mes favoris' : 'Ajouter aux favoris'}
                </button>
              </div>
            </div>
          </div>

          {/* Prestations similaires */}
          {similar.length > 0 && (
            <div className="mt-16">
              <h2 className="font-display text-2xl font-bold text-petrol mb-6">Prestations Similaires</h2>
              <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
                {similar.map(s => (
                  <div key={s.id} className="flex-shrink-0 w-52">
                    <ServiceCard service={s}/>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Lightbox */}
      {lightboxOpen && <Lightbox images={gallery} startIdx={lightboxIdx} onClose={closeLightbox}/>}

      {/* Modal de réservation (date + heure → WhatsApp) */}
      {showReservation && (
        <ReservationModal
          service={service}
          provider={null}
          onClose={() => setShowReservation(false)}
        />
      )}

      <Footer/>
    </>
  )
}
