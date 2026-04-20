# FAB Workshop Platform

Submission + Voting Plattform für den FAB Keynote Workshop
(2026-04-20, 9:00–12:00, „Ökologisch Leben neu gebaut in AI Studio").

Stack: Vite + React 18 + TypeScript + React Router v6 · Firebase Auth + Firestore ·
imgbb für Screenshots · Deploy auf Vercel.

Design: Industrial Minimalism, Paper `#F3F1E9` / Ink `#111111` / Green `#345900`.

---

## 1) Voraussetzungen

- Node ≥ 18
- Ein Firebase-Projekt mit aktivierter **Email/Password Authentication**
  und **Firestore** (beides ist bei dir bereits an).
- Ein **imgbb** API-Key (kostenlos, https://api.imgbb.com/).

---

## 2) Lokal starten

```bash
cd platform
cp .env.example .env.local
# .env.local öffnen und VITE_IMGBB_KEY eintragen
npm install
npm run dev
```

App läuft auf http://localhost:5173.

---

## 3) Firestore-Rollen & Regeln

Die Rules liegen in `firestore.rules`. Einmalig deployen mit der Firebase CLI:

```bash
npm i -g firebase-tools
firebase login
firebase use fab-workshop
firebase deploy --only firestore:rules
```

(Alternativ: Rules-Text in die Firebase Console → Firestore → Rules kopieren
und publishen.)

### Rollenmodell

- **admin**: sieht alles, schaltet Phasen, legt Invite-Codes an, exportiert CSVs.
- **participant**: eine Submission, ein Vote, sieht Ergebnisse erst in der
  `results`-Phase (Admin sieht sie jederzeit).

### Phasen

`registration` → `submission` → `voting` → `results`.
Phasenwechsel setzt `submissionsOpen` / `votingOpen` automatisch passend.

---

## 4) Erstinbetriebnahme

Wenn das Projekt frisch ist und noch kein Admin existiert:

1. App öffnen (`/` redirectet auf `/auth`).
2. Einmalig `/bootstrap` aufrufen – legt `settings/config` an
   und seedet vier Invite-Codes:
   - `ADMIN-BOOT-2026` (role: admin, 1 Use) ← für deinen eigenen Account
   - `FAB-DEMO-1`, `FAB-DEMO-2`, `FAB-DEMO-3` (participant, 5 Uses)
3. Mit `ADMIN-BOOT-2026` und deiner E-Mail als Admin registrieren.
4. In `/admin` Phase setzen und echte Teilnehmer-Codes erzeugen
   (z.B. `FAB-2026-01`..`FAB-2026-24`).

---

## 5) Invite-Codes

- Nur Admin kann Codes anlegen.
- Bei Sign-up prüft die App:
  1. Existiert der Code?
  2. Ist er aktiv?
  3. `usedCount < maxUses`?
- Dann in einer Transaction `usedCount++` + User-Doc mit der zugeordneten Rolle.
- Schlägt die Transaction fehl, wird der eben erzeugte Auth-User wieder gelöscht.

---

## 6) Ablauf am Workshop-Tag

1. Vor dem Workshop: `/admin` → Phase `registration`, Invite-Codes teilen.
2. Teilnehmer registrieren sich mit ihrem Code.
3. Bauphase → Phase `submission`, `submissionsOpen = true`.
4. Teilnehmer legen in `/submit` Projekt an (Titel, Beschreibung, AI Studio Link,
   GitHub, Deploy-URL, Screenshot). Bis Phasenende editierbar.
5. Showcase-Block → Phase `voting`, `votingOpen = true`.
6. Alle ranken alle anderen Projekte vollständig. Doc-ID `votes/{uid}` erzwingt
   ein Vote pro Person, eigenes Projekt wird rausgefiltert.
7. Phase `results` → `/results` zeigt Borda-Leaderboard mit Tie-Break.
8. Admin exportiert bei Bedarf CSVs.

---

## 7) Scoring

`src/lib/scoring.ts` – klassisches Borda:
- Projekt auf Rang `i` von `L` Projekten bekommt `L - 1 - i` Punkte.
- Tie-Break:
  1. mehr 1st-Place-Stimmen
  2. besserer Durchschnittsrang
  3. frühere `submittedAt`

---

## 8) Deploy auf Vercel

```bash
npm i -g vercel
vercel login
cd platform
vercel                 # erst-Deploy (preview)
vercel --prod          # production
```

Im Vercel-Dashboard → Settings → Environment Variables **alle** `VITE_…` Keys
aus `.env.local` eintragen (Production + Preview).

`vercel.json` ist schon auf SPA-Rewrite konfiguriert.

Nach dem Deploy: die Production-URL in Firebase Console →
Authentication → Settings → **Authorized domains** hinzufügen,
sonst verweigert Firebase Auth das Login.

---

## 9) Struktur

```
platform/
├── firestore.rules            # Security Rules
├── vercel.json                # SPA-Rewrite, build command
├── .env.example               # alle VITE_… Variablen
├── src/
│   ├── main.tsx
│   ├── App.tsx                # Routing + Auth-Guard
│   ├── vite-env.d.ts          # Env-Types
│   ├── lib/
│   │   ├── firebase.ts        # Firebase-Init
│   │   ├── auth.ts            # Sign-up mit Invite-Code-Transaction
│   │   ├── state.ts           # useAuthUser / useUserDoc / useSettings
│   │   ├── types.ts           # Firestore-Doc-Typen
│   │   ├── constants.ts       # Phasen, Bootstrap-Code
│   │   ├── scoring.ts         # Borda + Tie-Break
│   │   └── imgbb.ts           # Screenshot-Upload
│   ├── ui/
│   │   ├── tokens.css         # Palette, Typografie, Komponenten
│   │   └── Shell.tsx          # Topbar + Layout
│   └── routes/
│       ├── AuthPage.tsx       # Sign-in / Sign-up (Invite-Code)
│       ├── Bootstrap.tsx      # Erstinbetriebnahme
│       ├── Dashboard.tsx      # Nächster Schritt + Submission-Zusammenfassung
│       ├── SubmissionForm.tsx # Entwurf / Einreichen, Screenshot via imgbb
│       ├── Voting.tsx         # Drag-frei Ranking
│       ├── Results.tsx        # Leaderboard
│       └── Admin.tsx          # Phasen, Codes, User, CSV
```

---

## 10) Troubleshooting

- **„auth/unauthorized-domain"** nach Vercel-Deploy → Vercel-Domain in Firebase
  Authorized Domains eintragen.
- **imgbb-Upload schlägt fehl** → `VITE_IMGBB_KEY` prüfen (ohne Prefix `Bearer`,
  ist ein Client-Key).
- **„Invite-Code ungültig"** trotz existierendem Code → Code wird im Formular
  upper-cased. Entweder in Firestore den Doc-ID auch in Uppercase anlegen,
  oder im Admin-UI neu erzeugen.
- **Votes lassen sich nicht abgeben** → Prüfe Phase `voting` **und**
  `votingOpen = true` in `settings/config`.
