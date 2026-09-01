# Mise en service — administration, infolettre, statistiques

Le site n'a besoin d'**aucun compte extérieur** pour fonctionner : un mot
de passe, posé dans les réglages, ouvre l'administration ; le contenu vit
en fichiers dans le projet ; les statistiques se comptent toutes seules.
Deux services facultatifs restent : Brevo pour envoyer l'infolettre, et
un hébergeur pour publier.

---

## Étape 1 — Le mot de passe (2 min)

Un seul mot de passe, celui de la maison. Il ouvre `/admin` : le CMS
(livres, collections, rubriques) et la page de fréquentation.

1. Sur ton ordinateur, ouvre `.env.local` à la racine du projet et
   remplace le mot de passe d'essai :

   ```
   ADMIN_PASSWORD=une-phrase-longue-et-a-toi
   ```

2. Lance le site et va sur `http://localhost:3000/admin/` :

   ```bash
   npm run dev
   ```

C'est tout : le mot de passe ouvre le CMS, tu édites, les fichiers du
projet changent aussitôt et la page se met à jour. Retirer l'accès à
quelqu'un = changer le mot de passe.

> La session tient sept jours par navigateur ; « Se déconnecter » est en
> bas à droite du CMS.

## Étape 2 — Publier le site (≈ 15 min)

Le site se construit en fichiers, puis se sert :

```bash
npm run build
npm run start
```

N'importe quel hébergeur qui sait exécuter Node convient (un petit
serveur, une machine virtuelle, un hébergeur de ce type). Il faut
seulement y reporter les réglages de `.env.local` — au minimum
`ADMIN_PASSWORD`.

**Comment publier une modification faite dans le CMS** : tu édites en
local, tu vérifies sur `localhost`, puis tu envoies le travail
(`git push`) et tu redéploies. Les fichiers modifiés par le CMS sont
dans `content/` (le texte) et `public/covers/` (les images) — ils
partent avec le reste du projet.

> **À savoir** : l'administration ouverte *en ligne* enregistre bien les
> fichiers sur le serveur, mais le site public n'affichera les
> changements qu'après une reconstruction (le contenu est cuit au
> build, ce qui rend les pages instantanées). Si tu veux que la maison
> édite directement en ligne et voie le résultat tout de suite,
> dis-le-moi : c'est une évolution que je peux faire, elle demande de
> lire le contenu au moment de la visite plutôt qu'au build.

L'aperçu public sur GitHub Pages continue de se reconstruire à chaque
`git push` — c'est une vitrine statique : l'infolettre, les
statistiques et l'administration n'y fonctionnent pas (elles demandent
un serveur), et c'est voulu.

## Étape 3 — L'infolettre (Brevo, ≈ 15 min)

Le pop-up « La lettre du Cerisier » envoie chaque adresse **directement
dans une liste Brevo** — le même outil qui sert ensuite à écrire et
envoyer les campagnes, avec un éditeur visuel et le lien de
désinscription ajouté d'office. Gratuit jusqu'à 300 courriels par jour,
service européen.

1. Sur **brevo.com**, crée un compte.
2. **Contacts → Listes** → *Créer une liste* → `La lettre du Cerisier`.
   Son **numéro** (`#2`, `#3`…) s'affiche en haut de la liste →
   c'est `BREVO_LIST_ID` (le nombre seul).
3. Ton nom (en haut à droite) → **SMTP & API** → onglet *Clés API* →
   *Générer une nouvelle clé* → c'est `BREVO_API_KEY`.
4. Pose les deux dans les réglages du site (`.env.local` en local, les
   variables d'environnement chez l'hébergeur en ligne).

**Envoyer la lettre quand paraît un livre** : Brevo → **Campagnes →
Créer une campagne e-mail** → destinataires = ta liste → compose en
glisser-déposer (couverture, deux phrases, lien vers la fiche) →
*Envoyer*. Rien à coder, jamais.

## Étape 4 — Les statistiques (rien à créer)

La fréquentation est comptée **par le site lui-même**. Chaque page lue
dépose un signal minuscule, rangé en fichiers à côté du site (dossier
`.data`, ou celui que désigne `STATS_DIR`) : jours, pages les plus lues,
pays quand le serveur le renseigne, provenances. Pas de cookies ni de
données personnelles (les visiteurs sont comptés par une empreinte
anonyme qui change chaque nuit) — donc pas de bannière de consentement.

Les chiffres se lisent **dans l'administration** : bouton
« Fréquentation » en bas à droite du CMS, ou `…/admin/stats.html`.

## Vérifier que tout marche

- Le mot de passe ouvre `…/admin/`, et le CMS montre les 253 livres.
- Une modification enregistrée dans le CMS change bien le fichier
  correspondant dans `content/`, et la page du site suit après
  rafraîchissement.
- Une inscription au pop-up apparaît dans ta liste Brevo (Contacts).
- Une visite fait monter les chiffres de « Fréquentation ».
- Sur une fiche livre, le volume se saisit et se retourne ; sans WebGL,
  la couverture classique reste en place.

## Les réglages, en une table

| Réglage | Rôle | Où le trouver |
|---|---|---|
| `ADMIN_PASSWORD` | ouvre `/admin` (CMS + statistiques) | toi |
| `SESSION_SECRET` | signe les sessions (facultatif) | une longue phrase de ton cru |
| `BREVO_API_KEY` | inscriptions à l'infolettre | Brevo → SMTP & API |
| `BREVO_LIST_ID` | numéro de la liste | Brevo → Contacts → Listes |
| `STATS_DIR` | où ranger les comptes (facultatif) | un dossier du serveur |
| `STATS_SEL` | sel des empreintes anonymes (facultatif) | une longue phrase |
