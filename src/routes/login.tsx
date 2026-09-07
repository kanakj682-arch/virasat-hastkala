import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Phone, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AppShell, Button } from "@/components/kala/ui";
import { isValidPhone, requestOtp, signIn, spokenLanguages, verifyOtp } from "@/lib/account-store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in with your phone — sih 2026" },
      { name: "description", content: "Sign in to sih 2026 with your phone number and a one-time code, then set your name, language and profile photo." },
      { property: "og:title", content: "Sign in with your phone — sih 2026" },
      { property: "og:description", content: "Phone sign-in with a one-time code for artisans and buyers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [language, setLanguage] = useState(spokenLanguages[0] ?? "English");

  function sendCode() {
    const clean = phone.replace(/\D/g, "");
    if (!isValidPhone(clean)) {
      toast.error("Enter a 10-digit mobile number.");
      return;
    }
    const generated = requestOtp(clean);
    setPhone(clean);
    setStep("code");
    toast.success(`Your one-time code is ${generated}`, {
      description: "Demo mode: the code is shown here because no SMS service is connected yet.",
      duration: 15000,
    });
  }

  function confirm() {
    const result = verifyOtp(phone, code);
    if (!result.ok) {
      toast.error(result.reason ?? "That code did not work.");
      return;
    }
    if (!name.trim()) {
      toast.error("Please add the name buyers should see.");
      return;
    }
    signIn({ name, phone, language });
    toast.success("You are signed in.");
    navigate({ to: "/profile" });
  }

  return (
    <AppShell title="Sign in" eyebrow="Your account">
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="grid size-11 place-items-center rounded-2xl bg-terracotta-soft text-terracotta">
            <ShieldCheck className="size-5" />
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold text-ink">Sign in with your phone</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            We send a six-digit code to your mobile number. No password to remember.
          </p>

          {step === "phone" ? (
            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Mobile number</span>
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-background px-3">
                  <Phone className="size-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">+91</span>
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="98765 43210"
                    className="min-h-12 flex-1 bg-transparent text-sm outline-none"
                  />
                </div>
              </label>
              <Button className="w-full" onClick={sendCode}>
                Send code <ArrowRight className="size-4" />
              </Button>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Six-digit code</span>
                <input
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  className="mt-2 min-h-12 w-full rounded-xl border border-border bg-background px-3 font-mono text-lg tracking-[.4em] outline-none focus:border-terracotta"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your name</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Name buyers will see"
                  className="mt-2 min-h-12 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-terracotta"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Language</span>
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  className="mt-2 min-h-12 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-terracotta"
                >
                  {spokenLanguages.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>
              <Button className="w-full" onClick={confirm}>
                <Sparkles className="size-4" /> Confirm and continue
              </Button>
              <button type="button" onClick={() => setStep("phone")} className="w-full text-center text-sm font-semibold text-muted-foreground hover:text-foreground">
                Change number
              </button>
            </div>
          )}
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Signing in is optional — you can keep adding products without an account.
        </p>
      </div>
    </AppShell>
  );
}
