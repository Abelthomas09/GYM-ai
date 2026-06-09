import { CalendarCheck, Dumbbell, Sparkles, Target } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = [
  { label: "Start Plan", to: "/onboarding" },
  { label: "Sign In", to: "/auth/sign-in" },
  { label: "Account", to: "/account/profile" },
];

const highlights = [
  { icon: Sparkles, label: "AI-built programs" },
  { icon: Target, label: "Goal-based splits" },
  { icon: CalendarCheck, label: "Weekly structure" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-background)] px-6 pb-6 pt-12">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-lg border border-[var(--color-border)] bg-white shadow-lg shadow-slate-900/5">
        <div className="grid gap-8 p-6 md:grid-cols-[1.1fr_0.9fr] md:items-start md:p-8">
          <div>
            <Link
              to="/"
              className="mb-4 inline-flex items-center gap-2 text-[var(--color-foreground)]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-accent)] text-white">
                <Dumbbell className="h-5 w-5" />
              </span>
              <span className="text-lg font-bold">GymAI</span>
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-[var(--color-muted)]">
              Personalized training plans built around your goal, schedule,
              equipment, and experience level.
            </p>
            <div className="mt-5 inline-flex rounded-full bg-[var(--color-highlight-soft)] px-3 py-1 text-sm font-semibold text-[var(--color-highlight)]">
              Smart plans. Better sessions.
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg bg-[var(--color-card-muted)] p-4">
              <h2 className="mb-3 text-sm font-semibold text-[var(--color-foreground)]">
                App
              </h2>
              <nav className="flex flex-col gap-2">
                {footerLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="rounded-lg bg-[var(--color-foreground)] p-4 text-white">
              <h2 className="mb-3 text-sm font-semibold text-white">
                Built For
              </h2>
              <div className="flex flex-col gap-2">
                {highlights.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 text-sm text-white/75"
                  >
                    <item.icon className="h-4 w-4 text-[var(--color-highlight)]" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-[var(--color-border)] bg-[var(--color-card-muted)] px-6 py-4 text-sm text-[var(--color-muted)] sm:flex-row sm:items-center sm:justify-between md:px-8">
          <p>© {new Date().getFullYear()} GymAI. Train with structure.</p>
          <p className="rounded-full bg-[var(--color-accent)] px-3 py-1 font-semibold text-white">
            AI-ready training flow
          </p>
        </div>
      </div>
    </footer>
  );
}
