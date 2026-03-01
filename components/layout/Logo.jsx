'use client'
import Link from 'next/link'
import Image from 'next/image'

export default function Logo({ dark = false }) {
  return (
    <Link href="/" className="flex items-center gap-3 no-underline">
      {/* Cercle avec le nouveau logo image */}
      <div className={`w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ${dark ? 'ring-gray-200' : 'ring-white/30'}`}>
        <img
          src="/images/logo.png"
          alt="Fempreneur Hub logo"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col">
        <span
          className={`font-display text-xl italic font-bold leading-none ${dark ? 'text-petrol' : 'text-white'}`}
        >
          fempreneur
        </span>
        <span className={`text-xs tracking-widest uppercase ${dark ? 'text-gray-500' : 'text-white/70'}`}>
          hub
        </span>
      </div>
    </Link>
  )
}
