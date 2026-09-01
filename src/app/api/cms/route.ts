import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import { jetonValide, litJetonDesCookies } from "@/lib/jeton";

/**
 * Le guichet du CMS : Decap écrit ici, et nulle part ailleurs.
 *
 * L'administration ne dépend d'aucun service extérieur — ni compte, ni
 * dépôt distant, ni fournisseur d'identité : le mot de passe de la maison
 * (ADMIN_PASSWORD) ouvre une session, et cette session autorise à lire et
 * à écrire les fichiers de contenu du projet. Decap parle le protocole
 * de son serveur de fichiers ; cette route en reprend les gestes
 * (`entriesByFolder`, `persistEntry`, `getMedia`…) au lieu de l'exiger à
 * côté.
 *
 * Après chaque écriture, les données du site sont reconstruites depuis
 * content/ (le même script qu'au build) : en développement, la page se
 * met à jour d'elle-même dans la foulée.
 *
 * Ce que cela suppose du serveur : un disque où écrire. En local, c'est
 * le dossier du projet. En ligne, il faut un hébergeur qui exécute Node
 * avec un disque persistant ; sur un hébergement figé, l'édition se fait
 * en local et se publie par un nouveau déploiement.
 */

const RACINE = process.cwd();
const executer = promisify(execFile);

/* Aucun chemin ne sort du projet : on résout, puis on vérifie. */
function cheminSur(relatif: string): string {
  const absolu = path.resolve(RACINE, relatif);
  const dedans = path.relative(RACINE, absolu);
  if (!dedans || dedans.startsWith("..") || path.isAbsolute(dedans)) {
    throw new Error("Chemin hors du projet");
  }
  return absolu;
}

const enSlash = (p: string) => p.replace(/\\/g, "/");
const empreinte = (contenu: Buffer | string) =>
  createHash("sha256").update(contenu).digest("hex");

async function listeFichiers(
  dossier: string,
  extension: string,
  profondeur: number,
): Promise<string[]> {
  const parcours = async (absolu: string, reste: number): Promise<string[]> => {
    if (reste <= 0) return [];
    let entrees;
    try {
      entrees = await fs.readdir(absolu, { withFileTypes: true });
    } catch {
      return [];
    }
    const listes = await Promise.all(
      entrees.map((e) => {
        const chemin = path.join(absolu, e.name);
        return e.isDirectory()
          ? parcours(chemin, reste - 1)
          : Promise.resolve(chemin.endsWith(extension) ? [chemin] : []);
      }),
    );
    return listes.flat();
  };
  const trouves = await parcours(cheminSur(dossier), profondeur);
  return trouves.map((f) => enSlash(path.relative(RACINE, f)));
}

async function fiches(fichiers: { path: string; label?: string }[]) {
  return Promise.all(
    fichiers.map(async (f) => {
      try {
        const contenu = await fs.readFile(cheminSur(f.path));
        return {
          data: contenu.toString("utf8"),
          file: { path: enSlash(f.path), label: f.label, id: empreinte(contenu) },
        };
      } catch {
        return { data: null, file: { path: enSlash(f.path), label: f.label, id: null } };
      }
    }),
  );
}

async function media(chemin: string) {
  const contenu = await fs.readFile(cheminSur(chemin));
  return {
    id: empreinte(contenu),
    content: contenu.toString("base64"),
    encoding: "base64",
    path: enSlash(chemin),
    name: path.basename(chemin),
  };
}

async function ecris(chemin: string, contenu: Buffer | string) {
  const absolu = cheminSur(chemin);
  await fs.mkdir(path.dirname(absolu), { recursive: true });
  await fs.writeFile(absolu, contenu);
}

async function efface(chemin: string) {
  await fs.unlink(cheminSur(chemin)).catch(() => {});
}

async function deplace(depuis: string, vers: string) {
  const source = cheminSur(depuis);
  const cible = cheminSur(vers);
  await fs.mkdir(path.dirname(cible), { recursive: true });
  await fs.rename(source, cible);
}

