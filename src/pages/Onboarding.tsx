import { RedirectToSignIn, SignedIn } from "@neondatabase/neon-js/auth/react";
import { useAuth } from "../context/useAuth";
import { Card } from "../components/ui/Card";
import { Select } from "../components/ui/Select";
import { useEffect, useState } from "react";
import { Textarea } from "../components/ui/Textarea";
import { Button } from "../components/ui/Button";
import { ArrowRight, Loader2, MailCheck } from "lucide-react";
import type { UserProfile } from "../types";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/Input";
import { authClient } from "../lib/auth";

const emailOtpAuth = authClient as typeof authClient & {
  emailOtp: {
    sendVerificationOtp: (data: {
      email: string;
      type: "sign-in" | "email-verification" | "forget-password";
    }) => Promise<{
      data?: { success: boolean } | null;
      error?: { message?: string } | null;
    }>;
    verifyEmail: (data: {
      email: string;
      otp: string;
    }) => Promise<{ data?: unknown; error?: { message?: string } | null }>;
  };
};

const goalOptions = [
  { value: "bulk", label: "Build Muscle (Bulk)" },
  { value: "cut", label: "Lose Fat (Cut)" },
  { value: "recomp", label: "Body Recomposition" },
  { value: "strength", label: "Build Strength" },
  { value: "endurance", label: "Improve Endurance" },
];

const experienceOptions = [
  { value: "beginner", label: "Beginner (0-1 years)" },
  { value: "intermediate", label: "Intermediate (1-3 years)" },
  { value: "advanced", label: "Advanced (3+ years)" },
];

const daysOptions = [
  { value: "2", label: "2 days per week" },
  { value: "3", label: "3 days per week" },
  { value: "4", label: "4 days per week" },
  { value: "5", label: "5 days per week" },
  { value: "6", label: "6 days per week" },
];

const sessionOptions = [
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "60 minutes" },
  { value: "90", label: "90 minutes" },
];

const equipmentOptions = [
  { value: "full_gym", label: "Full Gym Access" },
  { value: "home", label: "Home Gym" },
  { value: "dumbbells", label: "Dumbbells Only" },
];

const splitOptions = [
  { value: "full_body", label: "Full Body" },
  { value: "upper_lower", label: "Upper/Lower Split" },
  { value: "ppl", label: "Push/Pull/Legs" },
  { value: "custom", label: "Let AI Decide" },
];

