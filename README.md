# 🎯 Rallye des 50 d'Alma

**Encyclopédie géolocalisée pour découvrir les œuvres et le patrimoine d'Alma**

## 🎯 Concept

Une application mobile-first qui gamifie la découverte du patrimoine d'Alma. Les utilisateurs explorent la ville pour trouver 50 œuvres, débloquent leur histoire, répondent à des quiz et collectionnent des badges.

Inspiré de Pokémon GO et Geocaching, mais avec une vocation **éducative et patrimoniale**.

## ✨ Fonctionnalités (POC v0.1)

### Implémentées
- ✅ Carte interactive (Leaflet + OpenStreetMap)
- ✅ 50 œuvres documentées avec coordonnées GPS
- ✅ Géolocalisation (détection à 100m)
- ✅ Système de points
- ✅ 12 badges à débloquer
- ✅ Quiz par œuvre (50 questions)
- ✅ Encyclopédie avec catégories
- ✅ Recherche d'œuvres
- ✅ Stockage local (offline)
- ✅ PWA installable
- ✅ AR stub (à développer V2)

### À venir (V1.0)
- 📷 Appareil photo + partage social
- 🎮 Mode AR avec 8th Wall
- 🏆 Classement école vs école
- 👨‍🏫 Dashboard enseignant
- 📊 Analytics de progression

## 📂 Structure

```
rallye-alma/
├── index.html              # Page principale (PWA)
├── manifest.json           # Web App Manifest
├── README.md               # Ce fichier
├── assets/
│   ├── svg/                # Logo + icônes
│   └── img/                # Photos (à venir)
├── src/
│   ├── css/style.css       # Feuille de style
│   └── js/
│       ├── data.js         # 50 œuvres + catégories
│       ├── storage.js      # LocalStorage (progression)
│       ├── gamification.js # Système de badges
│       ├── encyclopedia.js # Affichage encyclopédique
│       ├── quiz.js         # Système de quiz
│       ├── map.js          # Carte Leaflet
│       └── app.js          # Contrôleur principal
└── docs/                   # Documentation
```

## 🛠️ Stack technique

- **Frontend** : HTML5 + CSS3 + Vanilla JS
- **Carte** : [Leaflet 1.9.4](https://leafletjs.com/) + OpenStreetMap (gratuit, souverain)
- **Stockage** : LocalStorage (offline)
- **PWA** : Web App Manifest (installable)
- **Backend (V1)** : Node.js + Express + PostgreSQL

## 🚀 Déploiement

### Local
```bash
# Ouvrir directement dans un navigateur
open index.html

# OU avec un serveur local (recommandé pour PWA)
python3 -m http.server 8000
# Puis ouvrir http://localhost:8000
```

### Production
- Hébergement statique : Netlify, Vercel, ou serveur QC (OVH, PlanetHoster)
- HTTPS obligatoire (pour géolocalisation)

## 📊 Données

### Les 50 œuvres
- **8 Œuvres** : Patrimoine bâti (églises, couvents, hôtels de ville)
- **7 Œuvres** : Art public (sculptures, fontaines, monuments)
- **10 Œuvres** : Nature (parcs, lac, sentiers)
- **10 Œuvres** : Industrie (usine, barrage, centrale)
- **5 Œuvres** : Savoir (bibliothèque, musées, écoles)
- **10 Œuvres** : Divers

### Sources des données
- Google Places API (POC)
- Société d'histoire d'Alma (à contacter)
- MRC Lac-Saint-Jean-Est (à valider)

## 🎮 Système de points

| Action | Points |
|---|---|
| Découvrir une œuvre | +100 |
| Réussir un quiz | +50 |
| Prendre une photo | +25 |
| Partager sur réseaux | +25 |
| Débloquer un badge | +200 |
| Trouver toutes les 50 | +1000 (bonus) |

## 🎖️ 12 Badges

- 🥉 Premier pas (1 œuvre)
- 🥈 Explorateur (10)
- 🥇 Conquérant (25)
- 💎 Maître d'Alma (50)
- 📸 Photo-graphe (5 photos)
- 🎬 Cinéaste (3 partages)
- 🧠 Érudit (20 quiz)
- ⚡ Rapide (10 en 1h)
- 🏛️ Gardien du patrimoine (tous)
- 🌳 Ami de la nature (tous)
- 🏆 Complétiste (50 + quiz)
- 🎓 Curieux (tous les quiz 1er coup)

## 🏫 Pour les écoles

**Mode APPRENTI** : 10 œuvres obligatoires, 2h
**Mode EXPLORATEUR** : 25 œuvres, 4h
**Mode MAÎTRE** : 50 œuvres, 2 jours

Idéal pour :
- Cours d'histoire locale
- Activités parascolaires
- Projets pédagogiques
- Visites culturelles

## 💰 Financement

### Coût MVP estimé : 11 000$
- Dev (2 semaines)
- Design UI/UX
- API Google Places
- Photos
- Hébergement

### Sources potentielles
- **MEI** : 10 000$ (subvention)
- **Ville d'Alma** : 1 000$
- **MRC Lac-Saint-Jean-Est** : 1 000$
- **Rio Tinto** : 2 000$ (commandite)
- **Crowdfunding** : 5 000$

## 📅 Roadmap

| Phase | Date | Livrables |
|---|---|---|
| **POC v0.1** | ✅ Maintenant | 50 œuvres + carte + quiz |
| **v1.0** | +2 mois | Photos + AR + partage |
| **v2.0** | +6 mois | École + classement + analytics |
| **v3.0** | +12 mois | 5 villes + backend + premium |

## 🇨🇦 Souveraineté

- **Données au QC** : serveur à Beauharnois
- **Pas de Google Analytics** : Plausible self-host
- **Pas de Cloudflare** : DNS souverain
- **Pas de CDN US** : Leaflet + tuiles OSM alternatives

## 📞 Contact

- **Auteur** : Demon (Striker-Comtaria)
- **Repo** : https://github.com/DeamonDev888/rallye-alma
- **Démo** : (à déployer)

## 📜 Licence

MIT — À valider avec la Ville d'Alma avant déploiement commercial.

---

**Fait avec ❤️ au Saguenay–Lac-Saint-Jean**