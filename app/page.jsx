import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSlider from '@/components/home/HeroSlider'
import EventsCarousel from '@/components/home/EventsCarousel'
import ServicesSection from '@/components/home/ServicesSection'
import ProvidersSection from '@/components/home/ProvidersSection'
import HowItWorks from '@/components/home/HowItWorks'
import Testimonials from '@/components/home/Testimonials'

export default function HomePage() {
  return (
    <>
      <Navbar transparent />
      <main>
        <HeroSlider />

        {/* Separateur visible entre le hero video et la section evenements */}
        <div className="relative bg-gradient-to-b from-petrol-dark to-petrol py-10 overflow-hidden">
          <div className="absolute inset-0 pattern-bg opacity-10" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <p className="text-gold text-xs font-bold tracking-widest uppercase mb-1">Fempreneur Hub</p>
                <h3 className="font-display text-2xl font-bold text-white">
                  Evenements, Prestations et Prestataires
                </h3>
                <p className="text-white/60 text-sm mt-1">Tout pour votre evenement parfait au Cameroun</p>
              </div>
              <div className="flex gap-8">
                {[
                  { value: '500+', label: 'Prestataires' },
                  { value: '2 000+', label: 'Evenements' },
                  { value: '10 000+', label: 'Clientes satisfaites' },
                ].map(stat => (
                  <div key={stat.label} className="text-center">
                    <div className="text-xl font-bold font-display text-gold">{stat.value}</div>
                    <div className="text-white/50 text-xs">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <EventsCarousel />
        <ServicesSection />
        <ProvidersSection />
        <HowItWorks />
        <Testimonials />

        {/* CTA Banner */}
        <section className="py-20 bg-gradient-to-br from-fuchsia to-fuchsia-dark text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Prete a rejoindre la communaute ?
            </h2>
            <p className="text-white/80 text-xl mb-10">
              Que vous soyez cliente ou prestataire, Fempreneur Hub est fait pour vous.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/auth/register?type=client"
                className="bg-white text-fuchsia font-bold px-8 py-4 rounded-full hover:bg-gold hover:text-white transition-all shadow-lg">
                M'inscrire comme Cliente
              </a>
              <a href="/auth/register?type=provider"
                className="border-2 border-white text-white font-bold px-8 py-4 rounded-full hover:bg-white hover:text-fuchsia transition-all">
                Devenir Prestataire
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
