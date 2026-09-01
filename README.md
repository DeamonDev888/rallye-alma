# 🎯 Rallye des 50 d'Alma

**Encyclopédie géolocalisée pour découvrir les œuvres et le patrimoine d'Alma**

🚀 **App live** : https://deamondev888.github.io/rallye-alma/

---

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
- ✅ Déployé sur GitHub Pages

### À venir (V1.0)
- 📷 Appareil photo + partage social
- 🎮 Mode AR avec 8th Wall
- 🏆 Classement école vs école
- 👨‍🏫 Dashboard enseignant
- 📊 Analytics de progression

## 🚀 Démo en ligne

**URL** : https://deamondev888.github.io/rallye-alma/

Pour tester :
1. Ouvre le lien dans Chrome (mobile ou desktop)
2. Accepte la géolocalisation
3. Explore les 50 œuvres sur la carte
4. Réponds aux quiz
5. Débloque les 12 badges

## 📂 Structure

```
rallye-alma/
├── index.html              # Page principale (PWA)
├── manifest.json           # Web App Manifest
├── README.md               # Ce fichier
├── .github/
│   └── workflows/
│       └── deploy.yml      # Auto-deploy GitHub Pages
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
└── docs/                    # Documentation
```

## 🛠️ Stack technique

- **Frontend** : HTML5 + CSS3 + Vanilla JS (zéro framework)
- **Carte** : [Leaflet 1.9.4](https://leafletjs.com/) + OpenStreetMap (gratuit, souverain)
- **Stockage** : LocalStorage (offline)
- **PWA** : Web App Manifest (installable)
- **CI/CD** : GitHub Actions → GitHub Pages
- **Hébergement** : GitHub Pages (gratuit, HTTPS)

## 🚀 Déploiement

### Automatique (GitHub Pages)
- Chaque `git push` sur `main` déclenche un redéploiement
- URL : https://deamondev888.github.io/rallye-alma/

### Local
```bash
# Cloner
git clone https://github.com/DeamonDev888/rallye-alma.git
cd rallye-alma

# Lancer
python3 -m http.server 8000
# Ouvrir http://localhost:8000
```

## 📊 Données

### Les 50 œuvres
- **15** : Patrimoine bâti (églises, couvents, hôtels de ville, gares, ponts)
- **10** : Art public (sculptures, fontaines, monuments, fresques, vitraux)
- **10** : Nature (parcs, lac, sentiers, belvédères)
- **10** : Industrie (usine, barrage, centrale, quai, scierie)
- **5** : Savoir (bibliothèque, musées, écoles, centres)

### Sources des données
- Google Places API (POC)
- Société d'histoire d'Alma (à contacter)
- MRC Lac-Saint-Jean-Est (à valider)
- Ville d'Alma (à valider)

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
- 📚 Cours d'histoire locale
- 🎨 Activités parascolaires
- 🔍 Projets pédagogiques
- 👨‍👩‍👧 Visites culturelles familiales

## 💰 Financement

### Coût MVP estimé : 11 000$
- Dev (2 semaines) : 8 000$
- Design UI/UX : 1 500$
- API Google Places : 200$
- Photos (1 photographe × 3 jours) : 600$
- Hébergement : 100$
- Imprévu : 600$

### Sources potentielles
- **MEI** : 10 000$ (subvention tech QC)
- **Ville d'Alma** : 1 000$
- **MRC Lac-Saint-Jean-Est** : 1 000$
- **Rio Tinto** : 2 000$ (commandite)
- **Desjardins** : 1 000$
- **Crowdfunding Ulule** : 5 000$

## 📅 Roadmap

| Phase | Date | Livrables |
|---|---|---|
| **POC v0.1** | ✅ Août 2026 | 50 œuvres + carte + quiz + GitHub Pages |
| **v1.0** | +2 mois | Photos réelles + AR + partage social |
| **v2.0** | +6 mois | Dashboard enseignant + classement |
| **v3.0** | +12 mois | 5 villes + backend + premium |

## 🇨🇦 Souveraineté

- **Données au QC** : hébergement GitHub Pages (US) puis migration vers serveur QC
- **Pas de Google Analytics** : Plausible self-host
- **Pas de Cloudflare** : DNS souverain
- **Pas de CDN US** : Leaflet + tuiles OSM alternatives
- **Loi 25 ready** : aucune donnée personnelle collectée pour l'instant

## 📞 Contact

- **Auteur** : Demon (Striker-Comtaria)
- **Repo** : https://github.com/DeamonDev888/rallye-alma
- **App live** : https://deamondev888.github.io/rallye-alma/

## 📜 Licence

MIT — À valider avec la Ville d'Alma avant déploiement commercial.

---

**Fait avec ❤️ au Saguenay–Lac-Saint-Jean**

🚀 **[Ouvre l'app](https://deamondev888.github.io/rallye-alma/)**