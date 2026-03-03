// ============================================================
// FEMPRENEUR HUB - Base de données temporaire
// Utilise localStorage pour persister les données entre pages
// ============================================================

const WHATSAPP_NUMBER = '+237694872823'

// --- Comptes de test pré-créés ---
const INITIAL_USERS = [
  // ── PRESTATAIRES ──
  {
    id: 'presta1',
    prenom: 'Marie',
    nom: 'Beauty',
    email: 'marie@beauty.com',
    motDePasse: 'presta123',
    type: 'prestataire',
    categorie: 'coiffure',
    whatsapp: WHATSAPP_NUMBER,
    description: 'Specialiste coiffure afro et tresses depuis 10 ans a Yaounde. Braids, locs, tissage, chignons de mariee.',
    image: '/images/img3.jpg',
    createdAt: Date.now(),
  },
  {
    id: 'presta2',
    prenom: 'Deco',
    nom: '& Co',
    email: 'deco@event.com',
    motDePasse: 'presta123',
    type: 'prestataire',
    categorie: 'decoration',
    whatsapp: WHATSAPP_NUMBER,
    description: 'Decoration florale et thematique pour mariages, anniversaires et evenements corporatifs a Douala.',
    image: '/images/img5.jpg',
    createdAt: Date.now(),
  },
  // ── CLIENTS ──
  {
    id: 'client-1',
    prenom: 'Aicha',
    nom: 'Diallo',
    email: 'client1@test.com',
    motDePasse: 'test123',
    type: 'client',
    image: '/images/img1.jpg',
    description: '',
    createdAt: Date.now(),
  },
  {
    id: 'client-2',
    prenom: 'Fatima',
    nom: 'Njoya',
    email: 'client2@test.com',
    motDePasse: 'test123',
    type: 'client',
    image: '/images/img2.jpg',
    description: '',
    createdAt: Date.now(),
  },
  {
    id: 'client-3',
    prenom: 'Clarisse',
    nom: 'Tchouala',
    email: 'client3@test.com',
    motDePasse: 'test123',
    type: 'client',
    image: '/images/img4.jpg',
    description: '',
    createdAt: Date.now(),
  },
  {
    id: 'client-4',
    prenom: 'Vanessa',
    nom: 'Mbarga',
    email: 'client4@test.com',
    motDePasse: 'test123',
    type: 'client',
    image: '/images/img6.jpg',
    description: '',
    createdAt: Date.now(),
  },
  {
    id: 'client-5',
    prenom: 'Sarah',
    nom: 'Kamga',
    email: 'client5@test.com',
    motDePasse: 'test123',
    type: 'client',
    image: '/images/img7.jpg',
    description: '',
    createdAt: Date.now(),
  },
]

// ─────────────────────────────────────────────────────────
// Helpers localStorage (ne plante pas si window absent)
// ─────────────────────────────────────────────────────────
function lsGet(key, fallback = null) {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

function lsSet(key, value) {
  if (typeof window === 'undefined') return
  try { window.localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

// Envoie un événement personnalisé pour mettre à jour l'interface
function emit(event, detail = null) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(event, { detail }))
  }
}

// ─────────────────────────────────────────────────────────
// INITIALISATION
// ─────────────────────────────────────────────────────────
export function initStore() {
  if (typeof window === 'undefined') return
  if (!lsGet('fh_users'))        lsSet('fh_users', INITIAL_USERS)
  if (!lsGet('fh_likes'))        lsSet('fh_likes', {})
  if (!lsGet('fh_liked_by'))     lsSet('fh_liked_by', {})
  if (!lsGet('fh_views'))        lsSet('fh_views', {})
  if (!lsGet('fh_places'))       lsSet('fh_places', {})
  if (!lsGet('fh_avis'))         lsSet('fh_avis', [])
  if (!lsGet('fh_reservations')) lsSet('fh_reservations', [])
  if (!lsGet('fh_favoris'))      lsSet('fh_favoris', {})
}

// Force la réinitialisation (utile si on veut remettre à zéro les users)
export function resetStore() {
  if (typeof window === 'undefined') return
  lsSet('fh_users', INITIAL_USERS)
  lsSet('fh_session', null)
  lsSet('fh_likes', {})
  lsSet('fh_liked_by', {})
  lsSet('fh_views', {})
  lsSet('fh_places', {})
  lsSet('fh_avis', [])
  lsSet('fh_reservations', [])
  lsSet('fh_favoris', {})
  emit('fh_auth_change', null)
}

// ─────────────────────────────────────────────────────────
// AUTHENTIFICATION — connectée au backend via API
// ─────────────────────────────────────────────────────────
import { apiLogin, apiRegister, normalizeUser, setToken, removeToken, CATEGORIE_SLUG_MAP } from '@/lib/api'

export async function login(email, motDePasse) {
  try {
    const data = await apiLogin(email, motDePasse)
    const user = normalizeUser(data.user, data.token)
    setToken(data.token)
    lsSet('fh_session', user)
    emit('fh_auth_change', user)
    return { success: true, user }
  } catch (err) {
    return { success: false, error: err.message || 'Email ou mot de passe incorrect' }
  }
}

export async function register(data) {
  const nom = `${data.prenom || ''} ${data.nom || ''}`.trim()
  const categorieSlug = data.type === 'prestataire'
    ? (CATEGORIE_SLUG_MAP[data.categorie] || 'autre')
    : undefined
  try {
    const res = await apiRegister({
      email: data.email,
      password: data.motDePasse,
      nom,
      role: data.type === 'prestataire' ? 'PRESTATAIRE' : 'CLIENT',
      telephone: data.telephone || undefined,
      categorieSlug,
    })
    const user = normalizeUser(res.user, res.token)
    setToken(res.token)
    lsSet('fh_session', user)
    emit('fh_auth_change', user)
    return { success: true, user }
  } catch (err) {
    return { success: false, error: err.message || 'Erreur lors de la création du compte' }
  }
}

