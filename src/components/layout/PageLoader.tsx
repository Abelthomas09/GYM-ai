import { Dumbbell } from "lucide-react";

interface PageLoaderProps {
  label?: string;
}

export default function PageLoader({
  label = "Loading your session...",
}: PageLoaderProps) {
  return (
    <div className="min-h-[calc(100dvh-4rem)] px-6 py-8 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 rounded-lg border border-[var(--color-border)] bg-white px-8 py-7 text-center shadow-lg shadow-slate-900/5">
        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-accent-soft)]">
          <Dumbbell className="h-6 w-6 animate-pulse text-[var(--color-accent)]" />
        </span>
        <div>
          <p className="font-semibold text-[var(--color-foreground)]">
            GymAI is updating
          </p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">{label}</p>
        </div>
      </div>
    </div>
  );
}
