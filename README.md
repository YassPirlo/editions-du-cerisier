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

- **CMS (Decap)** sur `/admin/` : la maison édite les livres, collections et
  rubriques de `content/` ; chaque enregistrement est un commit, chaque
  commit reconstruit le site. En local : `npm run cms-local` dans un
  terminal, `npm run dev` dans un autre — pas de compte requis
  (`local_backend`).
- **Authentification** : Netlify Identity + Git Gateway (comptes par
  invitation, un par adresse de courriel), derrière une porte maison —
  l'écran de connexion de `public/admin/index.html`, qui parle
  directement à l'API d'identité et impose un mot de passe fort à sa
  création (regex : 12 caractères, minuscule, majuscule, chiffre,
  caractère spécial, jamais l'adresse dedans). `AccesIdentite.tsx`
  reconduit vers `/admin/` les liens d'invitation et de renouvellement,
  qui arrivent sur `/`. La mise en service se fait dans le tableau de
  bord Netlify — pas-à-pas dans `GUIDE-CONFIGURATION.md`.
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
- **Fréquentation** : Umami (`NEXT_PUBLIC_UMAMI_ID`), la mesure
  d'audience sans cookies ni données personnelles — donc sans bannière de
  consentement (`Statistiques.tsx` ; tableau de bord sur cloud.umami.is,
  carte des pays comprise).

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

Créer le site Netlify et y activer Identity + Git Gateway + Forms (le
pas-à-pas est dans `GUIDE-CONFIGURATION.md`), créer la propriété Google
Analytics, vrai logo vectoriel, en-têtes de sécurité.