/* Les JSON que lit le site se refont depuis content/, par le script même
   du build : une seule vérité, jamais deux transformations à tenir
   d'accord. Un contenu qui casse la reconstruction (une collection
   inconnue, par exemple) doit se voir tout de suite — le fichier est
   écrit, mais l'éditeur est prévenu. */
async function reconstruisLesDonnees() {
  await executer(process.execPath, [path.join("scripts", "construire-donnees.mjs")], {
    cwd: RACINE,
    windowsHide: true,
  });
}

type Corps = { action?: string; params?: Record<string, unknown> };

export async function POST(request: Request) {
  if (!(await jetonValide(litJetonDesCookies(request.headers)))) {
    return Response.json(
      { error: "Session requise — repassez par la porte de l’administration." },
      { status: 401 },
    );
  }

  let corps: Corps;
  try {
    corps = await request.json();
  } catch {
    return Response.json({ error: "Requête illisible." }, { status: 400 });
  }

  const p = (corps.params ?? {}) as Record<string, never>;

  try {
    switch (corps.action) {
      case "info":
        return Response.json({
          repo: path.basename(RACINE),
          publish_modes: ["simple"],
          type: "local_fs",
        });

      case "entriesByFolder": {
        const { folder, extension, depth } = p as unknown as {
          folder: string;
          extension: string;
          depth: number;
        };
        const fichiers = await listeFichiers(folder, extension, depth);
        return Response.json(await fiches(fichiers.map((path) => ({ path }))));
      }

      case "entriesByFiles":
        return Response.json(
          await fiches((p as unknown as { files: { path: string; label?: string }[] }).files),
        );

      case "getEntry": {
        const [entree] = await fiches([{ path: (p as unknown as { path: string }).path }]);
        return Response.json(entree);
      }

      case "persistEntry": {
        const { entry, dataFiles, assets } = p as unknown as {
          entry?: { path: string; raw: string; newPath?: string };
          dataFiles?: { path: string; raw: string; newPath?: string }[];
          assets: { path: string; content: string; encoding: BufferEncoding }[];
        };
        const fichiers = dataFiles ?? (entry ? [entry] : []);
        await Promise.all(fichiers.map((f) => ecris(f.path, f.raw)));
        await Promise.all(
          assets.map((a) => ecris(a.path, Buffer.from(a.content, a.encoding))),
        );
        /* Une fiche renommée déménage : on écrit au nouveau nom, on
           retire l'ancien. */
        for (const f of fichiers) {
          if (f.newPath && f.newPath !== f.path) await deplace(f.path, f.newPath);
        }
        await reconstruisLesDonnees();
        return Response.json({ message: "entry persisted" });
      }

      case "getMedia": {
        const { mediaFolder } = p as unknown as { mediaFolder: string };
        const fichiers = await listeFichiers(mediaFolder, "", 1);
        return Response.json(await Promise.all(fichiers.map(media)));
      }

      case "getMediaFile":
        return Response.json(await media((p as unknown as { path: string }).path));

      case "persistMedia": {
        const { asset } = p as unknown as {
          asset: { path: string; content: string; encoding: BufferEncoding };
        };
        await ecris(asset.path, Buffer.from(asset.content, asset.encoding));
        return Response.json(await media(asset.path));
      }

      case "deleteFile": {
        const { path: chemin } = p as unknown as { path: string };
        await efface(chemin);
        await reconstruisLesDonnees();
        return Response.json({ message: `deleted file ${chemin}` });
      }

      case "deleteFiles": {
        const { paths } = p as unknown as { paths: string[] };
        await Promise.all(paths.map(efface));
        await reconstruisLesDonnees();
        return Response.json({ message: `deleted files ${paths.join(", ")}` });
      }

      case "getDeployPreview":
        return Response.json(null);

      default:
        return Response.json(
          { error: `Geste inconnu : ${corps.action}` },
          { status: 422 },
        );
    }
  } catch (e) {
    const detail = e instanceof Error ? e.message : "Erreur inconnue";
    console.error(`CMS — ${corps.action} : ${detail}`);
    return Response.json({ error: detail }, { status: 500 });
  }
}
