// The registry of every building and landmark in the world. Anything with
// status 'open' is placed on the map and can be entered (or read); 'planned'
// ones are listed as under construction until you build them.

export type BuildingId =
  | 'welcome'
  | 'city-hall'
  | 'data-centre'
  | 'events-garden'
  | 'community-centre'
  | 'airport'
  | 'arcade'
  | 'product-studio'
  | 'post-office'
  | 'construction'
  | 'campus';

export interface Rect {
  minX: number;
  minZ: number;
  maxX: number;
  maxZ: number;
}

export interface Building {
  id: BuildingId;
  /** Landmarks (like the welcome sign) open a panel but aren't listed in the directory. */
  kind: 'building' | 'landmark';
  name: string;
  /** Shown on the minimap. */
  icon: string;
  /** One line, used in the short "Around town" lists. */
  summary: string;
  /** A fuller description of what's inside, used in the City Hall directory. */
  inside: string;
  /** Label on the button that appears when you walk up to it. */
  prompt: string;
  status: 'open' | 'planned';
  /** Where the building's local origin sits on the baseplate (stud units). */
  origin: { x: number; z: number };
  /**
   * Buildings are modelled with their front facing +z (south). 'north' turns
   * the model 180° so its front faces the street to the north.
   */
  facing: 'south' | 'north';
  /** Door position in local coordinates. Walking here shows the prompt. */
  entrance: { x: number; z: number };
  /** Rough outline in local coordinates, drawn on the minimap. */
  footprint: Rect;
  /** Road node the taxi stops at (see roads.ts). */
  stop: string;
  /** Extra words the directory search should match, e.g. "resume" for the Post Office. */
  keywords: string[];
  /** Optional photo header for the panel (photo is a file in /public). */
  hero?: { photo: string; alt: string; kicker: string };
}

