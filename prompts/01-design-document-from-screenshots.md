# Prompt: Design-Dokument aus Screenshots oder Referenzseiten

Nutze diesen Prompt in Google AI Studio, ChatGPT, Claude oder Codex, wenn du aus 1-5 Screenshots oder Website-Links ein sauberes Design-Dokument erzeugen willst.

## Ziel
- aus visuellen Referenzen ein klar formulierbares Stil- und Systemdokument machen
- das Ergebnis so schreiben, dass es direkt für AI Studio, Codex oder andere Coding-Agenten als Design-Brief nutzbar ist
- nicht nur den Look beschreiben, sondern auch Hierarchie, Dichte, Komponentenlogik, Motion und No-Gos

## Prompt
```text
Du bist ein exzellenter Produktdesigner, Creative Director und Design-System-Analyst.

Ich gebe dir Screenshots, Website-Links oder Design-Referenzen.
Deine Aufgabe ist es, daraus ein präzises Design-Dokument zu extrahieren, das ein Coding-Agent oder eine KI-App-Building-Plattform direkt verwenden kann.

Wichtige Arbeitsweise:
- Arbeite nicht oberflächlich und nicht generisch.
- Beschreibe nicht nur "modern", "clean" oder "minimalistisch", sondern konkret, wodurch dieser Eindruck entsteht.
- Leite Regeln aus den Referenzen ab.
- Wenn etwas nicht sicher erkennbar ist, markiere es als Annahme.
- Fokussiere auf umsetzbare, visuelle und strukturelle Aussagen.

Liefere das Ergebnis in genau dieser Struktur:

# Design-Dokument

## 1. Gesamteindruck
- Welche Wirkung erzeugt das Design insgesamt?
- Welche 3-6 Adjektive treffen es am besten?
- Woran erkennt man diese Wirkung konkret?

## 2. Marken- und Stilrichtung
- Beschreibe die visuelle Richtung präzise.
- Ordne sie in nachvollziehbare Stilbegriffe ein.
- Nenne, was der Stil bewusst NICHT ist.

## 3. Layout-System
- Beschreibe Raster, Content-Breite, Weißraum, Section-Logik und responsive Verhalten.
- Erkläre, ob das Design eher editorial, dashboardig, dokumentenzentriert, magazinig, institutionell, produktorientiert oder landingpage-lastig ist.

## 4. Typografie
- Beschreibe die Typografie-Hierarchie.
- Welche Heading-/Body-Logik ist erkennbar?
- Wie wirkt die Typografie emotional und funktional?
- Wenn passende Font-Richtungen ableitbar sind, nenne sie.

## 5. Farbwelt
- Hauptfarben
- Akzentfarben
- Hintergrundsystem
- Kontrastverhalten
- Wann Farben sparsam und wann dominant eingesetzt werden

## 6. Komponentenstil
- Buttons
- Navigation
- Cards oder bewusst keine Cards
- Formulare
- Tabellen oder Listen
- Bilder
- Call-to-Actions
- Divider, Rahmen, Flächen, Schatten, Rundungen

## 7. Bildsprache
- Welche Bildart passt zu diesem Stil?
- Eher real, editorial, dokumentarisch, produktnah, technisch, atmosphärisch?
- Welche Bildsprache würde den Stil zerstören?

## 8. Motion und Interaktion
- Welche Art von Animationen passt?
- Wie subtil oder präsent soll Motion sein?
- Welche Hover-, Scroll- oder Reveal-Prinzipien passen?

## 9. UI-Dichte und Informationsarchitektur
- Ist das Interface eher dicht oder luftig?
- Wie werden Prioritäten sichtbar gemacht?
- Welche Elemente tragen Orientierung?

## 10. Harte Regeln
- Liste 10-20 konkrete Design-Regeln, die beim Nachbauen eingehalten werden müssen.

## 11. No-Gos
- Liste 10-20 Dinge, die vermieden werden müssen, weil sie den Stil verwässern.

## 12. Build-Brief für KI-Coding-Tools
- Formuliere am Ende einen klaren, kompakten Umsetzungsbrief für AI Studio / Codex / Claude Code.
- Dieser Brief soll so geschrieben sein, dass ein Coding-Agent die visuelle Richtung direkt umsetzen kann.

Zusätzliche Anforderungen:
- Wenn die Referenz industrial-minimalistisch, institutionell oder dokumentenzentriert wirkt, benenne das klar.
- Wenn die Referenz übertriebene Bubble-UI, weiche Pillen oder Dashboard-Glätte bewusst vermeidet, mache das explizit.
- Wenn die Referenz mit einem ruhigen, zen-artigen Rhythmus arbeitet, beschreibe dies ohne in Klischees oder asiatische Symbolik abzurutschen.
- Wenn ich eine Markenfarbe angebe, integriere sie logisch in die Farbstrategie.

Am Ende:
- Nenne 3 kurze Stilnamen, die diesen Look gut zusammenfassen.
- Nenne 3 alternative Stilrichtungen, die ähnlich gut funktionieren würden.
```

## Empfohlene Nutzung
- hänge 1-5 Screenshots an
- ergänze bei Bedarf: `Nutze #345900 als zurückhaltende Primärakzentfarbe`
- ergänze bei Bedarf: `Der Look soll in Richtung KIRegister / institutional minimalism / industrial minimalism gehen`
