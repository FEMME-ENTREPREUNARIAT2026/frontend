const CATEGORY_COLORS = {
  coiffure: 'bg-fuchsia-light/20 text-fuchsia',
  restauration: 'bg-gold/20 text-gold-dark',
  decoration: 'bg-lavender/20 text-lavender-dark',
  makeup: 'bg-pink-100 text-pink-600',
  manucure: 'bg-purple-100 text-purple-600',
  cinematographie: 'bg-petrol/20 text-petrol',
  hotesses: 'bg-blue-100 text-blue-600',
  mc: 'bg-indigo-100 text-indigo-600',
  sonorisation: 'bg-orange-100 text-orange-600',
  billeterie: 'bg-green-100 text-green-600',
}

export default function Badge({ label, category }) {
  const colors = CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-600'
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${colors}`}>
      {label}
    </span>
  )
}
