import { Link, Navigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Calendar,
  Clock,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useAuth } from "../context/useAuth";
import heroImage from "../assets/gym-ai-hero.png";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Plans",
    description:
      "Get a training program tailored to your goals, experience, and schedule.",
  },
  {
    icon: Target,
    title: "Goal-Oriented",
    description:
      "Whether you want to build muscle, lose fat, or get stronger - we optimize for your goal.",
  },
  {
    icon: Calendar,
    title: "Flexible Scheduling",
    description:
      "Plans that fit your lifestyle. Train 2 days or 6 - we adapt to you.",
  },
  {
    icon: Clock,
    title: "Time-Efficient",
    description:
      "Every workout is designed to maximize results in your available time.",
  },
];

const sampleWorkouts = [
  "Upper Strength",
  "Lower Strength",
  "Upper Volume",
  "Lower Volume",
];

export default function Home() {
  const { user, isLoading } = useAuth();

  if (!isLoading && user) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <div className="min-h-screen">
      <section className="relative px-6 pb-16 pt-28 overflow-hidden">
        <div className="relative max-w-6xl mx-auto grid gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[var(--color-border)] mb-8 shadow-sm shadow-slate-900/5">
              <Zap className="w-4 h-4 text-[var(--color-accent)]" />
              <span className="text-sm text-[var(--color-muted)]">
                AI-powered training plans
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
              Your Perfect
              <br />
              <span className="text-[var(--color-accent)]">Gym Plan</span> in
              Seconds
            </h1>

            <p className="text-xl text-[var(--color-muted)] max-w-2xl mb-10 leading-relaxed">
              Stop guessing. Get a personalized training program built by AI,
              tailored to your goals, experience, and schedule.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/onboarding">
                <Button size="lg" className="gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/auth/sign-in">
                <Button variant="secondary" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 rounded-lg bg-[var(--color-accent-soft)]/70" />
            <img
              src={heroImage}
              alt="Athlete preparing for a strength workout in a bright gym"
              className="relative aspect-[4/3] w-full rounded-lg border border-[var(--color-border)] object-cover shadow-xl shadow-slate-900/10"
            />
          </div>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-accent)]">
              Plan preview
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              See the structure before you train.
            </h2>
            <p className="text-[var(--color-muted)] text-lg leading-relaxed">
              GymAI turns your goals into a weekly split with the right session
              length, effort targets, and progression.
            </p>
          </div>

          <div className="rounded-lg border border-[var(--color-border)] bg-white p-5 shadow-xl shadow-slate-900/10">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-[var(--color-muted)]">This week</p>
                <h3 className="text-2xl font-bold">Upper/Lower Split</h3>
              </div>
              <span className="rounded-full bg-[var(--color-highlight-soft)] px-3 py-1 text-sm font-semibold text-[var(--color-highlight)]">
                4 days
              </span>
            </div>

            <div className="space-y-3">
              {sampleWorkouts.map((workout, index) => (
                <div
                  key={workout}
                  className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-card-muted)] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-sm font-bold text-[var(--color-accent)]">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold">{workout}</p>
                      <p className="text-sm text-[var(--color-muted)]">
                        6 exercises - 60 min
                      </p>
                    </div>
                  </div>
                  <Activity className="h-5 w-5 text-[var(--color-accent)]" />
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-[var(--color-accent)] p-4 text-white">
                <BarChart3 className="mb-3 h-5 w-5" />
                <p className="text-2xl font-bold">8.2</p>
                <p className="text-sm text-white/75">Avg RPE</p>
              </div>
              <div className="rounded-lg bg-[var(--color-foreground)] p-4 text-white">
                <Target className="mb-3 h-5 w-5 text-[var(--color-highlight)]" />
                <p className="text-2xl font-bold">12 wk</p>
                <p className="text-sm text-white/70">Progression</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why GymAI?</h2>
            <p className="text-[var(--color-muted)] text-lg">
              We combine fitness expertise with AI to create programs that
              actually work for you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.title}
                variant="bordered"
                className="group transition hover:-translate-y-1 hover:border-[var(--color-accent)]/40"
              >
                <div className="w-12 h-12 rounded-lg bg-[var(--color-accent-soft)] flex items-center justify-center mb-4 transition-colors group-hover:bg-[var(--color-accent)]">
                  <feature.icon className="w-6 h-6 text-[var(--color-accent)] transition-colors group-hover:text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-[var(--color-muted)] text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
