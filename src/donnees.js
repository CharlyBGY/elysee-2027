// ═══════════════════════════════════════════════════════════════════
//  DONNÉES DE L'APPLICATION — c'est le seul fichier à modifier pour
//  mettre à jour les sondages, candidats, événements et échéances.
//  Après modification sur GitHub, le site se met à jour tout seul.
// ═══════════════════════════════════════════════════════════════════

// ─ Données figées au 2 juillet 2026 (sources : Ifop 25/06, Odoxa 26/05, LCP, France 24) ─
export const MISE_A_JOUR = "2 juillet 2026";

export const BLOCS = {
  EXG: { label: "Extrême gauche", color: "#8E1F2F" },
  GAU: { label: "Gauche", color: "#C7314A" },
  SOC: { label: "Gauche sociale-démocrate", color: "#E86B8A" },
  ECO: { label: "Écologistes", color: "#2E9E5B" },
  CEN: { label: "Bloc central", color: "#E8952F" },
  DRO: { label: "Droite", color: "#2F5FB3" },
  EXD: { label: "Extrême droite", color: "#1B3A63" },
  DIV: { label: "Divers", color: "#6B7280" },
};

// statut : "Déclaré(e)" | "Primaire" | "Congrès" | "Pressenti"
// sondage : pourcentage de la dernière vague, ou null si non testé
export const CANDIDATS = [
  { nom: "Jordan Bardella", parti: "Rassemblement national", bloc: "EXD", statut: "Pressenti", note: "Plan B du RN si Marine Le Pen reste inéligible. Domine tous les sondages (32 à 36 %).", sondage: 36 },
  { nom: "Marine Le Pen", parti: "Rassemblement national", bloc: "EXD", statut: "Déclarée", note: "Candidature suspendue à son appel après sa condamnation de mars 2025.", sondage: null },
  { nom: "Édouard Philippe", parti: "Horizons", bloc: "CEN", statut: "Déclaré", note: "Parti en campagne dès septembre 2024. En recul dans les dernières vagues.", sondage: 14 },
  { nom: "Jean-Luc Mélenchon", parti: "La France insoumise", bloc: "GAU", statut: "Déclaré", note: "4e candidature confirmée fin mai 2026. Forte dynamique, près de 200 000 soutiens en ligne.", sondage: 13 },
  { nom: "Raphaël Glucksmann", parti: "Place publique", bloc: "SOC", statut: "Déclaré", note: "Espace social-démocrate, en concurrence directe avec Mélenchon pour la 2e place à gauche.", sondage: 9 },
  { nom: "Gabriel Attal", parti: "Renaissance", bloc: "CEN", statut: "Déclaré", note: "Progresse mais reste derrière Édouard Philippe dans le bloc central.", sondage: 8 },
  { nom: "Bruno Retailleau", parti: "Les Républicains", bloc: "DRO", statut: "Déclaré", note: "Porte la candidature LR face à Xavier Bertrand.", sondage: 8 },
  { nom: "Éric Zemmour", parti: "Reconquête", bloc: "EXD", statut: "Déclaré", note: "Deuxième candidature, autour de 4 %.", sondage: 4 },
  { nom: "Fabien Roussel", parti: "PCF", bloc: "GAU", statut: "Congrès", note: "Candidature tranchée au congrès du PCF début juillet à Lille. Les militants ont voté à plus de 60 % pour une candidature communiste.", sondage: 3 },
  { nom: "Marine Tondelier", parti: "Les Écologistes", bloc: "ECO", statut: "Déclarée", note: "Déclarée le 22 octobre 2025, \"un acte d'amour pour la France\".", sondage: 2.5 },
  { nom: "Nicolas Dupont-Aignan", parti: "Debout la France", bloc: "EXD", statut: "Déclaré", note: "4e candidature, annoncée en mars 2025.", sondage: 2 },
  { nom: "Nathalie Arthaud", parti: "Lutte ouvrière", bloc: "EXG", statut: "Déclarée", note: "4e candidature pour porter la voix des travailleurs.", sondage: 0.5 },
  { nom: "François Ruffin", parti: "Debout !", bloc: "GAU", statut: "Déclaré", note: "Le \"pari du peuple\", campagne lancée en avril 2026.", sondage: null },
  { nom: "Karim Bouamrane", parti: "PS", bloc: "SOC", statut: "Déclaré", note: "Maire de Saint-Ouen, déclaré le 9 juin 2026 : \"pour une France humaine et une France forte\".", sondage: null },
  { nom: "Jérôme Guedj", parti: "PS", bloc: "SOC", statut: "Déclaré", note: "Déclaré le 5 février 2026, sans passer par la primaire, ligne \"gauche républicaine et laïque\".", sondage: null },
  { nom: "Philippe Brun", parti: "PS", bloc: "SOC", statut: "Primaire", note: "Déclaré le 30 juin 2026 sur RMC, dans le cadre d'une éventuelle primaire interne au PS. Candidat \"de la feuille de paie\" et du pouvoir d'achat.", sondage: null },
  { nom: "Benjamin Lucas-Lundy", parti: "Génération·s", bloc: "SOC", statut: "Primaire", note: "Candidat à la primaire de la gauche dite Front populaire 2027, défenseur de l'union de toute la gauche.", sondage: null },
  { nom: "Lydie Massard", parti: "Union démocratique bretonne", bloc: "ECO", statut: "Primaire", note: "Ex-eurodéputée, candidate à la primaire de la gauche depuis avril 2026.", sondage: null },
  { nom: "Bernard Cazeneuve", parti: "La Convention", bloc: "SOC", statut: "Pressenti", note: "\"Si c'est à moi de prendre cette responsabilité, je la prendrai.\" Pas de candidature à une primaire.", sondage: null },
  { nom: "Xavier Bertrand", parti: "Sans étiquette (ex LR)", bloc: "DRO", statut: "Déclaré", note: "Se présente cette fois hors du cadre LR.", sondage: null },
  { nom: "Clémentine Autain", parti: "L'Après", bloc: "GAU", statut: "Primaire", note: "Candidate à la primaire de la gauche dite Front populaire 2027.", sondage: null },
  { nom: "Delphine Batho", parti: "Génération écologie", bloc: "ECO", statut: "Déclarée", note: "\"Reconstruire une écologie capable de gouverner\".", sondage: null },
  { nom: "Dominique de Villepin", parti: "La France humaniste", bloc: "DIV", statut: "Pressenti", note: "Multiplie les déplacements, une centaine de personnes mobilisées sur les parrainages.", sondage: null },
  { nom: "François Hollande", parti: "PS", bloc: "SOC", statut: "Pressenti", note: "Hypothèse testée par les instituts (Ipsos juin 2026), pas de déclaration officielle.", sondage: null },
];

