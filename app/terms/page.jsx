import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FadeIn from '@/components/ui/FadeIn'

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-16">
        <div className="bg-petrol text-white py-14">
          <FadeIn direction="up" className="max-w-4xl mx-auto px-4">
            <p className="text-gold text-xs font-bold tracking-widest uppercase mb-2">Legal</p>
            <h1 className="font-display text-4xl font-bold">Conditions d'utilisation</h1>
          </FadeIn>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <FadeIn direction="up" delay={0.1} className="bg-white rounded-3xl shadow-sm p-8 md:p-12 space-y-8 text-gray-600 leading-relaxed text-sm">
            <section>
              <h2 className="font-display text-xl font-bold text-petrol mb-3">1. Acceptation des conditions</h2>
              <p>En utilisant Fempreneur Hub, vous acceptez les presentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser la plateforme.</p>
            </section>
            <section>
              <h2 className="font-display text-xl font-bold text-petrol mb-3">2. Description du service</h2>
              <p>Fempreneur Hub est une plateforme de mise en relation entre clients et prestataires de services evenementiels au Cameroun. Nous ne sommes pas partie aux contrats conclus entre clients et prestataires.</p>
            </section>
            <section>
              <h2 className="font-display text-xl font-bold text-petrol mb-3">3. Comptes utilisateurs</h2>
              <p>Vous etes responsable de la confidentialite de vos identifiants de connexion et de toutes les activites effectuees sous votre compte. Vous vous engagez a fournir des informations exactes lors de votre inscription.</p>
            </section>
            <section>
              <h2 className="font-display text-xl font-bold text-petrol mb-3">4. Responsabilites des prestataires</h2>
              <p>Les prestataires s'engagent a fournir des informations exactes sur leurs services, a respecter les tarifs affiches et a honorer les engagements pris avec les clients.</p>
            </section>
            <section>
              <h2 className="font-display text-xl font-bold text-petrol mb-3">5. Propriete intellectuelle</h2>
              <p>Les contenus publies sur Fempreneur Hub (textes, images, logos) sont proteges par les droits de propriete intellectuelle. Toute reproduction non autorisee est interdite.</p>
            </section>
            <section>
              <h2 className="font-display text-xl font-bold text-petrol mb-3">6. Contact</h2>
              <p>Pour toute question relative aux conditions d'utilisation : <a href="mailto:fempreneurHUB@gmail.com" className="text-fuchsia hover:underline">fempreneurHUB@gmail.com</a></p>
            </section>
            <p className="text-xs text-gray-400">Derniere mise a jour : {new Date().getFullYear()}</p>
          </FadeIn>
        </div>
      </main>
      <Footer />
    </>
  )
}
