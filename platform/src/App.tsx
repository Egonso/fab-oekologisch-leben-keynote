import { Route, Routes, Navigate } from "react-router-dom";
import { Shell } from "./ui/Shell";
import { useAuthUser, useUserDoc } from "./lib/state";
import { AuthPage } from "./routes/AuthPage";
import { Dashboard } from "./routes/Dashboard";
import { SubmissionForm } from "./routes/SubmissionForm";
import { Voting } from "./routes/Voting";
import { Results } from "./routes/Results";
import { Admin } from "./routes/Admin";
import { Bootstrap } from "./routes/Bootstrap";

function Guarded({ children, admin }: { children: JSX.Element; admin?: boolean }) {
  const { fbUser, loading } = useAuthUser();
  const { user, loading: userLoading } = useUserDoc(fbUser?.uid);
  if (loading || (fbUser && userLoading)) {
    return <div className="muted">…lädt</div>;
  }
  if (!fbUser) return <Navigate to="/auth" replace />;
  if (admin && user?.role !== "admin") return <Navigate to="/" replace />;
  if (!user) {
    return (
      <div className="notice error">
        Du bist angemeldet, aber es gibt kein User-Profil. Bitte neu registrieren oder den Admin kontaktieren.
      </div>
    );
  }
  return children;
}

export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/bootstrap" element={<Bootstrap />} />
        <Route
          path="/"
          element={
            <Guarded>
              <Dashboard />
            </Guarded>
          }
        />
        <Route
          path="/submit"
          element={
            <Guarded>
              <SubmissionForm />
            </Guarded>
          }
        />
        <Route
          path="/vote"
          element={
            <Guarded>
              <Voting />
            </Guarded>
          }
        />
        <Route
          path="/results"
          element={
            <Guarded>
              <Results />
            </Guarded>
          }
        />
        <Route
          path="/admin"
          element={
            <Guarded admin>
              <Admin />
            </Guarded>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Shell>
  );
}
