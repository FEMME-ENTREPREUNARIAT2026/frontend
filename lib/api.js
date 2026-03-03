// ============================================================
// FEMPRENEUR HUB — Client API centralisé
// ============================================================

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3001'
const CATALOGUE_URL = process.env.NEXT_PUBLIC_CATALOGUE_URL || 'http://localhost:3002'
const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL || 'http://localhost:3003'

// ─── Gestion du token JWT ───────────────────────────────────
export function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('fh_jwt_token')
}

export function setToken(token) {
  if (typeof window === 'undefined') return
  localStorage.setItem('fh_jwt_token', token)
}

export function removeToken() {
  if (typeof window === 'undefined') return
  localStorage.removeItem('fh_jwt_token')
}

function authHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...authHeaders(), ...(options.headers || {}) },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw { status: res.status, message: data.message || 'Erreur serveur' }
  return data
}

// ─── Mapping catégorie label → slug backend ─────────────────
export const CATEGORIE_SLUG_MAP = {
  'Coiffure': 'coiffure',
  'Maquillage/Beaute': 'maquillage',
  'Decoration': 'decoration',
  'Restauration/Traiteur': 'restauration',
  'Cinematographie/Photo': 'cinematographie',
  'Sonorisation/DJ': 'sonorisation',
  'Hotesses/Protocole': 'hotesses',
  'Maitre de ceremonie': 'mc',
  'Manucure/Pedicure': 'manucure',
  'Autre': 'autre',
}

// ─── Normalisation user backend → format frontend ───────────
export function normalizeUser(user, token) {
  const parts = (user.nom || '').trim().split(' ')
  const prenom = parts[0] || ''
  const nom = parts.slice(1).join(' ') || ''
  return {
    id: user.id,
    prenom,
    nom,
    email: user.email,
    telephone: user.telephone || '',
    image: user.avatar || '/images/img1.jpg',
    type: user.role === 'PRESTATAIRE' ? 'prestataire' : 'client',
    categorie: user.categorieSlug || null,
    description: '',
    token,
  }
}

// ─── Normalisation prestation → carte service frontend ──────
export function normalizePrestationForCard(p) {
  return {
    id: p.id,
    title: p.titre,
    category: p.categorie?.slug || '',
    city: p.boutique?.ville || '',
    price: p.prix,
    rating: p.boutique?.noteMoyenne || 4.5,
    reviews: 0,
    description: p.description || '',
    providerName: p.boutique?.nom || '',
    providerId: p.boutique?.id || '',
    image: p.photos?.[0] || null,
    views: p.vues || 0,
    boutiqueId: p.boutiqueId,
  }
}

// ─── Normalisation boutique → carte prestataire frontend ────
export function normalizeBoutiqueForCard(b) {
  return {
    id: b.id,
    name: b.nom,
    city: b.ville,
    category: b.categorie?.slug || '',
    rating: b.noteMoyenne || 4.5,
    reviews: b._count?.prestations || 0,
    image: b.avatar || b.photos?.[0] || null,
    description: b.bio || '',
    adresse: b.adresse || '',
    quartier: b.quartier || '',
    disponible: b.disponible,
    tarifMin: b.tarifMin,
    badge: b.badge,
  }
}

// ─── Normalisation événement → format frontend ──────────────
export function normalizeEvenement(e) {
  return {
    id: e.id,
    title: e.titre,
    type: e.tags?.[0] || 'Événement',
    date: e.date ? e.date.split('T')[0] : '',
    time: e.heure || '',
    location: e.lieu,
    organizer: '',
    participants: e.inscrits || 0,
    maxParticipants: e.capacite || 100,
    image: e.image || null,
    price: e.prix || 'Gratuit',
    description: e.description || '',
    tags: e.tags || [],
  }
}

