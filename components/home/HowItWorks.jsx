import { HOW_IT_WORKS } from '@/data/mockData'

export default function HowItWorks() {
  const icons = ['', '', '']

  return (
    <section className="py-20 bg-petrol text-white relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-fuchsia/10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <p className="text-gold text-sm font-semibold tracking-widest uppercase mb-2">Simple et rapide</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">Comment ca marche ?</h2>
          <p className="text-white/70 mt-2 text-lg">3 etapes simples pour votre evenement parfait</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-white/20" />

          {HOW_IT_WORKS.map((item, i) => (
            <div key={item.step} className="text-center relative">
              {/* Step number */}
              <div className="w-20 h-20 rounded-full bg-fuchsia flex items-center justify-center mx-auto mb-6 text-white font-display text-2xl font-bold shadow-lg shadow-fuchsia/30">
                {item.step}
              </div>
              <h3 className="font-display text-xl font-semibold text-gold mb-3">{item.title}</h3>
              <p className="text-white/70 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
