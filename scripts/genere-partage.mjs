/* Compose public/partage.png : la carte de partage des réseaux sociaux,
   sur l'encre de la maison — or, papier, deux cerises pendues au filet.
   À relancer si l'identité graphique bouge : node scripts/genere-partage.mjs */
import sharp from "sharp";

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#171008" />
  <rect width="1200" height="10" fill="#ffc107" />
  <rect y="620" width="1200" height="10" fill="#ffc107" />

  <!-- Les cerises pendues au filet d'or -->
  <path d="M920 10 C 916 70, 905 105, 893 138" stroke="#8b6f47" stroke-width="5" fill="none" stroke-linecap="round" />
  <path d="M938 10 C 950 80, 962 115, 972 152" stroke="#8b6f47" stroke-width="5" fill="none" stroke-linecap="round" />
  <circle cx="890" cy="160" r="26" fill="#a5112b" />
  <circle cx="881" cy="151" r="7" fill="#e4566b" opacity="0.75" />
  <circle cx="976" cy="176" r="21" fill="#c2183a" />
  <circle cx="969" cy="169" r="5.5" fill="#e4566b" opacity="0.75" />

  <text x="600" y="268" text-anchor="middle" font-family="Georgia, serif" font-size="34" letter-spacing="16" fill="#ffc107">ÉDITIONS DU</text>
  <text x="600" y="408" text-anchor="middle" font-family="Georgia, serif" font-size="150" fill="#fdf8f5">Cerisier</text>
  <text x="600" y="492" text-anchor="middle" font-family="Georgia, serif" font-size="29" font-style="italic" fill="#ddbdb1">Maison d’édition coopérative — Cuesmes, depuis 1985</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile("public/partage.png");
console.log("public/partage.png généré");
