# FAB Handout: Von Web-Grundlagen zu AI Studio und deiner ersten Portfolio-Seite

## 1. Worum es heute geht
Heute soll klar werden:
- dass das Web im Kern verständlicher ist, als es oft wirkt
- dass moderne Websites letztlich auf HTML, CSS und JavaScript hinauslaufen
- dass Frameworks wie React vor allem helfen, Struktur, Wiederverwendung und Geschwindigkeit sauber zu organisieren
- dass Backend, APIs, Hosting, Secrets, Tokens und LLMs keine Magie sind, sondern Bausteine
- dass Google AI Studio ein sehr guter Einstieg ist, weil vieles davon für euch gemanagt werden kann
- dass ihr direkt eure erste Portfolio-Seite bauen könnt

## 2. Das Web in einfach

### HTML
- Struktur
- Was ist auf der Seite?
- Überschriften, Texte, Bilder, Buttons, Formulare

### CSS
- Aussehen
- Farben, Abstände, Typografie, Layout, responsive Verhalten

### JavaScript
- Verhalten
- Klicks, Zustandswechsel, Formularlogik, API-Anfragen, dynamische Inhalte

### Wichtig
- Auch wenn ihr mit React, Next.js oder Angular arbeitet, landet das Ergebnis im Browser wieder bei HTML, CSS und JavaScript.
- Frameworks machen das Erstellen komplexerer UIs sauberer und schneller.

## 3. Warum Frameworks?

### React
- sehr flexibel
- komponentenbasiert
- ideal für UI-Wiederverwendung
- gutes Ökosystem
- wahrscheinlich unser Hauptpfad im Kurs

### Next.js
- baut auf React auf
- sehr gut für echte Web-Produkte, Routing, Serverlogik und Deployment
- oft produktionsnäher als reines React

### Angular
- stärker strukturiert
- für größere, stärker reglementierte Anwendungen oft attraktiv
- steilere Lernkurve

### Kerngedanke
- Ihr definiert Elemente einmal und verwendet sie an vielen Stellen wieder.
- Genau das macht modernes Webbuilding leichter und skalierbarer.

## 4. Was ist localhost?
- Wenn ihr lokal entwickelt, läuft eure App zunächst auf eurem Computer.
- `localhost` ist nur die lokale Adresse dafür.
- Dort seht ihr eine Vorschau oder Entwicklungsansicht eurer App.
- Noch niemand sonst sieht diese Version automatisch.

## 5. Was ist der Build-Prozess?
- Euer Framework-Code wird für den Browser vorbereitet.
- Das Ergebnis wird gebündelt und optimiert.
- Am Ende werden browserfähige Dateien ausgeliefert.
- Für euch wichtig:
  - ihr arbeitet in einer angenehmeren Entwicklungsform
  - der Browser bekommt trotzdem normale Web-Technologien

## 6. Was ist ein Backend?
- Das Backend ist der Teil, der Daten speichert, verarbeitet und Regeln ausführt.
- Dort können liegen:
  - Benutzerkonten
  - Einträge in Datenbanken
  - Inhalte
  - Rechte
  - Automatisierungen
  - serverseitige API-Aufrufe

### Frontend vs Backend
- Frontend: das, was Nutzer sehen und bedienen
- Backend: das, was im Hintergrund Daten und Logik verwaltet

## 7. Was ist eine API?
- Eine API ist eine Schnittstelle.
- Sie erlaubt, dass Systeme miteinander sprechen.

### Beispiele
- Eure Website fragt ein Backend nach Projektdaten
- Amazon nutzt eine Zahlungs-API wie Stripe
- Eine App nutzt eine LLM-API
- Eine App nutzt eine Bildgenerierungs-API

## 8. Hosting ist nicht dasselbe wie Backend

### Webhosting
- dort liegt eure Website bzw. der ausgerenderte oder gebaute Frontend-Code
- z.B. Vercel oder Netlify

### Backend / Datenbank / Serverlogik
- dort liegen Benutzerdaten, Inhalte, Regeln und Aktionen
- z.B. Firebase / Firestore / Auth / Serverruntime

### Andere APIs
- laufen oft wieder auf ganz anderen Computern
- eure App sendet Anfragen hin und bekommt Antworten zurück

## 9. Secrets und Tokens

