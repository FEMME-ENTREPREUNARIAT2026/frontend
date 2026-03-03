import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import FadeIn from '@/components/ui/FadeIn'
import { StaggerContainer, StaggerItem } from '@/components/ui/StaggerChildren'

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-16">
        <div className="bg-petrol text-white py-14">
          <FadeIn direction="up" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-gold text-xs font-bold tracking-widest uppercase mb-2">Notre histoire</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold">A propos de nous</h1>
          </FadeIn>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-3xl shadow-sm p-8 md:p-12 space-y-8">
            <FadeIn direction="up" delay={0.05}>
              <section>
                <h2 className="font-display text-2xl font-bold text-petrol mb-4">Notre mission</h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Fempreneur Hub est la premiere plateforme camerounaise dediee a la mise en relation entre clients et prestataires evenementiels feminins. Notre mission : valoriser le talent des femmes entrepreneures et faciliter l'acces aux meilleurs services evenementiels du Cameroun.
                </p>
              </section>
            </FadeIn>
            <FadeIn direction="up" delay={0.1}>
              <section>
                <h2 className="font-display text-2xl font-bold text-petrol mb-4">Notre vision</h2>
                <p className="text-gray-600 leading-relaxed">
                  Nous croyons que chaque femme entrepreneuse merite d'etre vue, valorisee et soutenue. En creant un espace numerique inclusif et professionnel, Fempreneur Hub contribue a l'autonomisation economique des femmes camerounaises tout en offrant aux clients une experience de mise en relation simple, rapide et fiable.
                </p>
              </section>
            </FadeIn>
            <FadeIn direction="up" delay={0.15}>
              <section>
                <h2 className="font-display text-2xl font-bold text-petrol mb-4">Ce que nous proposons</h2>
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { emoji: '💇‍♀️', titre: '100+ Prestations', desc: 'Coiffure, makeup, decoration, restauration, sonorisation et bien plus.' },
                    { emoji: '👩‍💼', titre: '70+ Prestataires', desc: 'Des professionnelles triees sur le volet, notees par leurs clients.' },
                    { emoji: '🎉', titre: '30+ Evenements', desc: 'Mariages, anniversaires, baby showers, EVJF, seminaires au Cameroun.' },
                  ].map(item => (
                    <StaggerItem key={item.titre}>
                      <div className="bg-gray-50 rounded-2xl p-6 text-center h-full">
                        <div className="text-3xl mb-3">{item.emoji}</div>
                        <h3 className="font-display font-bold text-petrol mb-2">{item.titre}</h3>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </section>
            </FadeIn>
            <FadeIn direction="up" delay={0.2}>
              <section className="bg-fuchsia/5 rounded-2xl p-6 border border-fuchsia/10">
                <h2 className="font-display text-xl font-bold text-petrol mb-3">Nous contacter</h2>
                <p className="text-gray-600 text-sm mb-4">Pour toute question, partenariat ou assistance :</p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">📧 <a href="mailto:fempreneurHUB@gmail.com" className="text-fuchsia hover:underline">fempreneurHUB@gmail.com</a></p>
                  <p className="text-sm text-gray-700">📱 <a href="tel:+237694872823" className="text-fuchsia hover:underline">+237 694 872 823</a></p>
                </div>
              </section>
            </FadeIn>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
