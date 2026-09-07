import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Fleuron } from "@/components/Cerisier";
import { CONTACT } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Guide d’utilisation",
  description:
    "Comment tenir le site à jour : ajouter un livre, modifier une page, envoyer l’infolettre, consulter les chiffres de fréquentation.",
  /* La page s'adresse à la maison, pas aux lecteurs : elle n'a rien à faire
     dans les résultats de recherche. Elle reste pourtant en clair, sans mot
     de passe — elle ne contient aucun secret, et un mode d'emploi qu'il faut
     déverrouiller pour le lire est un mode d'emploi qu'on ne lit pas. Elle
     est également écartée de robots.ts et absente du plan du site. */
  robots: { index: false, follow: false },
};

/* Le mode d'emploi promis au devis. Il décrit ce que l'éditrice voit à
   l'écran, pas ce que le code fait : « Livres », « Enregistrer », « Publier »
   sont les mots de Decap tels qu'ils s'affichent en français. Si un libellé
   change dans public/admin/config.yml, il doit changer ici aussi — un guide
   qui nomme des boutons disparus est pire que pas de guide. */

function Section({
  numero,
  titre,
  chapeau,
  children,
}: {
  numero: number;
  titre: string;
  chapeau: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-16 scroll-mt-8 first:mt-0" id={`section-${numero}`}>
      <div className="flex items-baseline gap-3">
        <span
          aria-hidden="true"
          className="titre-verger text-2xl text-cerise-500 sm:text-3xl"
        >
          {numero}
        </span>
        <h2 className="titre-verger text-xl text-ecorce-900 sm:text-2xl">
          {titre}
        </h2>
      </div>
      <p className="mt-3 font-serif leading-relaxed text-ecorce-600 italic">
        {chapeau}
      </p>
      <div className="mt-6 space-y-4 font-serif leading-relaxed text-ecorce-700">
        {children}
      </div>
    </section>
  );
}

/* Les gestes numérotés : la liste ordonnée porte le sens — on fait ceci,
   puis cela — et le filet à gauche tient l'ensemble comme une marge de
   cahier. */
function Etapes({ children }: { children: React.ReactNode }) {
  return (
    <ol className="ml-5 list-decimal space-y-3 border-l-2 border-cerise-200 pl-6 marker:font-sans marker:text-sm marker:text-cerise-500">
      {children}
    </ol>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-sm border-l-2 border-ecorce-300 bg-ecorce-50 px-4 py-3 text-sm text-ecorce-600">
      {children}
    </p>
  );
}

const lien =
  "underline decoration-cerise-400 decoration-2 underline-offset-2 transition-colors hover:text-griotte-500";