// ─── AUTH ────────────────────────────────────────────────────
export async function apiLogin(email, password) {
  return request(`${AUTH_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function apiRegister({ email, password, nom, role, telephone, categorieSlug }) {
  return request(`${AUTH_URL}/auth/register`, {
    method: 'POST',
    body: JSON.stringify({ email, password, nom, role, telephone, categorieSlug }),
  })
}

export async function apiGetMe() {
  return request(`${AUTH_URL}/auth/me`)
}

export async function apiSendVerification(email) {
  return request(`${AUTH_URL}/auth/send-verification`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export async function apiVerifyEmail(email, code) {
  return request(`${AUTH_URL}/auth/verify-email`, {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  })
}

export async function apiForgotPassword(email) {
  return request(`${AUTH_URL}/auth/forgot-password`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export async function apiResetPassword(email, code, newPassword) {
  return request(`${AUTH_URL}/auth/reset-password`, {
    method: 'POST',
    body: JSON.stringify({ email, code, newPassword }),
  })
}

// ─── CATALOGUE — Catégories ──────────────────────────────────
export async function getCategories() {
  return request(`${CATALOGUE_URL}/categories`)
}

// ─── CATALOGUE — Boutiques (Prestataires) ───────────────────
export async function getBoutiques(params = {}) {
  const qs = new URLSearchParams(params).toString()
  return request(`${CATALOGUE_URL}/boutiques${qs ? '?' + qs : ''}`)
}

export async function getBoutiqueById(id) {
  return request(`${CATALOGUE_URL}/boutiques/${id}`)
}

export async function creerBoutique(data) {
  return request(`${CATALOGUE_URL}/boutiques`, { method: 'POST', body: JSON.stringify(data) })
}

export async function modifierBoutique(id, data) {
  return request(`${CATALOGUE_URL}/boutiques/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

// ─── CATALOGUE — Prestations (Services) ─────────────────────
export async function getPrestations(params = {}) {
  const qs = new URLSearchParams(params).toString()
  return request(`${CATALOGUE_URL}/prestations${qs ? '?' + qs : ''}`)
}

export async function getPrestationById(id) {
  return request(`${CATALOGUE_URL}/prestations/${id}`)
}

export async function creerPrestation(data) {
  return request(`${CATALOGUE_URL}/prestations`, { method: 'POST', body: JSON.stringify(data) })
}

export async function modifierPrestation(id, data) {
  return request(`${CATALOGUE_URL}/prestations/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export async function supprimerPrestation(id) {
  return request(`${CATALOGUE_URL}/prestations/${id}`, { method: 'DELETE' })
}

export async function searchCatalogue(q) {
  return request(`${CATALOGUE_URL}/search?q=${encodeURIComponent(q)}`)
}

// ─── CATALOGUE — Événements ──────────────────────────────────
export async function getEvenements(params = {}) {
  const qs = new URLSearchParams(params).toString()
  return request(`${CATALOGUE_URL}/evenements${qs ? '?' + qs : ''}`)
}

export async function getEvenementById(id) {
  return request(`${CATALOGUE_URL}/evenements/${id}`)
}

export async function creerEvenement(data) {
  return request(`${CATALOGUE_URL}/evenements`, { method: 'POST', body: JSON.stringify(data) })
}

// ─── BOOKING — Réservations ──────────────────────────────────
export async function creerReservation(data) {
  return request(`${BOOKING_URL}/booking/reservations`, { method: 'POST', body: JSON.stringify(data) })
}

export async function mesReservations() {
  return request(`${BOOKING_URL}/booking/reservations/mes`)
}

export async function reservationsBoutique(boutiqueId) {
  return request(`${BOOKING_URL}/booking/reservations/boutique/${boutiqueId}`)
}

export async function changerStatutReservation(reservationId, statut) {
  return request(`${BOOKING_URL}/booking/reservations/${reservationId}/statut`, {
    method: 'PATCH',
    body: JSON.stringify({ statut }),
  })
}

// ─── BOOKING — Avis ─────────────────────────────────────────
export async function laisserAvis(reservationId, data) {
  return request(`${BOOKING_URL}/booking/reservations/${reservationId}/avis`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function avisParBoutique(boutiqueId) {
  return request(`${BOOKING_URL}/booking/avis/boutique/${boutiqueId}`)
}
