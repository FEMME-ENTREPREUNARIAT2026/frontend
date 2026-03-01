'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react'
import Logo from './Logo'
import { getCurrentUser, logout, initStore } from '@/data/store'

const NAV_LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/services', label: 'Services' },
  { href: '/providers', label: 'Prestataires' },
  { href: '/events', label: 'Evenements' },
]

export default function Navbar({ transparent = false }) {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // Initialise le store et recupere l'utilisateur courant
  useEffect(() => {
    initStore()
    setUser(getCurrentUser())

    // Ecoute les changements d'auth (connexion/deconnexion)
    const handler = (e) => setUser(e.detail)
    window.addEventListener('fh_auth_change', handler)
    return () => window.removeEventListener('fh_auth_change', handler)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Ferme le dropdown si on clique ailleurs
  useEffect(() => {
    const close = () => setDropdownOpen(false)
    if (dropdownOpen) window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [dropdownOpen])

  function handleLogout() {
    logout()
    setUser(null)
    setDropdownOpen(false)
    router.push('/')
  }

  const isTransparent = transparent && !scrolled && !mobileOpen
  const profileHref = user?.type === 'prestataire' ? '/profile/provider' : '/profile/client'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isTransparent ? 'bg-transparent' : 'bg-white shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Logo dark={!isTransparent} />

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href}
                className={`font-medium text-sm transition-colors hover:text-fuchsia ${
                  isTransparent ? 'text-white' : 'text-gray-700'
                }`}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Zone */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              /* Utilisateur connecte : bouton avec son prenom */
              <div className="relative">
                <button
                  onClick={e => { e.stopPropagation(); setDropdownOpen(!dropdownOpen) }}
                  className={`flex items-center gap-2 font-medium text-sm px-4 py-2 rounded-full border transition-all ${
                    isTransparent
                      ? 'border-white text-white hover:bg-white/10'
                      : 'border-fuchsia text-fuchsia hover:bg-fuchsia hover:text-white'
                  }`}
                >
                  {/* Avatar miniature */}
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-fuchsia/20 flex-shrink-0">
                    {user.image ? (
                      <img src={user.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User size={14} className="m-auto mt-1" />
                    )}
                  </div>
                  {user.prenom}
                  <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-50">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {user.type === 'prestataire' ? 'Prestataire' : 'Client'}
                      </p>
                      <p className="font-medium text-petrol text-sm mt-0.5">
                        {user.prenom} {user.nom}
                      </p>
                    </div>
                    <Link
                      href={profileHref}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-fuchsia transition-colors"
                    >
                      <User size={15} />
                      Mon profil
                    </Link>
                    {user.type === 'prestataire' && (
                      <Link
                        href="/profile/client"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-fuchsia transition-colors"
                      >
                        <User size={15} />
                        Espace client
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={15} />
                      Se deconnecter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Non connecte */
              <>
                <Link
                  href="/auth/login"
                  className={`font-medium text-sm transition-colors ${
                    isTransparent ? 'text-white hover:text-gold' : 'text-gray-700 hover:text-fuchsia'
                  }`}
                >
                  Se connecter
                </Link>
                <Link href="/auth/register" className="btn-primary text-sm">
                  S'inscrire
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-lg ${isTransparent ? 'text-white' : 'text-gray-700'}`}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4">
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
              className="block py-3 text-gray-700 font-medium hover:text-fuchsia border-b border-gray-50">
              {link.label}
            </Link>
          ))}
          {user ? (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-500">Connecte(e) : <strong>{user.prenom}</strong></p>
              <Link
                href={profileHref}
                onClick={() => setMobileOpen(false)}
                className="block text-center btn-outline text-sm"
              >
                Mon profil
              </Link>
              <button onClick={handleLogout} className="w-full text-center py-2 text-sm text-red-500">
                Se deconnecter
              </button>
            </div>
          ) : (
            <div className="flex gap-3 mt-4">
              <Link href="/auth/login" className="flex-1 text-center btn-outline text-sm">
                Se connecter
              </Link>
              <Link href="/auth/register" className="flex-1 text-center btn-primary text-sm">
                S'inscrire
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
