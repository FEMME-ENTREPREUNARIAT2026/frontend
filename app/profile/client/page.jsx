'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  Bell, Calendar, ShoppingBag, Star, Settings, Heart, LogOut,
  Edit3, Upload, Check, X, Camera
} from 'lucide-react'
import { SERVICES, EVENTS } from '@/data/mockData'
import { IMAGES } from '@/data/mediaUtils'
import { getCurrentUser, logout, updateProfile, getReservations, getFavoris, initStore } from '@/data/store'

const STATUS_STYLES = {
  confirme: 'bg-petrol/10 text-petrol',
  pending: 'bg-gold/10 text-amber-700',
  termine: 'bg-gray-100 text-gray-500',
}
const STATUS_LABELS = {
  confirme: 'Confirmee',
  pending: 'En attente',
  termine: 'Terminee',
}

export default function ClientProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [editMode, setEditMode] = useState(false)
  const [editDesc, setEditDesc] = useState('')
  const [editPrenom, setEditPrenom] = useState('')
  const [reservations, setReservations] = useState([])
  const [favoris, setFavoris] = useState([])
  const [saving, setSaving] = useState(false)
  const fileRef = useRef(null)

  useEffect(() => {
    initStore()
    const u = getCurrentUser()
    if (!u) { router.push('/auth/login'); return }
    setUser(u)
    setEditDesc(u.description || '')
    setEditPrenom(u.prenom || '')
    setReservations(getReservations())
    setFavoris(getFavoris())

    const handler = (e) => { if(e.detail) setUser(e.detail) }
    window.addEventListener('fh_auth_change', handler)
    const dataHandler = () => { setReservations(getReservations()); setFavoris(getFavoris()) }
    window.addEventListener('fh_data_change', dataHandler)
    return () => {
      window.removeEventListener('fh_auth_change', handler)
      window.removeEventListener('fh_data_change', dataHandler)
    }
  }, [router])

  function handleLogout() {
    logout()
    router.push('/')
  }

  function handleSaveProfile() {
    setSaving(true)
    setTimeout(() => {
      const updated = updateProfile({ prenom: editPrenom, description: editDesc })
      setUser(updated)
      setSaving(false)
      setEditMode(false)
    }, 400)
  }

  function handleAvatarChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const updated = updateProfile({ image: ev.target.result })
      setUser(updated)
    }
    reader.readAsDataURL(file)
  }

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-fuchsia border-t-transparent rounded-full animate-spin"/>
    </div>
  )

  const initiale = (user.prenom || 'U')[0].toUpperCase()
  const favoriServices = SERVICES.filter(s => favoris.includes(s.id))

  const TABS = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Bell },
    { id: 'reservations', label: 'Reservations', icon: ShoppingBag },
    { id: 'favoris', label: 'Mes favoris', icon: Heart },
    { id: 'settings', label: 'Mon profil', icon: Settings },
  ]

  const stats = [
    { label: 'Reservations', value: reservations.length },
    { label: 'Evenements rejoints', value: Math.max(0, reservations.filter(r => r.eventId).length) },
    { label: 'Favoris', value: favoris.length },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-16">
        {/* Banniere style Facebook */}
        <div className="relative bg-gradient-to-br from-fuchsia to-petrol h-40 md:h-52">
          <div className="absolute inset-0 opacity-20"
            style={{backgroundImage:'radial-gradient(circle at 20% 50%, white 0%, transparent 60%)'}}/>
        </div>

        {/* Header profil */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-16 flex flex-col sm:flex-row items-start sm:items-end gap-4 pb-6 border-b border-gray-200">
            {/* Avatar + upload */}
            <div className="relative flex-shrink-0">
              <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-white shadow-xl bg-fuchsia flex items-center justify-center">
                {user.image ? (
                  <img src={user.image} alt={user.prenom} className="w-full h-full object-cover"/>
                ) : (
                  <span className="text-white font-display text-4xl font-bold">{initiale}</span>
                )}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-fuchsia hover:text-white transition-all"
              >
                <Camera size={14}/>
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange}/>
            </div>

            <div className="flex-1">
              <h1 className="font-display text-2xl font-bold text-petrol">
                {user.prenom} {user.nom}
              </h1>
              <p className="text-gray-500 text-sm">{user.type === 'prestataire' ? 'Prestataire & Cliente' : 'Cliente'}</p>
              {user.description && <p className="text-gray-400 text-sm mt-1 italic">"{user.description}"</p>}
            </div>

            <div className="flex gap-2">
              {user.type === 'prestataire' && (
                <Link href="/profile/provider" className="btn-outline text-sm">
                  Espace prestataire
                </Link>
              )}
              <button onClick={handleLogout}
                className="flex items-center gap-1 text-sm text-red-400 hover:text-red-600 transition-colors px-3 py-2 rounded-xl hover:bg-red-50">
                <LogOut size={15}/> Deconnexion
              </button>
            </div>
          </div>

          {/* Navigation onglets */}
          <div className="flex gap-1 border-b border-gray-200 mt-0 overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap -mb-px ${
                  activeTab === tab.id
                    ? 'border-fuchsia text-fuchsia'
                    : 'border-transparent text-gray-500 hover:text-petrol'
                }`}
              >
                <tab.icon size={15}/>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Contenu des onglets */}
          <div className="py-8">

            {/* ─── TABLEAU DE BORD ─── */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  {stats.map(s => (
                    <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm text-center">
                      <div className="font-display text-3xl font-bold text-fuchsia mb-1">{s.value}</div>
                      <div className="text-xs text-gray-400">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-display font-bold text-petrol mb-4">Activite recente</h3>
                  {reservations.length === 0 ? (
                    <p className="text-gray-400 text-sm">Aucune activite pour l'instant. <Link href="/services" className="text-fuchsia hover:underline">Decouvrir les services</Link></p>
                  ) : (
                    <div className="space-y-3">
                      {reservations.slice(0, 3).map(r => (
                        <div key={r.id} className="flex items-center gap-3 text-sm">
                          <div className="w-2 h-2 rounded-full bg-fuchsia"/>
                          <span className="text-gray-600">Reservation confirmee</span>
                          <span className="text-gray-400 text-xs ml-auto">{new Date(r.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ─── RESERVATIONS ─── */}
            {activeTab === 'reservations' && (
              <div className="space-y-4">
                {reservations.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
                    <ShoppingBag size={40} className="text-gray-200 mx-auto mb-3"/>
                    <p className="font-display text-lg text-gray-400">Aucune reservation</p>
                    <Link href="/events" className="btn-primary text-sm mt-4 inline-block">Voir les evenements</Link>
                  </div>
                ) : (
                  reservations.map(r => (
                    <div key={r.id} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
                      <div className="w-12 h-12 bg-fuchsia/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <ShoppingBag size={20} className="text-fuchsia"/>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-petrol text-sm">Reservation #{r.id.slice(-5)}</p>
                        <p className="text-xs text-gray-400">{new Date(r.date).toLocaleDateString('fr-FR', {weekday:'long', day:'numeric', month:'long'})}</p>
                      </div>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS_STYLES[r.statut] || STATUS_STYLES.pending}`}>
                        {STATUS_LABELS[r.statut] || 'En attente'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ─── FAVORIS ─── */}
            {activeTab === 'favoris' && (
              <div>
                {favoriServices.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
                    <Heart size={40} className="text-gray-200 mx-auto mb-3"/>
                    <p className="font-display text-lg text-gray-400">Aucun favori</p>
                    <Link href="/services" className="btn-primary text-sm mt-4 inline-block">Explorer les services</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {favoriServices.map(s => {
                      const img = s.src || s.image || IMAGES[s.id % IMAGES.length]
                      return (
                        <Link key={s.id} href={`/services/${s.id}`}
                          className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group">
                          <div className="relative overflow-hidden" style={{paddingBottom:'65%'}}>
                            <img src={img} alt={s.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={e=>{e.target.src='/images/img1.jpg'}}/>
                          </div>
                          <div className="p-3">
                            <p className="font-display font-semibold text-xs text-petrol line-clamp-2">{s.title}</p>
                            <p className="text-fuchsia font-bold text-sm mt-1">{(s.price||0).toLocaleString('fr-FR')} FCFA</p>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ─── PARAMETRES PROFIL ─── */}
            {activeTab === 'settings' && (
              <div className="max-w-xl">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display font-bold text-petrol">Modifier mon profil</h3>
                    {editMode ? (
                      <div className="flex gap-2">
                        <button onClick={() => setEditMode(false)}
                          className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all">
                          <X size={14}/>
                        </button>
                        <button onClick={handleSaveProfile} disabled={saving}
                          className="w-8 h-8 bg-fuchsia rounded-full flex items-center justify-center text-white hover:bg-fuchsia-dark transition-all disabled:opacity-50">
                          {saving ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"/> : <Check size={14}/>}
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setEditMode(true)}
                        className="flex items-center gap-1 text-sm text-fuchsia hover:underline">
                        <Edit3 size={14}/> Modifier
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Prenom</label>
                      {editMode ? (
                        <input type="text" value={editPrenom} onChange={e => setEditPrenom(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia"/>
                      ) : (
                        <p className="text-gray-700 font-medium">{user.prenom}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Nom</label>
                      <p className="text-gray-700 font-medium">{user.nom}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Email</label>
                      <p className="text-gray-700">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Description</label>
                      {editMode ? (
                        <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={3}
                          placeholder="Parlez un peu de vous..."
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia"/>
                      ) : (
                        <p className="text-gray-500 text-sm italic">{user.description || 'Aucune description'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Photo de profil</label>
                      <button onClick={() => fileRef.current?.click()}
                        className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm hover:border-fuchsia hover:text-fuchsia transition-all">
                        <Upload size={15}/> Changer la photo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer/>
    </>
  )
}
