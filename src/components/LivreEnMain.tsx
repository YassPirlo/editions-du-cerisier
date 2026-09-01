"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { ContactShadows, PresentationControls } from "@react-three/drei";
import { SRGBColorSpace, TextureLoader, type Group } from "three";

/**
 * Le livre en main : la fiche produit tend l’objet réel — on le saisit, on le
 * retourne, il revient se poser de face. C’est la seule scène WebGL du site,
 * une par fiche : les rayonnages restent en CSS (cent contextes WebGL sur une
 * page de collection étoufferaient n’importe quel navigateur).
 *
 * Chargé dynamiquement, sans rendu serveur, par VitrineLivre — qui garde le
 * volume CSS en dessous tant que la scène n’a pas peint, et pour toujours si
 * WebGL manque. Ce fichier est la première (et seule) exception assumée à la
 * règle « aucune dépendance de production » : three + react-three-fiber +
 * drei, à la demande de la maison.
 */

/* Le gabarit de la maison : plats 18 × 24 (voir FluxCouvertures), l’épaisseur
   suit la pagination réelle comme epaisseurDe() côté CSS. */
const LARGEUR = 1.8;
const HAUTEUR = 2.4;
const PLAT = 0.03;

const CARTON = "#d9cbb2";
const GARDE = "#f6efe1";
const DOS = "#52412a";
const PAPIER = "#f3ecd9";

export function epaisseurVolume(pages?: string): number {
  const n = parseInt(pages ?? "", 10);
  if (!n || Number.isNaN(n)) return 0.26;
  const borne = Math.min(Math.max(n, 60), 450);
  return 0.18 + ((borne - 60) / 390) * 0.34;
}

function Volume({
  src,
  epaisseur,
  onPeint,
}: {
  src: string;
  epaisseur: number;
  onPeint?: () => void;
}) {
  /* Le réglage de la texture passe par les props percées du matériau
     (map-colorSpace, map-anisotropy) : useLoader rend un objet partagé en
     cache, qu'on ne modifie pas en plein rendu. */
  const texture = useLoader(TextureLoader, src);

  /* La texture est arrivée (useLoader a fini de suspendre) : la vitrine peut
     fondre le volume CSS vers la scène. */
  useEffect(() => {
    onPeint?.();
  }, [onPeint]);

  const demiEp = epaisseur / 2;

  return (
    <group>
      {/* Le plat de devant porte la couverture ; ses chants restent carton. */}
      <mesh position={[0.02, 0, demiEp - PLAT / 2]}>
        <boxGeometry args={[LARGEUR, HAUTEUR, PLAT]} />
        <meshStandardMaterial attach="material-0" color={CARTON} roughness={0.7} />
        <meshStandardMaterial attach="material-1" color={CARTON} roughness={0.7} />
        <meshStandardMaterial attach="material-2" color={CARTON} roughness={0.7} />
        <meshStandardMaterial attach="material-3" color={CARTON} roughness={0.7} />
        <meshStandardMaterial
          attach="material-4"
          map={texture}
          map-colorSpace={SRGBColorSpace}
          map-anisotropy={4}
          roughness={0.55}
        />
        <meshStandardMaterial attach="material-5" color={GARDE} roughness={0.9} />
      </mesh>

      {/* Le plat de derrière, papier nu. */}
      <mesh position={[0.02, 0, -(demiEp - PLAT / 2)]}>
        <boxGeometry args={[LARGEUR, HAUTEUR, PLAT]} />
        <meshStandardMaterial color={CARTON} roughness={0.75} />
      </mesh>

      {/* Le dos relie les deux plats. */}
      <mesh position={[-LARGEUR / 2 + 0.02, 0, 0]}>
        <boxGeometry args={[0.04 + 0.04, HAUTEUR, epaisseur]} />
        <meshStandardMaterial color={DOS} roughness={0.6} />
      </mesh>

      {/* La tranche : le bloc de pages, en retrait de gouttière. */}
      <mesh position={[0.03, 0, 0]}>
        <boxGeometry args={[LARGEUR - 0.09, HAUTEUR - 0.09, epaisseur - PLAT * 2]} />
        <meshStandardMaterial color={PAPIER} roughness={0.95} />
      </mesh>
    </group>
  );
}

/* La respiration du volume posé — coupée si le lecteur préfère l’immobilité
   (le glisser reste possible : c’est son geste, pas le nôtre). */
function Respiration({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  const groupe = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!active || !groupe.current) return;
    const t = clock.getElapsedTime();
    groupe.current.position.y = Math.sin(t * 0.7) * 0.04;
    groupe.current.rotation.y = Math.sin(t * 0.3) * 0.05;
  });
  return <group ref={groupe}>{children}</group>;
}

export default function LivreEnMain({
  src,
  pages,
  onPeint,
}: {
  src: string;
  pages?: string;
  onPeint?: () => void;
}) {
  const epaisseur = epaisseurVolume(pages);
  const immobile = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 4.6], fov: 30 }}
      /* Le glisser horizontal tourne le livre ; le vertical continue de faire
         défiler la page — un canvas qui confisque le défilement au pouce est
         un piège, pas une vitrine. */
      style={{ touchAction: "pan-y" }}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 4, 5]} intensity={1.5} />
      <directionalLight position={[-4, 2, -3]} intensity={0.4} />

      <Suspense fallback={null}>
        <PresentationControls
          global
          cursor
          snap
          speed={1.4}
          polar={[-0.3, 0.35]}
          azimuth={[-Math.PI / 2.2, Math.PI / 2.2]}
          rotation={[0.04, -0.28, 0]}
        >
          <Respiration active={!immobile}>
            <Volume src={src} epaisseur={epaisseur} onPeint={onPeint} />
          </Respiration>
        </PresentationControls>
        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.35}
          scale={6}
          blur={2.6}
          far={2.2}
          color="#171008"
        />
      </Suspense>
    </Canvas>
  );
}
