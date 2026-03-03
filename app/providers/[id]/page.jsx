'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ServiceCard from '@/components/ui/ServiceCard'
import StarRating from '@/components/ui/StarRating'
import Badge from '@/components/ui/Badge'
import { PROVIDERS, SERVICES, CATEGORIES } from '@/data/mockData'
import { IMAGES, enrichServices } from '@/data/mediaUtils'
import {
  MapPin, Star, Package, Users, Share2, Heart, ChevronLeft, ChevronRight,
  X, ZoomIn, Phone, Send, Check
} from 'lucide-react'
import FadeIn from '@/components/ui/FadeIn'
import {
  getCurrentUser, getAvis, addAvis, getNoteMoyenne,
  getWhatsAppUrl, WHATSAPP_NUMBER, initStore
} from '@/data/store'

// -------------------------------------------------------
// Icone WhatsApp
// -------------------------------------------------------
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
      <p className="absolute top-5 left-1/2 -translate-x-1/2 text-white/50 text-sm">{idx+1} / {images.length}</p>
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
// Carte portfolio
// -------------------------------------------------------
function PortfolioCard({ service, position, onImageClick }) {
  const imgSrc = IMAGES[(service.id + position) % IMAGES.length]
  const hasVideo = service.mediaType === 'video' && service.src
  return (
    <Link href={`/services/${service.id}`}
      className="group rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block">
      <div className="relative overflow-hidden bg-gray-50" style={{ paddingBottom: '72%' }}
        onMouseEnter={e => { if(hasVideo){ const v = e.currentTarget.querySelector('video'); v && v.play() } }}
        onMouseLeave={e => { if(hasVideo){ const v = e.currentTarget.querySelector('video'); if(v){ v.pause(); v.currentTime = 0 } } }}>
        {hasVideo ? (
          <>
            <video src={service.src} muted loop playsInline preload="metadata"
              className="absolute inset-0 w-full h-full object-cover"/>
            <span className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">Video</span>
          </>
        ) : (
          <>
            <img src={imgSrc} alt={service.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={e => { e.target.src = '/images/img1.jpg' }}/>
            <div onClick={e => { e.preventDefault(); onImageClick(imgSrc) }}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/15 cursor-zoom-in">
              <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                <ZoomIn size={18} className="text-fuchsia"/>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="p-3">
        <h4 className="font-display font-semibold text-xs text-petrol line-clamp-2 mb-1.5 leading-snug">{service.title}</h4>
        <div className="flex items-center justify-between">
          <span className="font-bold text-fuchsia text-sm">{(service.price || 0).toLocaleString('fr-FR')} FCFA</span>
          <div className="flex items-center gap-1">
            <Star size={10} className="fill-gold text-gold"/>
            <span className="text-xs text-gray-500">{service.rating}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

// -------------------------------------------------------
// Formulaire d'avis
// -------------------------------------------------------
function AvisForm({ providerId, onAdded }) {
  const [note, setNote] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [commentaire, setCommentaire] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const user = getCurrentUser()

  if (!user) return (
    <div className="bg-fuchsia/5 rounded-xl p-4 text-center">
      <p className="text-sm text-gray-500 mb-3">Connectez-vous pour laisser un avis</p>
      <Link href="/auth/login" className="btn-primary text-sm">Se connecter</Link>
    </div>
  )

  if (done) return (
    <div className="bg-petrol/5 rounded-xl p-4 text-center">
      <p className="text-petrol font-medium text-sm">✅ Votre avis a été publié !</p>
    </div>
  )

  function handleSubmit(e) {
    e.preventDefault()
    if (note === 0) return
    setLoading(true)
    setTimeout(() => {
      addAvis({ providerId, note, commentaire })
      setLoading(false)
      setDone(true)
      onAdded()
    }, 600)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-1">
        {[1,2,3,4,5].map(s => (
          <button key={s} type="button"
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setNote(s)}
            className="text-2xl transition-transform hover:scale-110">
            {s <= (hovered || note) ? '⭐' : '☆'}
          </button>
        ))}
        {note > 0 && <span className="text-sm text-gray-500 ml-2 self-center">{note}/5</span>}
      </div>
      <textarea value={commentaire} onChange={e => setCommentaire(e.target.value)}
        placeholder="Dites-nous ce que vous avez aimé..."
        rows={3}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia"/>
      <button type="submit" disabled={note === 0 || loading}
        className="btn-primary text-sm flex items-center gap-2 disabled:opacity-50">
        {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> : <Send size={14}/>}
        Publier mon avis
      </button>
    </form>
  )
}

// -------------------------------------------------------
// Page boutique prestataire — style Facebook amélioré
// -------------------------------------------------------
export default function ProviderShopPage() {
  const { id } = useParams()
  const provider = PROVIDERS.find(p => p.id === Number(id)) || PROVIDERS[0]
  const catLabel = CATEGORIES.find(c => c.id === provider.category)?.label || provider.category
  const rawServices = SERVICES.filter(s => s.providerId === provider.id)
  const providerServices = enrichServices(rawServices)

  const [liked, setLiked] = useState(false)
  const [lightbox, setLightbox] = useState(null)
  const [avis, setAvis] = useState([])
  const [refreshAvis, setRefreshAvis] = useState(0)
  const [showRdv, setShowRdv] = useState(false)
  const [rdvDate, setRdvDate] = useState('')
  const [rdvHeure, setRdvHeure] = useState('')
  const [rdvService, setRdvService] = useState('')
  const [rdvNote, setRdvNote] = useState('')

  const whatsappNum = provider.whatsapp || WHATSAPP_NUMBER
  const user = getCurrentUser()
  const clientName = user ? `${user.prenom} ${user.nom}` : 'Client(e)'

  function buildRdvUrl() {
    const dateStr = rdvDate ? new Date(rdvDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ''
    const lines = [
      `Bonjour ${provider.name},`,
      ``,
      `Je souhaite prendre rendez-vous.`,
      rdvDate && rdvHeure ? `📅 Date : ${dateStr} à ${rdvHeure}` : rdvDate ? `📅 Date : ${dateStr}` : '',
      rdvService ? `💼 Service souhaité : ${rdvService}` : '',
      rdvNote ? `📝 Note : ${rdvNote}` : '',
      ``,
      `Client(e) : ${clientName}`,
    ].filter(l => l !== null && l !== undefined && !(l === '' && false))
    return getWhatsAppUrl(whatsappNum, lines.join('\n'))
  }

  useEffect(() => {
    initStore()
    setAvis(getAvis(provider.id))
  }, [provider.id, refreshAvis])

  const noteMoyenne = getNoteMoyenne(provider.id, provider.rating)

  const galleryImages = [
    provider.image || IMAGES[provider.id % IMAGES.length],
    ...providerServices.slice(0, 5).map((s, i) => IMAGES[(s.id + i) % IMAGES.length]),
  ].filter((v, i, arr) => arr.indexOf(v) === i)

  function openGallery(startIdx = 0) {
    setLightbox({ images: galleryImages, startIdx })
    document.body.style.overflow = 'hidden'
  }
  function openPortfolioZoom(imgSrc) {
    const imgs = [imgSrc, ...galleryImages.filter(i => i !== imgSrc)]
    setLightbox({ images: imgs, startIdx: 0 })
    document.body.style.overflow = 'hidden'
  }
  function closeLightbox() { setLightbox(null); document.body.style.overflow = '' }

  const bannerImg = providerServices[0]
    ? IMAGES[providerServices[0].id % IMAGES.length]
    : (provider.image || IMAGES[0])

  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-gray-50 pt-16">

        {/* ============================================================
            BANNIÈRE FACEBOOK STYLE :
            - Grande image de fond
            - Gradient du bas vers le haut
            - Nom, lieu, catégorie, boutons Like+Partager EN BAS de la bannière
            - Photo de profil (grande) chevauchant la bannière en bas à gauche
        ============================================================ */}
        <div
          className="relative w-full overflow-hidden cursor-pointer group"
          style={{ height: '340px' }}
          onClick={() => openGallery(0)}
        >
          {/* Image de fond */}
          <img
            src={bannerImg}
            alt="Bannière"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={e => { e.target.src = '/images/img1.jpg' }}
          />

          {/* Gradient fort en bas pour lisibilité du texte */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"/>

          {/* Indice galerie (hover) */}
          <div className="absolute top-4 right-4 bg-black/40 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn size={12}/> Voir la galerie ({galleryImages.length} photos)
          </div>

          {/* Zone infos EN BAS de la bannière */}
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-5">
            <div className="max-w-7xl mx-auto flex items-end justify-between gap-4">

              {/* Gauche : espace pour la photo de profil + nom/infos */}
              <div className="flex items-end gap-5">
                {/* Photo de profil (grande, déborde vers le bas) */}
                <div
                  className="relative flex-shrink-0 w-36 h-36 rounded-full overflow-hidden ring-4 ring-white shadow-2xl bg-white cursor-pointer hover:scale-105 transition-transform"
                  style={{ marginBottom: '-48px' }} // déborde sous la bannière
                  onClick={e => { e.stopPropagation(); openGallery(0) }}
                >
                  <img
                    src={provider.image || IMAGES[provider.id % IMAGES.length]}
                    alt={provider.name}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.src = '/images/img1.jpg' }}
                  />
                </div>

                {/* Nom + infos */}
                <div className="pb-2">
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-white drop-shadow-md">
                    {provider.name}
                  </h1>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {catLabel}
                    </span>
                    <span className="flex items-center gap-1 text-white/90 text-sm">
                      <MapPin size={13}/> {provider.city}
                    </span>
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(s => (
                        <span key={s} className={`text-sm ${s <= Math.round(noteMoyenne) ? 'text-gold' : 'text-white/30'}`}>★</span>
                      ))}
                      <span className="text-white/80 text-xs ml-1">{noteMoyenne} ({avis.length + provider.reviews} avis)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Droite : boutons Like et Partager (PAS de Réserver ici) */}
              <div
                className="flex items-center gap-2 pb-2 flex-shrink-0"
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => setLiked(!liked)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                    liked
                      ? 'border-fuchsia bg-fuchsia text-white'
                      : 'border-white/50 bg-white/20 backdrop-blur-sm text-white hover:bg-fuchsia hover:border-fuchsia'
                  }`}
                >
                  <Heart size={15} className={liked ? 'fill-white' : ''}/>
                  {liked ? 'Aimé' : 'Aimer'}
                </button>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: provider.name, url: window.location.href })
                    } else {
                      navigator.clipboard?.writeText(window.location.href)
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border-2 border-white/50 bg-white/20 backdrop-blur-sm text-white hover:bg-white hover:text-petrol transition-all"
                >
                  <Share2 size={15}/>
                  Partager
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Espace pour compenser le débordement de la photo de profil */}
        <div className="h-14 bg-gray-50"/>

        <FadeIn direction="up" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-16">

            {/* ---- Colonne principale ---- */}
            <div className="lg:col-span-2">

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { icon: Package, label: 'Prestations', value: provider.prestations },
                  { icon: Star, label: 'Avis', value: provider.reviews + avis.length },
                  { icon: Users, label: 'Clients', value: provider.clients },
                ].map(stat => (
                  <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm text-center">
                    <stat.icon size={20} className="text-fuchsia mx-auto mb-1"/>
                    <div className="font-display font-bold text-xl text-petrol">{stat.value}</div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* A propos */}
              <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                <h2 className="font-display text-xl font-bold text-petrol mb-3">À propos</h2>
                <p className="text-gray-600 leading-relaxed">{provider.description}</p>

                <div className="mt-5 pt-5 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                  <button onClick={() => setShowRdv(true)}
                    className="flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 font-medium px-4 py-2.5 rounded-full text-sm transition-all">
                    <WA size={16}/> WhatsApp : {whatsappNum}
                  </button>
                  <a href={`tel:${provider.telephone || whatsappNum}`}
                    className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium px-4 py-2.5 rounded-full text-sm transition-all">
                    <Phone size={15}/> Appeler
                  </a>
                </div>
              </div>

              {/* Galerie */}
              {galleryImages.length > 1 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-xl font-bold text-petrol">Galerie</h2>
                    <p className="text-xs text-gray-400">Cliquer pour agrandir</p>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {galleryImages.map((img, i) => (
                      <button key={i} onClick={() => openGallery(i)}
                        className="relative group overflow-hidden rounded-xl" style={{ paddingBottom: '75%' }}>
                        <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          onError={e => { e.target.src = '/images/img1.jpg' }}/>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                          <ZoomIn size={20} className="text-white"/>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Portfolio */}
              <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-bold text-petrol">Portfolio</h2>
                  {providerServices.length > 0 && (
                    <span className="text-sm text-gray-400">
                      {providerServices.length} prestation{providerServices.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                {providerServices.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {providerServices.map((s, i) => (
                      <PortfolioCard key={s.id} service={s} position={i} onImageClick={openPortfolioZoom}/>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-300">
                    <Package size={40} className="mx-auto mb-3"/>
                    <p className="font-display text-lg text-gray-400">Portfolio bientôt disponible</p>
                  </div>
                )}
              </div>

              {/* Avis */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-display text-xl font-bold text-petrol mb-6">Avis clients</h2>
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-600 mb-3">Laissez votre avis :</p>
                  <AvisForm providerId={provider.id} onAdded={() => setRefreshAvis(r => r + 1)}/>
                </div>
                <div className="space-y-4">
                  {avis.map(a => (
                    <div key={a.id} className="border-t border-gray-50 pt-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-gray-700">{a.userName}</span>
                        <div className="flex">
                          {[1,2,3,4,5].map(s => <span key={s} className={s <= a.note ? 'text-gold' : 'text-gray-200'} style={{ fontSize: '12px' }}>★</span>)}
                        </div>
                      </div>
                      {a.commentaire && <p className="text-xs text-gray-500 leading-relaxed">{a.commentaire}</p>}
                    </div>
                  ))}
                  {[
                    { name: 'Amira K.', text: 'Service exceptionnel, très professionnelle !', rating: 5 },
                    { name: 'Sandra B.', text: 'Je recommande vivement, résultat parfait.', rating: 5 },
                    { name: 'Patricia M.', text: 'Très contente du résultat pour mon mariage.', rating: 4 },
                  ].map((rev, i) => (
                    <div key={i} className="border-t border-gray-100 pt-3 mt-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">{rev.name}</span>
                        <StarRating rating={rev.rating} size={10}/>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{rev.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ---- Sidebar ---- */}
            <div>
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-20">
                <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-100">
                  <div className="text-4xl font-bold font-display text-fuchsia">{noteMoyenne}</div>
                  <div>
                    <StarRating rating={noteMoyenne} size={16}/>
                    <p className="text-xs text-gray-400 mt-1">{provider.reviews + avis.length} avis vérifiés</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowRdv(true)}
                  className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-full text-sm transition-all shadow-md shadow-green-500/20 mb-3"
                >
                  <WA size={18}/>
                  Prendre rendez-vous
                </button>

                <a href={`tel:${provider.telephone || whatsappNum}`}
                  className="flex items-center justify-center gap-2 w-full border-2 border-gray-200 hover:border-fuchsia hover:text-fuchsia text-gray-600 font-medium py-3 rounded-full text-sm transition-all mb-5">
                  <Phone size={15}/> Appeler
                </a>

                <div className="text-center pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400 mb-2">Partager ce profil</p>
                  <button
                    onClick={() => {
                      if (navigator.share) navigator.share({ title: provider.name, url: window.location.href })
                      else navigator.clipboard?.writeText(window.location.href)
                    }}
                    className="flex items-center justify-center gap-1 w-full text-xs text-gray-400 hover:text-fuchsia transition-colors"
                  >
                    <Share2 size={12}/> Partager le lien
                  </button>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {lightbox && <Lightbox images={lightbox.images} startIdx={lightbox.startIdx} onClose={closeLightbox}/>}

        {/* Modal rendez-vous */}
        {showRdv && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowRdv(false)}>
            <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="font-display text-lg font-bold text-petrol">Prendre rendez-vous</h3>
                  <p className="text-xs text-gray-400 mt-0.5">avec {provider.name}</p>
                </div>
                <button onClick={() => setShowRdv(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <X size={15}/>
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Date souhaitée</label>
                    <input
                      type="date"
                      value={rdvDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={e => setRdvDate(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Heure souhaitée</label>
                    <input
                      type="time"
                      value={rdvHeure}
                      onChange={e => setRdvHeure(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Service souhaité</label>
                  <input
                    type="text"
                    value={rdvService}
                    onChange={e => setRdvService(e.target.value)}
                    placeholder="Ex : Coiffure mariage, Tresses box braids..."
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Message additionnel <span className="text-gray-400 font-normal">(optionnel)</span></label>
                  <textarea
                    value={rdvNote}
                    onChange={e => setRdvNote(e.target.value)}
                    rows={2}
                    placeholder="Précisions supplémentaires..."
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
                  />
                </div>

                <a
                  href={buildRdvUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowRdv(false)}
                  className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-full text-sm transition-all"
                >
                  <WA size={18}/>
                  Envoyer sur WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer/>
    </>
  )
}
