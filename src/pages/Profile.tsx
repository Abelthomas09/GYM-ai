import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useState } from "react";
import { Button } from "../components/ui/Button";
import {
  Calendar,
  Dumbbell,
  RefreshCcw,
  Target,
  TrendingUp,
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { PlanDisplay } from "../components/plan/PlanDisplay";
import PageLoader from "../components/layout/PageLoader";

export default function Profile() {
  const { user, isLoading, plan, generatePlan } = useAuth();
  const [isRegenerating, setIsRegenerating] = useState(false);

  if (isLoading) {
    return <PageLoader label="Refreshing your training plan..." />;
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  if (!plan) {
    return <Navigate to="/onboarding" replace />;
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  async function handleRegenerate() {
    setIsRegenerating(true);

    try {
      await generatePlan();
    } finally {
      setIsRegenerating(false);
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 rounded-lg bg-[var(--color-foreground)] p-6 text-white shadow-lg shadow-slate-900/10">
          <div>
            <h1 className="text-3xl font-bold mb-1">Your Training Plan</h1>
            <p className="text-white/70">
              Version {plan.version} - Created {formatDate(plan.createdAt)}
            </p>
          </div>

          <Button
            variant="secondary"
            className="gap-2 border-white/15 bg-white/10 text-white hover:bg-white/15"
            onClick={handleRegenerate}
            disabled={isRegenerating}
          >
            <RefreshCcw
              className={`w-4 h-4 ${isRegenerating ? "animate-spin" : ""}`}
            />
            {isRegenerating ? "Regenerating..." : "Regenerate Plan"}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-8">
          <Card variant="bordered" className="flex items-start gap-4">
            <div className="shrink-0 w-11 h-11 flex items-center justify-center rounded-lg bg-[var(--color-accent-soft)]">
              <Target className="w-5 h-5 text-[var(--color-accent)]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-[var(--color-muted)]">Goal</p>
              <p className="font-medium text-sm leading-snug">
                {plan.overview.goal}
              </p>
            </div>
          </Card>
          <Card variant="bordered" className="flex items-start gap-4">
            <div className="shrink-0 w-11 h-11 flex items-center justify-center rounded-lg bg-[var(--color-accent-soft)]">
              <Calendar className="w-5 h-5 text-[var(--color-accent)]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-[var(--color-muted)]">Frequency</p>
              <p className="font-medium text-sm leading-snug">
                {plan.overview.frequency}
              </p>
            </div>
          </Card>
          <Card variant="bordered" className="flex items-start gap-4">
            <div className="shrink-0 w-11 h-11 flex items-center justify-center rounded-lg bg-[var(--color-accent-soft)]">
              <Dumbbell className="w-5 h-5 text-[var(--color-accent)]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-[var(--color-muted)]">Split</p>
              <p className="font-medium text-sm leading-snug">
                {plan.overview.split}
              </p>
            </div>
          </Card>
          <Card variant="bordered" className="flex items-start gap-4">
            <div className="shrink-0 w-11 h-11 flex items-center justify-center rounded-lg bg-[var(--color-highlight-soft)]">
              <TrendingUp className="w-5 h-5 text-[var(--color-highlight)]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-[var(--color-muted)]">Version</p>
              <p className="font-medium text-sm leading-snug">
                {plan.version}
              </p>
            </div>
          </Card>
        </div>

        <Card
          variant="bordered"
          className="mb-8 border-l-4 border-l-[var(--color-accent)]"
        >
          <h2 className="font-semibold text-lg mb-2">Program Notes</h2>
          <p className="text-[var(--color-muted)] text-sm leading-relaxed">
            {plan.overview.notes}
          </p>
        </Card>

        <h2 className="font-semibold text-xl mb-4">Weekly Schedule</h2>
        <PlanDisplay weeklySchedule={plan.weeklySchedule} />

        <Card
          variant="bordered"
          className="mb-8 border-l-4 border-l-[var(--color-highlight)]"
        >
          <h2 className="font-semibold text-lg mb-2">Progression Strategy</h2>
          <p className="text-[var(--color-muted)] text-sm leading-relaxed">
            {plan.progression}
          </p>
        </Card>
      </div>
    </div>
  );
}
