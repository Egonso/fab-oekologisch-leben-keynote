# Google AI Studio: Prompting- und Build-Best-Practices

Kurzfassung für den Kurs. Basierend auf der aktuellen Google-AI-Doku und auf der Live-Nutzung im Kurskontext.

## Was aktuell wichtig ist
- Google AI Studio Build Mode kann inzwischen vollständige Apps erzeugen, nicht nur kleine Frontend-Demos.
- Laut offizieller Doku erzeugt Build Mode standardmäßig eine React-Web-App und kann zusätzlich serverseitige Runtime, Secrets Management, npm-Pakete und Firebase-Integration nutzen.
- Build Mode kann nach der Generierung entweder direkt in AI Studio weiter iteriert oder nach GitHub exportiert werden.
- AI Studio selbst ist kostenlos zugänglich; Kosten entstehen vor allem dann, wenn man produktiv deployed, höhere Nutzung fährt oder externe kostenpflichtige Dienste nutzt.

## Gute Build-Prompts
- Starte mit Ziel und Produktlogik, nicht mit Farben.
- Beschreibe zuerst:
  - wer die Nutzer sind
  - was sie tun können sollen
  - welche Seiten / Screens gebraucht werden
  - welche Daten gespeichert werden
  - wie Auth funktioniert
- Danach erst Stil, Design-System und Details.

## Gute Design-Prompts
- Nicht: `make it modern`.
- Besser:
  - Stilrichtung
  - Dichte
  - Typografie
  - No-Gos
  - Farben
  - Komponentenregeln
  - Bildsprache

## Gute technische Prompts
- Nenne klar:
  - React
  - Firebase Auth
  - Firestore
  - Rollen
  - Datenmodell
  - Validierungsregeln
  - Phasenlogik
  - wer was sehen oder ändern darf

## Iterationsmuster
- 1. Erstes Gerüst bauen lassen
- 2. Strukturelle Fehler oder fehlende Flows beheben
- 3. UX schärfen
- 4. Design schärfen
- 5. Texte verbessern
- 6. Build-Probleme fixen
- 7. Erst dann teilen oder exportieren

## Sehr gute Nachfass-Prompts
- `Fix any build issues and remove dead code.`
- `Refactor the component structure to make it easier to maintain.`
- `Make the admin area denser and more table-based.`
- `Sharpen the typography and spacing.`
- `Reduce visual softness and remove unnecessary rounded surfaces.`
- `Move sensitive logic server-side where appropriate.`

## Menschlich lesbarer Code
- Sag explizit:
  - `Write clear, scalable, human-readable code.`
  - `Prefer readable names over clever abstractions.`
  - `Keep component boundaries clean.`
  - `Avoid unnecessary complexity.`

## Wichtige Hinweise zu Kosten und Sicherheit
- Secrets gehören nicht offen ins Frontend.
- AI Studio hat eigenes Secrets-Handling und serverseitige Runtime-Unterstützung.
- Produktive Deployments verursachen Kosten für Hosting, API-Nutzung und evtl. Datenbank.
- Rate limits hängen vom Projekt und Modell ab und werden in AI Studio pro Projekt verwaltet.

## Gute offizielle Einstiegsquellen
- Build Mode: https://ai.google.dev/gemini-api/docs/aistudio-build-mode
- Prompting Strategies: https://ai.google.dev/gemini-api/docs/prompting-strategies
- Rate Limits: https://ai.google.dev/gemini-api/docs/rate-limits
- Pricing: https://ai.google.dev/gemini-api/docs/pricing
- Release Notes: https://ai.google.dev/gemini-api/docs/changelog
