import React from "react";

import { LegalPage } from "@/components/LegalPage";

export default function ImpressumScreen() {
  return (
    <LegalPage
      title="Impressum"
      intro="Angaben gemäß § 5 TMG"
      sections={[
        {
          heading: "Anbieter",
          body: "SielGuide UG (haftungsbeschränkt)\nMusterstraße 1\n26409 Carolinensiel\nDeutschland",
        },
        {
          heading: "Vertreten durch",
          body: "Geschäftsführung: Max Mustermann",
        },
        {
          heading: "Kontakt",
          body: "Telefon: +49 4464 000000\nE-Mail: kontakt@sielguide-app.example",
        },
        {
          heading: "Registereintrag",
          body: "Eintragung im Handelsregister.\nRegistergericht: Amtsgericht Aurich\nRegisternummer: HRB 00000",
        },
        {
          heading: "Umsatzsteuer-ID",
          body: "Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: DE000000000",
        },
        {
          heading: "Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV",
          body: "Max Mustermann\nMusterstraße 1, 26409 Carolinensiel",
        },
        {
          heading: "Haftungsausschluss",
          body: "SielGuide ist eine unabhängige App und kein offizielles Angebot der Stadt Carolinensiel oder eines Tourismusverbandes. Reservierungen, Buchungen und Bestellungen erfolgen ausschließlich über die jeweiligen externen Anbieter. Für deren Inhalte und Leistungen übernehmen wir keine Haftung.",
        },
      ]}
    />
  );
}
