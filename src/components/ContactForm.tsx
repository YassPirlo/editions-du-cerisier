"use client";

import { useState } from "react";
import { versGmail, versMailto } from "@/lib/courriel";
import { CONTACT } from "@/lib/nav";

const field =
  "mt-1.5 w-full rounded-lg border border-ecorce-200 bg-white px-3.5 py-2.5 text-[0.9375rem] text-ecorce-900 outline-none transition-colors placeholder:text-ecorce-300 focus:border-cerise-400 focus:ring-2 focus:ring-cerise-200";
const label = "block text-sm font-medium text-ecorce-700";

/* Les enseignes des deux messageries, redessinées à l'économie — juste ce
   qu'il faut de silhouette pour être reconnues d'un coup d'œil. La classe
   icone-marque les fait passer au gris avec l'édition noir et blanc :
   leurs couleurs sont en dur, les jetons ne les rattrapent pas. */
function IconeOutlook() {
  return (
    <svg viewBox="0 0 24 24" className="icone-marque h-4 w-4 shrink-0" aria-hidden="true">
      <path fill="#28a8ea" d="M9 5h13l-6.5 4.7Z" />
      <path fill="#0078d4" d="M9 7.2 15.5 11 22 7.2V17a1.6 1.6 0 0 1-1.6 1.6H9Z" />
      <rect x="1" y="4.4" width="12.6" height="15.2" rx="1.4" fill="#0f6cbd" />
      <circle cx="7.3" cy="12" r="3.1" fill="none" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}

function IconeGmail() {
  return (
    <svg viewBox="0 0 48 36" className="icone-marque h-3.5 w-auto shrink-0" aria-hidden="true">
      <path fill="#4285f4" d="M3.3 36h7.4V17.8L0 9.8v22.9C0 34.5 1.5 36 3.3 36Z" />
      <path fill="#34a853" d="M37.3 36h7.4c1.8 0 3.3-1.5 3.3-3.3V9.8l-10.7 8Z" />
      <path fill="#fbbc04" d="M37.3 3.3v14.5L48 9.8V5c0-4.1-4.7-6.4-8-4Z" />
      <path fill="#ea4335" d="M10.7 17.8V3.3L24 13.2 37.3 3.3v14.5L24 27.7Z" />
      <path fill="#c5221f" d="M0 5v4.8l10.7 8V3.3L8 1C4.7-1.4 0 .9 0 5Z" />
    </svg>
  );
}

export function ContactForm({
  subjectPrefix = "Message depuis le site",
  subjects,
}: {
  subjectPrefix?: string;
  subjects?: string[];
}) {
  /* Le canal du dernier envoi : le mot de confirmation n'est pas le même
     selon qu'un logiciel s'est ouvert ou qu'un onglet Gmail est apparu. */
  const [envoye, setEnvoye] = useState<"logiciel" | "gmail" | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();

    const sujet = get("sujet");
    const subject = sujet ? `${subjectPrefix} — ${sujet}` : subjectPrefix;
    /* L'en-tête d'abord, la ligne d'air ensuite : elle sépare les
       coordonnées du message dans le courriel — hors du filtre, sinon la
       chaîne vide s'y fait avaler. */
    const entete = [
      `Nom : ${get("nom")}`,
      `Courriel : ${get("email")}`,
      get("telephone") && `Téléphone : ${get("telephone")}`,
    ].filter(Boolean);
    const body = [...entete, "", get("message")].join("\n");

    /* Le bouton pressé décide du chemin : les deux soumettent le même
       formulaire, seul le canal diffère. */
    const canal =
      ((e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null)
        ?.value === "gmail"
        ? "gmail"
        : "logiciel";

    if (canal === "gmail") {
      window.open(versGmail(CONTACT.email, subject, body), "_blank", "noopener");
    } else {
      window.location.href = versMailto(CONTACT.email, subject, body);
    }
    setEnvoye(canal);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="nom" className={label}>
            Nom et prénom <span className="text-cerise-600">*</span>
          </label>
          <input id="nom" name="nom" required autoComplete="name" className={field} />
        </div>
        <div>
          <label htmlFor="email" className={label}>
            Courriel <span className="text-cerise-600">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={field}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="telephone" className={label}>
            Téléphone
          </label>
          <input
            id="telephone"
            name="telephone"
            type="tel"
            autoComplete="tel"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="sujet" className={label}>
            Sujet
          </label>
          {subjects ? (
            <select id="sujet" name="sujet" defaultValue={subjects[0]} className={field}>
              {subjects.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          ) : (
            <input id="sujet" name="sujet" className={field} />
          )}
        </div>
      </div>

      <div>
        <label htmlFor="message" className={label}>
          Message <span className="text-cerise-600">*</span>
        </label>
        <textarea id="message" name="message" required rows={7} className={field} />
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            name="canal"
            value="logiciel"
            className="inline-flex items-center gap-2.5 rounded-lg bg-ecorce-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-ecorce-700"
          >
            <IconeOutlook />
            Envoyer via Outlook
          </button>
          <button
            type="submit"
            name="canal"
            value="gmail"
            className="inline-flex items-center gap-2.5 rounded-lg border border-ecorce-200 bg-white px-5 py-3 text-sm font-semibold text-ecorce-900 transition-colors hover:border-cerise-400 hover:bg-cerise-50"
          >
            <IconeGmail />
            Envoyer via Gmail
          </button>
        </div>
        <p className="mt-2.5 text-xs text-ecorce-400">
          Outlook ouvre votre logiciel de courriel ; Gmail, un onglet dans le
          navigateur.
        </p>
      </div>

      {envoye && (
        <p
          role="status"
          className="rounded-lg border border-cerise-200 bg-cerise-50 px-4 py-3 text-sm text-ecorce-700"
        >
          {envoye === "gmail"
            ? "Gmail s’est ouvert dans un onglet avec le message pré-rempli. Si rien ne s’est passé, écrivez-nous directement à "
            : "Votre logiciel de courriel devrait s’ouvrir avec le message pré-rempli. Si rien ne se passe, écrivez-nous directement à "}
          <a
            href={`mailto:${CONTACT.email}`}
            className="font-semibold underline decoration-cerise-400 decoration-2 underline-offset-2"
          >
            {CONTACT.email}
          </a>
          .
        </p>
      )}
    </form>
  );
}
