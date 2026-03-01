'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  Bell, Package, ShoppingBag, BarChart3, Settings, Plus, LogOut,
  Edit3, Upload, Check, X, Camera, Eye, Heart, Trash2, MessageCircle
} from 'lucide-react'
import { SERVICES, CATEGORIES } from '@/data/mockData'
import { IMAGES } from '@/data/mediaUtils'
import { getCurrentUser, logout, updateProfile, getReservations, initStore, getWhatsAppUrl, WHATSAPP_NUMBER } from '@/data/store'

function WA({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

const STATUS_STYLES = { pending:'bg-gold/10 text-amber-700', confirme:'bg-petrol/10 text-petrol', termine:'bg-gray-100 text-gray-500' }
const STATUS_LABELS = { pending:'En attente', confirme:'Confirmee', termine:'Terminee' }

export default function ProviderProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [editMode, setEditMode] = useState(false)
  const [editDesc, setEditDesc] = useState('')
  const [editPrenom, setEditPrenom] = useState('')
  const [saving, setSaving] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAddService, setShowAddService] = useState(false)
  const [newService, setNewService] = useState({ title:'', description:'', prix:'', duree:'', categorie:'' })
  const [myServices, setMyServices] = useState([])
  const [reservations, setReservations] = useState([])
  const fileRef = useRef(null)
  const portfolioFileRef = useRef(null)

  useEffect(() => {
    initStore()
    const u = getCurrentUser()
    if (!u) { router.push('/auth/login'); return }
    if (u.type !== 'prestataire') { router.push('/profile/client'); return }
    setUser(u)
    setEditDesc(u.description || '')
    setEditPrenom(u.prenom || '')
    // Charger mes services depuis le localStorage
    const stored = localStorage.getItem('fh_my_services_' + u.id)
    if (stored) setMyServices(JSON.parse(stored))
    setReservations(getReservations())
    const handler = (e) => { if(e.detail) setUser(e.detail) }
    window.addEventListener('fh_auth_change', handler)
    return () => window.removeEventListener('fh_auth_change', handler)
  }, [router])

  function handleLogout() { logout(); router.push('/') }

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

  function handlePortfolioAdd(e) {
    const files = Array.from(e.target.files || [])
    if (!files.length || !user) return
    const readers = files.map(file => new Promise(resolve => {
      const reader = new FileReader()
      reader.onload = ev => resolve({ type: file.type.startsWith('video') ? 'video' : 'image', src: ev.target.result, name: file.name })
      reader.readAsDataURL(file)
    }))
    Promise.all(readers).then(newMedia => {
      const updated = [...myServices, ...newMedia.map((m, i) => ({
        id: Date.now() + i,
        title: m.name.replace(/\.[^.]+$/, ''),
        mediaType: m.type,
        src: m.src,
        image: m.type === 'image' ? m.src : IMAGES[myServices.length % IMAGES.length],
        price: 0,
        category: user.categorie || 'coiffure',
        providerId: user.id,
        providerName: `${user.prenom} ${user.nom}`,
        rating: 0,
        city: user.ville || 'Yaounde',
        description: '',
      }))]
      setMyServices(updated)
      localStorage.setItem('fh_my_services_' + user.id, JSON.stringify(updated))
      window.dispatchEvent(new CustomEvent('fh_data_change'))
    })
  }

  function handleAddService(e) {
    e.preventDefault()
    if (!newService.title || !user) return
    const s = {
      id: Date.now(),
      title: newService.title,
      description: newService.description,
      price: parseInt(newService.prix) || 0,
      duration: newService.duree,
      category: newService.categorie || user.categorie || 'coiffure',
      providerId: user.id,
      providerName: `${user.prenom} ${user.nom}`,
      rating: 0,
      views: 0,
      likes: 0,
      city: user.ville || 'Yaounde',
      mediaType: 'image',
      src: IMAGES[myServices.length % IMAGES.length],
      image: IMAGES[myServices.length % IMAGES.length],
    }
    const updated = [...myServices, s]
    setMyServices(updated)
    localStorage.setItem('fh_my_services_' + user.id, JSON.stringify(updated))
    setNewService({ title:'', description:'', prix:'', duree:'', categorie:'' })
    setShowAddService(false)
    window.dispatchEvent(new CustomEvent('fh_data_change'))
  }

  function handleDeleteService(serviceId) {
    const updated = myServices.filter(s => s.id !== serviceId)
    setMyServices(updated)
    if (user) localStorage.setItem('fh_my_services_' + user.id, JSON.stringify(updated))
  }

  const filteredReservations = reservations.filter(r => filterStatus === 'all' || r.statut === filterStatus)

  if (!user) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-fuchsia border-t-transparent rounded-full animate-spin"/></div>

  const whatsappNum = user.whatsapp || WHATSAPP_NUMBER
  const TABS = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Bell },
    { id: 'services', label: 'Mes prestations', icon: Package },
    { id: 'portfolio', label: 'Portfolio', icon: Upload },
    { id: 'reservations', label: 'Reservations', icon: ShoppingBag },
    { id: 'settings', label: 'Mon profil', icon: Settings },
  ]

  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-gray-50 pt-16">
        {/* Banniere */}
        <div className="relative bg-gradient-to-br from-petrol to-petrol-dark h-40 md:h-52">
          <div className="absolute inset-0 opacity-20" style={{backgroundImage:'radial-gradient(circle at 80% 50%, #FFC107 0%, transparent 60%)'}}/>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header profil */}
          <div className="relative -mt-16 flex flex-col sm:flex-row items-start sm:items-end gap-4 pb-6 border-b border-gray-200">
            <div className="relative flex-shrink-0">
              <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-white shadow-xl bg-petrol">
                {user.image ? (
                  <img src={user.image} alt={user.prenom} className="w-full h-full object-cover"/>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-display text-4xl font-bold">
                    {(user.prenom||'P')[0].toUpperCase()}
                  </div>
                )}
              </div>
              <button onClick={() => fileRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-fuchsia hover:text-white transition-all">
                <Camera size={14}/>
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange}/>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-bold text-petrol">{user.prenom} {user.nom}</h1>
                <span className="bg-gold/20 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">Prestataire</span>
              </div>
              <p className="text-gray-500 text-sm capitalize">{user.categorie} · {user.ville || 'Cameroun'}</p>
              {user.description && <p className="text-gray-400 text-sm mt-1 italic">"{user.description}"</p>}
              {/* WhatsApp visible */}
              <a href={getWhatsAppUrl(whatsappNum, `Bonjour ${user.prenom} !`)} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 text-xs text-green-600 hover:text-green-700">
                <WA size={12}/>{whatsappNum}
              </a>
            </div>

            <div className="flex gap-2">
              <Link href="/profile/client" className="btn-outline text-sm">Espace client</Link>
              <button onClick={handleLogout}
                className="flex items-center gap-1 text-sm text-red-400 hover:text-red-600 px-3 py-2 rounded-xl hover:bg-red-50 transition-all">
                <LogOut size={15}/> Deconnexion
              </button>
            </div>
          </div>

          {/* Onglets */}
          <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap -mb-px ${
                  activeTab === tab.id ? 'border-fuchsia text-fuchsia' : 'border-transparent text-gray-500 hover:text-petrol'
                }`}>
                <tab.icon size={15}/>{tab.label}
              </button>
            ))}
          </div>

          <div className="py-8">

            {/* ─── TABLEAU DE BORD ─── */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Prestations', value: myServices.length, icon: Package },
                    { label: 'Reservations', value: reservations.length, icon: ShoppingBag },
                    { label: 'Portfolio', value: myServices.filter(s=>s.mediaType).length, icon: Upload },
                    { label: 'Vues estimees', value: myServices.length * 47, icon: Eye },
                  ].map(s => (
                    <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm text-center">
                      <s.icon size={20} className="text-fuchsia mx-auto mb-2"/>
                      <div className="font-display text-2xl font-bold text-petrol">{s.value}</div>
                      <div className="text-xs text-gray-400">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <WA size={20}/>
                  </div>
                  <div>
                    <p className="font-semibold text-green-800 text-sm">Votre numero WhatsApp</p>
                    <p className="text-green-700 text-sm">{whatsappNum}</p>
                    <p className="text-green-600 text-xs mt-0.5">Les clients vous contacteront sur ce numero</p>
                  </div>
                  <a href={getWhatsAppUrl(whatsappNum)} target="_blank" rel="noopener noreferrer"
                    className="ml-auto bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-4 py-2 rounded-full transition-all flex-shrink-0">
                    Ouvrir
                  </a>
                </div>
              </div>
            )}

            {/* ─── MES PRESTATIONS ─── */}
            {activeTab === 'services' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display font-bold text-petrol">Mes prestations ({myServices.length})</h3>
                  <button onClick={() => setShowAddService(!showAddService)}
                    className="flex items-center gap-2 btn-primary text-sm">
                    <Plus size={16}/>Ajouter une prestation
                  </button>
                </div>

                {/* Formulaire ajout prestation */}
                {showAddService && (
                  <div className="bg-fuchsia/5 border border-fuchsia/20 rounded-2xl p-6 mb-6">
                    <h4 className="font-display font-bold text-petrol mb-4">Nouvelle prestation</h4>
                    <form onSubmit={handleAddService} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Titre *</label>
                        <input type="text" required value={newService.title}
                          onChange={e => setNewService(s=>({...s, title:e.target.value}))}
                          placeholder="Ex: Tresses Box Braids Premium"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia"/>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Description</label>
                        <textarea value={newService.description} rows={2}
                          onChange={e => setNewService(s=>({...s, description:e.target.value}))}
                          placeholder="Decrivez votre prestation..."
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia"/>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Prix (FCFA)</label>
                        <input type="number" value={newService.prix}
                          onChange={e => setNewService(s=>({...s, prix:e.target.value}))}
                          placeholder="25000"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia"/>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Duree</label>
                        <input type="text" value={newService.duree}
                          onChange={e => setNewService(s=>({...s, duree:e.target.value}))}
                          placeholder="Ex: 4h"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia"/>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Categorie</label>
                        <select value={newService.categorie}
                          onChange={e => setNewService(s=>({...s, categorie:e.target.value}))}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia">
                          <option value="">Ma categorie</option>
                          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                        </select>
                      </div>
                      <div className="md:col-span-2 flex gap-3">
                        <button type="submit" className="btn-primary text-sm flex items-center gap-2">
                          <Check size={14}/>Ajouter
                        </button>
                        <button type="button" onClick={() => setShowAddService(false)}
                          className="btn-outline text-sm">Annuler</button>
                      </div>
                    </form>
                  </div>
                )}

                {myServices.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
                    <Package size={40} className="text-gray-200 mx-auto mb-3"/>
                    <p className="font-display text-lg text-gray-400">Aucune prestation</p>
                    <p className="text-sm text-gray-400 mt-1">Ajoutez votre premiere prestation !</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {myServices.map(s => (
                      <div key={s.id} className="bg-white rounded-2xl p-4 shadow-sm flex gap-4 items-start">
                        <div className="w-16 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                          {s.mediaType === 'video' ? (
                            <video src={s.src} className="w-full h-full object-cover"/>
                          ) : (
                            <img src={s.src || s.image || IMAGES[0]} alt="" className="w-full h-full object-cover" onError={e=>{e.target.src='/images/img1.jpg'}}/>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-display font-semibold text-sm text-petrol line-clamp-1">{s.title}</p>
                          <p className="text-fuchsia font-bold text-sm">{(s.price||0).toLocaleString('fr-FR')} FCFA</p>
                          {s.duration && <p className="text-xs text-gray-400">{s.duration}</p>}
                        </div>
                        <button onClick={() => handleDeleteService(s.id)}
                          className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
                          <Trash2 size={15}/>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── PORTFOLIO ─── */}
            {activeTab === 'portfolio' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display font-bold text-petrol">Portfolio photos & videos</h3>
                  <button onClick={() => portfolioFileRef.current?.click()}
                    className="flex items-center gap-2 btn-primary text-sm">
                    <Upload size={16}/>Ajouter des fichiers
                  </button>
                  <input ref={portfolioFileRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handlePortfolioAdd}/>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 text-xs text-blue-700">
                  📎 Accepte les images (JPG, PNG) et videos (MP4). Taille max recommandee : 20 Mo par fichier.
                </div>
                {myServices.filter(s => s.src).length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 shadow-sm text-center border-2 border-dashed border-gray-200 cursor-pointer hover:border-fuchsia transition-all"
                    onClick={() => portfolioFileRef.current?.click()}>
                    <Upload size={40} className="text-gray-200 mx-auto mb-3"/>
                    <p className="font-display text-lg text-gray-400">Cliquer pour ajouter des photos ou videos</p>
                    <p className="text-sm text-gray-300 mt-1">JPG, PNG, MP4 acceptes</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {myServices.map((s, i) => (
                      <div key={s.id} className="relative group rounded-2xl overflow-hidden bg-gray-50 shadow-sm" style={{paddingBottom:'75%'}}>
                        {s.mediaType === 'video' ? (
                          <video src={s.src} className="absolute inset-0 w-full h-full object-cover" controls={false} muted loop playsInline
                            onMouseEnter={e=>e.target.play()} onMouseLeave={e=>{e.target.pause();e.target.currentTime=0}}/>
                        ) : (
                          <img src={s.src||s.image||IMAGES[i%IMAGES.length]} alt="" className="absolute inset-0 w-full h-full object-cover" onError={e=>{e.target.src='/images/img1.jpg'}}/>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button onClick={() => handleDeleteService(s.id)}
                            className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600">
                            <Trash2 size={14}/>
                          </button>
                        </div>
                        {s.mediaType === 'video' && (
                          <span className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">Video</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── RESERVATIONS RECUES ─── */}
            {activeTab === 'reservations' && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <h3 className="font-display font-bold text-petrol">Reservations</h3>
                  <div className="flex gap-2">
                    {['all','pending','confirme','termine'].map(s => (
                      <button key={s} onClick={() => setFilterStatus(s)}
                        className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                          filterStatus===s ? 'bg-fuchsia text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}>
                        {s==='all'?'Toutes':STATUS_LABELS[s]}
                      </button>
                    ))}
                  </div>
                </div>
                {filteredReservations.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
                    <ShoppingBag size={40} className="text-gray-200 mx-auto mb-3"/>
                    <p className="font-display text-lg text-gray-400">Aucune reservation</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredReservations.map(r => (
                      <div key={r.id} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
                        <div className="w-10 h-10 bg-fuchsia/10 rounded-full flex items-center justify-center flex-shrink-0 text-fuchsia font-bold text-sm">
                          {(r.nom||'?')[0]}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-petrol text-sm">{r.nom || 'Client anonyme'}</p>
                          <p className="text-xs text-gray-400">{new Date(r.date).toLocaleDateString('fr-FR', {weekday:'long',day:'numeric',month:'long'})}</p>
                        </div>
                        <a href={getWhatsAppUrl(r.telephone||WHATSAPP_NUMBER, `Bonjour ! Concernant votre reservation du ${new Date(r.date).toLocaleDateString('fr-FR')}`)} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 bg-green-50 text-green-600 hover:bg-green-100 text-xs font-medium px-3 py-1.5 rounded-full transition-all">
                          <WA size={12}/>Contacter
                        </a>
                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS_STYLES[r.statut]||STATUS_STYLES.pending}`}>
                          {STATUS_LABELS[r.statut]||'En attente'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── PARAMETRES ─── */}
            {activeTab === 'settings' && (
              <div className="max-w-xl">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display font-bold text-petrol">Mon profil prestataire</h3>
                    {editMode ? (
                      <div className="flex gap-2">
                        <button onClick={() => setEditMode(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"><X size={14}/></button>
                        <button onClick={handleSaveProfile} disabled={saving}
                          className="w-8 h-8 bg-fuchsia rounded-full flex items-center justify-center text-white hover:bg-fuchsia-dark disabled:opacity-50">
                          {saving ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"/> : <Check size={14}/>}
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setEditMode(true)} className="flex items-center gap-1 text-sm text-fuchsia hover:underline">
                        <Edit3 size={14}/>Modifier
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {[
                      { label:'Prenom', key:'prenom', edit: editMode, value: editPrenom, onChange: e=>setEditPrenom(e.target.value) },
                    ].map(f => (
                      <div key={f.label}>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">{f.label}</label>
                        {f.edit ? (
                          <input type="text" value={f.value} onChange={f.onChange}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia"/>
                        ) : <p className="text-gray-700 font-medium">{f.value}</p>}
                      </div>
                    ))}
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Email</label>
                      <p className="text-gray-700">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">WhatsApp</label>
                      <p className="text-green-600 font-medium">{whatsappNum}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Description</label>
                      {editMode ? (
                        <textarea value={editDesc} onChange={e=>setEditDesc(e.target.value)} rows={3}
                          placeholder="Decrivez vos services..."
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia"/>
                      ) : <p className="text-gray-500 text-sm italic">{user.description||'Aucune description'}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Photo de profil</label>
                      <button onClick={() => fileRef.current?.click()}
                        className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm hover:border-fuchsia hover:text-fuchsia transition-all">
                        <Upload size={15}/>Changer la photo
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
