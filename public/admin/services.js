/* Où l'administration va chercher les chiffres de fréquentation.
 *
 * Les pages de /admin sont des fichiers plats : elles ne passent pas par la
 * construction du site et ne connaissent donc pas les variables
 * d'environnement. Cette adresse-ci se règle donc à la main, une fois, au
 * moment de la mise en ligne.
 *
 * — En développement, Next répond lui-même : « /api/frequentation ».
 * — Une fois le site exporté, c'est le script posé chez l'hébergeur, par
 *   exemple « /services/frequentation.php ».
 */
window.POINT_FREQUENTATION = "/api/frequentation";
