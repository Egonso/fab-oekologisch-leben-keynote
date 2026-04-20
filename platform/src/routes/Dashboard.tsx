import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuthUser, useSettings, useUserDoc } from "../lib/state";
import type { SubmissionDoc } from "../lib/types";
import { PHASE_LABEL } from "../lib/constants";

export function Dashboard() {
  const { fbUser } = useAuthUser();
  const { user } = useUserDoc(fbUser?.uid);
  const { settings } = useSettings();
  const [sub, setSub] = useState<SubmissionDoc | null>(null);

  useEffect(() => {
    if (!fbUser) return;
    const q = query(
      collection(db, "submissions"),
      where("userId", "==", fbUser.uid)
    );
    return onSnapshot(q, (snap) => {
      if (snap.empty) setSub(null);
      else setSub({ id: snap.docs[0].id, ...snap.docs[0].data() } as SubmissionDoc);
    });
  }, [fbUser]);

  if (!user || !settings) return <div className="muted">…lädt</div>;

  const phase = settings.currentPhase;

  return (
    <div>
      <div className="section-header">
        <div>
          <span className="eyebrow">FAB · Dashboard</span>
          <h1>Hallo, {user.fullName}.</h1>
          <p className="muted">Dein Überblick für die aktuelle Phase.</p>
        </div>
        <div>
          <span className="tag green">{PHASE_LABEL[phase]}</span>
        </div>
      </div>

      <div className="grid-2">
        <section className="panel">
          <span className="mono" style={{ display: "block", marginBottom: 8 }}>STATUS</span>
          <h3>{nextStepTitle(phase, !!sub, sub?.status === "submitted")}</h3>
          <p className="muted" style={{ marginTop: 10 }}>
            {nextStepBody(phase, !!sub, sub?.status === "submitted")}
          </p>

          <div className="spacer-md" />
          <div className="link-row">
            {phase === "submission" && (
              <Link className="btn green" to="/submit">
                {sub ? "Submission weiter bearbeiten" : "Submission anlegen"}
              </Link>
            )}
            {phase === "voting" && (
              <Link className="btn green" to="/vote">
                Voting öffnen
              </Link>
            )}
            {phase === "results" && (
              <Link className="btn green" to="/results">
                Ergebnisse ansehen
              </Link>
            )}
            <Link className="btn ghost" to="/results">Leaderboard</Link>
          </div>
        </section>

        <section className="panel">
          <span className="mono" style={{ display: "block", marginBottom: 8 }}>DEINE SUBMISSION</span>
          {!sub && <p className="muted">Du hast noch keine Submission angelegt.</p>}
          {sub && (
            <dl className="kv">
              <dt>Titel</dt><dd>{sub.title || <span className="muted">—</span>}</dd>
              <dt>Status</dt><dd><span className="tag">{sub.status}</span></dd>
              <dt>AI Studio</dt><dd>{linkOrDash(sub.aiStudioShareUrl)}</dd>
              <dt>GitHub</dt><dd>{linkOrDash(sub.githubUrl)}</dd>
              <dt>Deploy</dt><dd>{linkOrDash(sub.deployUrl)}</dd>
            </dl>
          )}
          <div className="spacer-sm" />
          <Link className="btn ghost" to="/submit">Submission öffnen</Link>
        </section>
      </div>
    </div>
  );
}

function nextStepTitle(phase: string, hasSub: boolean, submitted: boolean) {
  if (phase === "registration") return "Registrierung läuft.";
  if (phase === "submission") return submitted ? "Submission eingereicht." : hasSub ? "Entwurf speichern und einreichen." : "Jetzt Submission anlegen.";
  if (phase === "voting") return "Voting ist offen.";
  if (phase === "results") return "Ergebnisse sind live.";
  return "";
}

function nextStepBody(phase: string, hasSub: boolean, submitted: boolean) {
  if (phase === "registration") return "Sobald der Admin die Phase auf „Submission“ umstellt, kannst du einreichen.";
  if (phase === "submission") return submitted
    ? "Du kannst deinen Eintrag bis Phasenende weiter bearbeiten."
    : hasSub
    ? "Du hast einen Entwurf. Speichere oder reiche ein, um ihn fertigzustellen."
    : "Titel, Beschreibung, AI Studio Share-Link, GitHub-Link, Deploy-URL, Screenshot.";
  if (phase === "voting") return "Ranke alle anderen Projekte vollständig und schicke dein Ranking ab.";
  return "Sieh dir das Leaderboard mit Score und Tie-Break an.";
}

function linkOrDash(u?: string) {
  if (!u) return <span className="muted">—</span>;
  return <a href={u} target="_blank" rel="noreferrer">{u}</a>;
}
