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

C'est la partie qui donne à la maison un accès `/admin/` par **courriel +
mot de passe, sur invitation seulement** — sans compte GitHub, sans rien
d'autre à connaître.

Dans le tableau de bord Netlify de ton site :

1. **Integrations → Identity** (ou *Site configuration → Identity*) →
   **Enable Identity**.
2. Toujours dans Identity : **Registration** → choisis **Invite only** —
   personne ne peut se créer un compte tout seul.
3. Plus bas : **Services → Git Gateway** → **Enable Git Gateway**. C'est le
   pont qui permet au CMS d'écrire dans le dépôt au nom de l'éditeur, sans
   qu'il ait de compte GitHub.
4. Onglet **Identity** (en haut) → **Invite users** → l'adresse de la
   maison (et la tienne pour essayer).
5. La personne invitée reçoit un courriel « You've been invited to join… »
   → clique **Accept the invite** → elle arrive sur le site, qui la
   reconduit sur `/admin/` (c'est le rôle de `AccesIdentite.tsx`) → elle
   choisit son mot de passe → le CMS s'ouvre.

L'écran de connexion est le nôtre (pas la fenêtre standard de Netlify) :
en français, aux couleurs de la maison, et il **impose un mot de passe
fort** au moment où chacun le choisit — douze caractères au moins, une
minuscule, une majuscule, un chiffre, un caractère spécial (vérifié par
regex, liste des exigences qui s'allume en tapant), et jamais l'adresse de
courriel dedans. Chaque accès est lié à une adresse invitée ; « Mot de
passe oublié ? » renvoie un lien de renouvellement, soumis aux mêmes
règles.

Ensuite, l'entrée se fait toujours par `…/admin/` → adresse + mot de
passe. Retirer un accès : Identity → la personne → *Delete user*.

> Si Netlify affichait Identity comme indisponible sur les nouveaux sites
> (le service est ancien chez eux), dis-le-moi : je brancherais alors le
> CMS sur l'authentification GitHub à la place — dix minutes de travail.

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

## Étape 4 — Les statistiques (Umami, sans Google, ≈ 10 min)

Umami compte les visiteurs **sans cookies et sans données personnelles** :
pas de compte Google, pas de bannière de consentement à infliger aux
lecteurs — et un tableau de bord simple avec pages lues, provenance et
**carte des pays**. Gratuit jusqu'à 100 000 événements par mois (des ordres
de grandeur au-dessus du besoin).

1. Sur **cloud.umami.is** → *Sign up* (adresse + mot de passe, c'est tout).
2. **Add website** → nom `Éditions du Cerisier`, domaine
   `editions-du-cerisier.be` → le site reçoit un **Website ID** (une longue
   référence) — copie-le.
3. Dans Netlify : **Site configuration → Environment variables** → ajoute
   `NEXT_PUBLIC_UMAMI_ID` = ce Website ID → *Deploys → Trigger deploy*.
4. C'est tout. Les chiffres tombent dans le tableau de bord de
   cloud.umami.is (vue *Realtime* pour vérifier tout de suite). Seul le
   vrai domaine est compté — tes essais locaux ne polluent pas les
   statistiques.

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

- L'invitation reçue par courriel mène bien à la création du mot de passe,
  puis au CMS sur `/admin/`.
- Une modification enregistrée dans le CMS crée un commit « Contenu : … »
  sur GitHub, et Netlify redéploie le site tout seul (2-3 min).
- Une inscription au pop-up apparaît dans ta liste Brevo (Contacts).
- Une visite du site en ligne apparaît dans le tableau de bord Umami
  (*Realtime*) — sans bannière à accepter, il n'y en a plus.
- Sur une fiche livre, le volume se saisit et se retourne (WebGL) ; sans
  WebGL, la couverture CSS reste en place.
