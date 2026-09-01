# Mise en service — hébergement, admin, infolettre, statistiques

Le site a désormais son CMS (Decap, sur `/admin/`) : le contenu vit en
Markdown dans `content/`, chaque enregistrement fait un commit, chaque
commit reconstruit le site. Ce qui reste demande un **compte Netlify à ton
nom** (je ne peux pas le créer pour toi) et quelques interrupteurs dans son
tableau de bord : c'est là que vivent l'authentification de l'admin et la
collecte de l'infolettre. Compte 30 à 45 minutes.

---

## Étape 1 — Mettre le site sur Netlify (≈ 10 min)

Netlify sert Next tel quel, et porte les services dont le site a besoin :
Identity (les comptes de l'admin), Git Gateway (le pont entre le CMS et
GitHub), et la route serveur de l'infolettre.

1. Pousse d'abord le travail sur GitHub (`git push`).
2. Sur **app.netlify.com** → *Sign up with GitHub*.
3. *Add new site → Import an existing project → GitHub* → choisis
   `editions-du-cerisier`. Les réglages proposés sont bons (le fichier
   `netlify.toml` du projet les fixe) → **Deploy**.
4. Quelques minutes plus tard le site vit sur `…netlify.app`. Branche le
   domaine (déjà créé) dans **Domain management → Add a domain** : Netlify
   affiche les enregistrements DNS à recopier chez le registrar, et le
   HTTPS suit tout seul.

## Étape 2 — L'authentification de l'admin (≈ 10 min)

**Un seul mot de passe — celui de la maison — posé dans les variables
d'environnement.** Pas de comptes, pas d'adresses, rien à activer chez
Netlify. Derrière la porte, le CMS écrit dans le dépôt avec un jeton
GitHub gardé côté serveur, remis uniquement aux sessions valides.

1. **Le jeton GitHub** (une fois) : sur github.com → *Settings →
   Developer settings → Personal access tokens → Fine-grained tokens →
   Generate new token* → *Repository access* : **Only select
   repositories** → `editions-du-cerisier` → *Permissions → Contents* :
   **Read and write** → expiration longue (1 an) → génère, **copie-le**
   (il ne s'affiche qu'une fois).
2. Dans Netlify : **Site configuration → Environment variables** →
   ajoute :
   - `ADMIN_PASSWORD` — le mot de passe de la maison ; choisis-le
     **long**, une phrase fait très bien ;
   - `GITHUB_CMS_TOKEN` — le jeton copié à l'instant ;
   - `SESSION_SECRET` — une autre longue phrase (facultatif) ;
   → *Deploys → Trigger deploy*.
3. `…/admin/` → le mot de passe → le CMS s'ouvre. Au premier passage,
   « Se connecter » ouvre une petite fenêtre qui se referme d'elle-même
   (elle remet la clé au CMS). La session tient sept jours par
   navigateur ; « Se déconnecter » est en bas à droite du CMS.

À savoir : les modifications du CMS sont committées au nom du
propriétaire du jeton. Retirer l'accès = changer `ADMIN_PASSWORD`
(et/ou révoquer le jeton sur GitHub). L'admin **en ligne** passe par le
domaine définitif (`base_url` de la configuration) : branche le domaine
à l'étape 1 avant de l'essayer.

## Étape 3 — L'infolettre (Brevo, ≈ 15 min)

Le pop-up « La lettre du Cerisier » envoie chaque adresse **directement
dans une liste Brevo** — le même outil qui sert ensuite à écrire et
envoyer les campagnes, avec un éditeur visuel et le lien de désinscription
ajouté d'office. Gratuit jusqu'à 300 courriels par jour, service européen.

1. Sur **brevo.com**, crée un compte.
2. **Contacts → Listes** → *Créer une liste* → `La lettre du Cerisier`.
   Son **numéro** (`#2`, `#3`…) s'affiche en haut de la liste →
   c'est `BREVO_LIST_ID` (le nombre seul).
3. Ton nom (en haut à droite) → **SMTP & API** → onglet *Clés API* →
   *Générer une nouvelle clé* → c'est `BREVO_API_KEY`.
4. Dans Netlify : **Site configuration → Environment variables** → ajoute
   `BREVO_API_KEY` et `BREVO_LIST_ID` → *Deploys → Trigger deploy*.
5. Dès lors, chaque inscription au pop-up apparaît dans ta liste
   (Brevo → Contacts). L'anti-robot est en place, et une adresse déjà
   inscrite ne crée pas de doublon.

**Envoyer la lettre quand paraît un livre** : Brevo → **Campagnes →
Créer une campagne e-mail** → destinataires = ta liste → compose en
glisser-déposer (couverture, deux phrases, lien vers la fiche) →
*Envoyer*. Rien à coder, jamais.

## Étape 4 — Les statistiques (maison : rien à créer)

La fréquentation est comptée **par le site lui-même** — aucun service
tiers, aucun compte à ouvrir. Chaque page lue dépose un signal minuscule
sur `/api/frequentation`, rangé dans le stockage attaché au site (les
Blobs Netlify) : jours, pages les plus lues, **pays des lecteurs**,
provenances. Pas de cookies ni de données personnelles (les visiteurs
sont comptés par une empreinte anonyme qui change chaque nuit) — donc
pas de bannière de consentement.

Les chiffres se lisent **dans ton admin** : bouton « Fréquentation » en
bas à droite du CMS, ou directement `…/admin/stats.html` — réservé aux
sessions de la maison (le même compte que l'admin).

Il n'y a rien à configurer. En option, pose une variable `STATS_SEL`
(une longue phrase quelconque) dans Netlify pour saler les empreintes
anonymes.

## Éditer le site en local (déjà prêt, aucun compte)

Deux terminaux à la racine du projet :

```bash
npm run cms-local
```

```bash
npm run dev
```

Puis ouvre `http://localhost:3000/admin/` : le CMS s'ouvre directement
(pas de mot de passe en local) et écrit dans `content/` — tu vois les
modifications sur le site local, et tu les pousses avec git quand tu es
content.

## Vérifier que tout marche

- Le mot de passe (celui des variables Netlify) ouvre `…/admin/`, et le
  CMS s'ouvre après la petite fenêtre d'autorisation.
- Une modification enregistrée dans le CMS crée un commit « Contenu : … »
  sur GitHub, et Netlify redéploie le site tout seul (2-3 min).
- Une inscription au pop-up apparaît dans ta liste Brevo (Contacts).
- Une visite du site en ligne fait monter les chiffres de
  `…/admin/stats.html` (bouton « Fréquentation » du CMS) — sans bannière
  à accepter, il n'y en a pas besoin.
- Sur une fiche livre, le volume se saisit et se retourne (WebGL) ; sans
  WebGL, la couverture CSS reste en place.
