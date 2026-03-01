// ============================================================
// FEMPRENEUR HUB — Utilitaire central des medias
// Toutes les images et videos sont dans /images/
// ============================================================

export const IMAGES = [
  '/images/img1.jpg',
  '/images/img2.jpg',
  '/images/img3.jpg',
  '/images/img4.jpg',
  '/images/img5.jpg',
  '/images/img6.jpg',
  '/images/img7.jpg',
  '/images/img8.jpg',
]

export const VIDEOS = [
  '/images/vid1.mp4',
  '/images/vid2.mp4',
  '/images/vid3.mp4',
  '/images/vid4.mp4',
]

// Retourne l'image d'affichage d'un service
// Lit le champ src OU image selon ce qui est disponible
export function getServiceImage(service) {
  if (!service) return IMAGES[0]
  // Si c'est une video, on prend une image de couverture a la place
  if (service.mediaType === 'video') {
    // Image de couverture = image dont l'index est base sur l'id
    return IMAGES[Math.abs(service.id || 0) % IMAGES.length]
  }
  if (service.src) return service.src
  if (service.image) return service.image
  return IMAGES[Math.abs(service.id || 0) % IMAGES.length]
}

// Retourne la source video d'un service (null si pas de video)
export function getServiceVideo(service) {
  if (!service) return null
  if (service.mediaType === 'video' && service.src) return service.src
  if (service.video) return service.video
  return null
}

// Retourne une image par index (pour les pages prestataires, evenements, etc.)
export function getImageByIndex(index) {
  return IMAGES[Math.abs(index) % IMAGES.length]
}

// Enrichit les services en assignant les bons medias
// - Garde le mediaType d'origine si c'est deja 'video'
// - Pour les images : varie entre les 8 images selon l'id du service
// - Ajoute des videos toutes les 10 prestations si pas deja une video
export function enrichServices(services) {
  return services.map((s, i) => {
    // Si le service a deja une video, on la garde
    if (s.mediaType === 'video' && s.src) {
      return {
        ...s,
        image: IMAGES[Math.abs(s.id) % IMAGES.length], // image de couverture
      }
    }
    // Sinon, une video toutes les 10 cartes (positions 9, 19, 29...)
    const isVideoSlot = (i + 1) % 10 === 0
    if (isVideoSlot) {
      const videoSrc = VIDEOS[Math.floor(i / 10) % VIDEOS.length]
      return {
        ...s,
        mediaType: 'video',
        src: videoSrc,
        image: IMAGES[i % IMAGES.length], // image de couverture pour la miniature
      }
    }
    // Image variee selon l'id pour eviter les repetitions
    const img = IMAGES[Math.abs(s.id + i) % IMAGES.length]
    return {
      ...s,
      mediaType: 'image',
      src: img,
      image: img,
    }
  })
}
