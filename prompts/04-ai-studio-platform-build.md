# Prompt: AI-Studio-Plattform für Submission, Ranking und Gewinner-Ermittlung

Dieser Prompt ist dafür gedacht, live in Google AI Studio Build Mode eingefügt zu werden.

## Ziel
- Plattform für die Klasse bauen
- Registrierung, Submission, Voting und automatische Auswertung
- sauberer Stil: industrial minimalism, professionell, klar, mit einem Hauch Zen-Ruhe

## Stilvorgabe
- visuelle Richtung: document-first institutional minimalism
- professionell, reduziert, klar
- keine Bubble-UI
- keine pill-heavy Navigationssprache
- keine weichen Dashboard-Karten ohne Zweck
- keine beige Safe-Palette
- Grundfarben: Off-White, Kohle, Graphit, Stahlgrau
- Akzentfarbe: `#345900`
- Stimmung: Industrial Minimalism + Professional + Light Zen Calm
- keine asiatischen Symbole oder kulturellen Klischees
- Look eher in Richtung KIRegister als generische Startup-Landingpage

## Prompt
```text
Build a full-stack web application in Google AI Studio.

This is a private class platform for a design and portfolio challenge.
Use a React frontend, server-side runtime, Firebase Authentication, and Firestore.
Use AI Studio's full-stack and Firebase capabilities directly.

The app must feel professional, clear, elegant, industrial-minimalist, and slightly zen.
No bubble-heavy UI, no oversized rounded cards, no playful startup aesthetic, no beige-safe palette.
Use #345900 as a restrained accent color.
Think document-first, editorial, institutional, sharp, calm, trustworthy.

Core product purpose:
Participants register, submit their project, review the other projects, rank everyone else, and the platform automatically computes the winner.

Authentication:
- Allow Google sign-in
- Also allow email + password sign-up
- In both cases require a valid invite code before the account becomes active
- Store whether the user signed up with Google or email/password

Roles:
- admin
- participant

Collections / data model:

users
- id
- fullName
- email
- authProvider
- role
- inviteCodeUsed
- createdAt
- isActive

inviteCodes
- code
- label
- isActive
- maxUses
- usedCount
- createdAt

submissions
- id
- userId
- participantName
- title
- shortDescription
- aiStudioShareUrl
- githubUrl
- deployUrl
- screenshotUrl
- status (draft/submitted)
- submittedAt

votes
- id
- voterUserId
- rankedSubmissionIds (ordered array from best to worst)
- createdAt

settings
- currentPhase
  - registration
  - submission
  - voting
  - results
- submissionsOpen
- votingOpen

Required rules:
- A participant can only have one submission
- A participant cannot vote for themselves
- A participant must rank all other submitted projects
- Only submitted projects appear in the voting view
- Voting can only happen during the voting phase
- Submission can only happen during the submission phase
- Admin can change the phase

Winner logic:
- Use Borda-style scoring by default
- If there is a tie, break it by:
  1. more first-place votes
  2. better average rank
  3. earlier submission time

Views:

1. Public / auth shell
- sign in / sign up
- invite code entry
- short explanation of the challenge

2. Participant dashboard
- current phase
- their submission status
- quick links to edit or view their submission
- instructions for what to do next

3. Submission form
- project title
- short description
- AI Studio share URL
- GitHub URL
- deployed app URL
- screenshot URL
- save draft
- submit

4. Voting interface
- show all other submitted projects
- each card must show:
  - title
  - participant name
  - short description
  - screenshot
  - links
- provide a clear ranking UI
- let the participant order every other project
- require full ranking before final submit

5. Results page
- leaderboard
- score
- number of first-place votes
- average rank
- submission links

6. Admin area
- create / disable invite codes
- see user list
- see submission list
- change current phase
- inspect results
- export submissions and rankings

UX requirements:
- desktop-first but mobile-safe
- clear hierarchy
- fast scanning
- structured tables where useful
- restrained cards only when helpful
- consistent typography
- subtle motion only

Technical requirements:
- use Firestore security rules
- role-aware access
- participants can only edit their own submission and vote
- admins can manage all records
- validate URLs
- prevent duplicate votes
- prevent duplicate submission records per user

Seed requirements:
- include a simple admin bootstrap path or clear documented seed logic
- include placeholder invite code examples

Delivery requirements:
- create all required screens
- create Firebase wiring
- create clean component structure
- write readable, scalable code
- avoid magic strings where easy constants are better
- keep naming human-readable

At the end:
- show a polished home/login screen
- generate the full app
- fix any build issues
- keep the code organized
```

## Live-Demo-Tipp
- Direkt danach in AI Studio ergänzen:
  - `Now refine the visual system further toward sharper institutional minimalism, with cleaner typography, stronger spacing discipline, more table-based admin views, and better screenshot presentation.`
