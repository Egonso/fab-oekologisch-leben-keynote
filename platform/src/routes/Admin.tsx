import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useSettings } from "../lib/state";
import type { InviteCodeDoc, SubmissionDoc, UserDoc, VoteDoc } from "../lib/types";
import type { Phase } from "../lib/constants";
import { PHASE_LABEL } from "../lib/constants";

export function Admin() {
  const { settings } = useSettings();
  const [codes, setCodes] = useState<InviteCodeDoc[]>([]);
  const [users, setUsers] = useState<UserDoc[]>([]);
  const [subs, setSubs] = useState<SubmissionDoc[]>([]);
  const [votes, setVotes] = useState<VoteDoc[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const unsubs = [
      onSnapshot(collection(db, "inviteCodes"), (s) =>
        setCodes(s.docs.map((d) => ({ code: d.id, ...(d.data() as any) } as InviteCodeDoc)))
      ),
      onSnapshot(query(collection(db, "users")), (s) =>
        setUsers(s.docs.map((d) => ({ id: d.id, ...(d.data() as any) } as UserDoc)))
      ),
      onSnapshot(collection(db, "submissions"), (s) =>
        setSubs(s.docs.map((d) => ({ id: d.id, ...(d.data() as any) } as SubmissionDoc)))
      ),
      onSnapshot(collection(db, "votes"), (s) =>
        setVotes(s.docs.map((d) => ({ id: d.id, ...(d.data() as any) } as VoteDoc)))
      ),
    ];
    return () => unsubs.forEach((u) => u());
  }, []);

  async function setPhase(p: Phase) {
    try {
      await updateDoc(doc(db, "settings", "config"), {
        currentPhase: p,
        submissionsOpen: p === "submission",
        votingOpen: p === "voting",
        updatedAt: serverTimestamp(),
      });
      setMsg(`Phase auf ${PHASE_LABEL[p]} gesetzt.`);
    } catch (e: any) {
      setErr(String(e?.message ?? e));
    }
  }

  async function toggleFlag(key: "submissionsOpen" | "votingOpen") {
    if (!settings) return;
    await updateDoc(doc(db, "settings", "config"), {
      [key]: !settings[key],
      updatedAt: serverTimestamp(),
    });
  }

  async function createCode(form: HTMLFormElement) {
    const fd = new FormData(form);
    const code = String(fd.get("code") ?? "").trim().toUpperCase();
    if (!code) return;
    const role = String(fd.get("role") ?? "participant") as "admin" | "participant";
    const maxUses = Number(fd.get("maxUses") ?? 1);
    const label = String(fd.get("label") ?? "");
    await setDoc(doc(db, "inviteCodes", code), {
      code,
      role,
      label,
      maxUses,
      usedCount: 0,
      isActive: true,
      createdAt: serverTimestamp(),
    });
    form.reset();
  }

  async function toggleCode(code: InviteCodeDoc) {
    await updateDoc(doc(db, "inviteCodes", code.code), {
      isActive: !code.isActive,
    });
  }

  function exportSubmissionsCsv() {
    const header = [
      "id",
      "participantName",
      "title",
      "status",
      "shortDescription",
      "aiStudioShareUrl",
      "githubUrl",
      "deployUrl",
      "screenshotUrl",
    ];
    const rows = subs.map((s) =>
      header.map((h) => csvCell((s as any)[h])).join(",")
    );
    downloadCsv("submissions.csv", [header.join(","), ...rows].join("\n"));
  }

  function exportVotesCsv() {
    const uById = new Map(users.map((u) => [u.id, u]));
    const header = ["voter", "email", "ranking"];
    const rows = votes.map((v) => {
      const u = uById.get(v.voterUserId);
      return [
        csvCell(u?.fullName ?? v.voterUserId),
        csvCell(u?.email ?? ""),
        csvCell(v.rankedSubmissionIds.join(" > ")),
      ].join(",");
    });
    downloadCsv("votes.csv", [header.join(","), ...rows].join("\n"));
  }

  async function toggleUserActive(u: UserDoc) {
    await updateDoc(doc(db, "users", u.id), { isActive: !u.isActive });
  }

  return (
    <div>
      <div className="section-header">
        <div>
          <span className="eyebrow">FAB · Admin</span>
          <h1>Kontrolle.</h1>
          <p className="muted">Phasen umschalten, Invite-Codes, User, Submissions, Export.</p>
        </div>
        <div>
          <span className="tag green">
            Phase: {settings ? PHASE_LABEL[settings.currentPhase] : "—"}
          </span>
        </div>
      </div>

      {msg && <div className="notice">{msg}</div>}
      {err && <div className="notice error">{err}</div>}

      {/* phases */}
      <section className="panel">
        <h3>Phasen</h3>
        <p className="muted">
          Nur eine Phase aktiv. Setzen schaltet submissionsOpen bzw. votingOpen passend dazu.
        </p>
        <div className="link-row" style={{ marginTop: 16 }}>
          {(["registration", "submission", "voting", "results"] as Phase[]).map((p) => (
            <button
              key={p}
              className={settings?.currentPhase === p ? "btn green" : "btn ghost"}
              onClick={() => setPhase(p)}
            >
              {PHASE_LABEL[p]}
            </button>
          ))}
        </div>
        <div className="spacer-sm" />
        <label style={{ display: "block", marginBottom: 8 }}>
          <input
            type="checkbox"
            checked={!!settings?.submissionsOpen}
            onChange={() => toggleFlag("submissionsOpen")}
          />{" "}
          submissionsOpen
        </label>
        <label style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={!!settings?.votingOpen}
            onChange={() => toggleFlag("votingOpen")}
          />{" "}
          votingOpen
        </label>
      </section>

      <div className="spacer-md" />

      {/* invite codes */}
      <section className="panel">
        <h3>Invite-Codes</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createCode(e.currentTarget);
          }}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr 120px 80px auto", gap: 12, alignItems: "end", marginBottom: 16 }}
        >
          <div className="field"><label>Code</label><input className="input" name="code" required placeholder="FAB-XYZ" /></div>
          <div className="field"><label>Label</label><input className="input" name="label" placeholder="Gruppe A" /></div>
          <div className="field">
            <label>Rolle</label>
            <select className="select" name="role">
              <option value="participant">participant</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <div className="field"><label>Max-Uses</label><input className="input" name="maxUses" type="number" min={1} defaultValue={1} /></div>
          <button className="btn green" type="submit">Anlegen</button>
        </form>

        <table className="table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Label</th>
              <th>Rolle</th>
              <th>Max</th>
              <th>Used</th>
              <th>Aktiv</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {codes.map((c) => (
              <tr key={c.code}>
                <td><code>{c.code}</code></td>
                <td>{c.label}</td>
                <td>{c.role}</td>
                <td className="num">{c.maxUses ?? 1}</td>
                <td className="num">{c.usedCount ?? 0}</td>
                <td>{c.isActive ? "aktiv" : "deaktiviert"}</td>
                <td>
                  <button className="btn ghost" onClick={() => toggleCode(c)}>
                    {c.isActive ? "deaktivieren" : "aktivieren"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="spacer-md" />

      {/* users */}
      <section className="panel">
        <h3>User</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>E-Mail</th>
              <th>Rolle</th>
              <th>Aktiv</th>
              <th>Invite</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.fullName}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.isActive ? "ja" : "nein"}</td>
                <td><code>{u.inviteCodeUsed}</code></td>
                <td>
                  <button className="btn ghost" onClick={() => toggleUserActive(u)}>
                    {u.isActive ? "deaktivieren" : "aktivieren"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="spacer-md" />

      {/* submissions + votes */}
      <section className="panel">
        <h3>Submissions & Votes</h3>
        <div className="link-row" style={{ marginBottom: 16 }}>
          <button className="btn ghost" onClick={exportSubmissionsCsv}>Submissions CSV</button>
          <button className="btn ghost" onClick={exportVotesCsv}>Votes CSV</button>
        </div>
        <table className="table">
          <thead>
            <tr><th>Titel</th><th>Teilnehmer</th><th>Status</th><th>Links</th></tr>
          </thead>
          <tbody>
            {subs.map((s) => (
              <tr key={s.id}>
                <td>{s.title}</td>
                <td>{s.participantName}</td>
                <td>{s.status}</td>
                <td className="link-row" style={{ fontSize: 12 }}>
                  {s.aiStudioShareUrl && <a href={s.aiStudioShareUrl} target="_blank" rel="noreferrer">AI</a>}
                  {s.githubUrl && <a href={s.githubUrl} target="_blank" rel="noreferrer">Git</a>}
                  {s.deployUrl && <a href={s.deployUrl} target="_blank" rel="noreferrer">Live</a>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="muted" style={{ marginTop: 16, fontSize: 13 }}>
          {subs.length} Submissions · {votes.length} Votes · {users.length} User
        </p>
      </section>
    </div>
  );
}

function csvCell(v: unknown) {
  const s = v == null ? "" : String(v);
  if (s.includes(",") || s.includes('"') || s.includes("\n"))
    return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function downloadCsv(name: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}
