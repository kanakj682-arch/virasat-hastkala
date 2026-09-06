import { supabase } from "@/integrations/supabase/client";
import type { Draft } from "@/lib/draft-store";

const BUCKET = "product-photos";
const SIGNED_URL_TTL = 60 * 60 * 24 * 365; // 1 year

function dataUrlToBlob(dataUrl: string): Blob {
  const [meta, base64] = dataUrl.split(",");
  const mime = /data:(.*?);/.exec(meta ?? "")?.[1] ?? "image/jpeg";
  const binary = atob(base64 ?? "");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

/** Upload a captured photo to cloud storage and return a long-lived viewable URL. */
export async function uploadProductPhoto(photo: string): Promise<{ path: string; url: string }> {
  const blob = dataUrlToBlob(photo);
  const ext = blob.type.split("/")[1] ?? "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: blob.type, upsert: false });
  if (error) throw new Error("We could not upload your photo. Please try again.");

  const { data, error: signError } = await supabase.storage.from(BUCKET).createSignedUrl(path, SIGNED_URL_TTL);
  if (signError || !data?.signedUrl) throw new Error("Your photo was saved but could not be opened. Please try again.");

  return { path, url: data.signedUrl };
}

const CRAFT_HINTS: Array<{ match: RegExp; craft: string; category: string; material: string }> = [
  { match: /pottery|blue pottery|mitti|clay|ceramic/i, craft: "Pottery", category: "Home decor", material: "Clay" },
  { match: /saree|silk|weav|bunkar|fabric|textile|cotton/i, craft: "Handloom weaving", category: "Textiles", material: "Handwoven fabric" },
  { match: /wood|lakdi|carv/i, craft: "Wood carving", category: "Home decor", material: "Wood" },
  { match: /brass|metal|pital|bronze/i, craft: "Metal craft", category: "Home decor", material: "Brass" },
  { match: /jewel|necklace|earring|jhumka|silver/i, craft: "Jewellery", category: "Jewellery", material: "Silver" },
  { match: /paint|madhubani|warli|painting|canvas/i, craft: "Folk painting", category: "Wall art", material: "Natural pigments on paper" },
];

function sentenceCase(text: string) {
  const clean = text.trim().replace(/\s+/g, " ");
  return clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : "";
}

function buildDraft(photo: string | null, transcript: string): Draft {
  const hint = CRAFT_HINTS.find((entry) => entry.match.test(transcript));
  const firstLine = sentenceCase(transcript.split(/[.।\n]/)[0] ?? "");
  const title = firstLine ? firstLine.slice(0, 60) : hint ? `Handmade ${hint.craft.toLowerCase()} piece` : "Handmade craft piece";
  const craft = hint?.craft ?? "Handmade craft";
  const category = hint?.category ?? "Handmade craft";
  const material = hint?.material ?? "Traditional materials";
  const description = transcript.trim()
    ? `${sentenceCase(transcript)}\n\nEach piece is made by hand, so small variations are part of its character.`
    : `A handmade ${craft.toLowerCase()} piece created by a skilled artisan. Each piece is made by hand, so small variations are part of its character.`;

  const tags = Array.from(
    new Set([craft.toLowerCase(), category.toLowerCase(), "handmade", "artisan made", "made in india"]),
  );

  return { photo, transcript, title, category, craft, material, price: "Price on request", description, tags };
}

/** Upload the photo to cloud storage and build the catalogue draft. */
export async function generateCatalogue(input: { photo: string | null; transcript: string }): Promise<Draft> {
  if (!input.photo) throw new Error("Add a photo so we can create your catalogue.");
  const url = input.photo.startsWith("data:") ? (await uploadProductPhoto(input.photo)).url : input.photo;
  return buildDraft(url, input.transcript);
}

/** Kept for existing call sites — now runs entirely on our own backend. */
export const generateCatalogueFromBackend = generateCatalogue;

/** Save the reviewed catalogue to the database. */
export async function saveProduct(draft: Draft) {
  const { data, error } = await supabase
    .from("products")
    .insert({
      title: draft.title || "Untitled craft",
      category: draft.category,
      craft: draft.craft,
      material: draft.material,
      price: draft.price,
      description: draft.description,
      tags: draft.tags,
      image_url: draft.photo,
      transcript: draft.transcript,
    })
    .select()
    .single();

  if (error) throw new Error("We could not publish your product. Please try again.");
  return data;
}
