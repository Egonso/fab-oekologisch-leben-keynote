import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  User as FbUser,
} from "firebase/auth";
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { ADMIN_BOOT_CODE } from "./constants";
import type { UserDoc } from "./types";

export function onAuth(cb: (user: FbUser | null) => void) {
  return onAuthStateChanged(auth, cb);
}

export async function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signOut() {
  return fbSignOut(auth);
}

export interface SignUpInput {
  fullName: string;
  email: string;
  password: string;
  inviteCode: string;
}

/**
 * Atomic sign-up:
 *   1. create auth user
 *   2. in a single transaction: check invite code, increment usedCount, write /users/{uid}
 *
 * If any step fails after auth user creation we still surface a clean error.
 */
export async function signUp(input: SignUpInput): Promise<UserDoc> {
  const code = input.inviteCode.trim().toUpperCase();
  if (!code) throw new Error("Invite-Code fehlt.");

  // Validate invite code before we create an auth account.
  const ref = doc(db, "inviteCodes", code);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Invite-Code ungültig.");
  const data = snap.data();
  if (!data.isActive) throw new Error("Invite-Code ist deaktiviert.");
  if ((data.usedCount ?? 0) >= (data.maxUses ?? 1))
    throw new Error("Invite-Code wurde schon aufgebraucht.");

  // Create the auth user.
  const cred = await createUserWithEmailAndPassword(
    auth,
    input.email,
    input.password
  );
  const uid = cred.user.uid;

  // Transactionally consume the code and create the user doc.
  try {
    await runTransaction(db, async (tx) => {
      const fresh = await tx.get(ref);
      if (!fresh.exists()) throw new Error("Invite-Code verschwunden.");
      const cur = fresh.data();
      if (!cur.isActive) throw new Error("Invite-Code ist deaktiviert.");
      if ((cur.usedCount ?? 0) >= (cur.maxUses ?? 1))
        throw new Error("Invite-Code wurde schon aufgebraucht.");

      const role = cur.role === "admin" ? "admin" : "participant";
      tx.update(ref, { usedCount: (cur.usedCount ?? 0) + 1 });

      const userRef = doc(db, "users", uid);
      tx.set(userRef, {
        id: uid,
        fullName: input.fullName.trim(),
        email: input.email,
        authProvider: "password",
        role,
        inviteCodeUsed: code,
        isActive: true,
        createdAt: serverTimestamp(),
      });
    });
  } catch (err) {
    // Roll back auth so the user can retry cleanly.
    try {
      await cred.user.delete();
    } catch {}
    throw err;
  }

  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  return userSnap.data() as UserDoc;
}

/**
 * First-run admin bootstrap.
 * Creates the ADMIN-BOOT code document if it is not already present.
 * Intended to be called once from the UI before the first admin signs up.
 */
export async function ensureAdminBootstrap() {
  const ref = doc(db, "inviteCodes", ADMIN_BOOT_CODE);
  const snap = await getDoc(ref);
  if (snap.exists()) return;
  await setDoc(ref, {
    code: ADMIN_BOOT_CODE,
    label: "Admin bootstrap",
    role: "admin",
    isActive: true,
    maxUses: 1,
    usedCount: 0,
    createdAt: serverTimestamp(),
  });
}

/**
 * First-run settings bootstrap.
 */
export async function ensureSettings() {
  const ref = doc(db, "settings", "config");
  const snap = await getDoc(ref);
  if (snap.exists()) return;
  await setDoc(ref, {
    currentPhase: "registration",
    submissionsOpen: false,
    votingOpen: false,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Optional demo seed: creates three participant invite codes
 * with 5 uses each, so you can hand them out during a dry run.
 * Safe to run multiple times – skips any code that already exists.
 */
export async function ensureDemoCodes() {
  const demo = ["FAB-DEMO-1", "FAB-DEMO-2", "FAB-DEMO-3"];
  for (const code of demo) {
    const ref = doc(db, "inviteCodes", code);
    const snap = await getDoc(ref);
    if (snap.exists()) continue;
    await setDoc(ref, {
      code,
      label: "Demo",
      role: "participant",
      isActive: true,
      maxUses: 5,
      usedCount: 0,
      createdAt: serverTimestamp(),
    });
  }
}