### Secrets
- geheime Zugangsdaten
- dürfen nicht offen im Frontend landen
- z.B. API Keys, private Tokens, Service-Zugänge

### Tokens
- können Zugriff oder Identität repräsentieren
- z.B. Login-Token, API-Token

### Merksatz
- Nur weil etwas technisch funktioniert, ist es noch nicht sicher.

## 10. Was ist ein Large Language Model?
- Ein LLM ist ein Sprachmodell, das Muster in Sprache gelernt hat.
- Es kann Text verstehen, erzeugen, strukturieren, transformieren und oft auch Code schreiben.
- Es ist nicht automatisch ein Agent.

## 11. Was ist ein Agent?
- Ein Agent ist nicht nur ein Modell.
- Ein Agent hat meist:
  - ein Ziel
  - Kontext
  - Werkzeuge
  - Speicher oder Zustand
  - Handlungsschritte
  - manchmal Autonomie über mehrere Schritte

### Kurzform
- LLM = denkt / antwortet
- Agent = nutzt das Modell plus Werkzeuge und Abläufe, um etwas zu erledigen

## 12. AI Studio, Codex, Cloud Code, Antigravity

### Gemeinsame Grundlogik
- alle arbeiten mit Prompts, Kontext, Dateien, Iterationen und Modellfähigkeiten
- alle können Code generieren und verändern
- alle helfen beim Bauen digitaler Produkte

### Google AI Studio
- sehr guter Einstieg
- Build Mode kann heute React + serverseitige Runtime + Secrets + Firebase-Integration unterstützen
- direkt im Browser
- gut für schnelle erste Ergebnisse

### Codex / Cloud Code / ähnliche lokale Coding-Agenten
- mehr direkte Kontrolle über Dateien
- gut für echte lokale Projekte
- mehr Verantwortung für Setup, Rendering, Backend, Plugins, Secrets
- man muss etwas installieren
- man zahlt typischerweise über Modell- oder Tool-Nutzung

### Google Antigravity
- stärker agentisch
- gut, wenn Projekte komplexer werden
- verwandt mit dem Build-Erlebnis in AI Studio, aber stärker als Entwicklungsplattform gedacht

## 13. Was aktuell laut Google wichtig ist
- AI Studio Build Mode kann vollständige Apps erzeugen
- React ist standardmäßig die Frontend-Richtung
- serverseitige Runtime ist möglich
- Secrets-Management ist möglich
- Firebase kann automatisiert integriert werden
- GitHub-Export ist möglich
- Deploy zu Cloud Run ist möglich
- AI Studio selbst ist kostenlos nutzbar, produktive Nutzung kann aber Kosten erzeugen

Offizielle Quellen:
- https://ai.google.dev/gemini-api/docs/aistudio-build-mode
- https://ai.google.dev/gemini-api/docs/prompting-strategies
- https://ai.google.dev/gemini-api/docs/rate-limits
- https://ai.google.dev/gemini-api/docs/pricing
- https://ai.google.dev/gemini-api/docs/changelog

## 14. Wie bekannte Websites grob funktionieren

### Amazon
- HTML: Produktseiten, Buttons, Formularstruktur
- CSS: Layout, Abstände, Farbsystem
- JavaScript: Interaktionen, Suchverhalten, Warenkorb-Updates
- Backend: Produkte, Beschreibungen, Preise, Nutzer, Bestellungen
- APIs: z.B. Zahlungsdienste wie Stripe oder interne Services

### Facebook
- HTML/CSS/JS für Feed, Profile, Kommentare, Eingaben
- Backend für Nutzer, Posts, Likes, Beziehungen, Nachrichten
- APIs und interne Services für Uploads, Benachrichtigungen, Werbung, Moderation

### Euer Portfolio
- HTML/CSS/JS für Seite und Interaktion
- anfangs eventuell ganz ohne echtes Backend möglich
- später evtl. mit Formular, CMS, Datenbank oder LLM-Funktionen

## 15. Euer erstes Projekt: Portfolio-Landingpage

### Ziel
- eine Seite bauen, die zeigt, wie ihr euch nach außen präsentieren wollt

### Braucht ihr dafür mindestens?
- ein kleines PRD
- ein Design-Dokument
- Inhalte
- Bilder oder visuelle Referenzen

