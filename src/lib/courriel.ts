/**
 * Composer un message dans la messagerie du lecteur — deux chemins pour
 * la même lettre : le logiciel installé sur la machine (mailto : Outlook,
 * Mail, Thunderbird…) et Gmail dans un onglet du navigateur. Servent au
 * panier comme au formulaire de contact.
 */

export const versMailto = (destinataire: string, sujet: string, corps: string) =>
  `mailto:${destinataire}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;

export const versGmail = (destinataire: string, sujet: string, corps: string) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(destinataire)}&su=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;
