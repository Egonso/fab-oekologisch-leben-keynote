import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useSettings, useUserDoc, useAuthUser } from "../lib/state";
import type { SubmissionDoc, VoteDoc } from "../lib/types";
import { computeLeaderboard, type ScoreRow } from "../lib/scoring";

export function Results() {
  const { fbUser } = useAuthUser();
  const { user } = useUserDoc(fbUser?.uid);
  const { settings } = useSettings();
  const [rows, setRows] = useState<ScoreRow[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === "admin";
  const visibleForEveryone = settings?.currentPhase === "results";

  useEffect(() => {
    (async () => {
      const [sSnap, vSnap] = await Promise.all([
        getDocs(collection(db, "submissions")),
        getDocs(collection(db, "votes")),
      ]);
      const subs: SubmissionDoc[] = sSnap.docs.map(
        (d) => ({ id: d.id, ...d.data() } as SubmissionDoc)
      );
      const votes: VoteDoc[] = vSnap.docs.map(
        (d) => ({ id: d.id, ...d.data() } as VoteDoc)
      );
      setRows(computeLeaderboard(subs, votes));
      setLoading(false);
    })();
  }, [settings]);

  if (loading) return <div className="muted">…lädt</div>;

  return (
    <div>
      <div className="section-header">
        <div>
          <span className="eyebrow">FAB · Results</span>
          <h1>Leaderboard.</h1>
          <p className="muted">
            Borda-Score über alle gültigen Rankings. Tie-Break: mehr 1st-Place-Stimmen → besserer
            Durchschnittsrang → frühere Einreichung.
          </p>
        </div>
      </div>

      {!visibleForEveryone && !isAdmin && (
        <div className="notice">
          Ergebnisse werden öffentlich, sobald der Admin die Phase auf „results“ stellt.
        </div>
      )}

      {(visibleForEveryone || isAdmin) && (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Titel</th>
                <th>Teilnehmer</th>
                <th>Score</th>
                <th>1st</th>
                <th>Ø Rang</th>
                <th>Links</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.submissionId} className={i === 0 ? "winner highlight" : ""}>
                  <td className="num">{String(i + 1).padStart(2, "0")}</td>
                  <td>
                    <strong>{r.title}</strong>
                    {i === 0 && (
                      <span className="tag green" style={{ marginLeft: 8 }}>Winner</span>
                    )}
                  </td>
                  <td>{r.participantName}</td>
                  <td className="num">{r.score}</td>
                  <td className="num">{r.firstPlaceVotes}</td>
                  <td className="num">{r.averageRank.toFixed(2)}</td>
                  <td>
                    <div className="link-row" style={{ fontSize: 12 }}>
                      {r.submission.aiStudioShareUrl && <a href={r.submission.aiStudioShareUrl} target="_blank" rel="noreferrer">AI Studio</a>}
                      {r.submission.githubUrl && <a href={r.submission.githubUrl} target="_blank" rel="noreferrer">GitHub</a>}
                      {r.submission.deployUrl && <a href={r.submission.deployUrl} target="_blank" rel="noreferrer">Live</a>}
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="muted">
                    Noch keine gültigen Ergebnisse.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {isAdmin && !visibleForEveryone && (
            <p className="muted" style={{ marginTop: 24, fontSize: 13 }}>
              Admin-Ansicht: Leaderboard wird live berechnet, Teilnehmer sehen es erst in der Results-Phase.
            </p>
          )}
        </>
      )}
    </div>
  );
}
