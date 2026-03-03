import { HOW_IT_WORKS } from '@/data/mockData'
import FadeIn from '@/components/ui/FadeIn'
import { StaggerContainer, StaggerItem } from '@/components/ui/StaggerChildren'

export default function HowItWorks() {
  return (
    <section className="py-24 bg-petrol relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/4 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-fuchsia/10 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Header */}
        <FadeIn direction="up" className="text-center mb-20">
          <span className="inline-block font-script text-gold text-3xl mb-2 opacity-90">Simple &amp; rapide</span>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-white">
            Comment ça marche ?
          </h2>
          <p className="text-white/60 mt-3 text-lg">3 étapes simples pour votre événement parfait</p>
        </FadeIn>

        {/* Steps — stagger on scroll */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-12 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px">
            <div className="h-full bg-gradient-to-r from-fuchsia/40 via-gold/40 to-fuchsia/40" />
          </div>

          {HOW_IT_WORKS.map((item, i) => {
            const gradients = [
              'from-fuchsia to-fuchsia-dark',
              'from-gold to-gold-dark',
              'from-lavender to-lavender-dark',
            ]
            return (
              <StaggerItem key={item.step}>
                <div className="text-center group">
                  {/* Step circle */}
                  <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${gradients[i]} flex items-center justify-center mx-auto mb-7 shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                    <span className="font-display text-3xl font-bold text-white">{item.step}</span>
                  </div>
                  {/* Card */}
                  <div className="bg-white/8 backdrop-blur-sm rounded-2xl p-6 border border-white/10 transition-all duration-300 group-hover:bg-white/14 group-hover:border-white/22 group-hover:-translate-y-1">
                    <h3 className="font-display text-xl font-semibold text-gold mb-3">{item.title}</h3>
                    <p className="text-white/65 leading-relaxed text-sm">{item.description}</p>
                  </div>
                </div>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </div>
    </section>
  )
}
