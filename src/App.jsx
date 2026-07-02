import React, { useState, useMemo, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// ─ Données figées au 2 juillet 2026 (sources : Ifop 25/06, Odoxa 26/05, LCP, France 24) ─

const BLOCS = {
  EXG: { label: "Extrême gauche", color: "#8E1F2F" },
  GAU: { label: "Gauche", color: "#C7314A" },
  SOC: { label: "Gauche sociale-démocrate", color: "#E86B8A" },
  ECO: { label: "Écologistes", color: "#2E9E5B" },
  CEN: { label: "Bloc central", color: "#E8952F" },
  DRO: { label: "Droite", color: "#2F5FB3" },
  EXD: { label: "Extrême droite", color: "#1B3A63" },
  DIV: { label: "Divers", color: "#6B7280" },
};

const CANDIDATS = [
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

const FIL = [
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

const AGENDA = [
  { date: "Début juillet 2026", evt: "Congrès du PCF à Lille : décision sur la candidature Roussel" },
  { date: "9 juillet 2026", evt: "Vote des militants PS : grande primaire de gauche ou désignation resserrée au sein du pôle socialiste" },
  { date: "11 octobre 2026", evt: "Primaire de la gauche unitaire (L'Après, Écologistes, Debout !, Génération·s, UDB), sans LFI, Place publique ni PCF" },
  { date: "Mars 2027", evt: "Dépôt des 500 parrainages et publication de la liste officielle des candidats" },
  { date: "18 avril 2027", evt: "Premier tour de l'élection présidentielle" },
  { date: "2 mai 2027", evt: "Second tour de l'élection présidentielle" },
];

const SERIES = [
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

const TENDANCE = [
  { vague: "Mars 26", Bardella: 31, Philippe: 21, "Mélenchon": 12, Glucksmann: 12, Attal: 6, Retailleau: 5, Zemmour: 5, Roussel: 3, Tondelier: 3, "Dupont-Aignan": 2, Arthaud: 0.5 },
  { vague: "Avril 26", Bardella: 32, Philippe: 19, "Mélenchon": 13, Glucksmann: 11, Attal: 6, Retailleau: 6, Zemmour: 5, Roussel: 3, Tondelier: 3, "Dupont-Aignan": 2, Arthaud: 0.5 },
  { vague: "Mai 26", Bardella: 32, Philippe: 17, "Mélenchon": 16, Glucksmann: 11, Attal: 7, Retailleau: 7, Zemmour: 4, Roussel: 3, Tondelier: 2.5, "Dupont-Aignan": 2, Arthaud: 0.5 },
  { vague: "Juin 26", Bardella: 36, Philippe: 14, "Mélenchon": 13, Glucksmann: 9, Attal: 8, Retailleau: 8, Zemmour: 4, Roussel: 3, Tondelier: 2.5, "Dupont-Aignan": 2, Arthaud: 0.5 },
];

const LIGNES_PAR_DEFAUT = ["Bardella", "Philippe", "Mélenchon", "Glucksmann"];

const STATUT_STYLE = {
  "Déclaré": { bg: "#E7F0E9", fg: "#1F6B3A" },
  "Déclarée": { bg: "#E7F0E9", fg: "#1F6B3A" },
  "Primaire": { bg: "#FDF1DC", fg: "#8A5A10" },
  "Congrès": { bg: "#FDF1DC", fg: "#8A5A10" },
  "Pressenti": { bg: "#ECEEF3", fg: "#4B5563" },
};

function normaliser(str) {
  return str.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function Badge({ statut }) {
  const s = STATUT_STYLE[statut] || STATUT_STYLE["Pressenti"];
  return (
    <span style={{ background: s.bg, color: s.fg, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 99 }}>
      {statut}
    </span>
  );
}

export default function Elysee2027() {
  const [tab, setTab] = useState("sondages");
  const [ouvert, setOuvert] = useState(null);
  const [filtreBloc, setFiltreBloc] = useState(null);
  const [recherche, setRecherche] = useState("");
  const [lignesAffichees, setLignesAffichees] = useState(LIGNES_PAR_DEFAUT);
  const [copie, setCopie] = useState(null);
  const [sombre, setSombre] = useState(() => {
    if (typeof window === "undefined") return false;
    const enregistre = window.localStorage.getItem("elysee2027-theme");
    if (enregistre) return enregistre === "sombre";
    return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    window.localStorage.setItem("elysee2027-theme", sombre ? "sombre" : "clair");
  }, [sombre]);

  useEffect(() => {
    if (!copie) return;
    const t = setTimeout(() => setCopie(null), 1800);
    return () => clearTimeout(t);
  }, [copie]);

  const jours = useMemo(() => Math.max(0, Math.ceil((new Date("2027-04-18") - Date.now()) / 86400000)), []);
  const sondes = CANDIDATS.filter(c => c.sondage !== null).sort((a, b) => b.sondage - a.sondage);
  const candidatsAffiches = CANDIDATS.filter(c => {
    if (filtreBloc && c.bloc !== filtreBloc) return false;
    if (recherche.trim()) {
      const q = normaliser(recherche.trim());
      return normaliser(c.nom).includes(q) || normaliser(c.parti).includes(q);
    }
    return true;
  });

  function basculerLigne(cle) {
    setLignesAffichees(prev => prev.includes(cle) ? prev.filter(k => k !== cle) : [...prev, cle]);
  }

  async function partager(c) {
    const texte = `${c.nom} (${c.parti}) — ${c.sondage !== null ? c.sondage + " %" : c.statut} — ${c.note}`;
    if (navigator.share) {
      try { await navigator.share({ title: c.nom, text: texte }); } catch { /* partage annulé */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(texte);
      setCopie(c.nom);
    } catch { /* presse-papier indisponible */ }
  }

  function exporterDonnees() {
    const donnees = { candidats: CANDIDATS, fil: FIL, agenda: AGENDA, tendance: TENDANCE, exporteLe: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(donnees, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "elysee-2027.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  const font = "'Archivo', -apple-system, 'Segoe UI', sans-serif";

  const theme = sombre ? {
    pageBg: "#0B0F1A", containerBg: "#12172A", text: "#EDEFF4", textMuted: "#9AA6BD", textMuted2: "#6B7690",
    noteText: "#C3CADC", border: "#232A3D", cardBg: "#171D2E", trackBg: "#232A3D", navBg: "#12172A",
    inputBg: "#171D2E", chipBorder: "#2B3348",
  } : {
    pageBg: "#EEF0F4", containerBg: "#FAFBFC", text: "#1B2237", textMuted: "#6B7280", textMuted2: "#9AA2B1",
    noteText: "#414B60", border: "#E5E8EE", cardBg: "#fff", trackBg: "#E5E8EE", navBg: "#fff",
    inputBg: "#fff", chipBorder: "#D8DCE5",
  };

  return (
    <div style={{ minHeight: "100vh", background: theme.pageBg, display: "flex", justifyContent: "center", fontFamily: font, color: theme.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        button { font-family: inherit; }
        input { font-family: inherit; }
        .carte { transition: transform .12s ease; }
        .carte:active { transform: scale(.985); }
        @media (prefers-reduced-motion: reduce) { .carte { transition: none; } .barre { transition: none !important; } }
      `}</style>

      <div style={{ width: "100%", maxWidth: 420, background: theme.containerBg, minHeight: "100vh", display: "flex", flexDirection: "column", boxShadow: "0 0 40px rgba(27,34,55,.12)" }}>

        {/* En-tête */}
        <header style={{ position: "relative", background: "#1B2237", color: "#fff", padding: "20px 18px 16px" }}>
          <button
            onClick={() => setSombre(s => !s)}
            title={sombre ? "Passer en mode clair" : "Passer en mode sombre"}
            style={{ position: "absolute", top: 14, right: 18, width: 28, height: 28, borderRadius: 99, border: "none", background: "rgba(255,255,255,.14)", color: "#fff", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {sombre ? "☀️" : "🌙"}
          </button>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8FA0C9", fontWeight: 600 }}>Présidentielle</div>
              <h1 style={{ margin: "2px 0 0", fontSize: 26, fontWeight: 800, letterSpacing: "-0.01em" }}>Élysée 2027</h1>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1 }}>J-{jours}</div>
              <div style={{ fontSize: 10.5, color: "#8FA0C9", marginTop: 3 }}>1er tour : 18 avril 2027</div>
            </div>
          </div>
        </header>

        {/* Contenu */}
        <main style={{ flex: 1, overflowY: "auto", padding: "16px 14px 90px" }}>

          {tab === "sondages" && (
            <div>
              <p style={{ fontSize: 12, color: theme.textMuted, margin: "0 0 12px", lineHeight: 1.5 }}>
                Dernière vague : Ifop-Fiducial, 25 juin 2026. Marge d'erreur de 2 à 3 points. À un an du scrutin, les sondages ont une valeur prédictive limitée.
              </p>

              {sondes.map(c => (
                <div key={c.nom} style={{ marginBottom: 11 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>{c.nom} <span style={{ color: theme.textMuted2, fontWeight: 400, fontSize: 12 }}>{c.parti}</span></span>
                    <span style={{ fontWeight: 800 }}>{c.sondage} %</span>
                  </div>
                  <div style={{ height: 9, background: theme.trackBg, borderRadius: 99, overflow: "hidden" }}>
                    <div className="barre" style={{ height: "100%", width: `${(c.sondage / 40) * 100}%`, background: BLOCS[c.bloc].color, borderRadius: 99, transition: "width .6s ease" }} />
                  </div>
                </div>
              ))}

              <h2 style={{ fontSize: 14, fontWeight: 700, margin: "24px 0 8px", letterSpacing: "0.02em" }}>Tendance sur 4 mois</h2>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                {SERIES.map(s => {
                  const actif = lignesAffichees.includes(s.key);
                  return (
                    <button key={s.key} onClick={() => basculerLigne(s.key)}
                      style={{ fontSize: 11, fontWeight: 600, padding: "4px 9px", borderRadius: 99, border: `1px solid ${actif ? s.color : theme.chipBorder}`, background: actif ? s.color : theme.cardBg, color: actif ? "#fff" : theme.text, cursor: "pointer" }}>
                      {s.key}
                    </button>
                  );
                })}
              </div>
              <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 14, padding: "14px 6px 6px" }}>
                <ResponsiveContainer width="100%" height={190}>
                  <LineChart data={TENDANCE} margin={{ top: 5, right: 12, left: -18, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
                    <XAxis dataKey="vague" tick={{ fontSize: 11, fill: theme.textMuted }} />
                    <YAxis tick={{ fontSize: 11, fill: theme.textMuted }} domain={[0, 40]} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10, border: `1px solid ${theme.border}`, background: theme.cardBg, color: theme.text }} />
                    {SERIES.filter(s => lignesAffichees.includes(s.key)).map(s => (
                      <Line key={s.key} type="monotone" dataKey={s.key} stroke={s.color} strokeWidth={2.5} dot={{ r: 3 }} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div style={{ background: "#1B2237", color: "#fff", borderRadius: 14, padding: "14px 16px", marginTop: 16 }}>
                <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8FA0C9", fontWeight: 700 }}>Hypothèse de second tour</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                  <div style={{ flex: 52 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>Bardella 52 %</div>
                    <div style={{ height: 8, background: BLOCS.EXD.color, borderRadius: "99px 0 0 99px", marginTop: 5, filter: "brightness(1.6)" }} />
                  </div>
                  <div style={{ flex: 48, textAlign: "right" }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>Philippe 48 %</div>
                    <div style={{ height: 8, background: BLOCS.CEN.color, borderRadius: "0 99px 99px 0", marginTop: 5 }} />
                  </div>
                </div>
                <div style={{ fontSize: 10.5, color: "#8FA0C9", marginTop: 9 }}>Odoxa, 20-21 mai 2026, 1 005 personnes. Il y a deux mois, le rapport était inversé.</div>
              </div>
            </div>
          )}

          {tab === "candidats" && (
            <div>
              <input
                type="text"
                value={recherche}
                onChange={e => setRecherche(e.target.value)}
                placeholder="Rechercher un candidat ou un parti…"
                style={{ width: "100%", fontSize: 13, padding: "9px 12px", borderRadius: 10, border: `1px solid ${theme.border}`, background: theme.inputBg, color: theme.text, marginBottom: 12, outline: "none" }}
              />

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                <button onClick={() => setFiltreBloc(null)} style={{ fontSize: 11.5, fontWeight: 600, padding: "5px 11px", borderRadius: 99, border: `1px solid ${theme.chipBorder}`, background: filtreBloc === null ? "#1B2237" : theme.cardBg, color: filtreBloc === null ? "#fff" : theme.text, cursor: "pointer" }}>Tous</button>
                {Object.entries(BLOCS).filter(([k]) => k !== "DIV").map(([k, b]) => (
                  <button key={k} onClick={() => setFiltreBloc(filtreBloc === k ? null : k)} style={{ fontSize: 11.5, fontWeight: 600, padding: "5px 11px", borderRadius: 99, border: `1px solid ${filtreBloc === k ? b.color : theme.chipBorder}`, background: filtreBloc === k ? b.color : theme.cardBg, color: filtreBloc === k ? "#fff" : theme.text, cursor: "pointer" }}>{b.label}</button>
                ))}
              </div>

              {candidatsAffiches.length === 0 && (
                <p style={{ fontSize: 12.5, color: theme.textMuted, textAlign: "center", padding: "24px 0" }}>Aucun candidat ne correspond à cette recherche.</p>
              )}

              {candidatsAffiches.map(c => (
                <div key={c.nom} className="carte" onClick={() => setOuvert(ouvert === c.nom ? null : c.nom)}
                  style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderLeft: `4px solid ${BLOCS[c.bloc].color}`, borderRadius: 12, padding: "12px 14px", marginBottom: 9, cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14.5 }}>{c.nom}</div>
                      <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 1 }}>{c.parti} · {BLOCS[c.bloc].label}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      {c.sondage !== null && <span style={{ fontWeight: 800, fontSize: 15 }}>{c.sondage} %</span>}
                      <Badge statut={c.statut} />
                      <button onClick={e => { e.stopPropagation(); partager(c); }} title="Partager cette fiche"
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: theme.textMuted, padding: 2, lineHeight: 1 }}>
                        {copie === c.nom ? "✓" : "⤴"}
                      </button>
                    </div>
                  </div>
                  {ouvert === c.nom && (
                    <p style={{ fontSize: 12.5, color: theme.noteText, lineHeight: 1.55, margin: "10px 0 0", paddingTop: 10, borderTop: `1px solid ${theme.border}` }}>{c.note}</p>
                  )}
                </div>
              ))}
              <p style={{ fontSize: 11, color: theme.textMuted2, lineHeight: 1.5, marginTop: 10 }}>
                22 candidatures officielles recensées à ce jour. Chaque candidat devra réunir 500 parrainages d'élus issus d'au moins 30 départements pour figurer sur la liste officielle en mars 2027.
              </p>
              <button onClick={exporterDonnees}
                style={{ marginTop: 12, fontSize: 12, fontWeight: 700, color: theme.text, background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "8px 14px", cursor: "pointer" }}>
                Exporter les données (JSON)
              </button>
            </div>
          )}

          {tab === "fil" && (
            <div>
              {FIL.map((e, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 4 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 12, flexShrink: 0 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 99, background: BLOCS[e.bloc].color, marginTop: 6 }} />
                    {i < FIL.length - 1 && <div style={{ width: 2, flex: 1, background: theme.border, marginTop: 4 }} />}
                  </div>
                  <div style={{ paddingBottom: 18, flex: 1 }}>
                    <div style={{ fontSize: 11, color: theme.textMuted2, fontWeight: 600 }}>{e.date} · <span style={{ color: BLOCS[e.bloc].color }}>{e.type}</span></div>
                    <div style={{ fontWeight: 700, fontSize: 14, margin: "3px 0 4px" }}>{e.titre}</div>
                    <div style={{ fontSize: 12.5, color: theme.noteText, lineHeight: 1.55 }}>{e.texte}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "agenda" && (
            <div>
              {AGENDA.map((a, i) => (
                <div key={i} style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 12, padding: "13px 15px", marginBottom: 9 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: theme.text, letterSpacing: "0.05em", textTransform: "uppercase" }}>{a.date}</div>
                  <div style={{ fontSize: 13.5, color: theme.noteText, marginTop: 4, lineHeight: 1.5 }}>{a.evt}</div>
                </div>
              ))}
              <div style={{ background: "#FDF1DC", borderRadius: 12, padding: "13px 15px", marginTop: 6 }}>
                <div style={{ fontSize: 12.5, color: "#8A5A10", lineHeight: 1.55 }}>
                  Rappel méthodologique : depuis 1995, le favori des sondages à un an du scrutin n'a remporté l'élection qu'une fois sur deux. En 2011, DSK était donné vainqueur. En 2016, Juppé dominait.
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Navigation basse */}
        <nav style={{ position: "fixed", bottom: 0, width: "100%", maxWidth: 420, background: theme.navBg, borderTop: `1px solid ${theme.border}`, display: "flex", padding: "8px 6px calc(8px + env(safe-area-inset-bottom))" }}>
          {[
            { id: "sondages", label: "Sondages", ico: "📊" },
            { id: "candidats", label: "Candidats", ico: "🗳️" },
            { id: "fil", label: "Le fil", ico: "📰" },
            { id: "agenda", label: "Agenda", ico: "📅" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ flex: 1, background: "none", border: "none", cursor: "pointer", padding: "6px 0", borderRadius: 10, color: tab === t.id ? theme.text : theme.textMuted2 }}>
              <div style={{ fontSize: 18, filter: tab === t.id ? "none" : "grayscale(1) opacity(.55)" }}>{t.ico}</div>
              <div style={{ fontSize: 10.5, fontWeight: tab === t.id ? 800 : 500, marginTop: 2 }}>{t.label}</div>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
