import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FadeIn from '@/components/ui/FadeIn'

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-16">
        <div className="bg-petrol text-white py-14">
          <FadeIn direction="up" className="max-w-4xl mx-auto px-4">
            <p className="text-gold text-xs font-bold tracking-widest uppercase mb-2">Legal</p>
            <h1 className="font-display text-4xl font-bold">Mentions legales</h1>
          </FadeIn>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <FadeIn direction="up" delay={0.1} className="bg-white rounded-3xl shadow-sm p-8 md:p-12 space-y-8 text-gray-600 leading-relaxed text-sm">
            <section>
              <h2 className="font-display text-xl font-bold text-petrol mb-3">Editeur du site</h2>
              <p>Fempreneur Hub<br />Yaounde, Cameroun<br />Email : fempreneurHUB@gmail.com<br />Tel : +237 694 872 823</p>
            </section>
            <section>
              <h2 className="font-display text-xl font-bold text-petrol mb-3">Donnees personnelles</h2>
              <p>Les donnees personnelles collectees sur Fempreneur Hub (nom, email, numero de telephone) sont utilisees uniquement dans le cadre de la mise en relation entre clients et prestataires. Elles ne sont pas vendues ni cedees a des tiers.</p>
            </section>
            <section>
              <h2 className="font-display text-xl font-bold text-petrol mb-3">Cookies</h2>
              <p>Fempreneur Hub utilise le stockage local du navigateur pour maintenir votre session de connexion et sauvegarder vos preferences. Ces donnees restent sur votre appareil et peuvent etre effacees a tout moment via les parametres de votre navigateur.</p>
            </section>
            <section>
              <h2 className="font-display text-xl font-bold text-petrol mb-3">Droits des utilisateurs</h2>
              <p>Conformement aux lois applicables, vous disposez d'un droit d'acces, de rectification et de suppression de vos donnees personnelles. Pour exercer ces droits, contactez-nous a fempreneurHUB@gmail.com.</p>
            </section>
          </FadeIn>
        </div>
      </main>
      <Footer />
    </>
  )
}
