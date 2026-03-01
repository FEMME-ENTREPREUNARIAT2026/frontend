'use client'
export default function FilterBar({ categories, activeCategory, onCategoryChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            activeCategory === cat.id
              ? 'bg-fuchsia text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-lavender-light hover:text-petrol'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
