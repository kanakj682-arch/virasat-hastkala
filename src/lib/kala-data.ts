import silkSaree from "@/assets/silk-saree.jpg";
import woodenToy from "@/assets/wooden-toy.jpg";
import brassIdol from "@/assets/brass-idol.jpg";
import textiles from "@/assets/handwoven-textiles.jpg";
import baskets from "@/assets/jute-baskets.jpg";
import meena from "@/assets/meena-portrait.jpg";

export type Product = { id: string; title: string; category: string; price: string; status: "Published" | "Draft" | "Needs Review"; image: string; imageAlt: string; description?: string; tags?: string[] };
export type Opportunity = { id: string; title: string; buyer: string; score: number; quantity: string; budget: string; location: string; deadline: string; requirement: string; category: string; materials: string; reasons: string[] };
export type Enquiry = { id: string; status: "New" | "Accepted" | "In Discussion" | "Completed"; buyer: string; interest: string; quantity: string; budget: string; deadline: string; delivery: string };

export const demoArtisan = { name: "Meena Devi", location: "Jaipur, Rajasthan", craft: "Jaipur Blue Pottery", experience: "12 years", languages: ["हिन्दी", "English"], capacity: "40–60 pieces / month", image: meena };

export const products: Product[] = [
  { id: "silk-saree", title: "Handmade Silk Saree", category: "Textiles · Handloom", price: "₹4,999", status: "Published", image: silkSaree, imageAlt: "Handwoven Chanderi silk saree with gold zari border", description: "A Chanderi handloom silk saree woven on a pit loom over nine days, coloured with plant-based eco dyes and finished with a fine gold zari border.", tags: ["Chanderi Weave", "Eco Dyes"] },
  { id: "wooden-toy", title: "Handcrafted Wooden Toy", category: "Toys · Woodcraft", price: "₹899", status: "Published", image: woodenToy, imageAlt: "Handcrafted natural wooden elephant toy on wheels", description: "A hand-turned wooden elephant on wheels, shaped from sustainably sourced wood and finished with non-toxic, child-safe colours.", tags: ["Natural Wood", "Non-Toxic"] },
  { id: "brass-idol", title: "Vintage Brass Idol", category: "Home Décor · Metal Craft", price: "₹2,499", status: "Published", image: brassIdol, imageAlt: "Hand-engraved solid brass idol with warm patina", description: "A solid brass idol cast by hand and engraved with traditional motifs, carrying the warm patina that only slow, honest metalwork gives.", tags: ["Solid Brass", "Hand-Engraved"] },
];

export const opportunities: Opportunity[] = [
  { id: "corporate-diwali", title: "Corporate Diwali Gift Requirement", buyer: "ABC Enterprises", score: 94, quantity: "200 handmade products", budget: "₹600 – ₹900 / unit", location: "New Delhi", deadline: "15 October 2026", requirement: "Thoughtful, locally made gifts for an employee Diwali programme.", category: "Home décor · gifting", materials: "Ceramic, natural finishes", reasons: ["Product category matches", "Price fits buyer budget", "Artisan production capacity is suitable", "Delivery region is feasible"] },
  { id: "sustainable-gifting", title: "Sustainable Corporate Gifting", buyer: "GreenLeaf Co.", score: 91, quantity: "120 handmade products", budget: "₹700 – ₹1,100 / unit", location: "Mumbai", deadline: "28 October 2026", requirement: "Plastic-free gifting collection with a clear artisan story.", category: "Sustainable gifting", materials: "Natural, low-waste materials", reasons: ["Craft story aligns", "Price fits the brief", "Capacity can meet the timeline", "Regional shipping is workable"] },
  { id: "hotel-decor", title: "Boutique Hotel Décor Requirement", buyer: "Sarovar Hotels", score: 89, quantity: "80 accent pieces", budget: "₹900 – ₹1,300 / unit", location: "Jaipur", deadline: "05 November 2026", requirement: "Blue and white accent pieces for a new heritage property.", category: "Hospitality · décor", materials: "Ceramic, hand-painted glaze", reasons: ["Aesthetic direction matches", "Local delivery is easy", "Product range is suitable", "Repeat order potential"] },
  { id: "exhibition", title: "Handicraft Exhibition Opportunity", buyer: "Rajasthan Craft Council", score: 84, quantity: "1 curated stall", budget: "Commission-free showcase", location: "Udaipur", deadline: "18 November 2026", requirement: "A curated showcase of contemporary blue pottery makers.", category: "Exhibition · showcase", materials: "Blue pottery collection", reasons: ["Craft tradition is relevant", "Regional participation encouraged", "Range fits curation", "Story-led makers preferred"] },
];

export const enquiries: Enquiry[] = [
  { id: "hotel-enquiry", status: "New", buyer: "ABC Hotels", interest: "Handcrafted Blue Pottery Vase", quantity: "150 units", budget: "₹900 / unit", deadline: "20 October", delivery: "New Delhi" },
  { id: "greenleaf-enquiry", status: "Accepted", buyer: "GreenLeaf Co.", interest: "Festive Blue Pottery Gift Set", quantity: "80 units", budget: "₹1,100 / unit", deadline: "28 October", delivery: "Mumbai" },
  { id: "craft-council-enquiry", status: "In Discussion", buyer: "Rajasthan Craft Council", interest: "Curated blue pottery collection", quantity: "1 exhibition stall", budget: "Showcase", deadline: "18 November", delivery: "Udaipur" },
];

export const artisans = [
  { id: "meena", name: "Meena Devi", location: "Jaipur, Rajasthan", craft: "Blue Pottery Artisan", score: 95, image: meena, alt: "Meena Devi in her blue pottery workshop", reason: "Product requirement, budget compatibility, capacity, and location" },
  { id: "rekha", name: "Rekha Kumari", location: "Sanganer, Rajasthan", craft: "Hand Block Printing", score: 89, image: textiles, alt: "Handwoven and printed textile collection", reason: "Sustainable materials and gifting range" },
  { id: "arjun", name: "Arjun Boro", location: "Assam", craft: "Natural Jute Craft", score: 84, image: baskets, alt: "Handmade natural jute baskets", reason: "Eco-friendly material and production capacity" },
  { id: "lata", name: "Lata Bai", location: "Madhya Pradesh", craft: "Handwoven Textiles", score: 82, image: textiles, alt: "Layered handwoven textiles", reason: "Craft story and corporate gifting fit" },
];

export const languages = ["English", "हिन्दी", "मराठी", "বাংলা", "தமிழ்", "తెలుగు"];