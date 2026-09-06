import { useEffect, useState } from "react";
import { Camera, Film, Headphones, Pause, Play, Sparkles, Volume2, X } from "lucide-react";
import { artisanStories, findStory, type ArtisanStory } from "@/lib/artisan-stories";
import { cn } from "@/lib/utils";

function useNarration() {
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  function toggle(story: ArtisanStory) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setPlayingId((current) => (current === story.id ? null : story.id));
      return;
    }
    window.speechSynthesis.cancel();
    if (playingId === story.id) {
      setPlayingId(null);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(`${story.name}, ${story.craft} from ${story.location}. ${story.story}`);
    utterance.rate = 0.95;
    utterance.onend = () => setPlayingId(null);
    utterance.onerror = () => setPlayingId(null);
    window.speechSynthesis.speak(utterance);
    setPlayingId(story.id);
  }

  function stop() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    setPlayingId(null);
  }

  return { playingId, toggle, stop };
}

const kindMeta = {
  audio: { icon: Headphones, label: "Audio clip" },
  reel: { icon: Film, label: "Video reel" },
  photo: { icon: Camera, label: "Photo story" },
} as const;

function StoryFeed({ stories, playingId, onToggle }: { stories: ArtisanStory[]; playingId: string | null; onToggle: (story: ArtisanStory) => void }) {
  return (
    <div className="mt-5 space-y-4">
      {stories.map((story) => {
        const Meta = kindMeta[story.kind];
        const active = playingId === story.id;
        return (
          <article key={story.id} className="overflow-hidden rounded-2xl border border-border bg-muted/30">
            <div className="flex gap-4 p-4">
              <div className="relative shrink-0">
                <img src={story.image} alt={story.alt} loading="lazy" className="size-24 rounded-xl object-cover sm:size-28" />
                <span className="absolute bottom-1 left-1 inline-flex items-center gap-1 rounded-md bg-ink/75 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[.12em] text-primary-foreground">
                  <Meta.icon className="size-3" />
                  {story.duration}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] uppercase tracking-[.16em] text-terracotta">{Meta.label} · {story.heritage}</p>
                <h3 className="mt-1 font-display text-base font-bold leading-tight text-ink">{story.name}</h3>
                <p className="text-xs text-muted-foreground">{story.craft} · {story.location}</p>
                <p className="mt-2 text-sm italic leading-relaxed text-foreground/80">“{story.quote}”</p>
                <button
                  type="button"
                  onClick={() => onToggle(story)}
                  aria-label={active ? `Pause ${story.name}'s story` : `Listen to ${story.name}'s story`}
                  className={cn(
                    "mt-3 inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-xs font-semibold transition-colors",
                    active ? "bg-terracotta text-primary-foreground" : "border border-border bg-card text-foreground hover:bg-muted",
                  )}
                >
                  {active ? <Pause className="size-4" /> : <Play className="size-4" />}
                  {active ? "Playing…" : "Listen to artisan story"}
                </button>
              </div>
            </div>
            <p className="border-t border-border/70 bg-card px-4 py-3 text-sm leading-relaxed text-muted-foreground">{story.story}</p>
          </article>
        );
      })}
    </div>
  );
}

function StoryDialog({ stories, title, onClose }: { stories: ArtisanStory[]; title: string; onClose: () => void }) {
  const { playingId, toggle, stop } = useNarration();

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        stop();
        onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, stop]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-ink/50 backdrop-blur-sm sm:place-items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-border bg-card p-5 shadow-2xl sm:rounded-3xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-terracotta">Heritage in their own voice</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-ink">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">Weavers, potters and sculptors explain the craft behind each product.</p>
          </div>
          <button
            onClick={() => {
              stop();
              onClose();
            }}
            aria-label="Close"
            className="rounded-xl p-2 text-muted-foreground hover:bg-muted"
          >
            <X className="size-5" />
          </button>
        </div>
        <StoryFeed stories={stories} playingId={playingId} onToggle={toggle} />
      </div>
    </div>
  );
}

export function ArtisanStoriesButton({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {compact ? (
        <button
          type="button"
          aria-label="Artisan stories"
          title="Artisan stories"
          onClick={() => setOpen(true)}
          className="grid size-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Sparkles className="size-[18px]" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border bg-card px-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <Sparkles className="size-4 text-terracotta" />
          Artisan Stories
        </button>
      )}
      {open && <StoryDialog stories={artisanStories} title="Artisan Stories" onClose={() => setOpen(false)} />}
    </>
  );
}

export function ArtisanStoryBadge({ artisanId, artisanName, className }: { artisanId?: string; artisanName?: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const matched = (artisanId && findStory(artisanId)) || undefined;
  const stories = matched ? [matched, ...artisanStories.filter((story) => story.id !== matched.id)] : artisanStories;
  const label = matched ? `Listen to ${matched.name}'s story` : artisanName ? `Listen to ${artisanName}'s story` : "Listen to artisan story";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={label}
        title={label}
        className={cn(
          "inline-flex min-h-9 items-center gap-1.5 rounded-full border border-terracotta/40 bg-saffron/15 px-2.5 text-[11px] font-semibold text-terracotta transition-colors hover:bg-saffron/30",
          className,
        )}
      >
        <Volume2 className="size-3.5" />
        Listen to artisan story
      </button>
      {open && <StoryDialog stories={stories} title={matched ? `${matched.name}'s story` : "Artisan Stories"} onClose={() => setOpen(false)} />}
    </>
  );
}
