'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { EVENTS } from '@/data/mockData'
import { IMAGES } from '@/data/mediaUtils'
import { Calendar, MapPin, Users, Clock, User, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { reserver, getPlacesRestantes, getCurrentUser, getWhatsAppUrl, WHATSAPP_NUMBER, initStore } from '@/data/store'

// Icone WhatsApp
function WA({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

export default function EventDetailPage() {
  const { id } = useParams()
  const event = EVENTS.find(e => e.id === Number(id)) || EVENTS[0]
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [placesLeft, setPlacesLeft] = useState(0)
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [telephone, setTelephone] = useState('')
  const [nbPlaces, setNbPlaces] = useState(1)
  const [loading, setLoading] = useState(false)

  const date = new Date(event.date)
  const imgSrc = event.image || IMAGES[Math.abs(event.id || 0) % IMAGES.length]

  // Lien WhatsApp pour reserver directement
  const waMessage = `Bonjour ! Je souhaite reserver ${nbPlaces} place(s) pour l'evenement "${event.title}" le ${date.toLocaleDateString('fr-FR')} a ${event.time}. Mon nom : ${nom || '[votre nom]'}, Email : ${email || '[votre email]'}.`
  const waUrl = getWhatsAppUrl(WHATSAPP_NUMBER, waMessage)

  useEffect(() => {
    initStore()
    setPlacesLeft(getPlacesRestantes(event))
    // Pre-remplir si connecte
    const user = getCurrentUser()
    if (user) {
      setNom(`${user.prenom} ${user.nom}`)
      setEmail(user.email)
    }
  }, [event.id])

  const participation = Math.min(100, Math.round(((event.maxParticipants - placesLeft) / event.maxParticipants) * 100))

  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      reserver(event.id, { nom, email, telephone, nbPlaces })
      setPlacesLeft(prev => Math.max(0, prev - nbPlaces))
      setLoading(false)
      setSubmitted(true)
      // Apres confirmation, proposer WhatsApp
    }, 600)
  }

  function handleClose() {
    setShowForm(false)
    setTimeout(() => setSubmitted(false), 500)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-16">
        {/* Image de couverture */}
        <div className="relative h-72 md:h-96 overflow-hidden">
          <img
            src={imgSrc}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={e => { e.target.src = '/images/img4.jpg' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-7xl mx-auto">
            <span className="bg-fuchsia text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">
              {event.type}
            </span>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight">{event.title}</h1>
          </div>
          {/* Fil d'Ariane */}
          <Link href="/events"
            className="absolute top-4 left-4 flex items-center gap-2 text-white/80 hover:text-white text-sm bg-black/30 rounded-full px-3 py-1.5 transition-all">
            <ChevronLeft size={16} /> Tous les evenements
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Contenu principal */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                <h2 className="font-display text-xl font-bold text-petrol mb-4">Details de l'evenement</h2>
                <p className="text-gray-600 leading-relaxed mb-6">{event.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Calendar, label: 'Date', value: date.toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' }) },
                    { icon: Clock, label: 'Heure', value: event.time },
                    { icon: MapPin, label: 'Lieu', value: event.location },
                    { icon: User, label: 'Organisateur', value: event.organizer },
                  ].map(item => (
                    <div key={item.label} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                      <item.icon size={18} className="text-fuchsia mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400">{item.label}</p>
                        <p className="text-sm font-medium text-petrol capitalize">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Participants */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-bold text-petrol">Participants</h2>
                  <span className="text-sm text-gray-500">
                    {event.maxParticipants - placesLeft} / {event.maxParticipants} inscrits
                  </span>
                </div>
                <div className="bg-gray-100 rounded-full h-3 mb-3 overflow-hidden">
                  <div
                    className="h-3 rounded-full transition-all duration-700"
                    style={{
                      width: `${participation}%`,
                      background: participation >= 80
                        ? 'linear-gradient(90deg, #FFC107, #ff9800)'
                        : 'linear-gradient(90deg, #E91E63, #B39DDB)'
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-gray-500">
                    <Users size={15} className="text-fuchsia" />
                    {placesLeft > 0 ? (
                      <><span className="font-bold text-petrol">{placesLeft}</span> place{placesLeft > 1 ? 's' : ''} restante{placesLeft > 1 ? 's' : ''}</>
                    ) : (
                      <span className="font-bold text-red-500">Complet !</span>
                    )}
                  </span>
                  {participation >= 80 && placesLeft > 0 && (
                    <span className="text-amber-600 text-xs font-medium bg-amber-50 px-2 py-1 rounded-full">
                      Plus que {placesLeft} place{placesLeft>1?'s':''}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar réservation */}
            <div>
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-20">
                {/* Prix */}
                <div className="text-3xl font-bold font-display text-fuchsia mb-1">
                  {event.price === 0 ? 'Gratuit' : `${(event.price).toLocaleString('fr-FR')} FCFA`}
                </div>
                <p className="text-sm text-gray-400 mb-5">par personne</p>

                {/* Places */}
                <div className="bg-gray-50 rounded-xl p-4 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Places restantes</span>
                    <span className={`font-bold ${placesLeft === 0 ? 'text-red-500' : 'text-petrol'}`}>
                      {placesLeft === 0 ? 'Complet' : placesLeft}
                    </span>
                  </div>
                </div>

                {placesLeft > 0 ? (
                  <>
                    {/* Bouton Réserver → ouvre modal */}
                    <button
                      onClick={() => setShowForm(true)}
                      className="w-full btn-primary mb-3 flex items-center justify-center gap-2"
                    >
                      Reserver ma place
                    </button>
                    {/* Bouton WhatsApp direct */}
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-full text-sm transition-all mb-3"
                    >
                      <WA size={16} />
                      Reserver via WhatsApp
                    </a>
                  </>
                ) : (
                  <div className="w-full text-center py-3 bg-gray-100 text-gray-400 rounded-full text-sm font-medium mb-3">
                    Evenement complet
                  </div>
                )}

                <Link href="/events" className="block w-full text-center btn-outline text-sm">
                  Voir d'autres evenements
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de réservation */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={handleClose}>
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display text-xl font-bold text-petrol">Reserver ma place</h3>
                <button onClick={handleClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                  <X size={16} />
                </button>
              </div>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-petrol rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">
                    ✓
                  </div>
                  <p className="font-bold text-petrol text-lg mb-2">Reservation confirmee !</p>
                  <p className="text-gray-500 text-sm mb-6">Votre place a bien ete reservee.</p>
                  {/* Proposer WhatsApp après confirmation */}
                  <a
                    href={getWhatsAppUrl(WHATSAPP_NUMBER, `Bonjour ! Ma reservation pour "${event.title}" est confirmee. Je suis ${nom}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-full text-sm transition-all mx-auto w-fit"
                  >
                    <WA size={16} />
                    Confirmer sur WhatsApp aussi
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nom complet *</label>
                    <input type="text" required value={nom} onChange={e => setNom(e.target.value)}
                      placeholder="Votre nom et prenom"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Telephone</label>
                    <input type="tel" value={telephone} onChange={e => setTelephone(e.target.value)}
                      placeholder="+237 6XX XX XX XX"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre de places</label>
                    <select value={nbPlaces} onChange={e => setNbPlaces(Number(e.target.value))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia">
                      {Array.from({length: Math.min(5, placesLeft)}, (_,i) => i+1).map(n => <option key={n} value={n}>{n} place{n>1?'s':''}</option>)}
                    </select>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full btn-primary mt-2 flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/> : 'Confirmer la reservation'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
