// Bump this string whenever seed portraits or children change.
// The app will clear localStorage and reload fresh seed data on next visit.
export const SEED_VERSION = 'v7';

export const ROOMS = [
  { id: "baby-toddler", name: "Baby/Toddler Room" },
  { id: "pre-kindy",    name: "Pre-Kindy" },
  { id: "kindy",        name: "Kindy Room" },
];

export const CHILDREN = [
  { id: "c4",  name: "Mia",     roomId: "kindy" },
  { id: "c5",  name: "Maggie",  roomId: "pre-kindy", photoUrl: "/images/maggie-profile.jpg" },
  { id: "c6",  name: "Hailey",  roomId: "pre-kindy" },
  { id: "c7",  name: "Elenor",  roomId: "baby-toddler" },
  { id: "c8",  name: "Jake",    roomId: "baby-toddler", photoUrl: "/images/jake-profile.jpg" },
  { id: "c9",  name: "Madeline",roomId: "kindy" },
  { id: "c10", name: "Billy",   roomId: "baby-toddler", photoUrl: "/images/billy-profile.jpg" },
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
      childIds: ["c8", "c10"],
      name: "Sibling Account",
      role: "parent",
    },
  ],
};

// Seed portraits — all real photos provided by the user.
// Unsplash placeholders for Maggie (p2, p5) removed at user request.
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
    id: "p0d",
    taggedIds: ["c5", "c8", "c10"],
    date: "2025-03-29",
    notes: "Jake is not happy about Maggie pressing buttons on his iPad at the campsite. Billy is standing by, dreaming about food.",
    photoUrl: "/images/billy-jake-maggie-ipad.jpg",
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
    id: "p0c",
    taggedIds: ["c5", "c8", "c10"],
    date: "2024-04-13",
    notes: "Jake giving Maggie a gentle head rub on the couch while Mum Gail feeds baby Billy — a beautiful family moment.",
    photoUrl: "/images/jake-maggie-billy-couch.jpg",
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
];
