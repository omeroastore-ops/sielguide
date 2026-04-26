import React from "react";

import { LegalPage } from "@/components/LegalPage";

export default function AGBScreen() {
  return (
    <LegalPage
      title="Allgemeine Geschäftsbedingungen"
      intro="Stand: April 2026. Diese Allgemeinen Geschäftsbedingungen (AGB) regeln die Nutzung der mobilen Anwendung SielGuide."
      sections={[
        {
          heading: "1. Geltungsbereich",
          body: "Diese AGB gelten für alle Nutzer der SielGuide App. Mit der Nutzung der App akzeptierst du diese Bedingungen.",
        },
        {
          heading: "2. Leistungen",
          body: "SielGuide bietet redaktionelle Inhalte, persönliche Empfehlungen und Verlinkungen zu externen Anbietern in Carolinensiel. Reservierungen, Buchungen und Bestellungen werden ausschließlich über die externen Anbieter abgewickelt.",
        },
        {
          heading: "3. Haftung",
          body: "SielGuide übernimmt keine Haftung für Inhalte und Leistungen externer Anbieter. Für direkte Schäden haften wir nur bei Vorsatz oder grober Fahrlässigkeit.",
        },
        {
          heading: "4. Nutzerkonto",
          body: "Für bestimmte Funktionen ist ein Nutzerkonto erforderlich. Du bist verpflichtet, deine Zugangsdaten geheim zu halten.",
        },
        {
          heading: "5. Inhalte und Bewertungen",
          body: "Bewertungen und Beiträge müssen wahrheitsgemäß und respektvoll sein. SielGuide behält sich vor, unangemessene Inhalte zu entfernen.",
        },
        {
          heading: "6. Kündigung",
          body: "Du kannst dein Nutzerkonto jederzeit löschen. Die Nutzung ist kostenlos.",
        },
        {
          heading: "7. Schlussbestimmungen",
          body: "Es gilt deutsches Recht. Sollte eine Bestimmung dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.",
        },
      ]}
    />
  );
}
