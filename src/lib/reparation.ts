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

/* Deux dégâts distincts sur les ISBN, tous deux vérifiables par la clé de
   contrôle — on ne corrige que ce que l'arithmétique confirme :

   – onze ISBN-13 ont avalé le nombre voisin de la fiche, prix ou pagination
     (« 9782872672455-13 ») : on ne garde les treize chiffres que si leur clé
     est valide. Elle l'est pour les onze.

   – treize ISBN-10 d'avant 2007 ont perdu leur dernier caractère… parce que
     c'était un X : l'extracteur ne retenait que chiffres et tirets. La clé
     recalculée (modulo 11) retombe sur X pour chacun des treize, ce qui
     confirme le diagnostic.

   Les deux ISBN-10 du catalogue dont la clé imprimée est fausse à la source
   restent tels quels : ce site recopie, il n'invente pas. */
const cleIsbn13Valide = (treize: string) => {
  let somme = 0;
  for (let i = 0; i < 12; i++) somme += Number(treize[i]) * (i % 2 ? 3 : 1);
  return (10 - (somme % 10)) % 10 === Number(treize[12]);
};

const cleIsbn10 = (neuf: string) => {
  let somme = 0;
  for (let i = 0; i < 9; i++) somme += Number(neuf[i]) * (10 - i);
  const cle = (11 - (somme % 11)) % 11;
  return cle === 10 ? "X" : String(cle);
};

export function nettoieIsbn(isbn: string): string {
  const colle = isbn.match(/^(\d{13})-\d+$/);
  if (colle && cleIsbn13Valide(colle[1])) return colle[1];
  if (/^\d-\d{5}-\d{3}$/.test(isbn)) {
    return `${isbn}-${cleIsbn10(isbn.replace(/-/g, ""))}`;
  }
  return isbn;
}
