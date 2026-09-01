"use client";

import { useEffect } from "react";

/**
 * Le raccord Netlify Identity : les courriels d'invitation, de confirmation
 * et de récupération envoyés par Netlify pointent vers la racine du site,
 * avec le jeton dans le fragment (#invite_token=…). Le widget qui sait quoi
 * en faire n'est chargé que sur /admin/ — on y reconduit donc le porteur du
 * jeton, fragment compris, au lieu de le laisser devant une page d'accueil
 * qui n'en fera rien. Aucun coût pour les autres visiteurs : pas de widget
 * chargé ici, un simple coup d'œil au fragment.
 */
const JETONS_IDENTITE =
  /^#(invite_token|confirmation_token|recovery_token|email_change_token)=/;

export function AccesIdentite() {
  useEffect(() => {
    if (JETONS_IDENTITE.test(window.location.hash)) {
      window.location.replace(`/admin/${window.location.hash}`);
    }
  }, []);
  return null;
}
