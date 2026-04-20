import { useEffect, useMemo, useState } from "react";
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuthUser, useSettings, useUserDoc } from "../lib/state";
import type { SubmissionDoc, VoteDoc } from "../lib/types";

export function Voting() {
  const { fbUser } = useAuthUser();
  const { user } = useUserDoc(fbUser?.uid);
  const { settings } = useSettings();

  const [subs, setSubs] = useState<SubmissionDoc[]>([]);
  const [ranking, setRanking] = useState<string[]>([]);
  const [alreadyVoted, setAlreadyVoted] = useState<VoteDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!fbUser) return;
    (async () => {
      const sSnap = await getDocs(
        query(collection(db, "submissions"), where("status", "==", "submitted"))
      );
      const list = sSnap.docs
        .map((d) => ({ id: d.id, ...d.data() } as SubmissionDoc))
        .filter((s) => s.userId !== fbUser.uid);
      setSubs(list);

      const vRef = doc(db, "votes", fbUser.uid);
      const v = await getDoc(vRef);
      if (v.exists()) {
        const vd = v.data() as VoteDoc;
        setAlreadyVoted(vd);
        setRanking(vd.rankedSubmissionIds);
      } else {
        setRanking(list.map((s) => s.id));
      }
      setLoading(false);
    })();
  }, [fbUser]);

  const rankedSet = useMemo(() => new Set(ranking), [ranking]);
  const unranked = useMemo(
    () => subs.filter((s) => !rankedSet.has(s.id)),
    [subs, rankedSet]
  );
  const complete = ranking.length === subs.length && unranked.length === 0;

  function move(i: number, d: -1 | 1) {
    setRanking((r) => {
      const j = i + d;
      if (j < 0 || j >= r.length) return r;
      const n = r.slice();
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });
  }

  function addToRanking(id: string) {
    setRanking((r) => (r.includes(id) ? r : [...r, id]));
  }
  function removeFromRanking(id: string) {
    setRanking((r) => r.filter((x) => x !== id));
  }

  async function submit() {
    if (!fbUser) return;
    if (!complete) {
      setErr("Du musst alle Projekte vollständig ranken.");
      return;
    }
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const ref = doc(db, "votes", fbUser.uid);
      await setDoc(ref, {
        id: fbUser.uid,
        voterUserId: fbUser.uid,
        rankedSubmissionIds: ranking,
        submittedAt: serverTimestamp(),
        createdAt: alreadyVoted?.createdAt ?? serverTimestamp(),
      });
      setMsg("Ranking eingereicht. Danke!");
      setAlreadyVoted({
        id: fbUser.uid,
        voterUserId: fbUser.uid,
        rankedSubmissionIds: ranking,
      });
    } catch (e: any) {
      setErr(String(e?.message ?? e));
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <div className="muted">…lädt</div>;
  if (!settings || !user) return null;

  const votingAllowed =
    settings.currentPhase === "voting" && settings.votingOpen && user.isActive;

  const subById = new Map(subs.map((s) => [s.id, s]));

  return (
    <div>
      <div className="section-header">
        <div>
          <span className="eyebrow">FAB · Voting</span>
          <h1>Rank the class.</h1>
          <p className="muted">Platz 1 = dein Favorit. Alle anderen müssen vollständig gerankt werden.</p>
        </div>
        <div>
          <span className="tag green">{subs.length} Projekte</span>
        </div>
      </div>

      {!votingAllowed && (
        <div className="notice">
          Voting ist aktuell nicht offen. Sobald der Admin freigibt, kannst du dein Ranking abgeben.
        </div>
      )}

      {subs.length === 0 && (
        <div className="notice">
          Es gibt noch keine eingereichten Projekte außer ggf. deinem eigenen.
        </div>
      )}

      <div className="grid-2">
        <section>
          <h3>Dein Ranking</h3>
          <p className="muted" style={{ marginBottom: 16 }}>
            Reihenfolge = beste zuerst. Mit ▲ und ▼ verschieben.
          </p>
          <ol className="rank-list">
            {ranking.map((id, i) => {
              const s = subById.get(id);
              if (!s) return null;
              return (
                <li key={id} className="rank-item">
                  <span className="rank-num">{String(i + 1).padStart(2, "0")}</span>
                  <div className="rank-body">
                    <div className="title">{s.title}</div>
                    <div className="muted">{s.participantName}</div>
                  </div>
                  <div className="rank-controls">
                    <button
                      className="btn ghost"
                      onClick={() => move(i, -1)}
                      disabled={i === 0 || !votingAllowed}
                      aria-label="nach oben"
                    >▲</button>
                    <button
                      className="btn ghost"
                      onClick={() => move(i, +1)}
                      disabled={i === ranking.length - 1 || !votingAllowed}
                      aria-label="nach unten"
                    >▼</button>
                    <button
                      className="btn ghost"
                      onClick={() => removeFromRanking(id)}
                      disabled={!votingAllowed}
                      aria-label="entfernen"
                    >−</button>
                  </div>
                </li>
              );
            })}
            {unranked.map((s) => (
              <li key={s.id} className="rank-item unranked">
                <span className="rank-num">··</span>
                <div className="rank-body">
                  <div className="title">{s.title}</div>
                  <div className="muted">{s.participantName}</div>
                </div>
                <div className="rank-controls">
                  <button
                    className="btn"
                    onClick={() => addToRanking(s.id)}
                    disabled={!votingAllowed}
                  >+ Rank</button>
                </div>
              </li>
            ))}
          </ol>

          {err && <div className="notice error" style={{ marginTop: 16 }}>{err}</div>}
          {msg && <div className="notice" style={{ marginTop: 16 }}>{msg}</div>}

          <div className="spacer-md" />
          <button
            className="btn green"
            onClick={submit}
            disabled={!votingAllowed || !complete || busy}
          >
            {alreadyVoted ? "Ranking aktualisieren" : "Ranking einreichen"}
          </button>
          {!complete && (
            <span className="muted" style={{ marginLeft: 12, fontSize: 12 }}>
              {unranked.length} Projekte noch zu platzieren
            </span>
          )}
        </section>

        <section>
          <h3>Projekte</h3>
          <p className="muted" style={{ marginBottom: 16 }}>
            Details zu jedem Eintrag. Links öffnen in neuem Tab.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {subs.map((s) => (
              <article key={s.id} className="panel tight">
                <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 16 }}>
                  {s.screenshotUrl ? (
                    <img src={s.screenshotUrl} alt="" className="shot-sm" />
                  ) : (
                    <div className="shot-sm" />
                  )}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                      <div>
                        <strong>{s.title}</strong>
                        <div className="muted">{s.participantName}</div>
                      </div>
                      <span className="tag ghost">{rankOf(ranking, s.id)}</span>
                    </div>
                    <p style={{ fontSize: 13, marginTop: 8 }}>{s.shortDescription}</p>
                    <div className="link-row" style={{ marginTop: 8, fontSize: 12 }}>
                      {s.aiStudioShareUrl && <a href={s.aiStudioShareUrl} target="_blank" rel="noreferrer">AI Studio</a>}
                      {s.githubUrl && <a href={s.githubUrl} target="_blank" rel="noreferrer">GitHub</a>}
                      {s.deployUrl && <a href={s.deployUrl} target="_blank" rel="noreferrer">Live</a>}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function rankOf(ranking: string[], id: string) {
  const i = ranking.indexOf(id);
  return i === -1 ? "unranked" : `#${String(i + 1).padStart(2, "0")}`;
}