function EmailVerificationCard({ email }: { email: string }) {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [autoSendTriggered, setAutoSendTriggered] = useState(false);

  useEffect(() => {
    if (!autoSendTriggered) {
      setAutoSendTriggered(true);
      sendCode(true);
    }
  }, [autoSendTriggered, email]);

  async function sendCode(isAutoSend = false) {
    setIsSending(true);
    setError("");
    setMessage("");

    try {
      const result = await emailOtpAuth.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to send code");
      }

      setMessage("Verification code sent. Check your email.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send code");
    } finally {
      setIsSending(false);
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setIsVerifying(true);
    setError("");
    setMessage("");

    try {
      const result = await emailOtpAuth.emailOtp.verifyEmail({
        email,
        otp: otp.trim(),
      });

      if (result.error) {
        throw new Error(result.error.message || "Invalid verification code");
      }

      setMessage("Email verified. Reloading your account...");
      window.location.reload();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to verify your email",
      );
    } finally {
      setIsVerifying(false);
    }
  }

  return (
    <Card variant="bordered">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[var(--color-accent-soft)]">
          <MailCheck className="w-5 h-5 text-[var(--color-accent)]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Verify your email</h1>
          <p className="text-sm text-[var(--color-muted)]">{email}</p>
        </div>
      </div>

      <p className="text-[var(--color-muted)] mb-6">
        Enter the OTP code sent to your inbox before creating your training
        plan.
      </p>

      {message && (
        <p className="mb-4 rounded-md border border-emerald-600/20 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {message}
        </p>
      )}

      {error && (
        <p className="mb-4 rounded-md border border-red-600/20 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <form onSubmit={verifyCode} className="space-y-4">
        <Input
          id="email-otp"
          label="Verification code"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter code"
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="submit"
            className="flex-1 gap-2"
            disabled={isVerifying || otp.trim().length === 0}
          >
            {isVerifying && <Loader2 className="w-4 h-4 animate-spin" />}
            Verify Email
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={sendCode}
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send Code"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default function Onboarding() {
  const { user, saveProfile, generatePlan } = useAuth();
  const [formData, setFormData] = useState({
    goal: "bulk",
    experience: "intermediate",
    daysPerWeek: "4",
    sessionLength: "60",
    equipment: "full_gym",
    injuries: "",
    preferredSplit: "upper_lower",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function updateForm(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleQuestionnaire(e: React.SubmitEvent) {
    e.preventDefault();

    const profile: Omit<UserProfile, "userId" | "updatedAt"> = {
      goal: formData.goal as UserProfile["goal"],
      experience: formData.experience as UserProfile["experience"],
      daysPerWeek: parseInt(formData.daysPerWeek),
      sessionLength: parseInt(formData.sessionLength),
      equipment: formData.equipment as UserProfile["equipment"],
      injuries: formData.injuries || undefined,
      preferredSplit: formData.preferredSplit as UserProfile["preferredSplit"],
    };
    try {
      await saveProfile(profile);
      setIsGenerating(true);
      await generatePlan();
      navigate("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setIsGenerating(false);
    }
  }

  if (!user) {
    return <RedirectToSignIn />;
  }

  if (user.email && user.emailVerified === false) {
    return (
      <SignedIn>
        <div className="min-h-screen pt-24 pb-12 px-6">
          <div className="max-w-xl mx-auto">
            <EmailVerificationCard email={user.email} />
          </div>
        </div>
      </SignedIn>
    );
  }

  return (
    <SignedIn>
      <div className="min-h-screen pt-24 pb-12 px-6">
        <div className="max-w-2xl mx-auto">
          {!isGenerating ? (
            <Card variant="bordered">
              <div className="mb-6 rounded-lg bg-[var(--color-card-muted)] p-5">
                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--color-accent)]">
                  Plan setup
                </p>
                <h1 className="text-2xl font-bold mb-2">
                  Tell Us About Yourself
                </h1>
                <p className="text-[var(--color-muted)]">
                  Help us create the perfect plan for you.
                </p>
              </div>
              {error && (
                <p className="mb-4 rounded-md border border-red-600/20 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}
              <form onSubmit={handleQuestionnaire} className="space-y-5">
                <Select
                  id="goal"
                  label="What's your primary goal?"
                  options={goalOptions}
                  value={formData.goal}
                  onChange={(e) => updateForm("goal", e.target.value)}
                />
                <Select
                  id="experience"
                  label="Training experience"
                  options={experienceOptions}
                  value={formData.experience}
                  onChange={(e) => updateForm("experience", e.target.value)}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Select
                    id="daysPerWeek"
                    label="Days per week"
                    options={daysOptions}
                    value={formData.daysPerWeek}
                    onChange={(e) => updateForm("daysPerWeek", e.target.value)}
                  />
                  <Select
                    id="sessionLength"
                    label="Session length"
                    options={sessionOptions}
                    value={formData.sessionLength}
                    onChange={(e) =>
                      updateForm("sessionLength", e.target.value)
                    }
                  />
                </div>
                <Select
                  id="equipment"
                  label="Equipment access"
                  options={equipmentOptions}
                  value={formData.equipment}
                  onChange={(e) => updateForm("equipment", e.target.value)}
                />

                <Select
                  id="preferredSplit"
                  label="Preferred training split"
                  options={splitOptions}
                  value={formData.preferredSplit}
                  onChange={(e) => updateForm("preferredSplit", e.target.value)}
                />

                <Textarea
                  id="injuries"
                  label="Any injuries or limitations? (optional)"
                  placeholder="E.g., lower back issues, shoulder impingement..."
                  rows={3}
                  value={formData.injuries}
                  onChange={(e) => updateForm("injuries", e.target.value)}
                />

                <div className="flex gap-3 pt-2">
                  <Button type="submit" className="flex-1 gap-2">
                    Generate My Plan <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </Card>
          ) : (
            <Card variant="bordered" className="text-center py-16">
              <Loader2 className="w-12 h-12 text-[var(--color-accent)] mx-auto mb-6 animate-spin" />
              <h1 className="text-2xl font-bold mb-2">Creating your Plan</h1>
              <p className="text-[var(--color-muted)]">
                Our AI is building your personalized training program...
              </p>
            </Card>
          )}
        </div>
      </div>
    </SignedIn>
  );
}
