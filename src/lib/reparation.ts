/**
 * Répare les dégâts de l'extraction SPIP, à la lecture des données.
 *
 * Les JSON de src/data sont la seule copie du site d'origine depuis sa mise
 * hors ligne : on ne les corrige pas sur place, on les garde tels quels et on
 * répare ici, à la frontière. Le jour où les champs dérivés seront recalculés
 * au build, ces fonctions déménageront avec eux sans changer de logique.
 */

/* L'extracteur a vidé les liens : le libellé est resté à côté de l'ancre
   (« <a href="…"></a> <strong>Titre</strong> »). Sur les 141 ancres vides du
   corpus, 137 suivent exactement ce motif : on replace le libellé dans
   l'ancre, ce qui rend au lien son texte d'origine sans toucher un mot du
   contenu. Le libellé ne doit pas contenir de <strong> imbriqué (deux cas
   dans le corpus) : on l'exclut du motif plutôt que de produire du HTML
   déséquilibré. */
const ANCRE_VIDE_PUIS_LIBELLE =
  /<a\s([^>]*)>\s*<\/a>\s*<strong>((?:(?!<\/?strong)[\s\S])*?)<\/strong>/g;

/* Les ancres restées vides après la première passe (libellé perdu, ou séparé
   par un paragraphe : quatre cas) affichent leur propre adresse — une URL
   visible vaut mieux qu'un lien de zéro pixel. */
const ANCRE_ENCORE_VIDE = /<a\s([^>]*?)href="([^"]+)"([^>]*)>\s*<\/a>/g;

export function repareAncresVides(html: string): string {
  return html
    .replace(ANCRE_VIDE_PUIS_LIBELLE, "<a $1><strong>$2</strong></a>")
    .replace(ANCRE_ENCORE_VIDE, '<a $1href="$2"$3>$2</a>');
}
