export const PHASES = {
  registration: "registration",
  submission: "submission",
  voting: "voting",
  results: "results",
} as const;

export type Phase = keyof typeof PHASES;

export const ROLES = {
  admin: "admin",
  participant: "participant",
} as const;

export type Role = keyof typeof ROLES;

export const SUBMISSION_STATUS = {
  draft: "draft",
  submitted: "submitted",
} as const;

export type SubmissionStatus = keyof typeof SUBMISSION_STATUS;

export const ADMIN_BOOT_CODE =
  import.meta.env.VITE_ADMIN_BOOT_CODE ?? "ADMIN-BOOT-2026";

export const IMGBB_KEY = import.meta.env.VITE_IMGBB_KEY ?? "";

export const PHASE_LABEL: Record<Phase, string> = {
  registration: "Registration",
  submission: "Submission",
  voting: "Voting",
  results: "Results",
};
