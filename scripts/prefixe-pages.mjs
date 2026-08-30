/* GitHub Pages sert l'aperçu sous « /editions-du-cerisier », mais les chemins
   stockés dans les données commencent à la racine (« /covers/… »,
   « /documents/… ») : basePath ne réécrit ni les src de next/image ni les
   href écrits en dur. On préfixe donc l'export après coup, plutôt que de
   polluer les composants avec une préoccupation d'hébergement.

   On traite les .html et les .txt : Next range dans les .txt la charge utile
   React des navigations côté client — sans eux, les couvertures casseraient
   au premier clic. Le remplacement se fait sur « "/covers/ » avec le
   guillemet : les URL absolues (https://…be/covers/…) ne sont pas touchées,
   et la forme échappée de la charge utile (\"/covers/…) l'est aussi, le
   guillemet étant le même. */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [dossier, base] = process.argv.slice(2);
if (!dossier || !base) {
  console.error("usage : node scripts/prefixe-pages.mjs <dossier-export> <base>");
  process.exit(1);
}

const fichiers = [];
(function parcourt(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) parcourt(p);
    else if (e.name.endsWith(".html") || e.name.endsWith(".txt")) fichiers.push(p);
  }
})(dossier);

let touches = 0;
for (const f of fichiers) {
  const avant = readFileSync(f, "utf8");
  const apres = avant
    .replaceAll('"/covers/', `"${base}/covers/`)
    .replaceAll('"/documents/', `"${base}/documents/`);
  if (apres !== avant) {
    writeFileSync(f, apres);
    touches++;
  }
}
console.log(`${fichiers.length} fichiers examinés, ${touches} préfixés vers ${base}`);
