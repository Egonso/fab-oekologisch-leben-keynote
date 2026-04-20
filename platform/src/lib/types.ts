import type { Role, SubmissionStatus, Phase } from "./constants";

export interface UserDoc {
  id: string;
  fullName: string;
  email: string;
  authProvider: "password" | "google";
  role: Role;
  inviteCodeUsed: string;
  isActive: boolean;
  createdAt?: unknown;
}

export interface InviteCodeDoc {
  code: string;
  label?: string;
  role: Role;
  isActive: boolean;
  maxUses: number;
  usedCount: number;
  createdAt?: unknown;
}

export interface SubmissionDoc {
  id: string;
  userId: string;
  participantName: string;
  title: string;
  shortDescription: string;
  aiStudioShareUrl?: string;
  githubUrl?: string;
  deployUrl?: string;
  screenshotUrl?: string;
  status: SubmissionStatus;
  submittedAt?: unknown;
  updatedAt?: unknown;
}

export interface VoteDoc {
  id: string;
  voterUserId: string;
  rankedSubmissionIds: string[];
  createdAt?: unknown;
  submittedAt?: unknown;
}

export interface SettingsDoc {
  currentPhase: Phase;
  submissionsOpen: boolean;
  votingOpen: boolean;
  updatedAt?: unknown;
  updatedBy?: string;
}