export function logout() {
  removeToken()
  lsSet('fh_session', null)
  emit('fh_auth_change', null)
}

export function getCurrentUser() {
  return lsGet('fh_session', null)
}

export function updateProfile(updates) {
  const session = lsGet('fh_session')
  if (!session) return null
  const newSession = { ...session, ...updates }
  lsSet('fh_session', newSession)
  emit('fh_auth_change', newSession)
  return newSession
}

// ─────────────────────────────────────────────────────────
// LIKES / FAVORIS
// ─────────────────────────────────────────────────────────
export function getLikes(serviceId) {
  const base = 50 + ((serviceId * 37) % 400)
  const extra = (lsGet('fh_likes') || {})[serviceId] || 0
  return base + extra
}

export function toggleLike(serviceId) {
  if (typeof window === 'undefined') return false
  const user = getCurrentUser()
  const userId = user?.id || 'anonymous'

  const likedBy = lsGet('fh_liked_by') || {}
  const userLiked = likedBy[userId] || []
  const already = userLiked.includes(serviceId)

  if (already) {
    likedBy[userId] = userLiked.filter(id => id !== serviceId)
  } else {
    likedBy[userId] = [...userLiked, serviceId]
    const likes = lsGet('fh_likes') || {}
    likes[serviceId] = (likes[serviceId] || 0) + 1
    lsSet('fh_likes', likes)
  }
  lsSet('fh_liked_by', likedBy)

  // Met aussi à jour les favoris
  const favoris = lsGet('fh_favoris') || {}
  favoris[userId] = already
    ? (favoris[userId] || []).filter(id => id !== serviceId)
    : [...(favoris[userId] || []), serviceId]
  lsSet('fh_favoris', favoris)

  emit('fh_data_change')
  return !already
}

export function isLiked(serviceId) {
  const user = getCurrentUser()
  const userId = user?.id || 'anonymous'
  const likedBy = lsGet('fh_liked_by') || {}
  return (likedBy[userId] || []).includes(serviceId)
}

export function getFavoris() {
  const user = getCurrentUser()
  if (!user) return []
  const favoris = lsGet('fh_favoris') || {}
  return favoris[user.id] || []
}

// ─────────────────────────────────────────────────────────
// VUES
// ─────────────────────────────────────────────────────────
export function incrementView(serviceId) {
  const views = lsGet('fh_views') || {}
  views[serviceId] = (views[serviceId] || 0) + 1
  lsSet('fh_views', views)
  emit('fh_data_change')
}

export function getViews(serviceId) {
  const base = 200 + ((serviceId * 113) % 2000)
  const extra = (lsGet('fh_views') || {})[serviceId] || 0
  return base + extra
}

// ─────────────────────────────────────────────────────────
// ÉVÉNEMENTS - PLACES
// ─────────────────────────────────────────────────────────
export function getPlacesRestantes(event) {
  const used = (lsGet('fh_places') || {})[event.id] || 0
  return Math.max(0, event.maxParticipants - event.participants - used)
}

export function reserver(eventId, data) {
  const places = lsGet('fh_places') || {}
  places[eventId] = (places[eventId] || 0) + (data.nbPlaces || 1)
  lsSet('fh_places', places)

  const user = getCurrentUser()
  const reservations = lsGet('fh_reservations') || []
  reservations.push({
    id: 'res-' + Date.now(),
    userId: user?.id || 'anonymous',
    userNom: user ? `${user.prenom} ${user.nom}` : 'Anonyme',
    eventId,
    ...data,
    statut: 'confirme',
    date: new Date().toISOString(),
  })
  lsSet('fh_reservations', reservations)
  emit('fh_data_change')
  return true
}

export function getReservations() {
  const user = getCurrentUser()
  if (!user) return []
  return (lsGet('fh_reservations') || []).filter(r => r.userId === user.id)
}

// ─────────────────────────────────────────────────────────
// AVIS
// ─────────────────────────────────────────────────────────
export function getAvis(providerId) {
  return (lsGet('fh_avis') || []).filter(a => a.providerId === providerId)
}

export function addAvis({ providerId, note, commentaire }) {
  const user = getCurrentUser()
  if (!user) return false
  const avis = lsGet('fh_avis') || []
  // Un seul avis par utilisateur par prestataire
  const exists = avis.findIndex(a => a.providerId === providerId && a.userId === user.id)
  const newAvis = {
    id: 'avis-' + Date.now(),
    userId: user.id,
    userName: `${user.prenom} ${user.nom}`,
    providerId,
    note,
    commentaire,
    date: new Date().toISOString(),
  }
  if (exists >= 0) avis[exists] = newAvis
  else avis.push(newAvis)
  lsSet('fh_avis', avis)
  emit('fh_data_change')
  return true
}

export function getNoteMoyenne(providerId, baseRating) {
  const avis = getAvis(providerId)
  if (avis.length === 0) return baseRating
  const sum = avis.reduce((acc, a) => acc + a.note, 0)
  return Math.round((sum / avis.length) * 10) / 10
}

// ─────────────────────────────────────────────────────────
// WHATSAPP
// ─────────────────────────────────────────────────────────
export function getWhatsAppUrl(numero = WHATSAPP_NUMBER, message = '') {
  const clean = (numero || WHATSAPP_NUMBER).replace(/[^0-9+]/g, '')
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`
}

export { WHATSAPP_NUMBER }
