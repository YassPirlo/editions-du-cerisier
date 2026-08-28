"use client";

import { useState } from "react";
import { CONTACT } from "@/lib/nav";

const field =
  "mt-1.5 w-full rounded-lg border border-ecorce-200 bg-white px-3.5 py-2.5 text-[0.9375rem] text-ecorce-900 outline-none transition-colors placeholder:text-ecorce-300 focus:border-cerise-400 focus:ring-2 focus:ring-cerise-200";
const label = "block text-sm font-medium text-ecorce-700";

export function ContactForm({
  subjectPrefix = "Message depuis le site",
  subjects,
}: {
  subjectPrefix?: string;
  subjects?: string[];
}) {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();

    const sujet = get("sujet");
    const subject = sujet ? `${subjectPrefix} — ${sujet}` : subjectPrefix;
    const body = [
      `Nom : ${get("nom")}`,
      `Courriel : ${get("email")}`,
      get("telephone") && `Téléphone : ${get("telephone")}`,
      "",
      get("message"),
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
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

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="rounded-lg bg-ecorce-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ecorce-700"
        >
          Envoyer le message
        </button>
        <p className="text-xs text-ecorce-400">
          Le message s’ouvre dans votre logiciel de courriel.
        </p>
      </div>

      {sent && (
        <p
          role="status"
          className="rounded-lg border border-cerise-200 bg-cerise-50 px-4 py-3 text-sm text-ecorce-700"
        >
          Votre logiciel de courriel devrait s’ouvrir avec le message pré-rempli. Si
          rien ne se passe, écrivez-nous directement à{" "}
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
