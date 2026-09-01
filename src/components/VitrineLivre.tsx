"use client";

import { Component, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { epaisseurDe, Livre3D } from "./Livre3D";

/**
 * La vitrine de la fiche livre : le volume CSS d’abord — c’est lui qui est
 * dans le HTML généré, visible avant tout JavaScript — puis, quand la scène
 * WebGL a chargé sa couverture, le vrai livre en main fond par-dessus et
 * prend les gestes. Sans couverture, sans WebGL ou en cas d’accroc, le
 * volume CSS reste : personne ne voit jamais un trou.
 */

const LivreEnMain = dynamic(() => import("./LivreEnMain"), {
  ssr: false,
  loading: () => null,
});

/* Un canvas peut échouer sans prévenir poliment (WebGL coupé, pilote
   récalcitrant) : la barrière rend alors le néant, et le volume CSS qui vit
   en dessous continue de faire l’affiche. */
class BarriereScene extends Component<
  { children: ReactNode },
  { casse: boolean }
> {
  state = { casse: false };
  static getDerivedStateFromError() {
    return { casse: true };
  }
  render() {
    return this.state.casse ? null : this.props.children;
  }
}

export function VitrineLivre({
  src,
  srcTexture,
  titre,
  collection,
  pages,
  sizes,
}: {
  /** La couverture telle que la sert next/image (volume CSS). */
  src: string | null;
  /** La même, préfixée pour l’aperçu statique — la scène la charge en texture. */
  srcTexture: string | null;
  titre: string;
  collection?: string;
  pages?: string;
  sizes?: string;
}) {
  const [peint, setPeint] = useState(false);

  /* Sans couverture, pas de volume à tendre : la reliure muette CSS suffit. */
  if (!src || !srcTexture) {
    return (
      <Livre3D
        src={src}
        titre={titre}
        collection={collection}
        sizes={sizes}
        epaisseur={epaisseurDe(pages)}
      />
    );
  }

  return (
    <div>
      <div className="relative">
        <div
          aria-hidden={peint || undefined}
          className={`transition-opacity duration-500 ${peint ? "opacity-0" : "opacity-100"}`}
        >
          <Livre3D
            src={src}
            titre={titre}
            collection={collection}
            sizes={sizes}
            epaisseur={epaisseurDe(pages)}
          />
        </div>
        <div
          role="img"
          aria-label={`Couverture de « ${titre} » en volume — cliquer-glisser pour retourner le livre`}
          className={`absolute -inset-x-8 -inset-y-6 cursor-grab transition-opacity duration-500 active:cursor-grabbing ${
            peint ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <BarriereScene>
            <LivreEnMain
              src={srcTexture}
              pages={pages}
              onPeint={() => setPeint(true)}
            />
          </BarriereScene>
        </div>
      </div>
      {/* mt-9 : la scène déborde du cadre d'un bon pouce (-inset-y-6) — le
          libellé doit se poser dessous, pas dessous le livre. */}
      <p
        aria-hidden="true"
        className={`mt-9 text-center text-xs text-ecorce-500 transition-opacity duration-500 ${
          peint ? "opacity-100" : "opacity-0"
        }`}
      >
        Saisissez le livre pour le retourner
      </p>
    </div>
  );
}
