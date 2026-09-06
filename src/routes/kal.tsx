import { createFileRoute } from "@tanstack/react-router";
import Kal from "@/components/kala/cards";
import { AppShell } from "@/components/kala/ui";

export const Route = createFileRoute("/kal")({
  head: () => ({
    meta: [
      { title: "Karigar & Buyer Forms — sih 2026" },
      { name: "description", content: "Verify your artisan profile or post a buyer requirement on sih 2026." },
      { property: "og:title", content: "Karigar & Buyer Forms — sih 2026" },
      { property: "og:description", content: "Verify your artisan profile or post a buyer requirement on sih 2026." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: KalPage,
});

export default function KalPage() {
  return (
    <AppShell title="Karigar & Buyer Forms" eyebrow="Get started">
      <div className="mx-auto max-w-3xl">
        <Kal />
      </div>
    </AppShell>
  );
}
