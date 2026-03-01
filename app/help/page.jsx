import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const FAQS = [
  {
    q: "Comment trouver une prestataire ?",
    a: "Rendez-vous sur la page 'Services' ou 'Prestataires'. Vous pouvez filtrer par categorie, ville ou note. Cliquez sur une prestataire pour voir son profil complet et la contacter via WhatsApp."
  },
  {
    q: "Comment contacter une prestataire ?",
    a: "Sur la page de chaque prestataire, cliquez sur le bouton vert 'Reserver via WhatsApp'. Vous serez redirige directement vers une conversation WhatsApp avec la prestataire."
  },
  {
    q: "Comment m'inscrire en tant que prestataire ?",
    a: "Cliquez sur 'S'inscrire', selectionnez 'Prestataire', choisissez votre categorie et remplissez votre profil. Vous aurez besoin d'un numero WhatsApp actif pour que les clients puissent vous contacter."
  },
  {
    q: "Comment gerer mon profil ?",
    a: "Connectez-vous a votre compte, cliquez sur votre nom en haut a droite, puis 'Mon profil'. Vous pouvez modifier votre photo, description, et pour les prestataires, gerer votre portfolio."
  },
  {
    q: "Comment participer a un evenement ?",
    a: "Sur la page 'Evenements', trouvez un evenement qui vous interesse et cliquez dessus pour voir les details. Remplissez le formulaire de reservation present sur la page."
  },
  {
    q: "Je ne me souviens plus de mon mot de passe",
    a: "Contactez-nous directement par email a fempreneurHUB@gmail.com ou via WhatsApp au +237 694 872 823. Nous vous aiderons a reinitialiser votre acces."
  },
]

export default function HelpPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-16">
        <div className="bg-gradient-to-br from-lavender to-petrol text-white py-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-gold text-xs font-bold tracking-widest uppercase mb-2">Assistance</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold">Centre d'aide</h1>
            <p className="text-white/80 mt-3 text-lg">Trouvez rapidement une reponse a vos questions.</p>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-display font-bold text-petrol mb-2">{faq.q}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 bg-fuchsia/5 rounded-3xl p-8 border border-fuchsia/10 text-center">
            <h2 className="font-display text-xl font-bold text-petrol mb-2">Vous n'avez pas trouve la reponse ?</h2>
            <p className="text-gray-500 text-sm mb-4">Notre equipe repond dans les 24h.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="mailto:fempreneurHUB@gmail.com"
                className="btn-primary text-sm inline-flex items-center gap-2">
                📧 Envoyer un email
              </a>
              <a href="https://wa.me/237694872823?text=Bonjour,%20j'ai%20besoin%20d'aide"
                target="_blank" rel="noopener noreferrer"
                className="btn-outline text-sm inline-flex items-center gap-2">
                💬 Contacter via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
