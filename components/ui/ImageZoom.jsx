'use client'
import { useState, useRef, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'

// -----------------------------------------------------------
// ImageZoom : zoom style Amazon
//
// Utilisation :
//   <ImageZoom images={['/images/img3.jpg', ...]} />
//
// - Survol : loupe qui agrandit la zone sous le curseur
// - Clic   : ouvre une modale plein ecran
// - Modale : navigation, zoom avant/arriere
// -----------------------------------------------------------

export default function ImageZoom({ images = [] }) {
  const [mainIdx, setMainIdx] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalIdx, setModalIdx] = useState(0)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 })
  const [showLens, setShowLens] = useState(false)
  const imgRef = useRef(null)

  // Taille de la loupe (carre, en px)
  const LENS_SIZE = 120
  // Taille du panneau de zoom agrandi (a droite)
  const ZOOM_SIZE = 400
  // Facteur de grossissement de la loupe
  const ZOOM_FACTOR = 3

  // Calcule la position de la loupe quand la souris bouge sur l'image
  const handleMouseMove = useCallback((e) => {
    const rect = imgRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    // Limite la loupe aux bords de l'image
    const lx = Math.max(LENS_SIZE / 2, Math.min(x, rect.width - LENS_SIZE / 2))
    const ly = Math.max(LENS_SIZE / 2, Math.min(y, rect.height - LENS_SIZE / 2))
    setLensPos({ x: lx, y: ly, w: rect.width, h: rect.height })
  }, [])

  const openModal = (idx) => {
    setModalIdx(idx)
    setZoomLevel(1)
    setModalOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setModalOpen(false)
    setZoomLevel(1)
    document.body.style.overflow = ''
  }

  const prevModal = () => setModalIdx(i => (i - 1 + images.length) % images.length)
  const nextModal = () => setModalIdx(i => (i + 1) % images.length)
  const zoomIn  = () => setZoomLevel(z => Math.min(z + 0.5, 3))
  const zoomOut = () => setZoomLevel(z => Math.max(z - 0.5, 1))

  if (images.length === 0) return null

  // Calcule le background-position du panneau de zoom
  const bgX = lensPos.w
    ? -((lensPos.x - LENS_SIZE / 2) / lensPos.w) * (lensPos.w * ZOOM_FACTOR - ZOOM_SIZE)
    : 0
  const bgY = lensPos.h
    ? -((lensPos.y - LENS_SIZE / 2) / lensPos.h) * (lensPos.h * ZOOM_FACTOR - ZOOM_SIZE)
    : 0

  return (
    <div className="flex flex-col gap-3">
      {/* Image principale avec loupe */}
      <div className="flex gap-4 items-start">
        {/* Zone image + loupe */}
        <div className="relative flex-1 rounded-2xl overflow-hidden bg-gray-50 cursor-crosshair select-none"
          style={{ paddingBottom: '80%' }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setShowLens(true)}
          onMouseLeave={() => setShowLens(false)}
          onClick={() => openModal(mainIdx)}
        >
          <img
            ref={imgRef}
            src={images[mainIdx]}
            alt="Prestation"
            className="absolute inset-0 w-full h-full object-cover"
            onError={e => { e.target.src = '/images/img1.jpg' }}
            draggable={false}
          />

          {/* Carre de loupe superpose */}
          {showLens && lensPos.w && (
            <div
              className="absolute pointer-events-none border-2 border-fuchsia/60 bg-white/10 rounded"
              style={{
                width: LENS_SIZE,
                height: LENS_SIZE,
                left: lensPos.x - LENS_SIZE / 2,
                top: lensPos.y - LENS_SIZE / 2,
              }}
            />
          )}

          {/* Indicateur "Cliquer pour agrandir" */}
          {showLens && (
            <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 pointer-events-none">
              <ZoomIn size={12} />
              Cliquer pour agrandir
            </div>
          )}
        </div>

        {/* Panneau de zoom agrandi — s'affiche a droite sur desktop */}
        {showLens && lensPos.w && (
          <div
            className="hidden lg:block flex-shrink-0 rounded-2xl overflow-hidden border-2 border-fuchsia/20 shadow-xl pointer-events-none"
            style={{
              width: ZOOM_SIZE,
              height: ZOOM_SIZE,
              backgroundImage: `url(${images[mainIdx]})`,
              backgroundSize: `${lensPos.w * ZOOM_FACTOR}px ${lensPos.h * ZOOM_FACTOR}px`,
              backgroundPosition: `${bgX}px ${bgY}px`,
              backgroundRepeat: 'no-repeat',
            }}
          />
        )}
      </div>

      {/* Miniatures */}
      <div className="flex gap-2 flex-wrap">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => { setMainIdx(i); openModal(i) }}
            className={`w-16 h-14 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-200 ${
              i === mainIdx
                ? 'ring-2 ring-fuchsia shadow-md'
                : 'ring-1 ring-gray-200 hover:ring-fuchsia/50 opacity-70 hover:opacity-100'
            }`}
          >
            <img src={img} alt="" className="w-full h-full object-cover" onError={e => { e.target.src = '/images/img1.jpg' }} />
          </button>
        ))}
      </div>

      {/* Modale plein ecran */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4"
          onClick={closeModal}
        >
          {/* Bouton fermer */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-50"
          >
            <X size={20} />
          </button>

          {/* Compteur */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {modalIdx + 1} / {images.length}
          </div>

          {/* Image zoomable */}
          <div
            className="relative max-w-4xl max-h-[80vh] overflow-hidden rounded-2xl"
            onClick={e => e.stopPropagation()}
            style={{ cursor: zoomLevel > 1 ? 'move' : 'default' }}
          >
            <img
              src={images[modalIdx]}
              alt=""
              className="block max-h-[80vh] w-auto transition-transform duration-300"
              style={{ transform: `scale(${zoomLevel})` }}
              onError={e => { e.target.src = '/images/img1.jpg' }}
            />
          </div>

          {/* Controles de la modale */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3" onClick={e => e.stopPropagation()}>
            {/* Navigation */}
            {images.length > 1 && (
              <button onClick={prevModal} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-fuchsia transition-all">
                <ChevronLeft size={20} />
              </button>
            )}

            {/* Zoom avant/arriere */}
            <button onClick={zoomOut} disabled={zoomLevel <= 1}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 disabled:opacity-30 transition-all">
              <ZoomOut size={18} />
            </button>
            <span className="text-white text-sm font-medium w-12 text-center">
              x{zoomLevel.toFixed(1)}
            </span>
            <button onClick={zoomIn} disabled={zoomLevel >= 3}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 disabled:opacity-30 transition-all">
              <ZoomIn size={18} />
            </button>

            {images.length > 1 && (
              <button onClick={nextModal} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-fuchsia transition-all">
                <ChevronRight size={20} />
              </button>
            )}
          </div>

          {/* Miniatures dans la modale */}
          {images.length > 1 && (
            <div
              className="absolute top-4 left-4 flex flex-col gap-2 max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => { setModalIdx(i); setZoomLevel(1) }}
                  className={`w-12 h-10 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                    i === modalIdx ? 'ring-2 ring-fuchsia' : 'opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