export default function GuidePage() {
  return (
    <>
      <PageHeader
        title="Guide d’utilisation"
        intro="Tenir le site à jour, en quatre gestes."
        breadcrumb={[{ label: "Accueil", href: "/" }]}
      />
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <div className="space-y-4 font-serif leading-relaxed text-ecorce-700">
          <p>
            Tout se fait depuis une seule adresse :{" "}
            <Link href="/admin" className={lien}>
              le tableau de bord
            </Link>
            . On s&rsquo;y connecte avec l&rsquo;adresse de courriel de la
            maison et son mot de passe — les mêmes que pour la première
            connexion, aucun autre compte à ouvrir.
          </p>
          <p>
            Une modification enregistrée met quelques minutes à paraître sur
            le site : le temps que celui-ci se reconstruise. Rien
            n&rsquo;est perdu pendant ce délai, et rien ne casse si vous
            fermez la fenêtre entre-temps.
          </p>
        </div>

        <nav aria-label="Sommaire" className="mt-10">
          <ol className="space-y-1.5 font-serif text-sm text-ecorce-600">
            {[
              "Ajouter un livre",
              "Modifier une page",
              "Envoyer l’infolettre",
              "Consulter les chiffres de fréquentation",
            ].map((t, i) => (
              <li key={t}>
                <a href={`#section-${i + 1}`} className={lien}>
                  {i + 1}. {t}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-14">
          <Section
            numero={1}
            titre="Ajouter un livre"
            chapeau="Une nouvelle parution, de la fiche vide au livre en ligne."
          >
            <Etapes>
              <li>
                Dans la colonne de gauche, cliquez sur <b>Livres</b>, puis sur{" "}
                <b>Nouveau livre</b> en haut à droite.
              </li>
              <li>
                Remplissez le <b>Titre</b>, puis choisissez la{" "}
                <b>Collection</b> : commencez à taper son nom, elle
                s&rsquo;affiche dans la liste — c&rsquo;est elle qui décide où
                le livre se range dans le catalogue.
              </li>
              <li>
                <b>Couverture</b> : glissez l&rsquo;image, ou cliquez pour la
                choisir sur votre ordinateur. Une couverture déjà envoyée se
                retrouve dans la médiathèque, inutile de la renvoyer.
              </li>
              <li>
                <b>ISBN</b>, <b>Prix</b> (écrit tel qu&rsquo;il doit
                s&rsquo;afficher, « 20 € ») et <b>Pages</b> sont facultatifs :
                un champ laissé vide ne s&rsquo;affiche simplement pas sur la
                fiche.
              </li>
              <li>
                <b>Ordre d&rsquo;affichage</b> : un nombre, du plus petit au
                plus grand. Laissez des écarts — 10, 20, 30 — pour pouvoir
                intercaler un titre plus tard sans tout renuméroter.
              </li>
              <li>
                <b>Fiche du livre</b> : le texte de présentation. Les boutons
                au-dessus du cadre suffisent (gras, italique, lien, intertitre,
                liste, citation) ; le site n&rsquo;affiche que ces
                mises&nbsp;en&nbsp;forme-là.
              </li>
              <li>
                <b>Enregistrer</b>, puis <b>Publier</b>. Le livre paraît au
                catalogue, dans sa collection, et sur la page de recherche.
              </li>
            </Etapes>
            <Note>
              La <b>Collection</b> est le seul champ dont dépend le rangement du
              livre. Si une collection manque à la liste, créez-la
              d&rsquo;abord dans <b>Collections</b> — et ne supprimez jamais une
              collection qui contient encore des livres : le site refuserait de
              se reconstruire.
            </Note>
          </Section>

          <Section
            numero={2}
            titre="Modifier une page"
            chapeau="Les textes de la maison — présentation, actualités, contact — se corrigent au même endroit."
          >
            <p>
              Chaque page du site a son entrée dans la colonne de gauche :{" "}
              <b>Présentation</b>, <b>Ligne éditoriale</b>,{" "}
              <b>Ce qu&rsquo;en dit la presse</b>,{" "}
              <b>Envoyer un manuscrit</b>, <b>Qui sommes-nous</b>,{" "}
              <b>À la une</b> et ses trois sous-pages, <b>Contact</b>,{" "}
              <b>Liens pratiques</b>. Le nom de la rubrique est celui de la
              page telle qu&rsquo;on la voit sur le site.
            </p>
            <Etapes>
              <li>
                Cliquez sur la rubrique, puis sur l&rsquo;entrée à corriger.
                Une page peut en contenir plusieurs : elles s&rsquo;affichent à
                la suite, dans l&rsquo;ordre indiqué.
              </li>
              <li>
                Corrigez le <b>Titre</b> ou le <b>Texte</b>. Pour déplacer une
                entrée dans la page, changez son{" "}
                <b>Ordre d&rsquo;affichage</b>.
              </li>
              <li>
                <b>Images</b> : la liste accepte plusieurs illustrations,
                affichées avec le texte dans l&rsquo;ordre où vous les
                rangez.
              </li>
              <li>
                <b>Enregistrer</b>, puis <b>Publier</b>.
              </li>
            </Etapes>
            <Note>
              <b>Nouveautés</b> mérite une attention : l&rsquo;ordre de ses
              entrées commande aussi le défilé des couvertures sur la page
              d&rsquo;accueil. La première entrée est la parution la plus
              récente.
            </Note>
          </Section>

          <Section
            numero={3}
            titre="Envoyer l’infolettre"
            chapeau="Le site récolte les adresses ; l’envoi, lui, se fait depuis Brevo."
          >
            <p>
              Le formulaire du site dépose chaque inscription dans le carnet
              d&rsquo;adresses tenu chez{" "}
              <a
                href="https://www.brevo.com/fr/"
                target="_blank"
                rel="noreferrer"
                className={lien}
              >
                Brevo
              </a>{" "}
              — une société française, données hébergées dans l&rsquo;Union
              européenne. Vous n&rsquo;avez rien à faire pour les recueillir :
              elles arrivent seules.
            </p>
            <Etapes>
              <li>
                Connectez-vous à Brevo avec l&rsquo;adresse de la maison.
              </li>
              <li>
                <b>Campagnes</b> → <b>Créer une campagne</b> →{" "}
                <b>Courriel</b>.
              </li>
              <li>
                Donnez un objet (c&rsquo;est ce que le lecteur lit en premier
                dans sa boîte), puis choisissez comme destinataire la liste où
                le site dépose les inscriptions — c&rsquo;est la seule que le
                formulaire alimente.
              </li>
              <li>
                Composez le message. Un lien de désinscription est ajouté
                automatiquement en bas — il est obligatoire, ne le retirez
                pas.
              </li>
              <li>
                <b>Envoyer un test</b> à votre propre adresse d&rsquo;abord ;
                relisez-le dans une vraie boîte de courriel. Puis{" "}
                <b>Envoyer</b>.
              </li>
            </Etapes>
            <Note>
              Une désinscription retire l&rsquo;adresse du carnet toute seule,
              sans rien vous demander. Une personne qui s&rsquo;inscrit deux
              fois n&rsquo;apparaît qu&rsquo;une fois : le site le sait.
            </Note>
          </Section>

          <Section
            numero={4}
            titre="Consulter les chiffres de fréquentation"
            chapeau="Savoir ce qui est lu, sans rien savoir de qui le lit."
          >
            <p>
              Les chiffres se lisent à l&rsquo;adresse{" "}
              <a href="/admin/stats.html" className={lien}>
                /admin/stats.html
              </a>
              , derrière un mot de passe distinct de celui du tableau de bord.
              Le navigateur le retient : vous ne le donnez qu&rsquo;une fois
              par appareil.
            </p>
            <p>La page montre, mois par mois :</p>
            <ul className="ml-5 list-disc space-y-1.5 marker:text-cerise-400">
              <li>
                les <b>pages les plus lues</b> — utile pour voir quel titre
                retient l&rsquo;attention ;
              </li>
              <li>
                le <b>pays</b> des lecteurs ;
              </li>
              <li>
                l&rsquo;<b>appareil</b> : ordinateur, téléphone ou tablette ;
              </li>
              <li>
                la <b>provenance</b> — le site depuis lequel on est arrivé, un
                moteur de recherche, un article, une lettre.
              </li>
            </ul>
            <Note>
              Ces chiffres n&rsquo;emploient aucun cookie et aucun service
              extérieur : c&rsquo;est le site lui-même qui compte, et
              l&rsquo;adresse IP n&rsquo;est jamais conservée. C&rsquo;est ce
              qui dispense le site de bannière de consentement — voir la page{" "}
              <Link href="/confidentialite" className={lien}>
                Confidentialité
              </Link>
              .
            </Note>
          </Section>
        </div>

        <Fleuron className="mt-16 h-8 w-24 text-ecorce-400" />

        <div className="mt-8 space-y-4 font-serif leading-relaxed text-ecorce-700">
          <h2 className="titre-verger text-xl text-ecorce-900">
            En cas de doute
          </h2>
          <p>
            Rien de ce qui se fait dans le tableau de bord n&rsquo;est
            irréparable : chaque modification est datée et conservée, et une
            version précédente peut toujours être rétablie. En cas de doute,
            enregistrez sans publier — le texte vous attend.
          </p>
          <p>
            Pour le reste, écrivez à{" "}
            <a href={`mailto:${CONTACT.email}`} className={lien}>
              {CONTACT.email}
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
}
