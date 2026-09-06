import meena from "@/assets/meena-portrait.jpg";
import textiles from "@/assets/handwoven-textiles.jpg";
import baskets from "@/assets/jute-baskets.jpg";
import brass from "@/assets/brass-idol.jpg";
import saree from "@/assets/silk-saree.jpg";
import toy from "@/assets/wooden-toy.jpg";

export type ArtisanStory = {
  id: string;
  name: string;
  craft: string;
  location: string;
  image: string;
  alt: string;
  kind: "audio" | "reel" | "photo";
  duration: string;
  heritage: string;
  quote: string;
  story: string;
};

export const artisanStories: ArtisanStory[] = [
  {
    id: "meena",
    name: "Meena Devi",
    craft: "Blue Pottery",
    location: "Jaipur, Rajasthan",
    image: meena,
    alt: "Meena Devi shaping a blue pottery vase in her workshop",
    kind: "audio",
    duration: "1:20",
    heritage: "Fourth generation",
    quote: "The blue in my pots is the same blue my great-grandmother mixed by hand.",
    story:
      "My family has shaped blue pottery in Jaipur for four generations. We grind quartz, mix it with gum, and shape every vase by hand before the cobalt glaze goes on. One piece takes three days and two firings. When a buyer asks why my vase costs more than a factory one, I tell them they are buying three days of my family's memory.",
  },
  {
    id: "lata",
    name: "Lata Bai",
    craft: "Handwoven Textiles",
    location: "Maheshwar, Madhya Pradesh",
    image: textiles,
    alt: "Layered handwoven textiles on a wooden loom",
    kind: "reel",
    duration: "0:55",
    heritage: "Third generation",
    quote: "The loom speaks all day. I have learnt to answer it.",
    story:
      "I sit at the loom before sunrise because the yarn behaves best in the cool air. Each saree carries a border pattern my mother named after our river. We dye with pomegranate rind and iron water, never chemicals, so the colour deepens with every wash instead of fading.",
  },
  {
    id: "arjun",
    name: "Arjun Boro",
    craft: "Natural Jute Craft",
    location: "Kokrajhar, Assam",
    image: baskets,
    alt: "Handmade natural jute baskets stacked together",
    kind: "audio",
    duration: "1:05",
    heritage: "Village cooperative of 40 women",
    quote: "Our baskets grow in the field before they are made in the house.",
    story:
      "We harvest jute from our own fields, soak the stalks in the pond for two weeks, then dry and split the fibre. Forty women in my village weave together in the afternoons. Every basket is plastic-free and takes about four hours, and the money reaches each weaver's own account the same week.",
  },
  {
    id: "ramesh",
    name: "Ramesh Sthapati",
    craft: "Brass Sculpture",
    location: "Swamimalai, Tamil Nadu",
    image: brass,
    alt: "Hand-cast brass idol with detailed ornamentation",
    kind: "photo",
    duration: "1:30",
    heritage: "Chola lost-wax lineage",
    quote: "The wax model is destroyed so the bronze can be born.",
    story:
      "We follow the lost-wax method written down in the Shilpa Shastra. I carve the figure in beeswax, coat it in river clay, then pour molten brass so the wax burns away. The mould is broken only once, which means every idol I make is the only one of its kind.",
  },
  {
    id: "sunita",
    name: "Sunita Bhandari",
    craft: "Silk Weaving",
    location: "Bhagalpur, Bihar",
    image: saree,
    alt: "Silk saree with woven golden border",
    kind: "reel",
    duration: "1:10",
    heritage: "Second generation",
    quote: "A wedding saree carries a family's whole day inside it.",
    story:
      "Bhagalpur tussar silk comes from cocoons collected after the moth has left, so nothing is harmed. I weave the border in real zari on a pit loom. A bridal saree takes me eighteen days, and I write the bride's name on the reverse selvedge as my signature.",
  },
  {
    id: "kishore",
    name: "Kishore Chitrakar",
    craft: "Channapatna Wooden Toys",
    location: "Channapatna, Karnataka",
    image: toy,
    alt: "Brightly lacquered wooden toy",
    kind: "audio",
    duration: "0:48",
    heritage: "Fifth generation",
    quote: "Children chew these toys, so the colour must be food.",
    story:
      "We turn soft ivory wood on a hand lathe and polish it with lacquer coloured by turmeric, indigo and kumkuma. No chemical paint ever touches a toy, because babies put them straight into their mouths. My grandfather taught me that safety is part of the craft, not an extra.",
  },
];

export function findStory(id: string) {
  return artisanStories.find((story) => story.id === id);
}
