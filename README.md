# Élysée 2027

Application web de suivi de l'élection présidentielle française de 2027 : sondages, candidats déclarés, fil d'actualité et agenda électoral.

Données figées au 2 juillet 2026 (sources : Ifop 25/06, Odoxa 26/05, LCP, France 24).

## Fonctionnalités

- **Sondages** : classement de la dernière vague, graphique de tendance sur 4 mois avec sélection des candidats affichés, hypothèse de second tour
- **Candidats** : 24 fiches détaillées, recherche par nom ou parti, filtres par bloc politique, partage de fiche, export JSON
- **Le fil** : chronologie des événements de la pré-campagne
- **Agenda** : les échéances jusqu'au scrutin
- Mode sombre, installable sur téléphone (PWA)

## Développement

```bash
npm install
npm run dev
```

## Build de production

```bash
npm run build
npm run preview
```

## Déploiement

Le site est déployé automatiquement sur GitHub Pages à chaque push sur `main` (voir `.github/workflows/deploy.yml`).
