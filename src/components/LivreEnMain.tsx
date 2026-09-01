"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { SRGBColorSpace, TextureLoader, type Group } from "three";

/**
 * Le livre en main : la fiche produit tend l’objet réel — on le saisit, on
 * le retourne, il revient se poser de face. C’est la seule scène WebGL du
 * site, une par fiche : les rayonnages restent en CSS (cent contextes
 * WebGL sur une page de collection étoufferaient n’importe quel
 * navigateur).
 *
 * La boucle de rendu est « à la demande » : au repos, pas une image n’est
 * calculée — la carte graphique ne travaille que pendant le geste et le
 * retour élastique, calculés maison (un amorti dans useFrame qui
 * redemande une image tant qu’il n’est pas posé). C’est ce qui évite de
 * disputer le processeur au défilement de la page.
 *
 * Chargé dynamiquement, sans rendu serveur, par VitrineLivre — qui garde
 * le volume CSS en dessous tant que la scène n’a pas peint, et pour
 * toujours si WebGL manque.
 */

/* La hauteur du volume est fixe ; la largeur du plat suit le ratio réel de
   la couverture chargée (borné aux proportions plausibles d’un livre) —
   ni étirement, ni liseré. L’épaisseur suit la pagination réelle, comme
   epaisseurDe() côté CSS. */
const HAUTEUR = 2.4;
const PLAT = 0.03;

/* La pose de présentation, légèrement de trois quarts. */
const POSE_X = 0.04;
const POSE_Y = -0.28;

const CARTON = "#d9cbb2";
const GARDE = "#f6efe1";
const DOS = "#52412a";
const PAPIER = "#f3ecd9";

export function epaisseurVolume(pages?: string): number {
  const n = parseInt(pages ?? "", 10);
  if (!n || Number.isNaN(n)) return 0.26;
  const borne = Math.min(Math.max(n, 60), 450);
  return 0.15 + ((borne - 60) / 390) * 0.47;
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

  /* Le plat au ratio réel de la couverture : la texture s'y pose telle
     quelle, sans étirement. */
  const image = texture.image as { width?: number; height?: number } | undefined;
  const ratio =
    image?.width && image?.height ? image.width / image.height : 0.75;
  const largeur = HAUTEUR * Math.min(0.85, Math.max(0.62, ratio));

  const demiEp = epaisseur / 2;

  return (
    <group>
      {/* Le plat de devant porte la couverture ; ses chants restent carton. */}
      <mesh position={[0.02, 0, demiEp - PLAT / 2]}>
        <boxGeometry args={[largeur, HAUTEUR, PLAT]} />
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
        <boxGeometry args={[largeur, HAUTEUR, PLAT]} />
        <meshStandardMaterial color={CARTON} roughness={0.75} />
      </mesh>

      {/* Le dos relie les deux plats. */}
      <mesh position={[-largeur / 2 + 0.02, 0, 0]}>
        <boxGeometry args={[0.08, HAUTEUR, epaisseur]} />
        <meshStandardMaterial color={DOS} roughness={0.6} />
      </mesh>

      {/* La tranche : le bloc de pages, en retrait de gouttière. */}
      <mesh position={[0.03, 0, 0]}>
        <boxGeometry args={[largeur - 0.09, HAUTEUR - 0.09, epaisseur - PLAT * 2]} />
        <meshStandardMaterial color={PAPIER} roughness={0.95} />
      </mesh>
    </group>
  );
}

/* La prise en main : le glisser horizontal tourne le livre, le relâcher le
   laisse revenir se poser — un amorti qui ne demande des images que tant
   que le volume bouge. */
function PriseEnMain({ children }: { children: React.ReactNode }) {
  const groupe = useRef<Group>(null);
  const { gl, invalidate } = useThree();
  const cible = useRef(0);
  const dernierX = useRef<number | null>(null);

  useEffect(() => {
    const toile = gl.domElement;

    const prend = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      dernierX.current = e.clientX;
      toile.setPointerCapture(e.pointerId);
    };
    const tourne = (e: PointerEvent) => {
      if (dernierX.current === null) return;
      cible.current = Math.max(
        -1.35,
        Math.min(1.35, cible.current + (e.clientX - dernierX.current) * 0.012),
      );
      dernierX.current = e.clientX;
      invalidate();
    };
    const repose = () => {
      if (dernierX.current === null) return;
      dernierX.current = null;
      cible.current = 0;
      invalidate();
    };

    toile.addEventListener("pointerdown", prend);
    toile.addEventListener("pointermove", tourne);
    toile.addEventListener("pointerup", repose);
    toile.addEventListener("pointercancel", repose);
    return () => {
      toile.removeEventListener("pointerdown", prend);
      toile.removeEventListener("pointermove", tourne);
      toile.removeEventListener("pointerup", repose);
      toile.removeEventListener("pointercancel", repose);
    };
  }, [gl, invalidate]);

  useFrame((_, dt) => {
    const g = groupe.current;
    if (!g) return;
    const but = POSE_Y + cible.current;
    const ecart = but - g.rotation.y;
    if (Math.abs(ecart) < 0.0005) return;
    g.rotation.y += ecart * Math.min(1, dt * 7);
    invalidate();
  });

  return (
    <group ref={groupe} rotation={[POSE_X, POSE_Y, 0]}>
      {children}
    </group>
  );
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

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.5]}
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
        <PriseEnMain>
          <Volume src={src} epaisseur={epaisseur} onPeint={onPeint} />
        </PriseEnMain>
        {/* frames={1} : l'ombre se calcule une fois pour toutes — le livre
            tourne sur place, elle n'a pas de raison de bouger. */}
        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.35}
          scale={6}
          blur={2.6}
          far={2.2}
          frames={1}
          color="#171008"
        />
      </Suspense>
    </Canvas>
  );
}
