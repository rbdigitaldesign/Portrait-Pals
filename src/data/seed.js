// Bump this string whenever seed portraits or children change.
export const SEED_VERSION = 'v15';

export const ROOMS = [
  { id: "baby-toddler", name: "Baby/Toddler Room" },
  { id: "pre-kindy",    name: "Pre-Kindy" },
  { id: "kindy",        name: "Kindy Room" },
];

// Room thresholds by age in months (used for auto-progression)
export const ROOM_THRESHOLDS = [
  { roomId: 'baby-toddler', maxMonths: 18 },
  { roomId: 'pre-kindy',    maxMonths: 30 },
  { roomId: 'kindy',        maxMonths: Infinity },
];

export const EVENT_TAGS = [
  { id: 'birthday',  label: 'Birthday',      icon: 'Cake'      },
  { id: 'excursion', label: 'Day Out',        icon: 'MapPin'    },
  { id: 'milestone', label: 'Milestone',      icon: 'Star'      },
  { id: 'special',   label: 'Special Event',  icon: 'PartyPopper' },
  { id: 'family',    label: 'Family Moment',  icon: 'Home'      },
];

// consentStatus:
//   'approved'  — parent has accepted; photos can be saved and shown
//   'pending'   — parent account exists but hasn't responded yet
//   'declined'  — parent has opted out; photos including this child cannot be saved
//   'unlinked'  — no parent account created yet (treated same as pending for capture)
//
// autoApproveTagging: if true, photos tagged by OTHER parents skip manual approval

export const CHILDREN = [
  // ── Baby / Toddler Room ──────────────────────────────────────────────────
  { id: "c8",  name: "Jake",      roomId: "baby-toddler", consentStatus: "approved", parentEmail: "siblings@parent.com", autoApproveTagging: true,  birthdate: "2022-06-01", photoUrl: "/images/Jake.jpg" },
  { id: "c10", name: "Billy",     roomId: "baby-toddler", consentStatus: "approved", parentEmail: "siblings@parent.com", autoApproveTagging: true,                             photoUrl: "/images/Billy.jpg" },

  // ── Pre-Kindy ─────────────────────────────────────────────────────────────
  { id: "c5",  name: "Maggie",    roomId: "pre-kindy",    consentStatus: "approved", parentEmail: "maggie@parent.com",   autoApproveTagging: false, birthdate: "2023-07-09",  photoUrl: "/images/maggie-profile.jpg" },
  { id: "c20", name: "Noah",      roomId: "pre-kindy",    consentStatus: "approved", parentEmail: "demo@parent.com",     autoApproveTagging: false, birthdate: "2024-08-10",  photoUrl: "/images/Noah.jpg" },
  { id: "c21", name: "Lily",      roomId: "pre-kindy",    consentStatus: "approved", parentEmail: "lily@parent.com",     autoApproveTagging: false, birthdate: "2024-05-22",  photoUrl: "/images/Lily.jpg" },
  { id: "c23", name: "Charlotte", roomId: "pre-kindy",    consentStatus: "approved", parentEmail: "charlotte@parent.com",autoApproveTagging: true,  birthdate: "2024-02-08",  photoUrl: "/images/Charlotte.jpg" },
  { id: "c25", name: "Zoe",       roomId: "pre-kindy",    consentStatus: "declined", parentEmail: "zoe@parent.com",      autoApproveTagging: false, birthdate: "2024-07-01",  photoUrl: "/images/Zoe.jpg" },

  // ── Kindy Room ────────────────────────────────────────────────────────────
  { id: "c36", name: "Emma",      roomId: "kindy",        consentStatus: "approved", parentEmail: "emma@parent.com",    autoApproveTagging: false, birthdate: "2023-05-12",   photoUrl: "/images/Emma.jpg" },
  { id: "c40", name: "Olivia",    roomId: "kindy",        consentStatus: "approved", parentEmail: "olivia@parent.com",  autoApproveTagging: true,  birthdate: "2022-12-20",   photoUrl: "/images/Olivia.jpg" },
  { id: "c41", name: "William",   roomId: "kindy",        consentStatus: "pending",  parentEmail: "william@parent.com", autoApproveTagging: false, birthdate: "2023-04-10",   photoUrl: "/images/William.jpg" },
];

export const ACCOUNTS = {
  admin: [
    {
      email: 'admin@portraitpals.com',
      password: 'admin2024',
      role: 'admin',
      name: 'App Administrator',
    },
  ],
  educators: [
    { email: 'admin@school.com', password: 'pass123', role: 'educator', name: 'Educator Demo' },
  ],
  parents: [
    {
      email: 'maggie@parent.com',
      password: 'pass123',
      childIds: ['c5'],
      name: "Maggie's Mum",
      role: 'parent',
    },
    {
      email: 'siblings@parent.com',
      password: 'pass123',
      childIds: ['c8', 'c10'],
      name: "Jake & Billy's Dad",
      role: 'parent',
    },
    {
      email: 'demo@parent.com',
      password: 'pass123',
      childIds: ['c20'],
      name: "Noah's Mum",
      role: 'parent',
    },
  ],
};

