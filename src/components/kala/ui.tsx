import { Link, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { HelpSupport } from "@/components/kala/help-support";
import { setLang, useLang, useT } from "@/lib/i18n";
import { ArrowRight, BadgeCheck, Bell, BriefcaseBusiness, ChevronLeft, CircleUserRound, Home, Inbox, Leaf, Menu, Package, Plus, Search, Sparkles, Store, UserRound, Volume2, X } from "lucide-react";

export function Brand({ compact = false }: { compact?: boolean }) {
  return <Link to="/" className="group flex items-center gap-3" aria-label="sih 2026 home">
    <span className="grid size-10 place-items-center rounded-2xl bg-indigo text-primary-foreground shadow-sm transition-transform group-hover:-rotate-3"><span className="font-display text-base font-bold">SI</span></span>
    {!compact && <span className="leading-none"><span className="block font-display text-lg font-bold text-ink">sih 2026 <span className="text-terracotta">AI</span></span><span className="mt-1 block font-mono text-[9px] uppercase tracking-[.19em] text-muted-foreground">Craft to market</span></span>}
  </Link>;
}

export function Button({ children, variant = "primary", className, asChild, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "quiet" | "danger"; asChild?: boolean }) {
  const styles = { primary: "bg-terracotta text-primary-foreground shadow-sm hover:bg-terracotta/90", secondary: "bg-indigo text-primary-foreground shadow-sm hover:bg-indigo/90", quiet: "border border-border bg-card text-foreground hover:bg-muted", danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90" };
  if (asChild) return <span className={cn("inline-flex", className)}>{children}</span>;
  return <button className={cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", styles[variant], className)} {...props}>{children}</button>;
}

export function IconButton({ label, children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return <button aria-label={label} title={label} className={cn("grid size-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className)} {...props}>{children}</button>;
}

const artisanNav = [{ key: "nav.home", to: "/dashboard", icon: Home }, { key: "nav.products", to: "/products", icon: Package }, { key: "nav.add", to: "/add-product", icon: Plus }, { key: "nav.opportunities", to: "/opportunities", icon: BriefcaseBusiness }, { key: "nav.profile", to: "/profile", icon: UserRound }];
const buyerNav = [{ key: "nav.home", to: "/buyer", icon: Home }, { key: "nav.find", to: "/buyer/matches", icon: Search }, { key: "nav.requirements", to: "/buyer/requirements", icon: BriefcaseBusiness }, { key: "nav.enquiries", to: "/buyer/enquiries", icon: Inbox }, { key: "nav.profile", to: "/profile", icon: UserRound }];

export function AppShell({ children, role = "artisan", title, eyebrow, action }: { children: ReactNode; role?: "artisan" | "buyer"; title?: string; eyebrow?: string; action?: ReactNode }) {
  const location = useLocation();
  const nav = role === "buyer" ? buyerNav : artisanNav;
  const t = useT();
  return <div className="min-h-screen bg-background text-foreground">
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-card px-5 py-6 lg:flex">
      <Brand />
      <div className="mt-12 rounded-2xl bg-indigo-soft p-4"><p className="font-mono text-[10px] uppercase tracking-[.18em] text-indigo">{role === "buyer" ? t("shell.buyer") : t("shell.artisan")}</p><p className="mt-2 text-sm leading-relaxed text-foreground/75">{role === "buyer" ? t("shell.buyerNote") : t("shell.artisanNote")}</p></div>
      <nav className="mt-8 flex-1 space-y-1.5">{nav.map((item) => { const Icon = item.icon; const active = location.pathname === item.to || (item.to !== "/dashboard" && location.pathname.startsWith(item.to)); return <Link key={item.key} to={item.to} className={cn("flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors", active ? "bg-indigo text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")}><Icon className="size-[18px]" strokeWidth={1.8} />{t(item.key)}</Link>; })}</nav>
      <div className="border-t border-border pt-5"><Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4" />Back to sih 2026</Link><p className="mt-4 font-mono text-[9px] uppercase tracking-[.16em] text-muted-foreground/70">SIH 2026</p></div>
    </aside>
    <div className="lg:pl-64"><header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-10"><div className="flex items-center gap-3 lg:hidden"><Brand compact /><span className="h-5 w-px bg-border" /><span className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">{role}</span></div><div className="hidden lg:block"><p className="font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">{eyebrow ?? (role === "buyer" ? t("shell.buyer") : t("shell.artisan"))}</p>{title && <h1 className="mt-1 font-display text-xl font-semibold text-ink">{title}</h1>}</div><div className="flex items-center gap-2">{action}<LanguageSwitcher /><HelpSupport /><IconButton label="Notifications"><Bell className="size-[18px]" /></IconButton><Link to="/profile" className="hidden items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-medium hover:bg-muted sm:flex"><img src="/src/assets/meena-portrait.jpg" alt="Meena Devi" className="size-8 rounded-full object-cover" /><span>{role === "buyer" ? "ABC Enterprises" : "Meena Devi"}</span></Link></div></div></header><main className="mx-auto max-w-7xl px-4 pb-28 pt-7 sm:px-6 lg:px-10 lg:pb-12">{children}</main></div>
    <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-5 rounded-2xl border border-border bg-card/95 p-1.5 shadow-xl backdrop-blur lg:hidden">{nav.map((item) => { const Icon = item.icon; const active = location.pathname === item.to || (item.to !== "/dashboard" && location.pathname.startsWith(item.to)); return <Link key={item.key} to={item.to} className={cn("flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl text-[10px] font-medium", active ? "bg-indigo text-primary-foreground" : "text-muted-foreground")}><Icon className="size-[17px]" strokeWidth={1.8} /><span>{t(item.key)}</span></Link>; })}</nav>
  </div>;
}

export function LanguageSwitcher() {
  const lang = useLang();
  return <div className="flex items-center rounded-xl border border-border bg-card p-0.5" role="group" aria-label="Choose language">
    {(["en", "hi"] as const).map((code) => <button key={code} type="button" onClick={() => setLang(code)} aria-pressed={lang === code} className={cn("min-h-9 rounded-lg px-2.5 text-xs font-semibold transition-colors", lang === code ? "bg-indigo text-primary-foreground" : "text-muted-foreground hover:bg-muted")}>{code === "en" ? "EN" : "हिं"}</button>)}
  </div>;
}

export function SectionHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) { return <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div>{eyebrow && <p className="font-mono text-[10px] uppercase tracking-[.2em] text-terracotta">{eyebrow}</p>}<h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">{title}</h2>{description && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>}</div>{action}</div>; }

export function Score({ value }: { value: number }) { return <div className="flex items-center gap-2"><span className="font-display text-xl font-bold text-indigo">{value}%</span><span className="font-mono text-[9px] uppercase tracking-[.14em] text-muted-foreground">AI match</span></div>; }
export function MatchBar({ value }: { value: number }) { return <div className="h-2 overflow-hidden rounded-full bg-indigo-soft"><div className="animate-progress-in h-full rounded-full bg-indigo" style={{ width: `${value}%` }} /></div>; }
export function StatusBadge({ status }: { status: string }) { const style = status === "New" ? "bg-saffron/20 text-saffron-foreground" : status === "Accepted" ? "bg-moss-soft text-moss" : status === "In Discussion" ? "bg-indigo-soft text-indigo" : "bg-muted text-muted-foreground"; return <span className={cn("rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[.1em]", style)}>{status}</span>; }
export function VoiceButton({ label = "Speak instead", onClick }: { label?: string; onClick?: () => void }) { return <Button type="button" variant="quiet" onClick={onClick} className="border-terracotta/30 text-terracotta"><Volume2 className="size-4" />{label}</Button>; }
export function EmptyIcon({ type = "leaf" }: { type?: "leaf" | "search" }) { return <div className="grid size-12 place-items-center rounded-2xl bg-saffron/20 text-terracotta">{type === "search" ? <Search className="size-5" /> : <Leaf className="size-5" />}</div>; }
export { ArrowRight, BadgeCheck, BriefcaseBusiness, CircleUserRound, Inbox, Menu, Package, Plus, Search, Sparkles, Store, UserRound, Volume2, X };