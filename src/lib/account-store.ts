import { useSyncExternalStore } from "react";

/** The signed-in person, kept on this device so the demo needs no server login. */
export type Account = {
  name: string;
  phone: string;
  language: string;
  photo: string | null;
  craft: string;
  location: string;
  experience: string;
  capacity: string;
  verified: boolean;
};

const KEY = "sih2026:account";
const listeners = new Set<() => void>();
let account: Account | null = null;
let hydrated = false;

export const spokenLanguages = [
  "English",
  "हिन्दी (Hindi)",
  "मराठी (Marathi)",
  "বাংলা (Bengali)",
  "தமிழ் (Tamil)",
  "తెలుగు (Telugu)",
  "ગુજરાતી (Gujarati)",
  "ਪੰਜਾਬੀ (Punjabi)",
  "ಕನ್ನಡ (Kannada)",
  "অসমীয়া (Assamese)",
];

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) account = JSON.parse(raw) as Account;
  } catch {
    account = null;
  }
}

function persist() {
  if (typeof window === "undefined") return;
  if (account) window.localStorage.setItem(KEY, JSON.stringify(account));
  else window.localStorage.removeItem(KEY);
}

function emit() {
  persist();
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useAccount(): Account | null {
  return useSyncExternalStore(
    subscribe,
    () => {
      hydrate();
      return account;
    },
    () => null,
  );
}

/** Name to show anywhere a person's name appears, with a friendly fallback. */
export function useDisplayName(fallback = "Guest artisan"): string {
  const current = useAccount();
  return current?.name?.trim() || fallback;
}

export function signIn(details: { name: string; phone: string; language: string }) {
  hydrate();
  account = {
    name: details.name.trim() || "Artisan",
    phone: details.phone.trim(),
    language: details.language,
    photo: account?.phone === details.phone ? (account?.photo ?? null) : null,
    craft: account?.craft ?? "Handmade craft",
    location: account?.location ?? "India",
    experience: account?.experience ?? "New on sih 2026",
    capacity: account?.capacity ?? "Tell buyers your monthly output",
    verified: true,
  };
  emit();
}

export function signOut() {
  hydrate();
  account = null;
  emit();
}

export function updateAccount(patch: Partial<Account>) {
  hydrate();
  if (!account) return;
  account = { ...account, ...patch };
  emit();
}

/** A six-digit code, held only for this browser session. */
let pendingOtp: { phone: string; code: string; expiresAt: number } | null = null;

export function requestOtp(phone: string): string {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  pendingOtp = { phone, code, expiresAt: Date.now() + 5 * 60 * 1000 };
  return code;
}

export function verifyOtp(phone: string, code: string): { ok: boolean; reason?: string } {
  if (!pendingOtp || pendingOtp.phone !== phone) return { ok: false, reason: "Please ask for a new code." };
  if (Date.now() > pendingOtp.expiresAt) return { ok: false, reason: "That code has expired. Ask for a new one." };
  if (pendingOtp.code !== code.trim()) return { ok: false, reason: "That code does not match. Try again." };
  pendingOtp = null;
  return { ok: true };
}

export function isValidPhone(phone: string) {
  return /^[6-9]\d{9}$/.test(phone.replace(/\D/g, ""));
}
