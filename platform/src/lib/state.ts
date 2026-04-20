import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import type { SettingsDoc, UserDoc } from "./types";
import { onAuth } from "./auth";
import { User as FbUser } from "firebase/auth";

export function useAuthUser(): { fbUser: FbUser | null; loading: boolean } {
  const [state, setState] = useState<{ fbUser: FbUser | null; loading: boolean }>(
    { fbUser: null, loading: true }
  );
  useEffect(() => {
    return onAuth((u) => setState({ fbUser: u, loading: false }));
  }, []);
  return state;
}

export function useUserDoc(uid: string | null | undefined) {
  const [doc_, setDoc] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!uid) {
      setDoc(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const ref = doc(db, "users", uid);
    const unsub = onSnapshot(ref, (snap) => {
      setDoc(snap.exists() ? (snap.data() as UserDoc) : null);
      setLoading(false);
    });
    return unsub;
  }, [uid]);
  return { user: doc_, loading };
}

export function useSettings() {
  const [settings, setSettings] = useState<SettingsDoc | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const ref = doc(db, "settings", "config");
    const unsub = onSnapshot(ref, (snap) => {
      setSettings(snap.exists() ? (snap.data() as SettingsDoc) : null);
      setLoading(false);
    });
    return unsub;
  }, []);
  return { settings, loading };
}
