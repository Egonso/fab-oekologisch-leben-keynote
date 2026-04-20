import { useEffect, useState } from "react";
import { collection, doc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuthUser, useSettings, useUserDoc } from "../lib/state";
import type { SubmissionDoc } from "../lib/types";
import { uploadToImgbb } from "../lib/imgbb";
import { IMGBB_KEY } from "../lib/constants";

const empty: Partial<SubmissionDoc> = {
  title: "",
  shortDescription: "",
  aiStudioShareUrl: "",
  githubUrl: "",
  deployUrl: "",
  screenshotUrl: "",
};

export function SubmissionForm() {
  const { fbUser } = useAuthUser();
  const { user } = useUserDoc(fbUser?.uid);
  const { settings } = useSettings();
  const [data, setData] = useState<Partial<SubmissionDoc>>(empty);
  const [existingId, setExistingId] = useState<string | null>(null);
  const [existingStatus, setExistingStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!fbUser) return;
    (async () => {
      const q = query(collection(db, "submissions"), where("userId", "==", fbUser.uid));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const d = snap.docs[0];
        setExistingId(d.id);
        const v = d.data() as SubmissionDoc;
        setExistingStatus(v.status);
        setData({
          title: v.title,
          shortDescription: v.shortDescription,
          aiStudioShareUrl: v.aiStudioShareUrl,
          githubUrl: v.githubUrl,
          deployUrl: v.deployUrl,
          screenshotUrl: v.screenshotUrl,
        });
      }
      setLoading(false);
    })();
  }, [fbUser]);

  const editable = settings?.currentPhase === "submission" && settings?.submissionsOpen;

  async function save(kind: "draft" | "submitted") {
    if (!fbUser || !user) return;
    setErr(null);
    setMsg(null);
    if (!validate(data, setErr)) return;

    setBusy(true);
    try {
      const id = existingId ?? fbUser.uid;
      const ref = doc(db, "submissions", id);
      const base: any = {
        id,
        userId: fbUser.uid,
        participantName: user.fullName,
        title: data.title!.trim(),
        shortDescription: data.shortDescription!.trim(),
        aiStudioShareUrl: data.aiStudioShareUrl?.trim() ?? "",
        githubUrl: data.githubUrl?.trim() ?? "",
        deployUrl: data.deployUrl?.trim() ?? "",
        screenshotUrl: data.screenshotUrl?.trim() ?? "",
        status: kind,
        updatedAt: serverTimestamp(),
      };
      if (kind === "submitted") base.submittedAt = serverTimestamp();
      await setDoc(ref, base, { merge: true });
      setExistingId(id);
      setExistingStatus(kind);
      setMsg(kind === "submitted" ? "Submission eingereicht." : "Entwurf gespeichert.");
    } catch (e: any) {
      setErr(String(e?.message ?? e));
    } finally {
      setBusy(false);
    }
  }

  async function upload(file: File) {
    setErr(null);
    setUploading(true);
    try {
      const r = await uploadToImgbb(file);
      setData((d) => ({ ...d, screenshotUrl: r.displayUrl || r.url }));
    } catch (e: any) {
      setErr(String(e?.message ?? e));
    } finally {
      setUploading(false);
    }
  }

  if (loading) return <div className="muted">…lädt</div>;

  return (
    <div style={{ maxWidth: 980, margin: "0 auto" }}>
      <div className="section-header">
        <div>
          <span className="eyebrow">FAB · Submission</span>
          <h1>Dein Projekt.</h1>
          <p className="muted">Eine Submission pro Teilnehmer. Änderbar bis Phasenende.</p>
        </div>
        <span className="tag">{existingStatus ?? "none"}</span>
      </div>

      {!editable && (
        <div className="notice">
          Submission-Phase ist aktuell nicht offen. Du kannst deinen Entwurf ansehen, aber nicht speichern.
        </div>
      )}

      <div className="grid-2">
        <form
          className="panel"
          onSubmit={(e) => { e.preventDefault(); save("submitted"); }}
        >
          <div className="field">
            <label>Projekt-Titel</label>
            <input
              className="input"
              required
              maxLength={120}
              value={data.title ?? ""}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              disabled={!editable}
            />
          </div>
          <div className="field">
            <label>Kurzbeschreibung (max 280)</label>
            <textarea
              className="textarea"
              maxLength={280}
              value={data.shortDescription ?? ""}
              onChange={(e) => setData({ ...data, shortDescription: e.target.value })}
              disabled={!editable}
              required
            />
          </div>
          <div className="field">
            <label>AI Studio Share-Link</label>
            <input
              className="input"
              type="url"
              placeholder="https://aistudio.google.com/apps/..."
              value={data.aiStudioShareUrl ?? ""}
              onChange={(e) => setData({ ...data, aiStudioShareUrl: e.target.value })}
              disabled={!editable}
            />
          </div>
          <div className="field">
            <label>GitHub-URL</label>
            <input
              className="input"
              type="url"
              placeholder="https://github.com/dein-handle/projekt"
              value={data.githubUrl ?? ""}
              onChange={(e) => setData({ ...data, githubUrl: e.target.value })}
              disabled={!editable}
            />
          </div>
          <div className="field">
            <label>Deploy-URL</label>
            <input
              className="input"
              type="url"
              placeholder="https://dein-projekt.vercel.app"
              value={data.deployUrl ?? ""}
              onChange={(e) => setData({ ...data, deployUrl: e.target.value })}
              disabled={!editable}
            />
          </div>
          <div className="field">
            <label>Screenshot (wird auf imgbb gehostet)</label>
            <input
              className="input"
              type="url"
              placeholder="Oder direkte Bild-URL einfügen"
              value={data.screenshotUrl ?? ""}
              onChange={(e) => setData({ ...data, screenshotUrl: e.target.value })}
              disabled={!editable || uploading}
            />
            <input
              className="input"
              type="file"
              accept="image/*"
              disabled={!editable || uploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) upload(f);
              }}
            />
            {uploading && <span className="hint">…lädt hoch</span>}
            {data.screenshotUrl && (
              <div style={{ marginTop: 10 }}>
                <img src={data.screenshotUrl} className="shot" alt="Screenshot" />
                <div className="hint">{data.screenshotUrl}</div>
              </div>
            )}
            <div className="hint">
              Tipp: Ausschnitt der Startseite, etwa 1600×900.
              {!IMGBB_KEY && " Aktuell ist noch kein imgbb-Key gesetzt, daher ist die URL-Eingabe der sichere Fallback."}
            </div>
          </div>

          {err && <div className="notice error">{err}</div>}
          {msg && <div className="notice">{msg}</div>}

          <div className="link-row">
            <button
              type="button"
              className="btn ghost"
              onClick={() => save("draft")}
              disabled={!editable || busy}
            >
              Entwurf speichern
            </button>
            <button className="btn green" type="submit" disabled={!editable || busy}>
              {existingStatus === "submitted" ? "Änderungen einreichen" : "Einreichen"}
            </button>
          </div>
        </form>

        <aside className="panel">
          <span className="mono" style={{ display: "block", marginBottom: 10 }}>
            VORSCHAU
          </span>
          <h3>{data.title || <span className="dim">Titel deines Projekts</span>}</h3>
          <p className="muted">{data.shortDescription || "Kurze Beschreibung erscheint hier."}</p>
          {data.screenshotUrl && (
            <img src={data.screenshotUrl} className="shot" alt="Vorschau" />
          )}
          <div className="spacer-sm" />
          <div className="link-row">
            {data.aiStudioShareUrl && <a href={data.aiStudioShareUrl} target="_blank" rel="noreferrer">AI Studio</a>}
            {data.githubUrl && <a href={data.githubUrl} target="_blank" rel="noreferrer">GitHub</a>}
            {data.deployUrl && <a href={data.deployUrl} target="_blank" rel="noreferrer">Live</a>}
          </div>
        </aside>
      </div>
    </div>
  );
}

function validate(d: Partial<SubmissionDoc>, setErr: (e: string) => void): boolean {
  if (!d.title || d.title.trim().length < 3) {
    setErr("Titel fehlt.");
    return false;
  }
  if (!d.shortDescription || d.shortDescription.trim().length < 10) {
    setErr("Kurzbeschreibung fehlt oder ist zu kurz.");
    return false;
  }
  for (const [k, v] of Object.entries({
    aiStudioShareUrl: d.aiStudioShareUrl,
    githubUrl: d.githubUrl,
    deployUrl: d.deployUrl,
    screenshotUrl: d.screenshotUrl,
  })) {
    if (v && !/^https?:\/\//i.test(v)) {
      setErr(`Bitte vollständige URL im Feld ${k}.`);
      return false;
    }
  }
  return true;
}