// Fil d'actualité, du plus récent au plus ancien.
// type : "Sondage" | "Déclaration" | "Parti" | "Agenda"
export const FIL = [
  { date: "30 juin 2026", type: "Parti", titre: "Le PS renvoie la primaire aux militants", texte: "À l'issue du conseil national, les militants socialistes voteront le 9 juillet entre la grande primaire de gauche (ligne Faure) et une désignation resserrée issue du pôle socialiste (ligne Vallaud).", bloc: "SOC" },
  { date: "30 juin 2026", type: "Déclaration", titre: "Philippe Brun se déclare", texte: "Le député PS de l'Eure annonce sur RMC sa candidature dans le cadre d'une éventuelle primaire interne, en candidat de la feuille de paie.", bloc: "SOC" },
  { date: "25 juin 2026", type: "Sondage", titre: "Ifop : Bardella à 36 %", texte: "Nouvelle vague Ifop-Fiducial : Bardella 36 %, Philippe 14 %, Mélenchon 13 %, Glucksmann 9 %, Attal et Retailleau 8 %.", bloc: "EXD" },
  { date: "24 juin 2026", type: "Sondage", titre: "Le duel souhaité : Philippe-Bardella", texte: "Selon Ifop pour Marianne, le second tour Philippe contre Bardella est l'affiche la plus souhaitée par les Français.", bloc: "CEN" },
  { date: "9 juin 2026", type: "Déclaration", titre: "Karim Bouamrane se lance", texte: "Le maire PS de Saint-Ouen annonce sa candidature : \"Je suis la candidature qui fédère.\"", bloc: "SOC" },
  { date: "Début juin 2026", type: "Parti", titre: "Le PCF vote pour une candidature", texte: "Plus de 60 % des militants se prononcent pour une candidature issue de leurs rangs. Décision au congrès de Lille début juillet.", bloc: "GAU" },
  { date: "26 mai 2026", type: "Sondage", titre: "Odoxa : Mélenchon bondit", texte: "Mélenchon gagne 4 points à 16 % et talonne Philippe (17 %). Au second tour, Bardella l'emporterait 52-48 face à Philippe.", bloc: "GAU" },
  { date: "Fin mai 2026", type: "Déclaration", titre: "Mélenchon confirme sa 4e candidature", texte: "Le leader de LFI sera sur la ligne de départ pour la quatrième fois consécutive.", bloc: "GAU" },
  { date: "Mai 2026", type: "Agenda", titre: "Dates du scrutin fixées", texte: "Le Conseil des ministres arrête les dates : 1er tour le 18 avril 2027, 2nd tour le 2 mai 2027.", bloc: "DIV" },
  { date: "25 avril 2026", type: "Déclaration", titre: "Ruffin fait le \"pari du peuple\"", texte: "Le député-reporter lance sa campagne avec son mouvement Debout !.", bloc: "GAU" },
  { date: "5 février 2026", type: "Déclaration", titre: "Guedj candidat sans primaire", texte: "Le socialiste se déclare pour une gauche \"républicaine, universaliste et laïque\", hors primaire.", bloc: "SOC" },
  { date: "22 octobre 2025", type: "Déclaration", titre: "Tondelier se déclare", texte: "La patronne des Écologistes annonce \"un acte d'amour pour la France\".", bloc: "ECO" },
];

