'use client'
import Link from 'next/link'
import Logo from './Logo'
import { Instagram, Facebook, Linkedin, Mail, Phone } from 'lucide-react'

// Icone WhatsApp (SVG car non disponible dans lucide)
function WhatsAppIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="bg-petrol-dark text-white">
      {/* Trait de couleur en haut */}
      <div className="h-1 bg-gradient-to-r from-fuchsia via-gold to-lavender" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Marque */}
          <div className="lg:col-span-1">
            <Logo />
            <p className="mt-4 text-white/70 text-sm leading-relaxed">
              La premiere plateforme de mise en relation entre clients et prestataires evenementiels au Cameroun.
            </p>
            <div className="flex gap-3 mt-6">
              <a href="#" aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-fuchsia transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-fuchsia transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-fuchsia transition-colors">
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-gold">Navigation</h4>
            <ul className="space-y-3">
              {[
                { href: '/services', label: 'Toutes les prestations' },
                { href: '/providers', label: 'Prestataires' },
                { href: '/events', label: 'Evenements' },
                { href: '/auth/register', label: "S'inscrire comme prestataire" },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/70 text-sm hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informations legales */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-gold">Informations</h4>
            <ul className="space-y-3">
              {[
                { href: '/about', label: 'A propos de nous' },
                { href: '/terms', label: "Conditions d'utilisation" },
                { href: '/privacy', label: 'Mentions legales' },
                { href: '/help', label: "Centre d'aide" },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/70 text-sm hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-gold">Contact</h4>
            <ul className="space-y-4">
              {/* Email */}
              <li>
                <a
                  href="mailto:fempreneurHUB@gmail.com"
                  className="flex items-start gap-2 text-white/70 text-sm hover:text-gold transition-colors group"
                >
                  <Mail size={14} className="text-fuchsia flex-shrink-0 mt-0.5" />
                  <span>fempreneurHUB@gmail.com</span>
                </a>
              </li>
              {/* Telephone */}
              <li>
                <a
                  href="tel:+237694872823"
                  className="flex items-center gap-2 text-white/70 text-sm hover:text-gold transition-colors"
                  title="Appeler ou copier le numero"
                >
                  <Phone size={14} className="text-fuchsia flex-shrink-0" />
                  +237 694 872 823
                </a>
              </li>
              {/* WhatsApp */}
              <li>
                <a
                  href="https://wa.me/237694872823?text=Bonjour%20Fempreneur%20Hub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/70 text-sm hover:text-gold transition-colors"
                >
                  <span className="text-fuchsia flex-shrink-0"><WhatsAppIcon size={14} /></span>
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bas de page */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            &copy; {new Date().getFullYear()} Fempreneur Hub. Tous droits reserves.
          </p>
          <p className="text-white/50 text-sm">
            Fait avec passion au Cameroun 🇨🇲
          </p>
        </div>
      </div>
    </footer>
  )
}
