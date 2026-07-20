/**
 * Resurrection-opportunity scoring for a GitHub repository.
 *
 * Ghost Commit resurrects dormant repos, but nothing decided *which* repos are
 * worth it. This pure module turns repo metadata into a 0–100 opportunity score
 * plus human-readable signals — a good candidate is popular, dormant (but not
 * dead-forever), unarchived, and missing modern basics we can add.
 */

export type RepoMeta = {
  pushedAt: string; // ISO timestamp of last push
  archived: boolean;
  stars: number;
  openIssues: number;
  hasReadme: boolean;
  license: string | null;
  now?: string; // injectable clock for deterministic scoring/tests
};

export type Dormancy = "active" | "stale" | "dormant" | "dead";

export type RepoHealth = {
  score: number; // 0–100 resurrection opportunity
  dormancy: Dormancy;
  monthsSincePush: number;
  signals: string[];
  recommend: boolean;
};

function monthsBetween(fromIso: string, toIso: string): number {
  const from = new Date(fromIso).getTime();
  const to = new Date(toIso).getTime();
  if (!Number.isFinite(from) || !Number.isFinite(to) || to < from) return 0;
  return (to - from) / (1000 * 60 * 60 * 24 * 30.44);
}

function classify(months: number): Dormancy {
  if (months < 3) return "active";
  if (months < 12) return "stale";
  if (months < 30) return "dormant";
  return "dead";
}

export function scoreRepository(meta: RepoMeta): RepoHealth {
  const now = meta.now ?? new Date().toISOString();
  const months = monthsBetween(meta.pushedAt, now);
  const dormancy = classify(months);
  const signals: string[] = [];

  let score = 0;

  // Popularity is the strongest signal that a revival is worth the effort.
  const starPoints = Math.min(45, Math.round(Math.log2(meta.stars + 1) * 6));
  score += starPoints;
  if (meta.stars > 0) signals.push(`${meta.stars} stars of latent audience`);

  // Reward the sweet spot: idle enough to need help, not so dead it's abandoned.
  const dormancyPoints = { active: 0, stale: 18, dormant: 30, dead: 12 }[dormancy];
  score += dormancyPoints;
  signals.push(`${dormancy} — last push ~${Math.round(months)} months ago`);

  if (meta.openIssues > 0) {
    score += Math.min(12, meta.openIssues);
    signals.push(`${meta.openIssues} open issues to triage`);
  }
  if (!meta.hasReadme) {
    score += 6;
    signals.push("no README — easy first win");
  }
  if (!meta.license) {
    score += 4;
    signals.push("no license — blocks contributors");
  }
  if (meta.archived) {
    score = Math.round(score * 0.3);
    signals.push("archived — resurrection is read-only unless unarchived");
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  return {
    score,
    dormancy,
    monthsSincePush: Math.round(months),
    signals,
    recommend: score >= 45 && !meta.archived,
  };
}
