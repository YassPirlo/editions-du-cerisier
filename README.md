# Éditions du Cerisier — refonte du site

Refonte du site des [Éditions du Cerisier](https://editions-du-cerisier.be),
maison d'édition coopérative fondée en 1985 à Cuesmes (Mons). Le site
d'origine, sous SPIP, est aujourd'hui hors ligne : l'extraction de son contenu
datée du 19 août 2026 (`src/data/`) sert de copie de référence.

## Principes

- **Les textes existants sont repris mot pour mot.** On ne réécrit rien, on ne
  supprime rien : les neuf collections et les rubriques d'origine sont
  préservées telles quelles.
- **Les données extraites ne se corrigent pas sur place.** Les JSON restent la
  copie fidèle du site d'origine ; les artefacts d'extraction (liens vidés de
  leur libellé, ISBN abîmés) se réparent à la lecture, dans
  `src/lib/reparation.ts`, où chaque correction est justifiée.
- **Pas d'e-commerce.** Les commandes passent par courriel, téléphone ou
  courrier, comme avant.
- Couleurs de la maison : le jaune `#ffc107` et le brun `#8b6f47` du bandeau
  historique.

## Stack

Next.js (App Router), React, TypeScript, Tailwind CSS v4 — les jetons de
couleur vivent dans le bloc `@theme` de `src/app/globals.css`, il n'y a pas de
`tailwind.config.js`. Aucune dépendance de production en dehors de
`next`/`react`/`react-dom`, volontairement. Le site est entièrement statique :
283 pages générées au build.

## Arborescence

```
src/data/        extraction SPIP figée : 253 livres, 9 collections, 13 rubriques
public/covers/   279 images (couvertures et visuels d'articles)
public/documents/  le catalogue PDF
src/lib/         lecture des données (content.ts) et réparations (reparation.ts)
src/app/         les pages ; /apercu/* : maquettes d'accueil non publiées
src/components/  dont Cerisier.tsx (vocabulaire graphique) et Livre3D.tsx
```

## Commandes

```bash
npm ci         # installer
npm run dev    # développer sur http://localhost:3000
npm run build  # générer le site statique
npm run start  # servir le build
```

## Reste à faire

Déploiement, interface d'édition pour la maison (le contenu est figé en JSON
pour l'instant), vrai logo vectoriel, en-têtes de sécurité, statistiques sans
cookies.
