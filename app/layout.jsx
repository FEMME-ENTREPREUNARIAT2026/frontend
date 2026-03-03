import './globals.css'
import PageTransition from '@/components/layout/PageTransition'

export const metadata = {
  title: 'Fempreneur Hub - Plateforme Evenementielle Cameroun',
  description: 'Trouvez les meilleurs prestataires evenementiels au Cameroun',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Nunito:wght@300;400;500;600;700&family=Great+Vibes&display=swap" rel="stylesheet" />
      </head>
      <body>
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  )
}