export const AGENDA = [
  { date: "Début juillet 2026", evt: "Congrès du PCF à Lille : décision sur la candidature Roussel" },
  { date: "9 juillet 2026", evt: "Vote des militants PS : grande primaire de gauche ou désignation resserrée au sein du pôle socialiste" },
  { date: "11 octobre 2026", evt: "Primaire de la gauche unitaire (L'Après, Écologistes, Debout !, Génération·s, UDB), sans LFI, Place publique ni PCF" },
  { date: "Mars 2027", evt: "Dépôt des 500 parrainages et publication de la liste officielle des candidats" },
  { date: "18 avril 2027", evt: "Premier tour de l'élection présidentielle" },
  { date: "2 mai 2027", evt: "Second tour de l'élection présidentielle" },
];

// Courbes disponibles dans le graphique de tendance
export const SERIES = [
  { key: "Bardella", color: "#1B3A63" },
  { key: "Philippe", color: "#E8952F" },
  { key: "Mélenchon", color: "#C7314A" },
  { key: "Glucksmann", color: "#E86B8A" },
  { key: "Attal", color: "#9333EA" },
  { key: "Retailleau", color: "#2563EB" },
  { key: "Zemmour", color: "#64748B" },
  { key: "Roussel", color: "#7F1D1D" },
  { key: "Tondelier", color: "#16A34A" },
  { key: "Dupont-Aignan", color: "#78350F" },
  { key: "Arthaud", color: "#DB2777" },
];

// Une entrée par vague de sondage ; les clés doivent correspondre à SERIES
export const TENDANCE = [
  { vague: "Mars 26", Bardella: 31, Philippe: 21, "Mélenchon": 12, Glucksmann: 12, Attal: 6, Retailleau: 5, Zemmour: 5, Roussel: 3, Tondelier: 3, "Dupont-Aignan": 2, Arthaud: 0.5 },
  { vague: "Avril 26", Bardella: 32, Philippe: 19, "Mélenchon": 13, Glucksmann: 11, Attal: 6, Retailleau: 6, Zemmour: 5, Roussel: 3, Tondelier: 3, "Dupont-Aignan": 2, Arthaud: 0.5 },
  { vague: "Mai 26", Bardella: 32, Philippe: 17, "Mélenchon": 16, Glucksmann: 11, Attal: 7, Retailleau: 7, Zemmour: 4, Roussel: 3, Tondelier: 2.5, "Dupont-Aignan": 2, Arthaud: 0.5 },
  { vague: "Juin 26", Bardella: 36, Philippe: 14, "Mélenchon": 13, Glucksmann: 9, Attal: 8, Retailleau: 8, Zemmour: 4, Roussel: 3, Tondelier: 2.5, "Dupont-Aignan": 2, Arthaud: 0.5 },
];

export const LIGNES_PAR_DEFAUT = ["Bardella", "Philippe", "Mélenchon", "Glucksmann"];

// Encadré "dernière vague" affiché en tête de l'onglet Sondages
export const NOTE_SONDAGES = "Dernière vague : Ifop-Fiducial, 25 juin 2026. Marge d'erreur de 2 à 3 points. À un an du scrutin, les sondages ont une valeur prédictive limitée.";

// Hypothèse de second tour (encadré sombre de l'onglet Sondages)
export const SECOND_TOUR = {
  gauche: { nom: "Bardella", score: 52, bloc: "EXD" },
  droite: { nom: "Philippe", score: 48, bloc: "CEN" },
  source: "Odoxa, 20-21 mai 2026, 1 005 personnes. Il y a deux mois, le rapport était inversé.",
};
