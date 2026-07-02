import React, { useState, useMemo, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { BLOCS, CANDIDATS, FIL, AGENDA, SERIES, TENDANCE, LIGNES_PAR_DEFAUT, NOTE_SONDAGES, SECOND_TOUR } from "./donnees.js";

const STATUT_STYLE = {
  "Déclaré": { bg: "#E7F0E9", fg: "#1F6B3A" },
  "Déclarée": { bg: "#E7F0E9", fg: "#1F6B3A" },
  "Primaire": { bg: "#FDF1DC", fg: "#8A5A10" },
  "Congrès": { bg: "#FDF1DC", fg: "#8A5A10" },
  "Pressenti": { bg: "#ECEEF3", fg: "#4B5563" },
};

const SEUIL_MAJ = 55; // px de tirage pour déclencher le rafraîchissement

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
  const [tirage, setTirage] = useState(0);
  const [enMaj, setEnMaj] = useState(false);
  const departY = useRef(null);
  const mainRef = useRef(null);
  const [sombre, setSombre] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("elysee2027-theme") === "sombre";
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

  // ─ Tirer depuis le haut de la liste pour recharger l'app (PWA plein écran) ─
  function surToucherDebut(e) {
    if (mainRef.current && mainRef.current.scrollTop <= 0) {
      departY.current = e.touches[0].clientY;
    } else {
      departY.current = null;
    }
  }

  function surToucherBouge(e) {
    if (departY.current === null || enMaj) return;
    const dy = e.touches[0].clientY - departY.current;
    if (dy > 0 && mainRef.current && mainRef.current.scrollTop <= 0) {
      setTirage(Math.min(dy * 0.4, 80));
    } else if (tirage !== 0) {
      setTirage(0);
    }
  }

  function surToucherFin() {
    departY.current = null;
    if (tirage >= SEUIL_MAJ && !enMaj) {
      setEnMaj(true);
      window.location.reload();
    } else {
      setTirage(0);
    }
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
        @keyframes tourner { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) { .carte { transition: none; } .barre { transition: none !important; } }
      `}</style>

      <div style={{ width: "100%", maxWidth: 420, background: theme.containerBg, minHeight: "100vh", display: "flex", flexDirection: "column", boxShadow: "0 0 40px rgba(27,34,55,.12)" }}>

        {/* En-tête */}
        <header style={{ background: "#1B2237", color: "#fff", padding: "20px 18px 16px" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8FA0C9", fontWeight: 600 }}>Présidentielle</div>
              <h1 style={{ margin: "2px 0 0", fontSize: 26, fontWeight: 800, letterSpacing: "-0.01em" }}>Élysée 2027</h1>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <button
                onClick={() => setSombre(s => !s)}
                title={sombre ? "Passer en mode clair" : "Passer en mode sombre"}
                style={{ width: 30, height: 30, borderRadius: 99, border: "none", background: "rgba(255,255,255,.14)", color: "#fff", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
              >
                {sombre ? "☀️" : "🌙"}
              </button>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1 }}>J-{jours}</div>
                <div style={{ fontSize: 10.5, color: "#8FA0C9", marginTop: 3 }}>1er tour : 18 avril 2027</div>
              </div>
            </div>
          </div>
        </header>

        {/* Indicateur de rafraîchissement */}
        <div aria-hidden={tirage === 0 && !enMaj} style={{ position: "relative", height: 0, overflow: "visible", zIndex: 5 }}>
          <div style={{
            position: "absolute", left: "50%", top: 6,
            transform: `translateX(-50%) translateY(${tirage - 40}px) rotate(${tirage * 3}deg)`,
            opacity: enMaj ? 1 : Math.min(tirage / SEUIL_MAJ, 1),
            width: 32, height: 32, borderRadius: 99, background: theme.cardBg,
            border: `1px solid ${theme.border}`, boxShadow: "0 2px 8px rgba(27,34,55,.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: departY.current === null ? "transform .2s ease, opacity .2s ease" : "none",
            animation: enMaj ? "tourner .8s linear infinite" : "none",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={tirage >= SEUIL_MAJ || enMaj ? "#1F6B3A" : theme.textMuted} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-3-6.7" />
              <polyline points="21 3 21 9 15 9" />
            </svg>
          </div>
        </div>

        {/* Contenu */}
        <main
          ref={mainRef}
          onTouchStart={surToucherDebut}
          onTouchMove={surToucherBouge}
          onTouchEnd={surToucherFin}
          style={{ flex: 1, overflowY: "auto", padding: "16px 14px 90px", transform: tirage ? `translateY(${tirage}px)` : "none", transition: departY.current === null ? "transform .2s ease" : "none" }}
        >

          {tab === "sondages" && (
            <div>
              <p style={{ fontSize: 12, color: theme.textMuted, margin: "0 0 12px", lineHeight: 1.5 }}>
                {NOTE_SONDAGES}
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
                  <div style={{ flex: SECOND_TOUR.gauche.score }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{SECOND_TOUR.gauche.nom} {SECOND_TOUR.gauche.score} %</div>
                    <div style={{ height: 8, background: BLOCS[SECOND_TOUR.gauche.bloc].color, borderRadius: "99px 0 0 99px", marginTop: 5, filter: "brightness(1.6)" }} />
                  </div>
                  <div style={{ flex: SECOND_TOUR.droite.score, textAlign: "right" }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{SECOND_TOUR.droite.nom} {SECOND_TOUR.droite.score} %</div>
                    <div style={{ height: 8, background: BLOCS[SECOND_TOUR.droite.bloc].color, borderRadius: "0 99px 99px 0", marginTop: 5 }} />
                  </div>
                </div>
                <div style={{ fontSize: 10.5, color: "#8FA0C9", marginTop: 9 }}>{SECOND_TOUR.source}</div>
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
                      <button onClick={e => { e.stopPropagation(); partager(c); }} title="Partager cette fiche" aria-label={`Partager la fiche de ${c.nom}`}
                        style={{ background: "none", border: "none", cursor: "pointer", color: copie === c.nom ? "#1F6B3A" : theme.textMuted, padding: 2, lineHeight: 0 }}>
                        {copie === c.nom ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="18" cy="5" r="3" />
                            <circle cx="6" cy="12" r="3" />
                            <circle cx="18" cy="19" r="3" />
                            <line x1="8.6" y1="10.6" x2="15.4" y2="6.5" />
                            <line x1="8.6" y1="13.4" x2="15.4" y2="17.5" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  {ouvert === c.nom && (
                    <p style={{ fontSize: 12.5, color: theme.noteText, lineHeight: 1.55, margin: "10px 0 0", paddingTop: 10, borderTop: `1px solid ${theme.border}` }}>{c.note}</p>
                  )}
                </div>
              ))}
              <p style={{ fontSize: 11, color: theme.textMuted2, lineHeight: 1.5, marginTop: 10 }}>
                {CANDIDATS.length} candidatures recensées à ce jour. Chaque candidat devra réunir 500 parrainages d'élus issus d'au moins 30 départements pour figurer sur la liste officielle en mars 2027.
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
