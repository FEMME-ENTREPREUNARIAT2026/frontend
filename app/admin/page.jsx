'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users, Search, Shield, Ban, CheckCircle, Trash2, Eye,
  X, Lock, Plus, EyeOff
} from 'lucide-react'
import { initStore } from '@/data/store'

// ─── Credentials admin en dur ───────────────────────────────
const ADMIN_EMAIL = 'admin@fempreneur.cm'
const ADMIN_PASSWORD = 'Admin2025!'

const CATEGORIES_PRESTA = [
  'Coiffure', 'Maquillage/Beaute', 'Decoration', 'Restauration/Traiteur',
  'Cinematographie/Photo', 'Sonorisation/DJ', 'Hotesses/Protocole',
  'Maitre de ceremonie', 'Manucure/Pedicure', 'Autre'
]

function lsGet(key, fallback = null) {
  if (typeof window === 'undefined') return fallback
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback } catch { return fallback }
}
function lsSet(key, value) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

export default function AdminPage() {
  const router = useRouter()
  const [adminLogged, setAdminLogged] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPwd, setLoginPwd] = useState('')
  const [loginError, setLoginError] = useState('')

  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [tab, setTab] = useState('prestataires')
  const [showLoginPwd, setShowLoginPwd] = useState(false)

  // ── Création prestataire ────────────────────────────────────
  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState({
    prenom: '', nom: '', email: '', password: '', telephone: '', whatsapp: '', categorie: ''
  })
  const [createPwdVisible, setCreatePwdVisible] = useState(false)
  const [createError, setCreateError] = useState('')

  // ── Édition prestataire ─────────────────────────────────────
  const [showEdit, setShowEdit] = useState(false)
  const [editForm, setEditForm] = useState(null)
  const [editPwdVisible, setEditPwdVisible] = useState(false)
  const [editError, setEditError] = useState('')

  useEffect(() => {
    initStore()
    // Vérifie session admin en localStorage
    if (lsGet('fh_admin_session')) setAdminLogged(true)
    loadUsers()
  }, [])

  function loadUsers() {
    const all = lsGet('fh_users') || []
    setUsers(all)
  }

  function handleLogin(e) {
    e.preventDefault()
    if (loginEmail === ADMIN_EMAIL && loginPwd === ADMIN_PASSWORD) {
      lsSet('fh_admin_session', true)
      setAdminLogged(true)
      setLoginError('')
    } else {
      setLoginError('Identifiants administrateur incorrects')
    }
  }

  function handleLogout() {
    lsSet('fh_admin_session', false)
    setAdminLogged(false)
  }

  function toggleStatus(userId) {
    const all = lsGet('fh_users') || []
    const updated = all.map(u =>
      u.id === userId ? { ...u, suspended: !u.suspended } : u
    )
    lsSet('fh_users', updated)
    setUsers(updated)
  }

  function deleteUser(userId) {
    if (!confirm('Confirmer la suppression de ce compte ?')) return
    const all = (lsGet('fh_users') || []).filter(u => u.id !== userId)
    lsSet('fh_users', all)
    setUsers(all)
    setSelected(null)
  }

  function createPrestataire(e) {
    e.preventDefault()
    setCreateError('')
    const all = lsGet('fh_users') || []
    if (all.find(u => u.email === createForm.email)) {
      setCreateError('Un compte avec cet email existe déjà.')
      return
    }
    const newUser = {
      id: Date.now(),
      type: 'prestataire',
      prenom: createForm.prenom,
      nom: createForm.nom,
      email: createForm.email,
      password: createForm.password,
      telephone: createForm.telephone,
      whatsapp: createForm.whatsapp,
      categorie: createForm.categorie,
      suspended: false,
      createdAt: new Date().toISOString(),
    }
    const updated = [newUser, ...all]
    lsSet('fh_users', updated)
    setUsers(updated)
    setShowCreate(false)
    setCreateForm({ prenom: '', nom: '', email: '', password: '', telephone: '', whatsapp: '', categorie: '' })
  }

  function openEdit(user) {
    setEditForm({
      id: user.id,
      prenom: user.prenom || '',
      nom: user.nom || '',
      email: user.email || '',
      password: '',
      telephone: user.telephone || '',
      whatsapp: user.whatsapp || '',
      categorie: user.categorie || '',
    })
    setEditError('')
    setShowEdit(true)
    setSelected(null)
  }

  function updateUser(e) {
    e.preventDefault()
    setEditError('')
    const all = lsGet('fh_users') || []
    const conflict = all.find(u => u.email === editForm.email && u.id !== editForm.id)
    if (conflict) { setEditError('Cet email est déjà utilisé par un autre compte.'); return }
    const updated = all.map(u => {
      if (u.id !== editForm.id) return u
      return {
        ...u,
        prenom: editForm.prenom,
        nom: editForm.nom,
        email: editForm.email,
        telephone: editForm.telephone,
        whatsapp: editForm.whatsapp,
        categorie: editForm.categorie,
        ...(editForm.password ? { password: editForm.password } : {}),
      }
    })
    lsSet('fh_users', updated)
    setUsers(updated)
    setShowEdit(false)
    setEditForm(null)
  }

  const displayed = users.filter(u => {
    const matchType = tab === 'prestataires' ? u.type === 'prestataire' : u.type === 'client'
    const matchSearch = search === '' ||
      u.prenom?.toLowerCase().includes(search.toLowerCase()) ||
      u.nom?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  const statsPresta = users.filter(u => u.type === 'prestataire')
  const statsClients = users.filter(u => u.type === 'client')
  const statsSuspended = users.filter(u => u.suspended)

  // ── Écran connexion admin ──────────────────────────────────
  if (!adminLogged) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-sm">
          <div className="flex items-center justify-center w-14 h-14 bg-petrol/10 rounded-2xl mx-auto mb-6">
            <Lock size={28} className="text-petrol" />
          </div>
          <h1 className="font-display text-2xl font-bold text-petrol text-center mb-1">
            Administration
          </h1>
          <p className="text-sm text-gray-400 text-center mb-6">Accès réservé aux administrateurs</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Email admin</label>
              <input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                placeholder="admin@fempreneur.cm"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-petrol/30 focus:border-petrol" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Mot de passe</label>
              <div className="relative">
                <input
                  type={showLoginPwd ? 'text' : 'password'}
                  required value={loginPwd} onChange={e => setLoginPwd(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-petrol/30 focus:border-petrol" />
                <button type="button" onClick={() => setShowLoginPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-petrol">
                  {showLoginPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            {loginError && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-xl">{loginError}</div>
            )}
            <button type="submit"
              className="w-full bg-petrol text-white py-3 rounded-full font-semibold hover:bg-petrol/90 transition-all">
              Se connecter
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ── Dashboard admin ────────────────────────────────────────
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header admin */}
        <div className="bg-petrol text-white py-4 px-6 flex items-center justify-between sticky top-0 z-40 shadow-lg">
          <div className="flex items-center gap-3">
            <Shield size={22} className="text-gold" />
            <span className="font-display font-bold text-lg">Fempreneur Hub — Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/60 text-sm hidden sm:block">{ADMIN_EMAIL}</span>
            <button onClick={handleLogout}
              className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-all">
              Déconnexion
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Prestataires', value: statsPresta.length, color: 'bg-petrol/10 text-petrol' },
              { label: 'Clientes', value: statsClients.length, color: 'bg-fuchsia/10 text-fuchsia' },
              { label: 'Total comptes', value: users.length, color: 'bg-gold/20 text-amber-700' },
              { label: 'Suspendus', value: statsSuspended.length, color: 'bg-red-50 text-red-500' },
            ].map(s => (
              <div key={s.label} className={`rounded-2xl p-5 ${s.color.split(' ')[0]} bg-white shadow-sm`}>
                <div className={`text-3xl font-bold font-display ${s.color.split(' ')[1]}`}>{s.value}</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs + bouton créer */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              {[
                { key: 'prestataires', label: 'Prestataires' },
                { key: 'clients', label: 'Clientes' },
              ].map(t => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    tab === t.key ? 'bg-petrol text-white' : 'bg-white text-gray-500 hover:bg-gray-100'
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>
            {tab === 'prestataires' && (
              <button onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 bg-fuchsia text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-fuchsia/90 transition-all">
                <Plus size={15} />
                Créer un prestataire
              </button>
            )}
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher par nom ou email..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol/30 focus:border-petrol bg-white"
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {displayed.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Users size={36} className="mx-auto mb-3 opacity-40" />
                <p>Aucun compte trouvé</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Compte</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Email</th>
                      {tab === 'prestataires' && (
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Catégorie</th>
                      )}
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Statut</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {displayed.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                              {u.image ? (
                                <img src={u.image} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-bold">
                                  {(u.prenom || '?')[0]}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-petrol">{u.prenom} {u.nom}</p>
                              <p className="text-xs text-gray-400 sm:hidden">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-gray-500 hidden sm:table-cell">{u.email}</td>
                        {tab === 'prestataires' && (
                          <td className="px-5 py-4 text-gray-500 capitalize hidden md:table-cell">{u.categorie || '—'}</td>
                        )}
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            u.suspended
                              ? 'bg-red-50 text-red-500'
                              : 'bg-green-50 text-green-600'
                          }`}>
                            {u.suspended ? <Ban size={11} /> : <CheckCircle size={11} />}
                            {u.suspended ? 'Suspendu' : 'Actif'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelected(u)}
                              title="Voir le profil"
                              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-petrol/10 flex items-center justify-center text-gray-500 hover:text-petrol transition-all"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => toggleStatus(u.id)}
                              title={u.suspended ? 'Réactiver' : 'Suspendre'}
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                u.suspended
                                  ? 'bg-green-50 hover:bg-green-100 text-green-600'
                                  : 'bg-amber-50 hover:bg-amber-100 text-amber-600'
                              }`}
                            >
                              {u.suspended ? <CheckCircle size={14} /> : <Ban size={14} />}
                            </button>
                            <button
                              onClick={() => deleteUser(u.id)}
                              title="Supprimer"
                              className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-600 transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal créer prestataire */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl z-10">
              <h3 className="font-display text-lg font-bold text-petrol">Créer un compte prestataire</h3>
              <button onClick={() => setShowCreate(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <X size={15} />
              </button>
            </div>

            <form onSubmit={createPrestataire} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Prénom</label>
                  <input required type="text" value={createForm.prenom}
                    onChange={e => setCreateForm(f => ({ ...f, prenom: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Nom</label>
                  <input required type="text" value={createForm.nom}
                    onChange={e => setCreateForm(f => ({ ...f, nom: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                <input required type="email" value={createForm.email}
                  onChange={e => setCreateForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Mot de passe</label>
                <div className="relative">
                  <input required type={createPwdVisible ? 'text' : 'password'} value={createForm.password}
                    onChange={e => setCreateForm(f => ({ ...f, password: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia" />
                  <button type="button" onClick={() => setCreatePwdVisible(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-fuchsia">
                    {createPwdVisible ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Téléphone</label>
                  <input type="tel" value={createForm.telephone}
                    onChange={e => setCreateForm(f => ({ ...f, telephone: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">WhatsApp</label>
                  <input type="tel" value={createForm.whatsapp}
                    onChange={e => setCreateForm(f => ({ ...f, whatsapp: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Catégorie</label>
                <select required value={createForm.categorie}
                  onChange={e => setCreateForm(f => ({ ...f, categorie: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia/30 focus:border-fuchsia bg-white">
                  <option value="">Sélectionner une catégorie</option>
                  {CATEGORIES_PRESTA.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {createError && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-xl">{createError}</div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)}
                  className="flex-1 py-3 rounded-full text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all">
                  Annuler
                </button>
                <button type="submit"
                  className="flex-1 py-3 rounded-full text-sm font-semibold bg-fuchsia text-white hover:bg-fuchsia/90 transition-all">
                  Créer le compte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal détail utilisateur */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-5">
              <h3 className="font-display text-lg font-bold text-petrol">Détail du compte</h3>
              <button onClick={() => setSelected(null)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <X size={15} />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100">
                {selected.image ? (
                  <img src={selected.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-400">
                    {(selected.prenom || '?')[0]}
                  </div>
                )}
              </div>
              <div>
                <p className="font-bold text-petrol text-lg">{selected.prenom} {selected.nom}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  selected.type === 'prestataire' ? 'bg-gold/20 text-amber-700' : 'bg-fuchsia/10 text-fuchsia'
                }`}>
                  {selected.type === 'prestataire' ? 'Prestataire' : 'Cliente'}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-5">
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-400">Email</span><span className="font-medium">{selected.email}</span>
              </div>
              {selected.telephone && (
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-400">Téléphone</span><span className="font-medium">{selected.telephone}</span>
                </div>
              )}
              {selected.categorie && (
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-400">Catégorie</span><span className="font-medium capitalize">{selected.categorie}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-400">Statut</span>
                <span className={`font-semibold ${selected.suspended ? 'text-red-500' : 'text-green-600'}`}>
                  {selected.suspended ? 'Suspendu' : 'Actif'}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {selected.type === 'prestataire' && (
                <button
                  onClick={() => {
                    localStorage.setItem('fh_session', JSON.stringify(selected))
                    localStorage.setItem('fh_admin_impersonate', 'true')
                    router.push('/profile/provider')
                  }}
                  className="w-full py-2.5 rounded-full text-sm font-semibold bg-fuchsia text-white hover:bg-fuchsia/90 transition-all"
                >
                  Gérer le profil
                </button>
              )}
              <button
                onClick={() => openEdit(selected)}
                className="w-full py-2.5 rounded-full text-sm font-semibold bg-petrol text-white hover:bg-petrol/90 transition-all"
              >
                Modifier le compte
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => { toggleStatus(selected.id); setSelected(prev => ({ ...prev, suspended: !prev.suspended })) }}
                  className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    selected.suspended
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                  }`}
                >
                  {selected.suspended ? 'Réactiver' : 'Suspendre'}
                </button>
                <button
                  onClick={() => deleteUser(selected.id)}
                  className="flex-1 py-2.5 rounded-full text-sm font-semibold bg-red-50 text-red-500 hover:bg-red-100 transition-all"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal éditer prestataire */}
      {showEdit && editForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowEdit(false)}>
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl z-10">
              <h3 className="font-display text-lg font-bold text-petrol">Modifier le compte</h3>
              <button onClick={() => setShowEdit(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <X size={15} />
              </button>
            </div>

            <form onSubmit={updateUser} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Prénom</label>
                  <input required type="text" value={editForm.prenom}
                    onChange={e => setEditForm(f => ({ ...f, prenom: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-petrol/30 focus:border-petrol" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Nom</label>
                  <input required type="text" value={editForm.nom}
                    onChange={e => setEditForm(f => ({ ...f, nom: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-petrol/30 focus:border-petrol" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                <input required type="email" value={editForm.email}
                  onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-petrol/30 focus:border-petrol" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Nouveau mot de passe <span className="text-gray-400 font-normal">(laisser vide pour ne pas changer)</span>
                </label>
                <div className="relative">
                  <input type={editPwdVisible ? 'text' : 'password'} value={editForm.password}
                    onChange={e => setEditForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-petrol/30 focus:border-petrol" />
                  <button type="button" onClick={() => setEditPwdVisible(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-petrol">
                    {editPwdVisible ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Téléphone</label>
                  <input type="tel" value={editForm.telephone}
                    onChange={e => setEditForm(f => ({ ...f, telephone: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-petrol/30 focus:border-petrol" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">WhatsApp</label>
                  <input type="tel" value={editForm.whatsapp}
                    onChange={e => setEditForm(f => ({ ...f, whatsapp: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-petrol/30 focus:border-petrol" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Catégorie</label>
                <select required value={editForm.categorie}
                  onChange={e => setEditForm(f => ({ ...f, categorie: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-petrol/30 focus:border-petrol bg-white">
                  <option value="">Sélectionner une catégorie</option>
                  {CATEGORIES_PRESTA.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {editError && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-xl">{editError}</div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowEdit(false)}
                  className="flex-1 py-3 rounded-full text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all">
                  Annuler
                </button>
                <button type="submit"
                  className="flex-1 py-3 rounded-full text-sm font-semibold bg-petrol text-white hover:bg-petrol/90 transition-all">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
