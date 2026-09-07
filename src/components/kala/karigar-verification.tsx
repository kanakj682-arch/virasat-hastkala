import { useState } from "react";
import { BadgeCheck, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/kala/ui";
import { supabase } from "@/integrations/supabase/client";
import { isValidPhone, requestOtp, spokenLanguages, verifyOtp } from "@/lib/account-store";

const crafts = ["Pottery", "Handloom weaving", "Wood carving", "Metal craft", "Jewellery", "Folk painting", "Jute craft", "Other"];

/** In-app Karigar verification form — replaces the old external form embed. */
export function KarigarVerification({ defaultName = "", defaultPhone = "", defaultLanguage = "" }: { defaultName?: string; defaultPhone?: string; defaultLanguage?: string }) {
  const [fullName, setFullName] = useState(defaultName);
  const [phone, setPhone] = useState(defaultPhone);
  const [aadhaar, setAadhaar] = useState("");
  const [craft, setCraft] = useState(crafts[0] ?? "Pottery");
  const [language, setLanguage] = useState(defaultLanguage || spokenLanguages[0] || "English");
  const [address, setAddress] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  function sendOtp() {
    const clean = phone.replace(/\D/g, "");
    if (!isValidPhone(clean)) {
      toast.error("Enter a 10-digit mobile number first.");
      return;
    }
    setPhone(clean);
    const code = requestOtp(clean);
    setOtpSent(true);
    toast.success(`Your verification code is ${code}`, {
      description: "Demo mode: the code appears here because no SMS service is connected yet.",
      duration: 15000,
    });
  }

  function confirmOtp() {
    const result = verifyOtp(phone.replace(/\D/g, ""), otp);
    if (!result.ok) {
      toast.error(result.reason ?? "That code did not work.");
      return;
    }
    setPhoneVerified(true);
    toast.success("Phone number verified.");
  }

  async function submit() {
    if (!fullName.trim() || !phone.trim() || !aadhaar.trim()) {
      toast.error("Please fill your name, phone and Aadhaar number.");
      return;
    }
    if (!phoneVerified) {
      toast.error("Please verify your phone number with the code first.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("karigar_kyc").insert({
      full_name: fullName.trim(),
      phone: phone.trim(),
      aadhaar_number: aadhaar.trim(),
      craft_type: craft,
      language,
      phone_verified: true,
      address: address.trim() || null,
    });
    setSaving(false);
    if (error) {
      toast.error("We could not send your details. Please try again.");
      return;
    }
    setDone(true);
    toast.success("Your verification request is in.");
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-moss-soft text-moss"><BadgeCheck className="size-6" /></div>
        <h3 className="mt-4 font-display text-xl font-bold text-ink">Verification request received</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Your details are safely saved with a verified phone number. We will mark your profile verified once the craft council review is complete.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" value={fullName} onChange={setFullName} placeholder="Your name" />
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Mobile number</span>
          <div className="mt-2 flex gap-2">
            <input
              value={phone}
              onChange={(event) => { setPhone(event.target.value); setPhoneVerified(false); }}
              inputMode="numeric"
              maxLength={10}
              placeholder="98765 43210"
              className="min-h-12 flex-1 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-terracotta"
            />
            <Button type="button" variant="quiet" className="shrink-0" onClick={sendOtp} disabled={phoneVerified}>
              {phoneVerified ? "Verified" : otpSent ? "Resend" : "Send code"}
            </Button>
          </div>
        </div>
        {otpSent && !phoneVerified && (
          <div className="sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Enter the six-digit code</span>
            <div className="mt-2 flex gap-2">
              <input
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                className="min-h-12 flex-1 rounded-xl border border-border bg-background px-3 font-mono tracking-[.35em] outline-none focus:border-terracotta"
              />
              <Button type="button" onClick={confirmOtp}><ShieldCheck className="size-4" />Verify</Button>
            </div>
          </div>
        )}
        {phoneVerified && (
          <p className="flex items-center gap-2 text-sm font-semibold text-moss sm:col-span-2"><BadgeCheck className="size-4" />Phone number verified</p>
        )}
        <Field label="Aadhaar number" value={aadhaar} onChange={setAadhaar} placeholder="XXXX XXXX XXXX" />
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Craft type</span>
          <select value={craft} onChange={(event) => setCraft(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-terracotta">
            {crafts.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Language</span>
          <select value={language} onChange={(event) => setLanguage(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-terracotta">
            {spokenLanguages.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <Field label="Village / city and state" value={address} onChange={setAddress} placeholder="Jaipur, Rajasthan" />
      </div>
      <Button className="mt-6 w-full sm:w-auto" onClick={submit} disabled={saving}>
        {saving ? <><Loader2 className="size-4 animate-spin" />Sending…</> : <><BadgeCheck className="size-4" />Submit for verification</>}
      </Button>
      <p className="mt-3 text-xs text-muted-foreground">Your Aadhaar number is stored privately and is never shown to buyers.</p>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (next: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 min-h-12 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-terracotta"
      />
    </label>
  );
}
