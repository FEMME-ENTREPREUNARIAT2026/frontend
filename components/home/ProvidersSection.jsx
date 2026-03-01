import Link from 'next/link'
import { PROVIDERS } from '@/data/mockData'
import ProviderCard from '../ui/ProviderCard'

export default function ProvidersSection() {
  const top6 = PROVIDERS.sort((a, b) => b.rating - a.rating).slice(0, 6)

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-fuchsia text-sm font-semibold tracking-widest uppercase mb-2">Top prestataires</p>
            <h2 className="section-title">Les Mieux Notees</h2>
            <p className="section-subtitle">Les professionnelles les plus appreciees de la plateforme</p>
          </div>
          <Link href="/providers" className="hidden md:block btn-outline">Voir tout</Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {top6.map(provider => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link href="/providers" className="btn-outline">Voir tous les prestataires</Link>
        </div>
      </div>
    </section>
  )
}
