# Éditions du Cerisier — refonte du site

Refonte du site des [Éditions du Cerisier](https://editions-du-cerisier.be),
maison d'édition coopérative fondée en 1985 à Cuesmes (Mons). Le site
d'origine, sous SPIP, est aujourd'hui hors ligne : l'extraction de son contenu
datée du 19 août 2026 (`src/data/`) sert de copie de référence.

## Principes

- **Les textes existants sont repris mot pour mot.** On ne réécrit rien, on ne
  supprime rien : les neuf collections et les rubriques d'origine sont
  préservées telles quelles.
- **Le contenu vivant est en Markdown, dans `content/`.** C'est lui que la
  maison édite (CMS Decap sur `/admin/`) ; au build, `npm run build` le
  retransforme en `src/data/*.json` via `scripts/construire-donnees.mjs`.
  Les artefacts d'extraction restants se réparent à la lecture, dans
  `src/lib/reparation.ts`, où chaque correction est justifiée.
- **Pas d'e-commerce.** Les commandes passent par courriel, téléphone ou
  courrier, comme avant.
- Couleurs de la maison : le jaune `#ffc107` et le brun `#8b6f47` du bandeau
  historique.

## Stack

Next.js (App Router), React, TypeScript, Tailwind CSS v4 — les jetons de
couleur vivent dans le bloc `@theme` de `src/app/globals.css`, il n'y a pas de
`tailwind.config.js`. Les dépendances de production restent comptées :
`gray-matter` + `marked` (le contenu Markdown au build) et, exception
assumée, `three` + `@react-three/fiber` + `@react-three/drei` — le livre en
main des fiches (`VitrineLivre.tsx`), chargé dynamiquement sur ces pages
seulement, avec le volume CSS en affiche et en repli. Le site public reste
entièrement statique, généré au build.

## Administration, infolettre, statistiques

- **CMS (Decap)** sur `/admin/` : la maison édite les livres, collections
  et rubriques de `content/`. Le CMS n'écrit nulle part ailleurs que
  chez nous — son guichet est `/api/cms` (`src/app/api/cms/route.ts`,
  protocole du serveur de fichiers de Decap), qui pose les fichiers puis
  refait `src/data/*.json` avec le script du build. Aucun service
  extérieur, aucun dépôt distant : `npm run dev` suffit.
- **Authentification** : un seul mot de passe, celui de la maison, posé
  dans `ADMIN_PASSWORD` — pas de comptes ni d'adresses. La porte de
  `public/admin/index.html` le vérifie via `/api/admin/session`
  (comparaison en temps constant, cookie signé de sept jours,
  `src/lib/jeton.ts`) ; la même session garde le guichet du CMS et les
  statistiques. Pas-à-pas dans `GUIDE-CONFIGURATION.md`.
- **Infolettre** : le pop-up « La lettre du Cerisier » poste vers
  `/api/infolettre`, qui range l'adresse dans la liste Brevo de la maison
  (clé côté serveur, pot de miel, réponses en français) — les campagnes
  s'écrivent et s'envoient depuis Brevo, sans code. L'aperçu GitHub Pages,
  purement statique, écarte cette route (workflow) et le pop-up y affiche
  son repli.
- **SEO** : données structurées schema.org (la maison en Organization,
  le site, chaque fiche en Book — ISBN, prix, couverture — et les fils
  d'Ariane, voir `src/lib/schema.ts`), carte de partage `public/partage.png`
  (régénérable par `scripts/genere-partage.mjs`), sitemap et robots tenus.
- **Fréquentation** : comptée par la maison elle-même, sans service
  tiers — la balise (`Statistiques.tsx`) dépose chaque vue sur
  `/api/frequentation`, qui agrège en fichiers (dossier `.data`, ou
  `STATS_DIR`) : jours, pages, pays quand le serveur de devant le
  renseigne, provenances ; visiteurs par empreinte anonyme quotidienne —
  pas de cookies ni de données personnelles, donc pas de bannière.
  Tableau de bord dans l'admin : `/admin/stats.html`, gardé par la même
  session.

## Arborescence

```
content/         le contenu vivant : livres, collections, rubriques (Markdown)
src/data/        les JSON regénérés au build depuis content/ (ne pas éditer)
public/covers/   les images (couvertures et visuels d'articles)
public/admin/    le CMS Decap (index.html + config.yml)
public/documents/  le catalogue PDF
scripts/         construire-donnees.mjs (content/ → JSON) et outils de migration
src/lib/         lecture des données (content.ts) et réparations (reparation.ts)
src/app/         les pages ; /apercu/* : maquettes d'accueil non publiées
src/components/  dont Cerisier.tsx (vocabulaire graphique), Livre3D.tsx,
                 VitrineLivre.tsx (le livre en main) et Statistiques.tsx
```

## Commandes

```bash
npm ci         # installer
npm run dev    # développer sur http://localhost:3000
npm run build  # générer le site statique
npm run start  # servir le build
```

## Reste à faire

Choisir l'hébergeur définitif (n'importe lequel sachant exécuter Node :
`npm run build` puis `npm run start`) et y reporter les réglages,
brancher la liste Brevo, vrai logo vectoriel, en-têtes de sécurité. Le
contenu étant cuit au build, une édition faite depuis l'administration
en ligne demande une reconstruction pour paraître — voir le guide.
