// Bump this string whenever seed portraits or children change.
export const SEED_VERSION = 'v10';

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
  { id: 'birthday',  label: '🎂 Birthday'     },
  { id: 'excursion', label: '🦁 Day Out'       },
  { id: 'milestone', label: '⭐ Milestone'      },
  { id: 'special',   label: '🎉 Special Event' },
  { id: 'family',    label: '🏡 Family Moment' },
];

// consentStatus:
//   'approved'  — parent has accepted; photos can be saved and shown
//   'pending'   — parent account exists but hasn't responded yet
//   'declined'  — parent has opted out; photos including this child cannot be saved
//   'unlinked'  — no parent account created yet (treated same as pending for capture)
//
// autoApproveTagging: if true, photos tagged by OTHER parents skip manual approval

export const CHILDREN = [
  // ── Existing children (kept from v9) ────────────────────────────────────
  { id: "c4",  name: "Mia",     roomId: "kindy",        consentStatus: "approved", parentEmail: "mia@parent.com",      autoApproveTagging: false },
  { id: "c5",  name: "Maggie",  roomId: "pre-kindy",    consentStatus: "approved", parentEmail: "maggie@parent.com",   autoApproveTagging: false, photoUrl: "/images/maggie-profile.jpg", birthdate: "2024-07-07" },
  { id: "c6",  name: "Hailey",  roomId: "pre-kindy",    consentStatus: "approved", parentEmail: "hailey@parent.com",   autoApproveTagging: false },
  { id: "c7",  name: "Elenor",  roomId: "baby-toddler", consentStatus: "pending",  parentEmail: "elenor@parent.com",   autoApproveTagging: false },
  { id: "c8",  name: "Jake",    roomId: "baby-toddler", consentStatus: "approved", parentEmail: "siblings@parent.com", autoApproveTagging: true,  photoUrl: "/images/jake-profile.jpg",   birthdate: "2022-06-01" },
  { id: "c9",  name: "Mary",    roomId: "kindy",        consentStatus: "approved", parentEmail: "mary@parent.com",     autoApproveTagging: false },
  { id: "c10", name: "Billy",   roomId: "baby-toddler", consentStatus: "approved", parentEmail: "siblings@parent.com", autoApproveTagging: true,  photoUrl: "/images/billy-profile.jpg" },

  // ── Baby / Toddler Room — new children ──────────────────────────────────
  { id: "c11", name: "Isla",    roomId: "baby-toddler", consentStatus: "approved", parentEmail: "isla@parent.com",     autoApproveTagging: false, birthdate: "2025-03-15" },
  { id: "c12", name: "Luca",    roomId: "baby-toddler", consentStatus: "pending",  parentEmail: "luca@parent.com",     autoApproveTagging: false, birthdate: "2025-01-22" },
  { id: "c13", name: "Poppy",   roomId: "baby-toddler", consentStatus: "approved", parentEmail: "poppy@parent.com",    autoApproveTagging: false, birthdate: "2025-05-01" },
  { id: "c14", name: "Archer",  roomId: "baby-toddler", consentStatus: "declined", parentEmail: "archer@parent.com",   autoApproveTagging: false, birthdate: "2024-12-10" },
  { id: "c15", name: "Evie",    roomId: "baby-toddler", consentStatus: "approved", parentEmail: "evie@parent.com",     autoApproveTagging: false, birthdate: "2025-02-28" },
  { id: "c16", name: "Felix",   roomId: "baby-toddler", consentStatus: "unlinked",                                     autoApproveTagging: false, birthdate: "2025-04-11" },
  { id: "c17", name: "Harper",  roomId: "baby-toddler", consentStatus: "pending",  parentEmail: "harper@parent.com",   autoApproveTagging: false, birthdate: "2024-11-30" },
  { id: "c18", name: "Theo",    roomId: "baby-toddler", consentStatus: "approved", parentEmail: "theo@parent.com",     autoApproveTagging: false, birthdate: "2025-01-05" },
  { id: "c19", name: "Sienna",  roomId: "baby-toddler", consentStatus: "approved", parentEmail: "sienna@parent.com",   autoApproveTagging: false, birthdate: "2025-03-20" },

  // ── Pre-Kindy — new children ─────────────────────────────────────────────
  { id: "c20", name: "Noah",      roomId: "pre-kindy", consentStatus: "approved", parentEmail: "demo@parent.com",       autoApproveTagging: false, birthdate: "2024-08-10" },
  { id: "c21", name: "Lily",      roomId: "pre-kindy", consentStatus: "approved", parentEmail: "lily@parent.com",       autoApproveTagging: false, birthdate: "2024-05-22" },
  { id: "c22", name: "Oliver",    roomId: "pre-kindy", consentStatus: "pending",  parentEmail: "oliver@parent.com",     autoApproveTagging: false, birthdate: "2023-10-15" },
  { id: "c23", name: "Charlotte", roomId: "pre-kindy", consentStatus: "approved", parentEmail: "charlotte@parent.com",  autoApproveTagging: true,  birthdate: "2024-02-08" },
  { id: "c24", name: "Ethan",     roomId: "pre-kindy", consentStatus: "approved", parentEmail: "ethan@parent.com",      autoApproveTagging: false, birthdate: "2023-09-20" },
  { id: "c25", name: "Zoe",       roomId: "pre-kindy", consentStatus: "declined", parentEmail: "zoe@parent.com",        autoApproveTagging: false, birthdate: "2024-07-01" },
  { id: "c26", name: "Liam",      roomId: "pre-kindy", consentStatus: "approved", parentEmail: "liam@parent.com",       autoApproveTagging: false, birthdate: "2024-01-14" },
  { id: "c27", name: "Ruby",      roomId: "pre-kindy", consentStatus: "pending",  parentEmail: "ruby@parent.com",       autoApproveTagging: false, birthdate: "2023-11-28" },
  { id: "c28", name: "Finn",      roomId: "pre-kindy", consentStatus: "approved", parentEmail: "finn@parent.com",       autoApproveTagging: false, birthdate: "2024-06-03" },
  { id: "c29", name: "Chloe",     roomId: "pre-kindy", consentStatus: "approved", parentEmail: "chloe@parent.com",      autoApproveTagging: false, birthdate: "2023-08-17" },
  { id: "c30", name: "Leo",       roomId: "pre-kindy", consentStatus: "unlinked",                                       autoApproveTagging: false, birthdate: "2024-04-25" },
  { id: "c31", name: "Grace",     roomId: "pre-kindy", consentStatus: "approved", parentEmail: "grace@parent.com",      autoApproveTagging: false, birthdate: "2024-09-12" },
  { id: "c32", name: "Mason",     roomId: "pre-kindy", consentStatus: "pending",  parentEmail: "mason@parent.com",      autoApproveTagging: false, birthdate: "2023-12-05" },
  { id: "c33", name: "Sophie",    roomId: "pre-kindy", consentStatus: "approved", parentEmail: "sophie@parent.com",     autoApproveTagging: false, birthdate: "2024-03-19" },
  { id: "c34", name: "Riley",     roomId: "pre-kindy", consentStatus: "approved", parentEmail: "riley@parent.com",      autoApproveTagging: false, birthdate: "2024-10-07" },
  { id: "c35", name: "Hudson",    roomId: "pre-kindy", consentStatus: "approved", parentEmail: "hudson@parent.com",     autoApproveTagging: false, birthdate: "2024-08-28" },

  // ── Kindy Room — new children ────────────────────────────────────────────
  { id: "c36", name: "Emma",      roomId: "kindy", consentStatus: "approved", parentEmail: "emma@parent.com",      autoApproveTagging: false, birthdate: "2023-05-12" },
  { id: "c37", name: "Lucas",     roomId: "kindy", consentStatus: "approved", parentEmail: "lucas@parent.com",     autoApproveTagging: false, birthdate: "2022-11-03" },
  { id: "c38", name: "Ava",       roomId: "kindy", consentStatus: "declined", parentEmail: "ava@parent.com",       autoApproveTagging: false, birthdate: "2023-02-28" },
  { id: "c39", name: "Jackson",   roomId: "kindy", consentStatus: "approved", parentEmail: "jackson@parent.com",   autoApproveTagging: false, birthdate: "2022-08-15" },
  { id: "c40", name: "Olivia",    roomId: "kindy", consentStatus: "approved", parentEmail: "olivia@parent.com",    autoApproveTagging: true,  birthdate: "2022-12-20" },
  { id: "c41", name: "William",   roomId: "kindy", consentStatus: "pending",  parentEmail: "william@parent.com",   autoApproveTagging: false, birthdate: "2023-04-10" },
  { id: "c42", name: "Isabella",  roomId: "kindy", consentStatus: "approved", parentEmail: "isabella@parent.com",  autoApproveTagging: false, birthdate: "2022-09-08" },
  { id: "c43", name: "James",     roomId: "kindy", consentStatus: "approved", parentEmail: "james@parent.com",     autoApproveTagging: false, birthdate: "2023-07-25" },
  { id: "c44", name: "Sophia",    roomId: "kindy", consentStatus: "approved", parentEmail: "sophia@parent.com",    autoApproveTagging: false, birthdate: "2022-10-30" },
  { id: "c45", name: "Benjamin",  roomId: "kindy", consentStatus: "approved", parentEmail: "benjamin@parent.com",  autoApproveTagging: false, birthdate: "2023-01-14" },
  { id: "c46", name: "Emily",     roomId: "kindy", consentStatus: "approved", parentEmail: "emily@parent.com",     autoApproveTagging: false, birthdate: "2022-07-22" },
  { id: "c47", name: "Aiden",     roomId: "kindy", consentStatus: "pending",  parentEmail: "aiden@parent.com",     autoApproveTagging: false, birthdate: "2023-06-18" },
  { id: "c48", name: "Madison",   roomId: "kindy", consentStatus: "unlinked",                                      autoApproveTagging: false, birthdate: "2022-06-14" },
  { id: "c49", name: "Logan",     roomId: "kindy", consentStatus: "approved", parentEmail: "logan@parent.com",     autoApproveTagging: false, birthdate: "2023-03-02" },
  { id: "c50", name: "Abigail",   roomId: "kindy", consentStatus: "approved", parentEmail: "abigail@parent.com",   autoApproveTagging: false, birthdate: "2022-11-28" },
  { id: "c51", name: "Max",       roomId: "kindy", consentStatus: "approved", parentEmail: "max@parent.com",       autoApproveTagging: false, birthdate: "2023-05-05" },
  { id: "c52", name: "Zara",      roomId: "kindy", consentStatus: "approved", parentEmail: "zara@parent.com",      autoApproveTagging: false, birthdate: "2023-07-10" },
  { id: "c53", name: "Stella",    roomId: "kindy", consentStatus: "pending",  parentEmail: "stella@parent.com",    autoApproveTagging: false, birthdate: "2023-01-20" },
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
      childIds: ['c4', 'c20'],
      name: 'Demo Parent (Mia & Noah)',
      role: 'parent',
    },
  ],
};