## 16. Das kleine PRD

Beschreibt:
- was ihr bauen wollt
- für wen
- was die Seite können soll
- was nicht Teil von v1 ist

## 17. Das Design-Dokument

Kann unterschiedlich tief sein:
- nur der Vibe
- ein paar Referenzseiten
- klare Stilbegriffe
- harte Regeln und No-Gos
- vollständiges Design-System

### Gute Inhalte
- Wirkung
- Stilrichtung
- Farben
- Typografie
- Layout
- Komponenten
- Bildsprache
- Motion
- No-Gos

## 18. Bilder hosten mit imgbb.com
- dort könnt ihr Bilder hochladen
- Ziel sind direkte Bildlinks
- Direktlinks erkennt man oft an der echten Dateiendung wie:
  - `.png`
  - `.jpg`
  - `.jpeg`
  - `.webp`
- Diese Direktlinks könnt ihr einer KI oder eurem Projekt geben

## 19. Share vs Publish in AI Studio

### Für Feedback / Einreichen
- `Share`
- dann z.B. `Anyone with the link can view`
- Link kopieren
- später wieder restriktiver machen, wenn ihr wollt

### Für echte Veröffentlichung
- nicht blind einfach `Publish`
- besser GitHub + Vercel oder Netlify verstehen

## 20. Was ist GitHub?
- Plattform für Code und Versionsverwaltung
- dort liegt euer Projekt nachvollziehbar und versioniert
- man kann Änderungen speichern, vergleichen, teilen und deployen

## 21. Warum GitHub + Vercel oder Netlify?
- klarerer Publishing-Flow
- keine direkte Kreditkartenpflicht wie bei manchen Schnell-Publish-Optionen
- stärkerer Standard-Workflow
- besser für echte Projektentwicklung

## 22. Version History
- zeigt, was wann geändert wurde
- extrem wichtig, wenn etwas kaputtgeht oder man Varianten vergleichen will

## 23. So arbeitet ihr effektiver
- wartet nicht passiv
- wenn ein Tool rechnet oder baut:
  - schreibt am Design-Dokument weiter
  - verbessert das PRD
  - sammelt Inhalte
  - arbeitet parallel an der 20€-Challenge

## 24. Mehrere Agenten parallel
- Das wird immer wichtiger.
- Eine sinnvolle Arbeitsweise ist:
  - ein Agent baut
  - ein anderer schreibt
  - ein dritter recherchiert
  - ihr kuratiert, steuert und entscheidet

## 25. Challenge
- Während ihr an eurem Portfolio arbeitet, könnt ihr parallel an der Challenge arbeiten.
- Ziel: die beste Design-/Umsetzungsleistung gewinnt.
- Preis: Gutschein für eine `20€` Subscription von ChatGPT, Gemini oder Claude.
- Zusätzlich: Vorstellung bei Christoff Schneider.

## 26. Submission und Ranking
- Ihr reicht eure Seite per Link ein.
- Alle können alle anderen ranken.
- Die Plattform berechnet daraus automatisch das Gewinnerprojekt.

## 27. Tool-Empfehlung für schnelle Ergebnisse
- Für schnelles Coden und Iterieren ist ein schnelleres Modell oft super.
- Wenn ihr hängenbleibt, kann ein stärkeres Modell oder ein Pro-Modus sinnvoller sein.
- Grundregel:
  - zuerst schnell
  - bei schweren Problemen tiefer

## 28. Wichtig beim Prompten
- sagt der KI:
  - schreibe klaren, menschlich lesbaren, skalierbaren Code
  - halte Komponenten sauber
  - vermeide unnötige Komplexität
  - strukturiere Dateien ordentlich

## 29. Gute Prompting-Regeln
- konkret statt vage
- Ziel vor Stil
- Struktur vor Deko
- Nutzer und Aufgaben vor Farben
- No-Gos explizit nennen
- nach dem ersten Build gezielt nachschärfen

## 30. Schlussgedanke
Das Ziel ist nicht nur, dass ihr heute irgendeine Seite baut.
Das Ziel ist, dass ihr versteht:
- was das Web ist
- wie moderne Tools euch helfen
- welche Bausteine ein Produkt wirklich hat
- und wie ihr eigenständig bessere Dinge bauen könnt