export const BUILDINGS: Building[] = [
  {
    id: 'welcome',
    kind: 'landmark',
    name: 'Welcome to the City of Ivory',
    icon: '👋',
    summary: 'Start here.',
    inside: '',
    prompt: 'Read the welcome sign',
    status: 'open',
    origin: { x: 9, z: 17 },
    facing: 'south',
    entrance: { x: 0, z: 3.6 },
    footprint: { minX: -5, minZ: 0, maxX: 5, maxZ: 3 },
    stop: 'WS',
    keywords: ['start', 'about', 'intro'],
    hero: { photo: 'ivory.jpg', alt: 'Ivory Huo', kicker: "Hey, I'm Ivory 👋" },
  },
  {
    id: 'city-hall',
    kind: 'building',
    name: 'City Hall',
    icon: '🏛️',
    summary: 'The town directory, and how to reach me.',
    inside: 'The town directory, and how to reach me.',
    prompt: 'Enter City Hall',
    status: 'open',
    origin: { x: 0, z: -9 },
    facing: 'south',
    entrance: { x: 0, z: 0.3 },
    footprint: { minX: -10, minZ: -15, maxX: 10, maxZ: -1 },
    stop: 'CH',
    keywords: ['directory', 'map', 'contact', 'email', 'linkedin', 'github', 'about'],
  },
  {
    id: 'data-centre',
    kind: 'building',
    name: 'Data Centre',
    icon: '🖥️',
    summary: 'Internships and technical skills.',
    inside:
      'A server rack for each of my internships at Toronto-Dominion Bank and Synic: what I built, the impact, and the tools I used. Plus my full skills list.',
    prompt: 'Enter the Data Centre',
    status: 'open',
    origin: { x: 46, z: 3 },
    facing: 'north',
    entrance: { x: 0, z: 0.3 },
    footprint: { minX: -10, minZ: -13, maxX: 8, maxZ: -1 },
    stop: 'DCs',
    keywords: ['experience', 'work', 'internships', 'TD', 'Toronto-Dominion', 'Synic', 'software engineer', 'business systems analyst', 'skills', 'python', 'sql', 'pyspark', 'databricks', 'power bi', 'java'],
  },
  {
    id: 'product-studio',
    kind: 'building',
    name: 'Product Studio',
    icon: '💡',
    summary: 'Case studies: the problem, the fix, the result.',
    inside:
      'Case studies laid out like design frames, from Toronto-Dominion Bank and Western Tech for Social Impact: the gap, my approach, what shipped and what changed.',
    prompt: 'Enter the Product Studio',
    status: 'open',
    origin: { x: 46, z: -31 },
    facing: 'south',
    entrance: { x: 0, z: 0.4 },
    footprint: { minX: -8, minZ: -12, maxX: 8, maxZ: -1 },
    stop: 'PSs',
    keywords: ['product', 'product management', 'PM', 'case studies', 'VOLT', 'people directory', 'SSO', 'requirements', 'stakeholders', 'GO Hockey', 'non-profit'],
  },
  {
    id: 'arcade',
    kind: 'building',
    name: 'Arcade',
    icon: '🕹️',
    summary: 'Side projects you can play.',
    inside:
      'My side projects as arcade cabinets: Aftermath Creatures, Uplift, waste awAI and Pitch Perfect.',
    prompt: 'Enter the Arcade',
    status: 'open',
    origin: { x: 32, z: 16 },
    facing: 'north',
    entrance: { x: 0, z: 0.4 },
    footprint: { minX: -8, minZ: -12, maxX: 8, maxZ: -1 },
    stop: 'ARs',
    keywords: ['projects', 'side projects', 'games', 'Aftermath Creatures', 'Uplift', 'java', 'react native', 'rust', 'design', 'figma', 'play', 'waste awAI', 'Pitch Perfect', 'recipes', 'presentation'],
  },
  {
    id: 'campus',
    kind: 'building',
    name: 'Campus',
    icon: '🎓',
    summary: 'Western, my NUS exchange, courses and thesis.',
    inside:
      'My Computer Science studies at Western and my exchange semester at the National University of Singapore: relevant courses, my thesis, honours and scholarships.',
    prompt: 'Enter Campus',
    status: 'open',
    origin: { x: -21, z: -45 },
    facing: 'south',
    entrance: { x: 0, z: 0.4 },
    footprint: { minX: -9, minZ: -13, maxX: 9, maxZ: -1 },
    stop: 'CAs',
    keywords: ['education', 'school', 'university', 'Western', 'NUS', 'National University of Singapore', 'exchange', 'GPA', 'scholarship', 'courses', 'thesis', 'degree', 'computer science'],
  },
  {
    id: 'community-centre',
    kind: 'building',
    name: 'Community Centre',
    icon: '🤝',
    summary: 'Clubs, leadership and community work.',
    inside: 'The clubs I lead and the community work I take part in outside class.',
    prompt: 'Enter the Community Centre',
    status: 'open',
    origin: { x: -48, z: 3 },
    facing: 'north',
    entrance: { x: 0, z: -0.6 },
    footprint: { minX: -10, minZ: -15, maxX: 10, maxZ: 0 },
    stop: 'CCs',
    keywords: ['clubs', 'leadership', 'CAISA', 'Women in Tech', 'SheHacks', 'Tech for Social Impact', 'volunteering', 'president'],
  },
  {
    id: 'events-garden',
    kind: 'building',
    name: 'Events Garden',
    icon: '🥂',
    summary: 'A wedding and a gala, two events I planned.',
    inside:
      'Two events side by side: the outdoor wedding ceremony I planned for my sister and her 150+ guests, and a gala I hosted.',
    prompt: 'Enter the Events Garden',
    status: 'open',
    origin: { x: -22, z: 31 },
    facing: 'south',
    entrance: { x: 0, z: -1.2 },
    footprint: { minX: -12, minZ: 0, maxX: 12, maxZ: 19 },
    stop: 'S',
    keywords: ['events', 'event planning', 'wedding', 'gala', 'party'],
  },
  {
    id: 'airport',
    kind: 'building',
    name: 'Airport',
    icon: '✈️',
    summary: "Everywhere I've travelled, on a departures board.",
    inside:
      "16 places across Asia, Europe, Oceania and North America, on a split-flap departures board. Watch for the plane taking off.",
    prompt: 'Enter the Airport',
    status: 'open',
    origin: { x: 21, z: -45 },
    facing: 'south',
    entrance: { x: 0, z: 0.4 },
    footprint: { minX: -10, minZ: -11, maxX: 14, maxZ: -1 },
    stop: 'APs',
    keywords: ['travel', 'countries', 'exchange', 'trips', 'abroad'],
  },
  {
    id: 'post-office',
    kind: 'building',
    name: 'Post Office',
    icon: '✉️',
    summary: 'Email me or grab my resume.',
    inside: 'Send me an email, download my resume, or find me on LinkedIn and GitHub.',
    prompt: 'Enter the Post Office',
    status: 'open',
    origin: { x: -30.5, z: 17.5 },
    facing: 'north',
    entrance: { x: 0, z: 0.4 },
    footprint: { minX: -7, minZ: -11, maxX: 7, maxZ: 1 },
    stop: 'POs',
    keywords: ['contact', 'email', 'resume', 'CV', 'linkedin', 'github', 'hire', 'reach'],
  },
  {
    id: 'construction',
    kind: 'building',
    name: 'Construction Site',
    icon: '🏗️',
    summary: "What I'm building and learning right now.",
    inside: "A live look at what I'm working on right now. It changes, so check back.",
    prompt: 'Visit the construction site',
    status: 'open',
    origin: { x: -47, z: -31 },
    facing: 'south',
    entrance: { x: 0, z: 0.4 },
    footprint: { minX: -9, minZ: -16, maxX: 9, maxZ: -1 },
    stop: 'CSs',
    keywords: ['now', 'current', 'learning', 'in progress', 'thesis', 'this website'],
  },
];

export function getBuilding(id: BuildingId): Building {
  const building = BUILDINGS.find((b) => b.id === id);
  if (!building) throw new Error(`Unknown building: ${id}`);
  return building;
}
