import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSlider from '@/components/home/HeroSlider'
import EventsCarousel from '@/components/home/EventsCarousel'
import ServicesSection from '@/components/home/ServicesSection'
import ProvidersSection from '@/components/home/ProvidersSection'
import HowItWorks from '@/components/home/HowItWorks'
import Testimonials from '@/components/home/Testimonials'
import FadeIn from '@/components/ui/FadeIn'
import { StaggerContainer, StaggerItem } from '@/components/ui/StaggerChildren'

export default function HomePage() {
  return (
    <>
      <Navbar transparent />
      <main>
        <HeroSlider />

        {/* Stats ribbon */}
        <div className="relative bg-gradient-to-r from-petrol-dark via-petrol to-petrol-dark py-10 overflow-hidden">
          <div className="absolute inset-0 pattern-bg opacity-15 pointer-events-none" />
          <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-64 h-10 bg-fuchsia/20 blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
              <FadeIn direction="left" duration={0.7}>
                <div className="text-center sm:text-left">
                  <span className="font-script text-gold text-2xl opacity-85">Fempreneur Hub</span>
                  <h3 className="font-display text-2xl font-semibold text-white mt-1 leading-tight">
                    Événements, Prestations & Prestataires
                  </h3>
                  <p className="text-white/50 text-sm mt-1">Tout pour votre événement parfait au Cameroun</p>
                </div>
              </FadeIn>

              <StaggerContainer className="flex gap-10">
                {[
                  { value: '500+', label: 'Prestataires' },
                  { value: '2 000+', label: 'Événements' },
                  { value: '10 000+', label: 'Clientes satisfaites' },
                ].map(stat => (
                  <StaggerItem key={stat.label}>
                    <div className="text-center">
                      <div className="text-2xl font-display font-bold gradient-text-gold">{stat.value}</div>
                      <div className="text-white/45 text-xs mt-0.5 font-medium">{stat.label}</div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </div>

        <EventsCarousel />
        <ServicesSection />
        <ProvidersSection />
        <HowItWorks />
        <Testimonials />

        {/* CTA Banner */}
        <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #AD1457 0%, #E91E63 50%, #7E57C2 100%)' }}>
          <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-black/10 blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 text-center relative">
            <FadeIn direction="up" duration={0.7}>
              <span className="font-script text-gold text-4xl block mb-2 opacity-90">Rejoignez-nous</span>
            </FadeIn>
            <FadeIn direction="up" delay={0.1} duration={0.7}>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-5 leading-tight">
                Prête à rejoindre<br className="hidden md:block" /> la communauté ?
              </h2>
            </FadeIn>
            <FadeIn direction="up" delay={0.2} duration={0.7}>
              <p className="text-white/75 text-lg md:text-xl mb-12 font-light max-w-2xl mx-auto leading-relaxed">
                Que vous soyez cliente ou prestataire, Fempreneur Hub est fait pour vous.
              </p>
            </FadeIn>
            <FadeIn direction="up" delay={0.3} duration={0.7}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/auth/register?type=client"
                  className="bg-white text-fuchsia-dark font-bold px-10 py-4 rounded-full hover:bg-gold hover:text-white transition-all duration-300 shadow-xl hover:shadow-gold/40 hover:-translate-y-0.5"
                >
                  M'inscrire comme Cliente
                </a>
                <a
                  href="/auth/register?type=provider"
                  className="border-2 border-white/60 text-white font-semibold px-10 py-4 rounded-full hover:bg-white/10 hover:border-white transition-all duration-300 backdrop-blur-sm"
                >
                  Devenir Prestataire
                </a>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
