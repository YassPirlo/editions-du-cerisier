import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Fleuron } from "@/components/Cerisier";
import { CONTACT } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Confidentialité",
  description:
    "Ce que le site des Éditions du Cerisier fait — et surtout ne fait pas — de vos données : infolettre, commandes, mesure de fréquentation sans cookie.",
  alternates: { canonical: "/confidentialite" },
};

/* La page dit ce que le site fait vraiment, rien de plus : chaque section
   correspond à un mécanisme du code (infolettre → /api/infolettre et Brevo,
   fréquentation → /api/frequentation, appareil → localStorage). Si un
   mécanisme change, cette page doit changer avec lui. */

const DERNIERE_MISE_A_JOUR = "1er septembre 2026";

function Section({
  titre,
  children,
}: {
  titre: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12 first:mt-0">
      <h2 className="titre-verger text-xl text-ecorce-900 sm:text-2xl">
        {titre}
      </h2>
      <div className="mt-4 space-y-4 font-serif leading-relaxed text-ecorce-700">
        {children}
      </div>
    </section>
  );
}

export default function ConfidentialitePage() {
  return (
    <>
      <PageHeader
        title="Confidentialité"
        intro="Ce que ce site fait — et surtout ne fait pas — de vos données."
        breadcrumb={[{ label: "Accueil", href: "/" }]}
      />
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <Section titre="En deux mots">
          <p>
            Ce site ne dépose aucun cookie, n&rsquo;affiche aucune publicité et
            ne confie votre navigation à aucune régie. Les seules données
            personnelles qu&rsquo;il touche sont celles que vous lui donnez
            vous-même : une adresse de courriel pour l&rsquo;infolettre, ou les
            coordonnées d&rsquo;une commande passée par courriel.
          </p>
        </Section>

        <Section titre="Qui est responsable">
          <p>
            {CONTACT.name}, société coopérative
            <br />
            {CONTACT.street}, {CONTACT.city}, {CONTACT.country}
            <br />
            <a
              href={`mailto:${CONTACT.email}`}
              className="underline decoration-cerise-400 decoration-2 underline-offset-2 transition-colors hover:text-griotte-500"
            >
              {CONTACT.email}
            </a>{" "}
            — Tél./Fax {CONTACT.phone}
          </p>
        </Section>

        <Section titre="L’infolettre">
          <p>
            Si vous vous inscrivez à la lettre du Cerisier, votre adresse de
            courriel est conservée dans le carnet d&rsquo;adresses de la maison,
            tenu chez{" "}
            <a
              href="https://www.brevo.com/fr/"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-cerise-400 decoration-2 underline-offset-2 transition-colors hover:text-griotte-500"
            >
              Brevo
            </a>{" "}
            (société française, données hébergées dans l&rsquo;Union
            européenne), qui n&rsquo;en fait aucun autre usage. Elle ne sert
            qu&rsquo;à vous annoncer les parutions et rencontres — quelques
            envois par an — et n&rsquo;est jamais cédée ni vendue.
          </p>
          <p>
            Chaque envoi contient un lien de désinscription ; un mot à{" "}
            <a
              href={`mailto:${CONTACT.email}`}
              className="underline decoration-cerise-400 decoration-2 underline-offset-2 transition-colors hover:text-griotte-500"
            >
              {CONTACT.email}
            </a>{" "}
            fait aussi bien. À la désinscription, l&rsquo;adresse est retirée du
            carnet.
          </p>
        </Section>

        <Section titre="Les commandes">
          <p>
            Les commandes se passent par courriel, depuis votre propre
            messagerie : le site prépare la lettre, mais ne voit ni
            n&rsquo;enregistre rien. Les coordonnées que vous joignez à votre
            commande (nom, adresse de livraison) ne servent qu&rsquo;à
            l&rsquo;expédier et à la facturer.
          </p>
        </Section>

        <Section titre="Ce qui reste sur votre appareil">
          <p>
            Le panier et le fait d&rsquo;avoir déjà vu l&rsquo;invitation à
            l&rsquo;infolettre sont retenus dans la mémoire locale de votre
            navigateur (<i>localStorage</i>), sur votre appareil uniquement.
            Rien de tout cela n&rsquo;est transmis au site ni à quiconque, et
            tout s&rsquo;efface avec les données de navigation.
          </p>
        </Section>

        <Section titre="La mesure de fréquentation">
          <p>
            Le site compte ses lecteurs lui-même, sans service tiers et sans
            cookie : à chaque page lue, il retient le chemin de la page, le
            site de provenance, le pays et le jour. Pour distinguer les
            visiteurs sans les reconnaître, il calcule une empreinte anonyme à
            sens unique qui change chaque jour — impossible de suivre qui que
            ce soit d&rsquo;un jour à l&rsquo;autre, et l&rsquo;adresse IP
            n&rsquo;est jamais conservée. C&rsquo;est ce qui dispense le site
            de bannière de consentement.
          </p>
        </Section>

        <Section titre="L’hébergement">
          <p>
            Le site est servi par Netlify, qui tient — comme tout hébergeur —
            des journaux techniques de courte durée (adresses IP des requêtes)
            à seule fin de sécurité et de bon fonctionnement.
          </p>
        </Section>

        <Section titre="Vos droits">
          <p>
            Vous pouvez à tout moment demander l&rsquo;accès aux données qui
            vous concernent, leur rectification ou leur effacement, ou vous
            opposer à leur traitement : écrivez à{" "}
            <a
              href={`mailto:${CONTACT.email}`}
              className="underline decoration-cerise-400 decoration-2 underline-offset-2 transition-colors hover:text-griotte-500"
            >
              {CONTACT.email}
            </a>{" "}
            ou par la poste à l&rsquo;adresse ci-dessus. Si vous estimez que
            vos droits ne sont pas respectés, vous pouvez saisir l&rsquo;
            <a
              href="https://www.autoriteprotectiondonnees.be/"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-cerise-400 decoration-2 underline-offset-2 transition-colors hover:text-griotte-500"
            >
              Autorité de protection des données
            </a>
            .
          </p>
          <p className="text-sm text-ecorce-500">
            Dernière mise à jour : {DERNIERE_MISE_A_JOUR}.
          </p>
        </Section>

        <Fleuron className="mt-14 h-8 w-24 text-ecorce-400" />

        <p className="mt-8">
          <Link
            href="/contact"
            className="font-serif text-sm text-ecorce-600 underline decoration-cerise-400 decoration-2 underline-offset-4 transition-colors hover:text-griotte-500"
          >
            Une question ? La page Contact →
          </Link>
        </p>
      </div>
    </>
  );
}
