import type { SubmissionDoc, VoteDoc } from "./types";

export interface ScoreRow {
  submissionId: string;
  title: string;
  participantName: string;
  score: number;
  firstPlaceVotes: number;
  averageRank: number; // 1-based average
  submittedAt: number; // ms since epoch, 0 if unknown
  submission: SubmissionDoc;
}

/**
 * Borda scoring:
 *   for each vote, a submission at index i (0-based, best first)
 *   in a ranking of length L receives (L - 1 - i) points.
 *
 * Tie-break order:
 *   1. more first-place votes
 *   2. better (lower) averageRank
 *   3. earlier submittedAt
 */
export function computeLeaderboard(
  submissions: SubmissionDoc[],
  votes: VoteDoc[]
): ScoreRow[] {
  const submitted = submissions.filter((s) => s.status === "submitted");
  const byId = new Map(submitted.map((s) => [s.id, s]));

  const rows = new Map<
    string,
    {
      submissionId: string;
      score: number;
      firstPlaceVotes: number;
      rankSum: number;
      rankCount: number;
    }
  >();

  for (const s of submitted) {
    rows.set(s.id, {
      submissionId: s.id,
      score: 0,
      firstPlaceVotes: 0,
      rankSum: 0,
      rankCount: 0,
    });
  }

  for (const vote of votes) {
    const ranking = vote.rankedSubmissionIds.filter((id) => byId.has(id));
    const L = ranking.length;
    if (L === 0) continue;
    for (let i = 0; i < L; i++) {
      const id = ranking[i];
      const row = rows.get(id);
      if (!row) continue;
      row.score += L - 1 - i;
      row.rankSum += i + 1;
      row.rankCount += 1;
      if (i === 0) row.firstPlaceVotes += 1;
    }
  }

  const result: ScoreRow[] = [];
  for (const [id, r] of rows) {
    const s = byId.get(id)!;
    const averageRank = r.rankCount === 0 ? Infinity : r.rankSum / r.rankCount;
    const submittedAt = toMs(s.submittedAt);
    result.push({
      submissionId: id,
      title: s.title,
      participantName: s.participantName,
      score: r.score,
      firstPlaceVotes: r.firstPlaceVotes,
      averageRank: Number.isFinite(averageRank) ? averageRank : 0,
      submittedAt,
      submission: s,
    });
  }

  result.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.firstPlaceVotes !== a.firstPlaceVotes)
      return b.firstPlaceVotes - a.firstPlaceVotes;
    if (a.averageRank !== b.averageRank) return a.averageRank - b.averageRank;
    if (a.submittedAt !== b.submittedAt) return a.submittedAt - b.submittedAt;
    return 0;
  });

  return result;
}

function toMs(ts: unknown): number {
  if (!ts) return 0;
  const t = ts as { toMillis?: () => number; seconds?: number };
  if (typeof t.toMillis === "function") return t.toMillis();
  if (typeof t.seconds === "number") return t.seconds * 1000;
  return 0;
}
