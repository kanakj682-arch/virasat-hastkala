import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Camera, Check, FileText, Mic, MicOff, Sparkles, Trash2, Upload } from "lucide-react";
import { AppShell, Button, SectionHeading } from "@/components/kala/ui";
import { toast } from "sonner";
import { updateDraft } from "@/lib/draft-store";
import { generateCatalogue } from "@/lib/catalog-api";
import { useSpeech } from "@/lib/use-speech";

export const Route = createFileRoute("/add-product")({ head: () => ({ meta: [{ title: "Add Your Craft — sih 2026" }, { name: "description", content: "Create a professional craft catalogue using a photo, your voice, or simple details." }, { property: "og:title", content: "Add Your Craft — sih 2026" }, { property: "og:description", content: "Use AI to turn your craft into a market-ready catalogue." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: AddProduct });

type Method = "photo" | "voice" | "manual";

function AddProduct() {
  const navigate = useNavigate();
  const [method, setMethod] = useState<Method>("photo");
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const speech = useSpeech();

  const spoken = speech.transcript || typed;

  function readFile(file: File | undefined) {
    setPhotoError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) { setPhotoError("Please choose a JPG or PNG image."); return; }
    if (file.size > 8 * 1024 * 1024) { setPhotoError("That image is larger than 8 MB. Please choose a smaller photo."); return; }
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(typeof reader.result === "string" ? reader.result : null);
      toast.success("Photo added successfully");
    };
    reader.onerror = () => setPhotoError("We could not read that photo. Please try again.");
    reader.readAsDataURL(file);
  }

  async function handleGenerate() {
    if (!photo) { setPhotoError("Add a photo of your craft first."); return; }
    setPhotoError(null);
    setBusy(true);
    if (speech.listening) speech.stop();
    try {
      const draft = await generateCatalogue({ photo, transcript: spoken });
      updateDraft(draft);
      toast.success("Photo uploaded and catalogue created");
      navigate({ to: "/catalogue" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "We could not create your catalogue. Please try again.";
      setPhotoError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  return <AppShell title="Add your craft" eyebrow="New product"><div className="mx-auto max-w-4xl">
    <Link to="/dashboard" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Back to home</Link>
    <SectionHeading eyebrow="Simple is powerful" title="Add your craft" description="Choose the easiest way to tell us about one product." />
    

    <div className="mt-7 grid gap-4 md:grid-cols-3">
      <MethodCard icon={Camera} title="Take / upload photo" copy="Show us the product. AI will look for shape, colour, and craft details." active={method === "photo"} onClick={() => setMethod("photo")} />
      <MethodCard icon={Mic} title="Describe by voice" copy="Speak naturally in your language. No perfect words needed." active={method === "voice"} onClick={() => setMethod("voice")} />
      <MethodCard icon={FileText} title="Enter details manually" copy="Type a few details if that feels more comfortable." active={method === "manual"} onClick={() => setMethod("manual")} />
    </div>

    <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="sr-only" onChange={(event) => readFile(event.target.files?.[0])} />
    <input ref={galleryRef} type="file" accept="image/*" className="sr-only" onChange={(event) => readFile(event.target.files?.[0])} />

    {photo ? (
      <div className="mt-6 rounded-2xl border border-border bg-card p-3 shadow-sm">
        <img src={photo} alt="Your craft product photo" className="aspect-square w-full rounded-xl object-cover" />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-2 rounded-xl bg-moss-soft px-3 py-2 text-xs text-moss"><Check className="size-4" />Photo added</span>
          <div className="flex gap-2">
            <Button variant="quiet" onClick={() => galleryRef.current?.click()}><Upload className="size-4" />Replace</Button>
            <Button variant="quiet" onClick={() => setPhoto(null)}><Trash2 className="size-4" />Remove</Button>
          </div>
        </div>
      </div>
    ) : (
      <div className="mt-6 rounded-2xl border-2 border-dashed border-terracotta/35 bg-terracotta-soft/40 p-6 text-center sm:p-10">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-card text-terracotta shadow-sm"><Upload className="size-6" /></div>
        <h2 className="mt-4 font-display text-xl font-bold text-ink">Start with a product photo</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">Use a clear photo on any background. Your photo stays on this device.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button onClick={() => cameraRef.current?.click()}><Camera className="size-4" />Take photo</Button>
          <Button variant="quiet" onClick={() => galleryRef.current?.click()}><Upload className="size-4" />Upload from gallery</Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">JPG or PNG · You can add more photos later</p>
      </div>
    )}
    {photoError && <p role="alert" className="mt-3 text-sm font-medium text-destructive">{photoError}</p>}

    <div className="mt-5 rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.16em] text-terracotta">Describe your craft</p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">Example: “Yeh vase Jaipur blue pottery technique se handmade hai aur ise banane mein 2 din lagte hain.”</p>
        </div>
        <Button type="button" variant={speech.listening ? "primary" : "quiet"} onClick={() => (speech.listening ? speech.stop() : speech.start())} className={speech.listening ? "" : "border-terracotta/30 text-terracotta"} aria-pressed={speech.listening}>
          {speech.listening ? <><MicOff className="size-4" />Stop recording</> : <><Mic className="size-4" />Speak now</>}
        </Button>
      </div>
      {speech.listening && <p className="mt-3 flex items-center gap-2 text-sm text-indigo"><span className="size-2 animate-pulse rounded-full bg-terracotta" />Listening… speak in your language.</p>}
      <label className="mt-4 block text-sm font-medium">Your description
        <textarea value={spoken} onChange={(event) => { setTyped(event.target.value); speech.setTranscript(event.target.value); }} rows={4} placeholder="Speak or type about your craft, material, and how long it takes to make." className="mt-2 w-full rounded-xl border border-input bg-background p-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      </label>
      {speech.error && <p role="alert" className="mt-2 text-sm font-medium text-destructive">{speech.error}</p>}
      {!speech.supported && !speech.error && <p className="mt-2 text-xs text-muted-foreground">Voice input isn’t available in this browser — typing works just as well.</p>}
    </div>

    <Button className="mt-6 min-h-13 w-full text-base" onClick={handleGenerate} disabled={busy}>
      <Sparkles className="size-5" />{busy ? "Generating your catalogue…" : "Generate catalogue with AI"} <ArrowRight className="size-4" />
    </Button>
    <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground"><Check className="size-3.5 text-moss" />You will review every AI suggestion before publishing.</p>
  </div></AppShell>;
}

function MethodCard({ icon: Icon, title, copy, active, onClick }: { icon: typeof Camera; title: string; copy: string; active?: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} aria-pressed={active} className={`rounded-2xl border p-5 text-left transition-colors ${active ? "border-terracotta bg-terracotta-soft/50" : "border-border bg-card hover:bg-muted"}`}>
    <div className={`grid size-10 place-items-center rounded-xl ${active ? "bg-terracotta text-primary-foreground" : "bg-indigo-soft text-indigo"}`}><Icon className="size-5" /></div>
    <h3 className="mt-4 font-display font-bold text-ink">{title}</h3>
    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy}</p>
  </button>;
}
