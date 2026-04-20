import { useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { signIn, signUp } from "../lib/auth";
import { useAuthUser } from "../lib/state";

type Mode = "signin" | "signup";

export function AuthPage() {
  const [params] = useSearchParams();
  const initialMode: Mode = params.get("mode") === "signup" ? "signup" : "signin";
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [inviteCode, setInviteCode] = useState(params.get("code") ?? "");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const { fbUser } = useAuthUser();
  if (fbUser) return <Navigate to="/" replace />;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      if (mode === "signin") {
        await signIn(email, password);
      } else {
        await signUp({ fullName, email, password, inviteCode });
      }
    } catch (e: any) {
      setErr(humanize(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 820, margin: "0 auto" }}>
      <div className="section-header">
        <div>
          <span className="eyebrow">FAB · Workshop Plattform</span>
          <h1>Die private Klassen-Plattform</h1>
          <p className="muted" style={{ marginTop: 10 }}>
            Registriere dich mit deinem Invite-Code, reiche dein Projekt ein, bewerte die anderen und sieh, wer gewonnen hat.
          </p>
        </div>
        <div>
          <span className="tag ghost">{mode === "signin" ? "SIGN IN" : "SIGN UP"}</span>
        </div>
      </div>

      <div className="grid-2">
        <form onSubmit={submit} className="panel">
          <div className="panel-head">
            <h3>{mode === "signin" ? "Einloggen" : "Konto anlegen"}</h3>
            <button
              type="button"
              className="btn link"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            >
              {mode === "signin" ? "Noch kein Konto?  Registrieren" : "Schon ein Konto?  Einloggen"}
            </button>
          </div>

          {mode === "signup" && (
            <>
              <div className="field">
                <label>Voller Name</label>
                <input
                  className="input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label>Invite-Code</label>
                <input
                  className="input"
                  style={{ fontFamily: "var(--mono)", letterSpacing: "0.08em" }}
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="FAB-..."
                  required
                />
                <span className="hint">Du hast den Code von mir im Workshop bekommen.</span>
              </div>
            </>
          )}

          <div className="field">
            <label>E-Mail</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Passwort</label>
            <input
              className="input"
              type="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {err && <div className="notice error">{err}</div>}

          <button className="btn green" type="submit" disabled={busy}>
            {busy ? "…einen Moment" : mode === "signin" ? "Einloggen" : "Registrieren"}
          </button>
        </form>

        <aside className="panel dark">
          <span className="tag green" style={{ marginBottom: 16, display: "inline-block" }}>
            CHALLENGE
          </span>
          <h3 style={{ color: "var(--ivory)" }}>Build. Submit. Rank. Win.</h3>
          <p className="muted" style={{ color: "var(--stone)", marginTop: 14 }}>
            Du baust deine Version von <code>oekologisch-leben.org</code>, teilst AI-Studio-Share-Link,
            GitHub und eine Deploy-URL. Danach rankst du alle anderen Projekte.
            Die Siegerermittlung läuft automatisch über Borda-Scoring.
          </p>
          <hr className="hair" style={{ borderColor: "#333" }} />
          <p className="mono" style={{ color: "var(--green-soft)" }}>Die Phasen</p>
          <ol style={{ margin: "8px 0 0 20px", color: "var(--ivory)" }}>
            <li>Registration</li>
            <li>Submission</li>
            <li>Voting</li>
            <li>Results</li>
          </ol>
        </aside>
      </div>
    </div>
  );
}

function humanize(e: any): string {
  const raw = e?.code ?? e?.message ?? String(e);
  const m: Record<string, string> = {
    "auth/invalid-email": "E-Mail-Adresse sieht falsch aus.",
    "auth/missing-password": "Passwort fehlt.",
    "auth/weak-password": "Passwort zu kurz (mindestens 6 Zeichen).",
    "auth/email-already-in-use": "Diese E-Mail ist schon registriert. Bitte einloggen.",
    "auth/invalid-credential": "E-Mail oder Passwort falsch.",
    "auth/user-not-found": "Kein Konto zu dieser E-Mail.",
    "auth/wrong-password": "Passwort falsch.",
    "auth/too-many-requests": "Zu viele Versuche. Bitte kurz warten.",
  };
  return m[raw] ?? String(e?.message ?? e);
}
