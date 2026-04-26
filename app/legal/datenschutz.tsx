import React from "react";

import { LegalPage } from "@/components/LegalPage";

export default function DatenschutzScreen() {
  return (
    <LegalPage
      title="Datenschutzerklärung"
      intro="Wir nehmen den Schutz deiner persönlichen Daten ernst. Diese Datenschutzerklärung informiert dich über Art, Umfang und Zweck der Verarbeitung personenbezogener Daten in unserer App."
      sections={[
        {
          heading: "1. Verantwortlicher",
          body: "SielGuide UG (haftungsbeschränkt), Musterstraße 1, 26409 Carolinensiel, Deutschland.",
        },
        {
          heading: "2. Erhobene Daten",
          body: "Bei der Nutzung der App können folgende Daten verarbeitet werden: Konto-Informationen (E-Mail, Name), Favoriten und Einstellungen (lokal auf deinem Gerät gespeichert), optional Standortdaten zur Anzeige nahegelegener Orte.",
        },
        {
          heading: "3. Zweck der Verarbeitung",
          body: "Die Verarbeitung erfolgt zur Bereitstellung der App-Funktionen, Personalisierung deiner Empfehlungen und zur Verbesserung des Angebots.",
        },
        {
          heading: "4. Rechtsgrundlage",
          body: "Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. a (Einwilligung), lit. b (Vertragserfüllung) und lit. f (berechtigtes Interesse) DSGVO.",
        },
        {
          heading: "5. Externe Anbieter",
          body: "Buchungen und Reservierungen werden über externe Anbieter abgewickelt. Hierbei können personenbezogene Daten an diese Anbieter übermittelt werden. Es gelten die jeweiligen Datenschutzerklärungen der externen Anbieter.",
        },
        {
          heading: "6. Speicherdauer",
          body: "Personenbezogene Daten werden nur so lange gespeichert, wie es für die genannten Zwecke erforderlich ist oder gesetzliche Aufbewahrungsfristen bestehen.",
        },
        {
          heading: "7. Deine Rechte",
          body: "Du hast jederzeit das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch gegen die Verarbeitung deiner personenbezogenen Daten.",
        },
        {
          heading: "8. Kontakt",
          body: "Für Fragen zum Datenschutz erreichst du uns unter: datenschutz@sielguide-app.example",
        },
      ]}
    />
  );
}
