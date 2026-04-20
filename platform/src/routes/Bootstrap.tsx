import { useState } from "react";
import { ensureAdminBootstrap, ensureDemoCodes, ensureSettings } from "../lib/auth";
import { ADMIN_BOOT_CODE } from "../lib/constants";
import { Link } from "react-router-dom";

export function Bootstrap() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function run(includeDemo: boolean) {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      await ensureSettings();
      await ensureAdminBootstrap();
      if (includeDemo) await ensureDemoCodes();
      setMsg(
        includeDemo
          ? "Plattform initialisiert + Demo-Codes (FAB-DEMO-1/2/3) angelegt. Du kannst dich jetzt mit dem Admin-Code registrieren."
          : "Plattform initialisiert. Du kannst dich jetzt mit dem Admin-Code registrieren."
      );
    } catch (e: any) {
      setErr(String(e?.message ?? e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <div className="section-header">
        <div>
          <span className="eyebrow">FAB · Setup</span>
          <h1>Bootstrap</h1>
          <p className="muted">Diese Seite einmal aufrufen, bevor sich der Admin registriert.</p>
        </div>
      </div>

      <div className="panel">
        <ol style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9 }}>
          <li>
            Drück unten auf <b>Initialisieren</b>. Das legt das Settings-Dokument und einen einmaligen Admin-Invite-Code an.
          </li>
          <li>
            Geh danach auf <Link to="/auth?mode=signup">/auth</Link> und registriere dich mit dem Invite-Code{" "}
            <code className="tag">{ADMIN_BOOT_CODE}</code>.
          </li>
          <li>Dein Konto bekommt dann automatisch die Rolle <code>admin</code>.</li>
          <li>
            Ab dann legst du im Admin-Bereich die Invite-Codes für die Klasse an und steuerst die Phasen.
          </li>
        </ol>

        <div className="spacer-md" />
        <div className="link-row">
          <button className="btn green" onClick={() => run(false)} disabled={busy}>
            {busy ? "…initialisiere" : "Initialisieren"}
          </button>
          <button className="btn ghost" onClick={() => run(true)} disabled={busy}>
            Initialisieren + Demo-Codes
          </button>
        </div>

        {msg && <div className="notice" style={{ marginTop: 16 }}>{msg}</div>}
        {err && <div className="notice error" style={{ marginTop: 16 }}>{err}</div>}
      </div>
    </div>
  );
}
