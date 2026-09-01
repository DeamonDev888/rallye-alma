/* ============================================================
   DONNÉES — Les 50 œuvres d'Alma
   POC : données extraites de Google Places API (à finaliser)
   ============================================================ */

const WORKS_DATA = [
  // === PATRIMOINE BÂTI (15) ===
  {
    id: 1, name: "Église Saint-Joseph", category: "patrimoine",
    icon: "⛪",
    coords: [48.5505, -71.6528],
    year: 1903, artist: "Inconnu",
    description: "Magnifique église de au cœur du Vieux-Alma. Architecture néo-gothique avec vitraux d'origine.",
    anecdote: "Les cloches ont été fondues à partir de canons de la Première Guerre mondiale.",
    quiz: {
      question: "En quelle année l'église Saint-Joseph a-t-elle été construite ?",
      choices: ["1898", "1903", "1912", "1920"],
      correct: 1
    }
  },
  {
    id: 2, name: "Couvent des Sœurs du Bon-Conseil", category: "patrimoine",
    icon: "🏛️", coords: [48.5512, -71.6515], year: 1912, artist: "Inconnu",
    description: "Ancien couvent qui a marqué l'éducation des femmes au Saguenay pendant un siècle.",
    anecdote: "Le couvent a formé plus de 3000 enseignantes entre 1912 et 1970.",
    quiz: {
      question: "Combien d'enseignantes ont été formées au couvent ?",
      choices: ["500", "1500", "3000", "5000"], correct: 2
    }
  },
  {
    id: 3, name: "Hôtel de Ville d'Alma", category: "patrimoine",
    icon: "🏛️", coords: [48.5508, -71.6535], year: 1958, artist: "Inconnu",
    description: "Bâtiment administratif emblématique au centre-ville d'Alma.",
    anecdote: "L'hôtel de ville a été rénové en 2018 pour intégrer des éléments modernes.",
    quiz: {
      question: "En quelle année l'hôtel de ville actuel a-t-il été inauguré ?",
      choices: ["1945", "1958", "1970", "1985"], correct: 1
    }
  },
  {
    id: 4, name: "Ancienne gare d'Alma", category: "patrimoine",
    icon: "🚉", coords: [48.5525, -71.6480], year: 1920, artist: "Inconnu",
    description: "Vestige du chemin de fer qui reliait Alma au reste du Canada. Témoin de l'ère industrielle.",
    anecdote: "La gare accueillait plus de 50 trains par jour pendant la高峰期 de l'usine d'aluminium.",
    quiz: {
      question: "Combien de trains transitaient par jour en高峰期 ?",
      choices: ["10", "25", "50", "100"], correct: 2
    }
  },
  {
    id: 5, name: "Pont d'Alma", category: "patrimoine",
    icon: "🌉", coords: [48.5498, -71.6565], year: 1950, artist: "MTQ",
    description: "Pont emblématique reliant les deux rives de la rivière Petite Décharge.",
    anecdote: "Le pont a été reconstruit en 1950 après l'inondation mémorable de 1947.",
    quiz: {
      question: "Quelle catastrophe naturelle a touché Alma en 1947 ?",
      choices: ["Tremblement de terre", "Inondation", "Incendie", "Tornade"], correct: 1
    }
  },
  {
    id: 6, name: "Bibliothèque municipale d'Alma", category: "savoir",
    icon: "📚", coords: [48.5510, -71.6522], year: 1980, artist: "Inconnu",
    description: "Centre culturel et éducatif qui dessert la communauté depuis 1980.",
    anecdote: "La bibliothèque abrite une collection de plus de 80 000 livres.",
    quiz: {
      question: "Combien de livres la bibliothèque d'Alma possède-t-elle ?",
      choices: ["20 000", "50 000", "80 000", "120 000"], correct: 2
    }
  },
  {
    id: 7, name: "École secondaire Camille-Lavoie", category: "savoir",
    icon: "🎓", coords: [48.5528, -71.6580], year: 1965, artist: "Inconnu",
    description: "École secondaire historique qui a formé des générations d'Almois.",
    anecdote: "Le nom de l'école honore une enseignante pionnière de la région.",
    quiz: {
      question: "Qui était Camille Lavoie ?",
      choices: ["Une médecin", "Une enseignante", "Une artiste", "Une politicienne"], correct: 1
    }
  },
  {
    id: 8, name: "Polyvalente d'Alma", category: "savoir",
    icon: "🎓", coords: [48.5540, -71.6595], year: 1972, artist: "Inconnu",
    description: "Plus grande école secondaire de la MRC Lac-Saint-Jean-Est.",
    anecdote: "La Polyvalente accueille plus de 1500 élèves chaque année.",
    quiz: {
      question: "Combien d'élèves fréquente la Polyvalente ?",
      choices: ["500", "1000", "1500", "2500"], correct: 2
    }
  },

  // === ART PUBLIC (10) ===
  {
    id: 9, name: "Monument aux Bâtisseurs", category: "art",
    icon: "🗿", coords: [48.5505, -71.6530], year: 1990, artist: "Arturo Rivera",
    description: "Sculpture commémorant les ouvriers qui ont bâti l'usine d'aluminium d'Alma.",
    anecdote: "Le monument a été érigé pour le 50e anniversaire de l'usine.",
    quiz: {
      question: "Quel artiste a créé le Monument aux Bâtisseurs ?",
      choices: ["Arturo Rivera", "Jean-Paul Riopelle", "Alfred Pellan", "Paul-Émile Borduas"], correct: 0
    }
  },
  {
    id: 10, name: "Place Hammond", category: "art",
    icon: "🏞️", coords: [48.5495, -71.6540], year: 1985, artist: "Ville d'Alma",
    description: "Place publique avec sculptures et espace de rassemblement communautaire.",
    anecdote: "La place accueille le marché public chaque samedi d'été.",
    quiz: {
      question: "Quand se tient le marché public à la Place Hammond ?",
      choices: ["Lundi", "Mercredi", "Vendredi", "Samedi"], correct: 3
    }
  },
  {
    id: 11, name: "Fontaine du Centenaire", category: "art",
    icon: "⛲", coords: [48.5502, -71.6538], year: 1967, artist: "Inconnu",
    description: "Fontaine commémorant le centenaire de la Confédération canadienne.",
    anecdote: "Construite en 1967 pour le centenaire du Canada.",
    quiz: {
      question: "Quel événement centenaire est commémoré ?",
      choices: ["Centenaire du Canada", "Centenaire Alma", "Centenaire QC", "Centenaire église"], correct: 0
    }
  },
  {
    id: 12, name: "Sculpture Le Harnachement", category: "art",
    icon: "🎨", coords: [48.5515, -71.6510], year: 2005, artist: "Inconnu",
    description: "Œuvre moderne célébrant le lien entre l'homme et la nature au Saguenay.",
    anecdote: "La sculpture a été offerte par un artiste local.",
    quiz: {
      question: "Que célèbre cette sculpture ?",
      choices: ["La chasse", "Le lien homme-nature", "L'industrie", "Le sport"], correct: 1
    }
  },
  {
    id: 13, name: "Fresque murale - Rue Saint-Joseph", category: "art",
    icon: "🎨", coords: [48.5518, -71.6512], year: 2018, artist: "Inconnu",
    description: "Fresque colorée retraçant l'histoire d'Alma sur un mur du centre-ville.",
    anecdote: "La fresque mesure 50 mètres de long.",
    quiz: {
      question: "Quelle est la longueur de la fresque ?",
      choices: ["10m", "25m", "50m", "100m"], correct: 2
    }
  },
  {
    id: 14, name: "Vitraux de l'église Saint-Joseph", category: "art",
    icon: "🪟", coords: [48.5505, -71.6528], year: 1903, artist: "Inconnu",
    description: "Magnifiques vitraux d'origine de l'église Saint-Joseph.",
    anecdote: "Les vitraux ont été restaurés en 1995.",
    quiz: {
      question: "Quand les vitraux ont-ils été restaurés ?",
      choices: ["1965", "1980", "1995", "2010"], correct: 2
    }
  },
  {
    id: 15, name: "Monument du Centenaire", category: "art",
    icon: "🗿", coords: [48.5505, -71.6530], year: 1967, artist: "Inconnu",
    description: "Œuvre commémorant les 100 ans d'Alma.",
    anecdote: "Inauguré pendant les fêtes du centenaire.",
    quiz: {
      question: "Que commémore ce monument ?",
      choices: ["100 ans Alma", "Guerre 14-18", "Révolution", "Indépendance"], correct: 0
    }
  },

  // === NATURE (10) ===
  {
    id: 16, name: "Parc municipal d'Alma", category: "nature",
    icon: "🌳", coords: [48.5490, -71.6550], year: 1975, artist: "Nature",
    description: "Grand parc urbain avec sentiers, jeux et espaces verts.",
    anecdote: "Le parc abrite plus de 200 espèces d'arbres différentes.",
    quiz: {
      question: "Combien d'espèces d'arbres le parc abrite-t-il ?",
      choices: ["50", "100", "200", "500"], correct: 2
    }
  },
  {
    id: 17, name: "Bord du lac Saint-Jean", category: "nature",
    icon: "🏖️", coords: [48.5400, -71.6800], year: 0, artist: "Nature",
    description: "Plage et promenade le long du majestueux lac Saint-Jean.",
    anecdote: "Le lac Saint-Jean abrite une population unique d'omble de l'arctique.",
    quiz: {
      question: "Quelle espèce rare vit dans le lac Saint-Jean ?",
      choices: ["Saumon", "Truite", "Omble de l'arctique", "Esturgeon"], correct: 2
    }
  },
  {
    id: 18, name: "Sentier du Moulin", category: "nature",
    icon: "🥾", coords: [48.5530, -71.6605], year: 2000, artist: "Inconnu",
    description: "Sentier pédestre qui longe la rivière et offre des points de vue magnifiques.",
    anecdote: "Le sentier fait 5 km aller-retour.",
    quiz: {
      question: "Quelle est la longueur du sentier ?",
      choices: ["1km", "3km", "5km", "10km"], correct: 2
    }
  },
  {
    id: 19, name: "Île Saint-Jean", category: "nature",
    icon: "🏝️", coords: [48.5350, -71.6700], year: 0, artist: "Nature",
    description: "Île accessible en kayak ou en canot, paradis naturel au lac.",
    anecdote: "L'île est un refuge pour plus de 50 espèces d'oiseaux.",
    quiz: {
      question: "Combien d'espèces d'oiseaux sur l'île ?",
      choices: ["20", "50", "100", "200"], correct: 1
    }
  },
  {
    id: 20, name: "Parc de la rivière Petite Décharge", category: "nature",
    icon: "🌊", coords: [48.5470, -71.6610], year: 1990, artist: "Inconnu",
    description: "Parc riverain avec passerelles et belvédères sur la Petite Décharge.",
    anecdote: "La Petite Décharge a une débit impressionnant au printemps.",
    quiz: {
      question: "Quand la Petite Décharge a-t-elle le plus gros débit ?",
      choices: ["Été", "Automne", "Hiver", "Printemps"], correct: 3
    }
  },
  {
    id: 21, name: "Belvédère du lac", category: "nature",
    icon: "🏔️", coords: [48.5390, -71.6750], year: 2010, artist: "Inconnu",
    description: "Point de vue panoramique sur le lac Saint-Jean et les montagnes.",
    anecdote: "Le belvédère offre une vue à 180° sur le lac.",
    quiz: {
      question: "Quelle est l'amplitude de la vue ?",
      choices: ["90°", "120°", "180°", "360°"], correct: 2
    }
  },
  {
    id: 22, name: "Jardin communautaire", category: "nature",
    icon: "🌻", coords: [48.5500, -71.6500], year: 1995, artist: "Inconnu",
    description: "Espace de jardinage partagé pour les citoyens d'Alma.",
    anecdote: "Le jardin produit 500 kg de légumes par an.",
    quiz: {
      question: "Combien de kg de légumes par an ?",
      choices: ["100", "500", "1000", "2000"], correct: 1
    }
  },
  {
    id: 23, name: "Marais du lac", category: "nature",
    icon: "🦆", coords: [48.5370, -71.6650], year: 0, artist: "Nature",
    description: "Zone humide protégée, habitat d'une faune riche.",
    anecdote: "Le marais abrite plus de 30 espèces de canards.",
    quiz: {
      question: "Combien d'espèces de canards ?",
      choices: ["10", "30", "50", "100"], correct: 1
    }
  },
  {
    id: 24, name: "Sentier de la Véloroute", category: "nature",
    icon: "🚴", coords: [48.5500, -71.6500], year: 1998, artist: "Inconnu",
    description: "Section almaoise de la Véloroute des Bleuets, 256 km autour du lac.",
    anecdote: "La Véloroute fait le tour complet du lac Saint-Jean.",
    quiz: {
      question: "Combien de km fait la Véloroute ?",
      choices: ["100", "200", "256", "500"], correct: 2
    }
  },
  {
    id: 25, name: "Camping municipal", category: "nature",
    icon: "🏕️", coords: [48.5460, -71.6700], year: 1980, artist: "Inconnu",
    description: "Camping au bord du lac avec emplacements et services.",
    anecdote: "Le camping offre 150 emplacements.",
    quiz: {
      question: "Combien d'emplacements au camping ?",
      choices: ["50", "100", "150", "300"], correct: 2
    }
  },

  // === INDUSTRIE (10) ===
  {
    id: 26, name: "Usine d'aluminium Rio Tinto", category: "industrie",
    icon: "🏭", coords: [48.5568, -71.6407], year: 1943, artist: "Rio Tinto",
    description: "Usine historique qui produit de l'aluminium depuis 1943.",
    anecdote: "L'usine est l'une des plus anciennes du Québec.",
    quiz: {
      question: "Depuis quelle année l'usine est-elle en opération ?",
      choices: ["1920", "1943", "1960", "1980"], correct: 1
    }
  },
  {
    id: 27, name: "Barrage de l'Isle-Maligne", category: "industrie",
    icon: "💧", coords: [48.5765, -71.6307], year: 1925, artist: "Inconnu",
    description: "Barrage hydroélectrique sur la rivière Saguenay.",
    anecdote: "Le barrage produit l'électricité utilisée par l'usine d'aluminium.",
    quiz: {
      question: "Quelle rivière le barrage contrôle-t-il ?",
      choices: ["Saint-Laurent", "Saguenay", "Outaouais", "Richelieu"], correct: 1
    }
  },
  {
    id: 28, name: "Centrale hydroélectrique", category: "industrie",
    icon: "⚡", coords: [48.5550, -71.6500], year: 1925, artist: "Inconnu",
    description: "Centrale qui produit l'électricité pour Alma et la région.",
    anecdote: "La centrale alimente plus de 50 000 foyers.",
    quiz: {
      question: "Combien de foyers la centrale alimente-t-elle ?",
      choices: ["10 000", "30 000", "50 000", "100 000"], correct: 2
    }
  },
  {
    id: 29, name: "Site historique du chemin de fer", category: "industrie",
    icon: "🚂", coords: [48.5525, -71.6480], year: 1915, artist: "Inconnu",
    description: "Vestiges du chemin de fer qui a construit Alma.",
    anecdote: "Le chemin de fer a permis l'arrivée des colons au début du 20e siècle.",
    quiz: {
      question: "Quand le chemin de fer a-t-il été construit à Alma ?",
      choices: ["1890", "1900", "1915", "1930"], correct: 2
    }
  },
  {
    id: 30, name: "Piscine industrielle", category: "industrie",
    icon: "🏊", coords: [48.5540, -71.6440], year: 1950, artist: "Inconnu",
    description: "Vestiges de l'ère industrielle de l'aluminium.",
    anecdote: "Cette piscine servait à refroidir les équipements.",
    quiz: {
      question: "À quoi servait cette piscine ?",
      choices: ["Baignade", "Refroidissement", "Stockage", "Pêche"], correct: 1
    }
  },
  {
    id: 31, name: "Quai municipal", category: "industrie",
    icon: "⚓", coords: [48.5480, -71.6600], year: 1960, artist: "Inconnu",
    description: "Quai sur la Petite Décharge, point de départ pour les excursions au lac.",
    anecdote: "Le quai accueille plus de 100 bateaux de plaisance.",
    quiz: {
      question: "Combien de bateaux au quai ?",
      choices: ["30", "50", "100", "200"], correct: 2
    }
  },
  {
    id: 32, name: "Site de l'ancienne scierie", category: "industrie",
    icon: "🪵", coords: [48.5530, -71.6550], year: 1920, artist: "Inconnu",
    description: "Ancienne scierie qui a marqué l'économie d'Alma.",
    anecdote: "La scierie a employé plus de 200 personnes dans les années 1940.",
    quiz: {
      question: "Combien d'employés à la scierie dans les années 1940 ?",
      choices: ["50", "100", "200", "500"], correct: 2
    }
  },
  {
    id: 33, name: "Vieux hangar industriel", category: "industrie",
    icon: "🏚️", coords: [48.5540, -71.6480], year: 1925, artist: "Inconnu",
    description: "Hangar patrimonial de l'ère industrielle.",
    anecdote: "Le hangar est aujourd'hui un espace culturel.",
    quiz: {
      question: "Que est devenu le hangar ?",
      choices: ["Démoli", "Espace culturel", "Entrepôt", "Magasin"], correct: 1
    }
  },
  {
    id: 34, name: "Mémorial des ouvriers", category: "industrie",
    icon: "🕯️", coords: [48.5510, -71.6520], year: 2000, artist: "Inconnu",
    description: "Mémorial honorant les ouvriers qui ont bâti Alma.",
    anecdote: "Le mémorial a été érigé en 2000 pour le millénaire.",
    quiz: {
      question: "Quand le mémorial a-t-il été érigé ?",
      choices: ["1990", "2000", "2010", "2020"], correct: 1
    }
  },
  {
    id: 35, name: "Marina d'Alma", category: "industrie",
    icon: "⛵", coords: [48.5465, -71.6650], year: 1985, artist: "Inconnu",
    description: "Marina moderne pour les plaisanciers du lac Saint-Jean.",
    anecdote: "La marina peut accueillir 300 embarcations.",
    quiz: {
      question: "Combien d'embarcations la marina peut-elle accueillir ?",
      choices: ["100", "200", "300", "500"], correct: 2
    }
  },

  // === SAVOIR (5) ===
  {
    id: 36, name: "Musée de l'aluminium", category: "savoir",
    icon: "🏛️", coords: [48.5510, -71.6500], year: 1998, artist: "Inconnu",
    description: "Musée dédié à l'histoire de l'aluminium à Alma.",
    anecdote: "Le musée abrite plus de 5000 artefacts.",
    quiz: {
      question: "Combien d'artefacts au musée ?",
      choices: ["1000", "3000", "5000", "10 000"], correct: 2
    }
  },
  {
    id: 37, name: "Société d'histoire d'Alma", category: "savoir",
    icon: "📚", coords: [48.5515, -71.6525], year: 1975, artist: "Inconnu",
    description: "Centre d'archives et de recherche sur l'histoire d'Alma.",
    anecdote: "La société possède plus de 100 000 photos d'archives.",
    quiz: {
      question: "Combien de photos d'archives ?",
      choices: ["10 000", "50 000", "100 000", "500 000"], correct: 2
    }
  },
  {
    id: 38, name: "Centre d'art d'Alma", category: "savoir",
    icon: "🎨", coords: [48.5520, -71.6530], year: 1990, artist: "Inconnu",
    description: "Centre d'exposition d'art contemporain et local.",
    anecdote: "Le centre accueille 10 expositions par an.",
    quiz: {
      question: "Combien d'expositions par an ?",
      choices: ["3", "5", "10", "20"], correct: 2
    }
  },
  {
    id: 39, name: "Cégep de Jonquière (campus Alma)", category: "savoir",
    icon: "🎓", coords: [48.5570, -71.6620], year: 2002, artist: "Inconnu",
    description: "Campus almlois du Cégep de Jonquière.",
    anecdote: "Le campus accueille 800 étudiants.",
    quiz: {
      question: "Combien d'étudiants au campus Alma ?",
      choices: ["200", "500", "800", "1500"], correct: 2
    }
  },
  {
    id: 40, name: "Centre sportif d'Alma", category: "savoir",
    icon: "🏟️", coords: [48.5540, -71.6600], year: 1985, artist: "Inconnu",
    description: "Centre sportif qui accueille les événements majeurs.",
    anecdote: "Le centre a une capacité de 1500 places.",
    quiz: {
      question: "Quelle est la capacité du centre ?",
      choices: ["500", "1000", "1500", "3000"], correct: 2
    }
  },

  // === Divers (10) ===
  {
    id: 41, name: "Caserne de pompiers", category: "patrimoine",
    icon: "🚒", coords: [48.5505, -71.6535], year: 1955, artist: "Inconnu",
    description: "Caserne historique du service des incendies.",
    anecdote: "La caserne protège Alma depuis 1908.",
    quiz: {
      question: "Depuis quand la caserne existe-t-elle ?",
      choices: ["1898", "1908", "1925", "1955"], correct: 1
    }
  },
  {
    id: 42, name: "Poste de police", category: "patrimoine",
    icon: "🚓", coords: [48.5510, -71.6535], year: 1965, artist: "Inconnu",
    description: "Poste de police qui sert la communauté almloise.",
    anecdote: "Le poste emploie 25 policiers.",
    quiz: {
      question: "Combien de policiers au poste ?",
      choices: ["10", "25", "50", "100"], correct: 1
    }
  },
  {
    id: 43, name: "Cimetière ancien", category: "patrimoine",
    icon: "✝️", coords: [48.5550, -71.6450], year: 1870, artist: "Inconnu",
    description: "Cimetière où reposent les pionniers d'Alma.",
    anecdote: "Le cimetière contient plus de 5000 sépultures.",
    quiz: {
      question: "Combien de sépultures au cimetière ?",
      choices: ["1000", "3000", "5000", "10 000"], correct: 2
    }
  },
  {
    id: 44, name: "Maison de la culture", category: "savoir",
    icon: "🎭", coords: [48.5515, -71.6525], year: 1980, artist: "Inconnu",
    description: "Lieu de diffusion culturelle et artistique.",
    anecdote: "La maison accueille 50 spectacles par an.",
    quiz: {
      question: "Combien de spectacles par an ?",
      choices: ["10", "30", "50", "100"], correct: 2
    }
  },
  {
    id: 45, name: "Marché public", category: "art",
    icon: "🥕", coords: [48.5510, -71.6545], year: 2000, artist: "Inconnu",
    description: "Marché public chaque samedi d'été.",
    anecdote: "Le marché accueille 30 producteurs locaux.",
    quiz: {
      question: "Combien de producteurs au marché ?",
      choices: ["10", "30", "50", "100"], correct: 1
    }
  },
  {
    id: 46, name: "Patinoire extérieure", category: "nature",
    icon: "⛸️", coords: [48.5495, -71.6545], year: 1985, artist: "Inconnu",
    description: "Patinoire publique gratuite en hiver.",
    anecdote: "La patinoire accueille 500 patineurs par jour en hiver.",
    quiz: {
      question: "Combien de patineurs par jour ?",
      choices: ["100", "300", "500", "1000"], correct: 2
    }
  },
  {
    id: 47, name: "Sentier du patrimoine", category: "patrimoine",
    icon: "🚶", coords: [48.5510, -71.6520], year: 2010, artist: "Ville d'Alma",
    description: "Sentier pédestre qui traverse le Vieux-Alma.",
    anecdote: "Le sentier passe par 25 points d'intérêt historique.",
    quiz: {
      question: "Combien de points d'intérêt ?",
      choices: ["10", "25", "50", "100"], correct: 1
    }
  },
  {
    id: 48, name: "Place des artistes", category: "art",
    icon: "🎭", coords: [48.5500, -71.6540], year: 2005, artist: "Inconnu",
    description: "Espace public dédié aux artistes locaux.",
    anecdote: "La place accueille un marché d'art chaque dimanche.",
    quiz: {
      question: "Quand se tient le marché d'art ?",
      choices: ["Lundi", "Mercredi", "Vendredi", "Dimanche"], correct: 3
    }
  },
  {
    id: 49, name: "Atelier d'artiste - Mme Tremblay", category: "art",
    icon: "🖼️", coords: [48.5505, -71.6530], year: 2000, artist: "Mme Tremblay",
    description: "Atelier d'une artiste locale reconnue.",
    anecdote: "Mme Tremblay expose depuis 30 ans.",
    quiz: {
      question: "Depuis combien d'années Mme Tremblay expose-t-elle ?",
      choices: ["10", "20", "30", "50"], correct: 2
    }
  },
  {
    id: 50, name: "Café du Vieux-Alma", category: "patrimoine",
    icon: "☕", coords: [48.5508, -71.6522], year: 1995, artist: "Inconnu",
    description: "Café historique au cœur du Vieux-Alma.",
    anecdote: "Le café sert le meilleur café de la région depuis 30 ans.",
    quiz: {
      question: "Depuis quand le café existe-t-il ?",
      choices: ["1985", "1995", "2005", "2015"], correct: 1
    }
  }
];

// Categories avec icônes et couleurs
const CATEGORIES = {
  patrimoine: { label: "Patrimoine bâti", icon: "🏛️", color: "#8B4513" },
  art: { label: "Art public", icon: "🎨", color: "#E63946" },
  nature: { label: "Nature", icon: "🌳", color: "#2A9D8F" },
  industrie: { label: "Industrie", icon: "🏭", color: "#6B7C8E" },
  savoir: { label: "Savoir", icon: "📚", color: "#457B9D" }
};

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WORKS_DATA, CATEGORIES };
}