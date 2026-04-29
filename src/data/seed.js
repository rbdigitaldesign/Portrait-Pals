// Bump this string whenever seed portraits or children change.
// The app will clear localStorage and reload fresh seed data on next visit.
export const SEED_VERSION = 'v2';

export const ROOMS = [
  { id: "baby-toddler", name: "Baby/Toddler Room" },
  { id: "pre-kindy",    name: "Pre-Kindy" },
  { id: "kindy",        name: "Kindy Room" },
];

export const CHILDREN = [
  { id: "c4", name: "Mia",     roomId: "kindy" },
  { id: "c5", name: "Maggie",  roomId: "pre-kindy" },
  { id: "c6", name: "Hailey",  roomId: "pre-kindy" },
  { id: "c7", name: "Elenor",  roomId: "baby-toddler" },
  { id: "c8",  name: "Jake",    roomId: "baby-toddler" },
  { id: "c9",  name: "Madeline",roomId: "kindy" },
  { id: "c10", name: "Billy",   roomId: "baby-toddler" },
];

export const ACCOUNTS = {
  educators: [
    { email: "admin@school.com", password: "pass123", role: "educator" },
  ],
  parents: [
    {
      email: "maggie@parent.com",
      password: "pass123",
      childIds: ["c5"],
      name: "Maggie's Parent",
      role: "parent",
    },
    {
      email: "siblings@parent.com",
      password: "pass123",
      childIds: ["c7", "c8", "c10"],
      name: "Sibling Account",
      role: "parent",
    },
  ],
};

// Seed portraits — swap photoUrl values with your own images.
// All image data lives here so replacements are one line each.
export const SEED_PORTRAITS = [
  {
    id: "p0f",
    taggedIds: ["c5", "c8"],
    date: "2025-07-07",
    notes: "Maggie's 1st birthday party — Jake pulls her aside to share some very important life advice, face to face on the play mat.",
    photoUrl: "/images/jake-maggie-birthday-advice.jpg",
    source: "school",
  },
  {
    id: "p0e",
    taggedIds: ["c5", "c8"],
    date: "2024-01-27",
    notes: "Jake cradling baby Maggie on the carpet — she's already smiling up at him.",
    photoUrl: "/images/jake-maggie-cuddle-carpet.jpg",
    source: "school",
  },
  {
    id: "p0d",
    taggedIds: ["c5", "c8", "c10"],
    date: "2025-03-29",
    notes: "Jake is not happy about Maggie pressing buttons on his iPad at the campsite. Billy is standing by, dreaming about food.",
    photoUrl: "/images/billy-jake-maggie-ipad.jpg",
    source: "school",
  },
  {
    id: "p0c",
    taggedIds: ["c5", "c8", "c10"],
    date: "2024-04-13",
    notes: "Jake giving Maggie a gentle head rub on the couch while Mum Gail feeds baby Billy — a beautiful family moment.",
    photoUrl: "/images/jake-maggie-billy-couch.jpg",
    source: "school",
  },
  {
    id: "p0a",
    taggedIds: ["c5", "c8"],
    date: "2026-02-21",
    notes: "Camping fun at Hahndorf.",
    photoUrl: "/images/jake-maggie-camping.jpg",
    source: "school",
  },
  {
    id: "p0b",
    taggedIds: ["c5", "c8"],
    date: "2024-12-25",
    notes: "Jake and Maggie's first Christmas morning together, discovering their new Duplo sets.",
    photoUrl: "/images/jake-maggie-blocks.jpg",
    source: "school",
  },
  {
    id: "p1",
    taggedIds: ["c4", "c8"],
    date: "2025-12-31",
    notes: "Mia and Jake sharing a festive morning building a big block tower together.",
    photoUrl: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80",
    source: "school",
  },
  {
    id: "p2",
    taggedIds: ["c5", "c6"],
    date: "2026-01-15",
    notes: "Maggie and Hailey painting at the art station — they mixed colours to make purple!",
    photoUrl: "https://images.unsplash.com/photo-1571210862729-78a52d3779a2?w=800&q=80",
    source: "school",
  },
  {
    id: "p3",
    taggedIds: ["c7", "c8"],
    date: "2026-02-03",
    notes: "Elenor and Jake discovering the sensory bin together for the very first time.",
    photoUrl: "https://images.unsplash.com/photo-1516627145497-ae6968895b24?w=800&q=80",
    source: "school",
  },
  {
    id: "p4",
    taggedIds: ["c4", "c9"],
    date: "2026-02-14",
    notes: "Mia and Madeline made Valentine's cards for each other — completely unprompted!",
    photoUrl: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
    source: "school",
  },
  {
    id: "p5",
    taggedIds: ["c5"],
    date: "2026-03-01",
    notes: "Maggie reading her favourite book in the cosy corner, then told the whole group the story.",
    photoUrl: "https://images.unsplash.com/photo-1512741685461-b3b7cc48b5af?w=800&q=80",
    source: "school",
  },
  {
    id: "p6",
    taggedIds: ["c6", "c9"],
    date: "2026-03-18",
    notes: "Hailey and Madeline working out how to balance the seesaw — ten whole minutes of teamwork.",
    photoUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&q=80",
    source: "school",
  },
];
