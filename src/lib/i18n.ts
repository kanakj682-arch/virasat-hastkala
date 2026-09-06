import { useSyncExternalStore } from "react";

export type Lang = "en" | "hi";

const KEY = "sih2026:lang";
let lang: Lang = "en";
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  const saved = window.localStorage.getItem(KEY);
  if (saved === "hi" || saved === "en") lang = saved;
}

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function setLang(next: Lang) {
  hydrate();
  lang = next;
  if (typeof window !== "undefined") window.localStorage.setItem(KEY, next);
  listeners.forEach((l) => l());
}

export function useLang(): Lang {
  return useSyncExternalStore(subscribe, () => { hydrate(); return lang; }, () => "en" as Lang);
}

const dictionary: Record<string, { en: string; hi: string }> = {
  "nav.home": { en: "Home", hi: "होम" },
  "nav.products": { en: "Products", hi: "उत्पाद" },
  "nav.add": { en: "Add product", hi: "नया उत्पाद" },
  "nav.opportunities": { en: "Opportunities", hi: "अवसर" },
  "nav.profile": { en: "Profile", hi: "प्रोफ़ाइल" },
  "nav.find": { en: "Find artisans", hi: "कारीगर खोजें" },
  "nav.requirements": { en: "Requirements", hi: "आवश्यकताएँ" },
  "nav.enquiries": { en: "Enquiries", hi: "पूछताछ" },
  "shell.artisan": { en: "Artisan workspace", hi: "कारीगर कार्यक्षेत्र" },
  "shell.buyer": { en: "Buyer workspace", hi: "खरीदार कार्यक्षेत्र" },
  "shell.artisanNote": { en: "Your craft, your story, your next market.", hi: "आपकी कला, आपकी कहानी, आपका अगला बाज़ार।" },
  "shell.buyerNote": { en: "Find the craft that fits your next brief.", hi: "अपनी ज़रूरत के अनुसार कारीगर चुनें।" },
  "help.title": { en: "Help & Support", hi: "सहायता और समर्थन" },
  "help.subtitle": { en: "Quick answers and instant assistance for artisans.", hi: "कारीगरों के लिए त्वरित उत्तर और तुरंत सहायता।" },
  "metrics.title": { en: "Live impact", hi: "लाइव प्रभाव" },
};

export function useT() {
  const current = useLang();
  return (key: string) => dictionary[key]?.[current] ?? key;
}