// Seed portraits — all real photos provided by the user.
export const SEED_PORTRAITS = [
  {
    id: "p0f",
    taggedIds: ["c5", "c8"],
    date: "2025-07-07",
    notes: "Maggie's 1st birthday party — Jake pulls her aside to share some very important life advice, face to face on the play mat.",
    photoUrl: "/images/jake-maggie-birthday-advice.jpg",
    source: "school",
    eventTag: "birthday",
    pendingConsent: [],
  },
  {
    id: "p0d",
    taggedIds: ["c5", "c8", "c10"],
    date: "2025-03-29",
    notes: "Jake is not happy about Maggie pressing buttons on his iPad at the campsite. Billy is standing by, dreaming about food.",
    photoUrl: "/images/billy-jake-maggie-ipad.jpg",
    source: "school",
    eventTag: null,
    pendingConsent: [],
  },
  {
    id: "p0a",
    taggedIds: ["c5", "c8"],
    date: "2026-02-21",
    notes: "Camping fun at Hahndorf.",
    photoUrl: "/images/jake-maggie-camping.jpg",
    source: "school",
    eventTag: "excursion",
    pendingConsent: [],
  },
  {
    id: "p0c",
    taggedIds: ["c5", "c8", "c10"],
    date: "2024-04-13",
    notes: "Jake giving Maggie a gentle head rub on the couch while Mum Gail feeds baby Billy — a beautiful family moment.",
    photoUrl: "/images/jake-maggie-billy-couch.jpg",
    source: "school",
    eventTag: "family",
    pendingConsent: [],
  },
  {
    id: "p0e",
    taggedIds: ["c5", "c8"],
    date: "2024-01-27",
    notes: "Jake cradling baby Maggie on the carpet — she's already smiling up at him.",
    photoUrl: "/images/jake-maggie-cuddle-carpet.jpg",
    source: "school",
    eventTag: "milestone",
    pendingConsent: [],
  },
];
