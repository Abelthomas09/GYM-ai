import { AuthView } from "@neondatabase/neon-js/auth/react";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authClient } from "../lib/auth";

function SignOutCard() {
  const navigate = useNavigate();
  const signingOutRef = useRef(false);

  useEffect(() => {
    if (signingOutRef.current) return;
    signingOutRef.current = true;

    authClient.signOut().finally(() => {
      navigate("/auth/sign-in", { replace: true });
    });
  }, [navigate]);

  return (
    <div className="w-full rounded-xl border border-[var(--color-border)] bg-white px-6 py-7 text-center shadow-sm shadow-slate-900/5">
      <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--color-accent-soft)]">
        <Loader2 className="h-5 w-5 animate-spin text-[var(--color-accent)]" />
      </div>
      <h1 className="text-xl font-semibold text-[var(--color-foreground)]">
        Signing out
      </h1>
      <p className="mt-2 text-sm text-[var(--color-muted)]">
        Ending your session...
      </p>
    </div>
  );
}

export default function Auth() {
  const { pathname } = useParams();
  const isSigningOut = pathname === "sign-out";

  return (
    <div className="mt-16 min-h-[calc(100dvh-4rem)] px-6 py-10 sm:py-12 flex items-center justify-center">
      <div className="w-full max-w-sm">
        {isSigningOut ? (
          <SignOutCard />
        ) : (
          <AuthView className="mx-auto w-full max-w-sm" pathname={pathname} />
        )}
      </div>
    </div>
  );
}
