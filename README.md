# FEMPRENEUR HUB - Frontend

Plateforme evenementielle camerounaise pour femmes entrepreneures.

## INSTALLATION (etapes simples)

### Etape 1 : Verifiez que Node.js est installe
Ouvrez votre terminal et tapez:
```
node --version
```
Si vous voyez un numero comme v18.x.x ou v20.x.x, parfait !
Sinon, telechargez Node.js sur https://nodejs.org et installez-le.

### Etape 2 : Ouvrez le projet
Extrayez le ZIP. Dans votre terminal, naviguez dans le dossier:
```
cd fempreneur-hub
```

### Etape 3 : Installez les dependances
```
npm install
```
Attendez quelques minutes (installation automatique).

### Etape 4 : Lancez le projet
```
npm run dev
```

### Etape 5 : Ouvrez dans votre navigateur
Allez sur: http://localhost:3000

---

## STRUCTURE DES FICHIERS

```
fempreneur-hub/
├── app/                     → Pages de l'application
│   ├── page.jsx             → Page d'accueil
│   ├── services/            → Page liste des services
│   │   └── [id]/            → Page detail d'un service
│   ├── providers/           → Page liste des prestataires
│   │   └── [id]/            → Boutique d'un prestataire
│   ├── events/              → Page liste des evenements
│   │   └── [id]/            → Page detail d'un evenement
│   ├── auth/
│   │   ├── login/           → Page connexion
│   │   └── register/        → Page inscription
│   └── profile/
│       ├── client/          → Profil cliente
│       └── provider/        → Profil prestataire
├── components/              → Composants reutilisables
│   ├── layout/              → Navbar, Footer, Logo
│   ├── home/                → Sections de la page d'accueil
│   ├── ui/                  → Cartes, badges, filtres...
│   └── services/events/...  → Composants specifiques
├── data/
│   └── mockData.js          → Donnees de test (a remplacer par l'API)
└── public/images/           → Vos images et videos (img1 a img8, vid1 a vid4)
```

## AJOUTER VOS IMAGES

Placez vos fichiers dans le dossier `public/images/` :
- img1.jpg → Image bosslady 1
- img2.jpg → Image bosslady 2
- img3.jpg → Image coiffure
- img4.jpg → Image evenement
- img5.jpg → Image decoration
- img6.jpg → Image restauration
- img7.jpg → Image shooting photo
- img8.jpg → Image pedicure/manucure
- vid1.mp4 → Video MC
- vid2.mp4 → Video hotesses
- vid3.mp4 → Video cinematographie
- vid4.mp4 → Video DJ/sonorisation

## GIT - POUSSER SUR VOTRE REPOSITORY

```bash
# 1. Initialisez Git dans le dossier (si pas encore fait)
git init

# 2. Ajoutez le remote de votre organisation GitHub
git remote add origin https://github.com/VOTRE-ORGANISATION/fempreneur-hub.git

# 3. Ajoutez tous les fichiers
git add .

# 4. Faites votre premier commit
git commit -m "feat: initialisation du frontend Fempreneur Hub"

# 5. Poussez sur la branche dev
git push -u origin dev
```

Si la branche dev n'existe pas encore:
```bash
git checkout -b dev
git push -u origin dev
```

## CONNECTER AU BACKEND

Toutes les donnees mock sont dans `data/mockData.js`.
Pour connecter au backend, remplacez les imports de mockData par des appels API.

Exemple de remplacement dans un composant:
```javascript
// AVANT (mock):
import { SERVICES } from '@/data/mockData'

// APRES (API):
const [services, setServices] = useState([])
useEffect(() => {
  fetch('/api/services').then(r => r.json()).then(setServices)
}, [])
```

## COULEURS DU DESIGN SYSTEM

- Fuchsia (principal): #E91E63
- Or: #FFC107
- Bleu petrol: #00695C
- Lavande: #B39DDB
