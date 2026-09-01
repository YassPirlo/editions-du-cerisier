/* Rogne les marges blanches des numérisations de couvertures.
 *
 * Une partie du corpus est constituée de photos du livre posé sur fond
 * blanc : la marge (et parfois les tranches photographiées) fait partie du
 * fichier. À l'écran, elle devient un cadre blanc dans les rayonnages et un
 * placage étrange sur le volume 3D des fiches. On rogne donc le tour
 * quasi blanc de chaque image — avec un garde-fou : si le rognage
 * emporterait plus d'un cinquième d'un côté, c'est que le blanc fait
 * partie de la couverture (les Griottes à fond blanc, par exemple) et on
 * ne touche à rien.
 *
 *   node scripts/rogne-couvertures.mjs           # essai à blanc (rapport)
 *   node scripts/rogne-couvertures.mjs --applique # écrit les fichiers
 *
 * Relançable sans danger : une image déjà rognée n'a plus de marge à
 * perdre et ressort inchangée.
 */
import { readdir, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const DOSSIER = "public/covers";
/* Distance au blanc tolérée : attrape la marge et les tranches photographiées
   (gris très clair), pas les aplats de couleur. */
const SEUIL = 27;
/* En deçà de ce rapport, le rognage mange la couverture elle-même : refus. */
const GARDE = 0.78;
/* Un rognage inférieur à ce rapport ne vaut pas une réécriture du fichier. */
const NEGLIGEABLE = 0.995;

const applique = process.argv.includes("--applique");

const fichiers = (await readdir(DOSSIER)).filter((f) =>
  /\.(jpe?g|png|webp)$/i.test(f),
);

let rognees = 0;
let gardees = 0;
let intactes = 0;
const refus = [];

for (const nom of fichiers) {
  const chemin = join(DOSSIER, nom);
  const avant = await sharp(chemin).metadata();

  const essai = sharp(chemin).trim({ background: "#ffffff", threshold: SEUIL });
  const tampon = await essai.toBuffer();
  const apres = await sharp(tampon).metadata();

  const rx = apres.width / avant.width;
  const ry = apres.height / avant.height;

  if (rx < GARDE || ry < GARDE) {
    /* Trop de blanc partirait : il fait partie de la couverture. */
    gardees++;
    refus.push(`${nom} (resterait ${Math.round(rx * 100)}×${Math.round(ry * 100)} %)`);
    continue;
  }
  if (rx > NEGLIGEABLE && ry > NEGLIGEABLE) {
    intactes++;
    continue;
  }

  rognees++;
  console.log(
    `rogne ${nom} : ${avant.width}×${avant.height} → ${apres.width}×${apres.height}`,
  );
  if (applique) {
    /* Réécrit dans le format d'origine, par un fichier temporaire pour ne
       jamais laisser une image à moitié écrite. */
    const temporaire = `${chemin}.tmp`;
    const sortie = sharp(tampon);
    if (/\.jpe?g$/i.test(nom)) await sortie.jpeg({ quality: 88 }).toFile(temporaire);
    else if (/\.png$/i.test(nom)) await sortie.png().toFile(temporaire);
    else await sortie.webp({ quality: 90 }).toFile(temporaire);
    await rename(temporaire, chemin);
  }
}

console.log(
  `\n${fichiers.length} images — ${rognees} rognées${applique ? "" : " (essai à blanc)"}, ` +
    `${intactes} déjà nettes, ${gardees} gardées telles quelles (le blanc fait partie de la couverture).`,
);
if (refus.length) {
  await writeFile(
    "scripts/rognage-refus.txt",
    refus.join("\n") + "\n",
    "utf8",
  );
  console.log("Liste des refus : scripts/rognage-refus.txt");
}