// Seed portraits — all real photos provided by the user.
export const SEED_PORTRAITS = [
  {
    id: "ps1",
    taggedIds: ["c5", "c21"],
    date: "2026-03-14",
    notes: "Bubble day in the yard — Maggie and Lily were completely lost in it, trying to blow the biggest bubbles they could manage.",
    photoUrl: "/images/pexels-antonius-ferret-5278821.jpg",
    source: "school",
    eventTag: "special",
    pendingConsent: [],
  },
  {
    id: "ps2",
    taggedIds: ["c5", "c21"],
    date: "2026-03-14",
    notes: "Total concentration — these two were in a bubble competition all of their own.",
    photoUrl: "/images/pexels-antonius-ferret-5275841.jpg",
    source: "school",
    eventTag: "special",
    pendingConsent: [],
  },
  {
    id: "ps3",
    taggedIds: ["c5", "c21"],
    date: "2026-04-02",
    notes: "Caught this moment at pack-up time. The two of them just dissolved into laughter and we're not sure why — classic.",
    photoUrl: "/images/pexels-antonius-ferret-5278985.jpg",
    source: "school",
    eventTag: null,
    pendingConsent: [],
  },
  {
    id: "ps4",
    taggedIds: ["c5", "c21", "c23"],
    date: "2026-04-22",
    notes: "Charlotte found the sticker collection and within about 30 seconds Maggie and Lily had pulled up a spot on the court to help sort through them.",
    photoUrl: "/images/pexels-antonius-ferret-5275351.jpg",
    source: "school",
    eventTag: null,
    pendingConsent: [],
  },
  {
    id: "ps5",
    taggedIds: ["c5", "c21", "c23"],
    date: "2026-05-08",
    notes: "Sports morning on the court — Lily sprinted ahead but Maggie and Charlotte weren't far behind.",
    photoUrl: "/images/pexels-antonius-ferret-5275809.jpg",
    source: "school",
    eventTag: "excursion",
    pendingConsent: [],
  },
  {
    id: "ps6",
    taggedIds: ["c5", "c21", "c23"],
    date: "2026-05-08",
    notes: "Three girls, zero cares — this was taken about two seconds before they all piled into each other.",
    photoUrl: "/images/pexels-antonius-ferret-5275836.jpg",
    source: "school",
    eventTag: "excursion",
    pendingConsent: [],
  },
  {
    id: "ps7",
    taggedIds: ["c23"],
    date: "2026-04-15",
    notes: "Charlotte completely absorbed in the puzzle table — she worked through every single one without looking up.",
    photoUrl: "/images/Charlotte-2.jpg",
    source: "school",
    eventTag: "milestone",
    pendingConsent: [],
  },
  {
    id: "ps8",
    taggedIds: ["c20", "c25"],
    date: "2026-04-28",
    notes: "Noah and Zoe in the sand pit — Noah went straight for the trucks, Zoe had other plans.",
    photoUrl: "/images/Zoe and Noah.jpg",
    source: "school",
    eventTag: null,
    pendingConsent: [],
  },
  {
    id: "ps9",
    taggedIds: ["c20", "c25"],
    date: "2026-04-28",
    notes: "Same session, different angle — Zoe found the best spot and wasn't moving.",
    photoUrl: "/images/Zoe and Noah-2.jpg",
    source: "school",
    eventTag: null,
    pendingConsent: [],
  },
  {
    id: "ps10",
    taggedIds: ["c23", "c40"],
    date: "2026-03-20",
    notes: "Charlotte and Olivia both spotted the truck at exactly the same moment — neither was willing to let go.",
    photoUrl: "/images/Charlotte and Olivia.jpg",
    source: "school",
    eventTag: null,
    pendingConsent: [],
  },
  {
    id: "ps11",
    taggedIds: ["c41", "c20"],
    date: "2026-04-10",
    notes: "William and Noah side by side on the rug, completely absorbed sorting through the game pieces together.",
    photoUrl: "/images/William and Noah.jpg",
    source: "school",
    eventTag: null,
    pendingConsent: [],
  },
  {
    id: "ps12",
    taggedIds: ["c36", "c10"],
    date: "2026-05-02",
    notes: "Outdoor play in the sandpit — Emma came with a plan, Billy came to supervise.",
    photoUrl: "/images/Emma and Billy.jpg",
    source: "school",
    eventTag: null,
    pendingConsent: [],
  },
  {
    id: "ps13",
    taggedIds: ["c8", "c5"],
    date: "2026-04-05",
    notes: "Dress-up Friday — Jake chose the penguin, Maggie went full giraffe. They spent the whole session at the table like this.",
    photoUrl: "/images/Jake and Maggie.jpg",
    source: "school",
    eventTag: "special",
    pendingConsent: [],
  },
];
