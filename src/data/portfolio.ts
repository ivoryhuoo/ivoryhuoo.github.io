// All the written content for the site lives here, so updating your portfolio
// never means digging through 3D code.

export const profile = {
  name: 'Ivory Huo',
  program: 'Honours Specialization in Computer Science',
  school: 'Western University',
  graduation: 'April 2027',
};

/** File in /public. */
export const RESUME_FILE = 'IvoryHuo_Resume.pdf';

export const links = [
  { label: 'Email', href: 'mailto:huo.ivory@gmail.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/ivory-huo' },
  { label: 'GitHub', href: 'https://github.com/ivoryhuoo' },
];

export const welcome = {
  paragraphs: [
    "Welcome to my city! I'm Ivory, an Honours Specialization Computer Science student at Western University, and I love building things: tools that make people's work easier, apps people enjoy using, and events that bring people together.",
    'So I built my portfolio the same way, one brick at a time. Walk around, step inside any building, or jump straight to one from the list below.',
  ],
};

// ---------------------------------------------------------------- experience

export interface Role {
  /** Stable id, used to link achievements to a role. */
  id: string;
  title: string;
  org: string;
  when: string;
  highlights: string[];
  stack: string[];
}

export const roles: Role[] = [
  {
    id: 'td-bsa',
    title: 'Business Systems Analyst Intern',
    org: 'Toronto-Dominion Bank',
    when: 'Summer 2026',
    highlights: [
      'Scoped requirements with 10 users and launched the People Directory Insights Tool (Power Apps and Power Automate) to replace manual reporting, cutting effort by 80%. Shipped 4 feedback-driven versions; it is now used daily.',
      'Prioritized 10+ initiatives across 5+ stakeholder groups, writing user stories and specs in Jira, and delivered 6 projects.',
      "Led major upgrades to the Vendor Opportunity Lifecycle Tool (VOLT), expanding it into the team's first unified view of vendor relationships across 3 systems. Demoed it to drive adoption; the team now relies on it to understand vendor relationships and prep for conferences and events.",
      "Presented the People Directory Insights Tool to a VP and at TD's intern showcase.",
      'Coordinated the SSO rollout for a live application, replacing its legacy sign-in and aligning security, infrastructure, compliance and risk teams through privacy review and go-live.',
    ],
    stack: ['Power Apps', 'Power Automate', 'Jira'],
  },
  {
    id: 'td-swe',
    title: 'Software Engineer Intern',
    org: 'Toronto-Dominion Bank',
    when: 'Summer 2025',
    highlights: [
      'Migrated legacy fraud claims data to the cloud with PySpark pipelines in Databricks, and automated daily reporting for 10+ fraud analysts.',
      'Laid the data foundation for a fraud threat dashboard for the VP of Canadian Fraud.',
      'Built the business case and sunset plan for decommissioning Eclipse, a legacy platform, mapping the migration for 10+ teams.',
    ],
    stack: ['PySpark', 'Databricks', 'Python', 'SQL'],
  },
  {
    id: 'synic-2024',
    title: 'Full-Stack Software Engineer Intern',
    org: 'Synic Software',
    when: 'Summer 2024',
    highlights: [
      "Partnered with designers to ship AI-generated menus in Heymate!, a restaurant app, using OpenAI's API, cutting menu creation effort by 30%.",
    ],
    stack: ['OpenAI API', 'AngularJS', 'ASP.NET Core 8', 'Entity Framework'],
  },
  {
    id: 'synic-2023',
    title: 'Web Development Intern',
    org: 'Synic Software',
    when: 'Summer 2023',
    highlights: [
      "Implemented OpenAI's API in a restaurant web app to generate menu content, partnering with designers and developers on usability and cross-browser compatibility, and raised task management efficiency 10% with Figma and Jira.",
    ],
    stack: ['OpenAI API', 'HTML', 'CSS', 'JavaScript', 'Figma', 'Jira'],
  },
];

export const skills: Array<{ group: string; items: string[] }> = [
  {
    group: 'Technical',
    items: ['Python', 'Java', 'JavaScript', 'Typescript', 'SQL', 'C/C++', 'HTML/CSS', 'React', 'Node.js', 'PySpark', 'Databricks', 'Docker', 'Github Actions', 'OpenAI API'],
  },
  {
    group: 'Product and data',
    items: ['Jira', 'Confluence', 'Figma', 'Power BI', 'Power Apps', 'Power Automate', 'Agile/Scrum'],
  },
];

// --------------------------------------------------------------- data centre

export interface Achievement {
  icon: string;
  title: string;
  detail: string;
  role?: string;
}

export const dataCentre: {
  stats: Array<{ value: number; suffix: string; label: string }>;
  achievements: Achievement[];
} = {
  /** Scoreboard numbers that count up when the Data Centre boots. */
  stats: [
    { value: 80, suffix: '%', label: 'less manual reporting' },
    { value: 5, suffix: '+', label: 'stakeholder groups aligned' },
    { value: 10, suffix: '+', label: 'analysts on automated reports' },
    { value: 6, suffix: '', label: 'projects delivered' },
  ],
  /** Unlocked by powering on the rack for `role`; ones without a role are unlocked from the start. */
  achievements: [
    { icon: '🌱', title: 'Always learning', detail: 'Picked up new skills through every opportunity along the way' },
    { icon: '🎤', title: 'Presented to a VP', detail: "People Directory Insights Tool, plus TD's intern showcase", role: 'td-bsa' },
    { icon: '🚀', title: 'Shipped v4', detail: '4 feedback-driven versions, now used daily', role: 'td-bsa' },
    { icon: '🔐', title: 'Went live', detail: 'SSO through privacy review and go-live', role: 'td-bsa' },
    { icon: '📦', title: 'Six for six', detail: '6 projects delivered from 10+ initiatives', role: 'td-bsa' },
    { icon: '☁️', title: 'Cloud migration', detail: 'Legacy fraud claims data moved to Databricks', role: 'td-swe' },
    { icon: '🤖', title: 'AI in production', detail: 'AI-generated menus shipped in Heymate!', role: 'synic-2024' },
    { icon: '🌐', title: 'Works everywhere', detail: 'Cross-browser UX for a restaurant web app', role: 'synic-2023' },
  ],
};

// ------------------------------------------------------------ product studio

export interface CaseStudy {
  name: string;
  /** Short name for the layers list. */
  short: string;
  icon: string;
  /** The impact in a few words, shown under the name in the layers list. */
  headline: string;
  context: string;
  problem: string;
  approach: string;
  shipped: string;
  result: string;
  /** Optional reflection, shown as "What I learned". */
  lesson?: string;
}

// TODO: add specifics where you can: who the users were, what you heard in
// requirements sessions, a design decision you made and why.
export const caseStudies: CaseStudy[] = [
  {
    name: 'People Directory Insights Tool',
    short: 'People Directory',
    icon: '👥',
    headline: '80% less effort · used daily',
    context: 'Toronto-Dominion Bank, Business Systems Analyst Intern, 2026',
    problem: "Obtaining user details across the company's organizational structure was manual and repetitive, taking up to 3 hours every week.",
    approach: 'Scoped requirements with 10 users, then iterated on their feedback across 4 versions.',
    shipped: 'The People Directory Insights Tool, built with Power Apps and Power Automate to replace the manual process.',
    result: "Reporting effort dropped by 80% and the team uses it daily. I presented it to a VP and at TD's intern showcase.",
  },
  {
    name: 'Vendor Opportunity Lifecycle Tool (VOLT)',
    short: 'VOLT',
    icon: '🔗',
    headline: '3 systems → 1 view',
    context: 'Toronto-Dominion Bank, Business Systems Analyst Intern, 2026',
    problem: 'Vendor relationships were spread across 3 systems, with no centralized visualization of how they connected.',
    approach: 'Led major upgrades to the tool, then demoed it to the team to drive adoption.',
    shipped: "An upgraded VOLT: the team's first unified view of vendor relationships.",
    result:
      'The team relies on it to understand vendor relationships and prep for conferences and events. Vendor knowledge that lived in scattered places is now shared in one view.',
  },
  {
    name: 'SSO (Single Sign-On) Rollout',
    short: 'SSO Rollout',
    icon: '🔐',
    headline: 'Legacy sign-in → SSO',
    context: 'Toronto-Dominion Bank, Business Systems Analyst Intern, 2026',
    problem: "A live application still relied on a legacy sign-in. The goal was to move it onto the bank's single sign-on for faster, simpler access.",
    approach: 'Aligned security, infrastructure, compliance and risk teams through privacy review.',
    shipped: 'SSO in production, replacing the legacy sign-in.',
    result: 'Took it from privacy review through go-live, so users sign in once instead of managing a separate login.',
  },
  {
    name: 'GO Hockey Platform',
    short: 'GO Hockey',
    icon: '🏒',
    headline: '50+ forms · 1 big lesson',
    context: 'Western Tech for Social Impact, Developer Director',
    problem:
      'GO Hockey, a London non-profit serving 500+ kids, ran its programs through a manual process spread across 50+ Google Forms and spreadsheets.',
    approach:
      'Gathered requirements with the client, working through sprints, code reviews, project planning and wireframes.',
    shipped: 'The foundations of a single platform to replace the forms and spreadsheets.',
    result:
      "Client communication was limited, so requirements and feedback came slowly. By the time the build was underway, we didn't have the time or budget to ship what the client really needed, and it didn't launch.",
    lesson:
      'Set up a regular check-in rhythm with the client from day one, lock requirements early, and scope a first release that fits the time and budget we actually have.',
  },
];

// -------------------------------------------------------------------- arcade

export interface ArcadeGame {
  id: 'aftermath' | 'uplift' | 'waste-awai' | 'pitch-perfect';
  name: string;
  /** Part of the name to highlight when it's shown in capitals, e.g. the "AI" in waste awAI. */
  emphasis?: string;
  tagline: string;
  blurb: string;
  features?: string[];
  stack: string[];
  /** Cabinet colours: body, marquee background, marquee text. */
  colors: { body: string; marquee: string; text: string };
  /** What the cabinet's little screen shows: an image file in /public/arcade, or emoji. */
  preview: { image?: string; emoji?: string };
  /** Screenshots in /public/arcade (file names include the extension). */
  gallery?: Array<{ file: string; alt: string; caption: string }>;
  /** The first link marked primary gets the pink button. */
  links?: Array<{ label: string; href: string; primary?: boolean }>;
  /** A personal note shown in the game's screen. */
  note?: string;
  /** Shown as a small badge above the tagline, e.g. "Hackathon project". */
  badge?: string;
}

export const arcadeGames: ArcadeGame[] = [
  {
    id: 'aftermath',
    name: 'Aftermath Creatures',
    tagline: 'A virtual pet game for the post-apocalypse.',
    blurb:
      "A Tamagotchi-style game with post-apocalyptic pets. Keep your creature fed, rested, happy and healthy, or it won't survive. Built in Java with a GUI, parental controls and JUnit tests.",
    stack: ['Java', 'JUnit'],
    colors: { body: '#2F7D32', marquee: '#163D1D', text: '#7DFCB0' },
    preview: {},
    note: 'This project was so much fun to work on! I got to draw and create each character, mood, and item myself on Procreate!',
  },
  {
    id: 'uplift',
    badge: '🏆 Hackathon project',
    name: 'Uplift',
    tagline: 'Empowering words to brighten your day.',
    blurb:
      'A self-love and connection app that inspires positivity through personalized affirmations and daily self-care motivation.',
    features: [
      'Personalized affirmations: AI-powered and tailored to your mood, delivered as push notifications.',
      'Self-love streaks: a visual tracker that celebrates showing up for yourself every day.',
      "AI affirmation generator: Voiceflow's Dialog Manager API crafts affirmations based on how you feel.",
      'Privacy-first sign-in with Auth0: social sign-in, multi-factor authentication and passwordless logins.',
    ],
    stack: ['Expo', 'Rust', 'Axum', 'PostgreSQL', 'Auth0', 'Voiceflow API'],
    colors: { body: '#B9A8F5', marquee: '#3A2F6B', text: '#FFC2DD' },
    preview: { image: 'uplift-logo-colour.png' },
    gallery: [
      { file: 'uplift-1.jpg', alt: 'Uplift welcome screen with the gradient logo and a Start button', caption: 'Welcome: empowering words, one affirmation at a time' },
      { file: 'uplift-2.jpg', alt: 'Profile info screen with username and a phone number field', caption: 'Info: add your number to get affirmations by text' },
      { file: 'uplift-4.jpg', alt: "Uplift home screen with today's affirmation, a streak counter and affirmation cards", caption: "Home: today's affirmation, your streak, and notes from us and your friends" },
      { file: 'uplift-3.jpg', alt: 'A check-in pop-up asking how are you feeling today, with a text box', caption: 'Check-in: tell Uplift how you feel, and it writes an affirmation for you' },
    ],
    links: [
      { label: 'Watch the demo on DoraHacks', href: 'https://dorahacks.io/build/20329', primary: true },
      { label: 'View the code on GitHub', href: 'https://github.com/ivoryhuoo/Uplift' },
    ],
  },
  {
    id: 'waste-awai',
    badge: '🏆 Hackathon project',
    name: 'waste awAI',
    emphasis: 'AI',
    tagline: 'Busy lives, smarter recipes, and less waste with AI.',
    blurb:
      "A web app that tracks your groceries and their expiration dates, then suggests recipes from what you already have, starting with whatever's about to expire. Made for busy university students and anyone who loses track of what's in their fridge.",
    features: [
      'Grocery tracker: keep an up-to-date inventory of your fridge.',
      'Expiration reminders: pop-up alerts before food goes bad.',
      'AI recipe generator: recipes from your ingredients, via the Spoonacular API.',
    ],
    stack: ['Next.js', 'Python', 'MySQL', 'Spoonacular API'],
    colors: { body: '#2E6FC2', marquee: '#0F2A4F', text: '#A9D8F5' },
    preview: { image: 'waste-logo.jpg' },
    gallery: [
      { file: 'waste-home.jpg', alt: 'waste awAI home screen with a fridge, grocery list, suggested recipes and expiry reminders', caption: 'Your fridge, grocery list, recipes and reminders in one place' },
      { file: 'waste-recipe.jpg', alt: 'A suggested recipe for chilled Swiss oatmeal, showing used and missing ingredients', caption: 'A recipe built from what you already have' },
      { file: 'waste-add.jpg', alt: 'The Add Fridge Item form with name, quantity, date added and expiration date', caption: 'Adding an item with its expiration date' },
    ],
    links: [
      { label: 'Watch the demo on DoraHacks', href: 'https://dorahacks.io/build/21427', primary: true },
      { label: 'View the code on GitHub', href: 'https://github.com/ivoryhuoo/Digital-Fridge' },
    ],
  },
  {
    id: 'pitch-perfect',
    badge: '🏆 Hackathon project',
    name: 'Pitch Perfect',
    tagline: 'Duck, duck… boost! Your presentation confidence starts here.',
    blurb:
      'An AI presentation coach my team of four built in under 36 hours at a hackathon. It listens as you practise and gives gentle, real-time feedback, so people with presentation anxiety can build confidence at their own pace.',
    features: [
      'Real-time coaching on tone, pacing, clarity, filler words, pauses and eye contact.',
      'Supportive feedback under ten words, generated with the Gemini API.',
      'Downloadable summary PDFs and a history of past sessions to track progress.',
    ],
    stack: ['React', 'Vite', 'Node.js', 'Express', 'MongoDB', 'Gemini API', 'face-api.js', 'PDFKit'],
    colors: { body: '#E8873A', marquee: '#4A2410', text: '#FFE58A' },
    preview: { image: 'pitch-home.jpg' },
    gallery: [
      {
        file: 'pitch-home.jpg',
        alt: 'Pitch Perfect landing page: a pond scene with lily-pad Login and Sign up buttons and a goose in a purple bucket hat',
        caption: 'This is the landing page. Watch the full demo video on Devpost to see the coaching in action!',
      },
    ],
    links: [
      { label: 'Watch the demo video on Devpost', href: 'https://devpost.com/software/pitch-perfect-x5nz1c', primary: true },
      { label: 'View the code on GitHub', href: 'https://github.com/ivoryhuoo/PitchPerfect' },
    ],
  },
];

// ------------------------------------------------------------------- airport

export type Region = 'Asia' | 'Europe' | 'Oceania' | 'North America';

export interface Destination {
  name: string;
  region: Region;
  /** Shown instead of "Visited" on the departures board. */
  status?: 'Exchange' | 'Hometown';
}

export const travel = {
  intro:
    'Fun fact: I love to travel! I soak in the culture wherever I go, and every place teaches me something new about the world and the people in it.',
  destinations: [
    { name: 'China', region: 'Asia', status: 'Hometown' },
    { name: 'Singapore', region: 'Asia', status: 'Exchange' },
    { name: 'Indonesia', region: 'Asia' },
    { name: 'Vietnam', region: 'Asia' },
    { name: 'Japan', region: 'Asia' },
    { name: 'Thailand', region: 'Asia' },
    { name: 'South Korea', region: 'Asia' },
    { name: 'Malaysia', region: 'Asia' },
    { name: 'Taiwan', region: 'Asia' },
    { name: 'Hong Kong', region: 'Asia' },
    { name: 'Italy', region: 'Europe' },
    { name: 'Germany', region: 'Europe' },
    { name: 'Greece', region: 'Europe' },
    { name: 'New Caledonia', region: 'Oceania' },
    { name: 'United States', region: 'North America' },
    { name: 'Mexico', region: 'North America' },
  ] as Destination[],
};

// ------------------------------------------------------------------ campus

export interface SchoolCard {
  id: string;
  /** Short label for the card switcher. */
  short: string;
  school: string;
  /** Logo file in /public. */
  logo: string;
  /** Logo sits on a white strip (for logos with a white background). */
  logoOnWhite?: boolean;
  role: string;
  line: string;
  detail: string;
  gpa: string;
  theme: 'western' | 'nus';
}

/** Student cards on the Campus popup, one per school. */
export const schoolCards: SchoolCard[] = [
  {
    id: 'western',
    short: 'University of Western Ontario',
    school: 'University of Western Ontario',
    logo: 'western-logo-white.png',
    role: 'Student',
    line: 'Class of 2027',
    detail: 'Honours Specialization in Computer Science',
    gpa: '3.7/4.0',
    theme: 'western',
  },
  {
    id: 'nus',
    short: 'National University of Singapore',
    school: 'National University of Singapore',
    logo: 'nus-logo.png',
    logoOnWhite: true,
    role: 'Exchange student',
    line: 'Singapore',
    detail: 'Exchange semester, Winter 2026',
    gpa: '4.3/5.0',
    theme: 'nus',
  },
];

export const education = {
  gpa: '3.7/4.0',
  /** Honours, shown as gold badges with an optional line below. */
  honours: [{ icon: '🏅', title: "Dean's Honour List", detail: '2023-24 and 2024-25' }] as Array<{
    icon: string;
    title: string;
    detail?: string;
  }>,
  /** Scholarships, grouped under one shared line. */
  scholarships: {
    note: 'For my exchange semester at NUS in Singapore',
    awards: [
      { icon: '🌍', title: 'Global Opportunities Award' },
      { icon: '✈️', title: 'International Learning Award' },
    ],
  },
  courses: [
    'Data Structures and Algorithms',
    'Operating Systems',
    'Databases I',
    'Introduction to Machine Learning',
    'Introduction to Software Engineering',
    'Object-Oriented Design and Analysis',
    'Organization of Programming Languages',
  ],
  thesis: {
    title: 'Undergraduate thesis (in progress)',
    detail:
      'Analyzing competitive moats for AI-native startups in the generative AI era, focusing on platform risk when hyperscaler partners launch competing products. Supervised at Ivey Business School.',
  },
  // Fill this in; it's hidden while empty.
  hackathons: [] as string[],
};

// -------------------------------------------------------- construction site

export interface NowItem {
  title: string;
  icon: string;
  detail: string;
  status: 'in-progress' | 'incoming';
}

export const nowBuilding = {
  updated: 'October 2026',
  items: [
    {
      title: 'This world',
      icon: '🧱',
      detail:
        'A 3D portfolio built with React, TypeScript and Three.js (React Three Fiber). New buildings go up all the time.',
      status: 'in-progress',
    },
    {
      title: 'My undergraduate thesis',
      icon: '📚',
      detail:
        'Analyzing competitive moats for AI-native startups in the generative AI era: what happens when the hyperscaler you partner with launches a competing product.',
      status: 'in-progress',
    },
    {
      title: 'Another project',
      icon: '📦',
      detail: 'Another project is on its way. Stay tuned!',
      status: 'incoming',
    },
  ] as NowItem[],
};

// ------------------------------------------------------------ events garden

export interface EventChapter {
  title: string;
  caption: string;
  /** Photo files in /public/events. */
  photos: string[];
}

export interface PlannedEvent {
  key: string;
  name: string;
  icon: string;
  /** One line under the name on its envelope. */
  sub: string;
  summary: string;
  stats: Array<{ value: string; label: string }>;
  roles: string[];
  /** Keep the role pills on a single row (on wide screens). */
  rolesOneLine?: boolean;
  /** Photos, shown as a gallery that slides past. */
  chapters: EventChapter[];
}

export const events = {
  intro: 'I love planning events and bringing people together! Open an envelope to see 2 of my most proud moments <3',
  items: [
    {
      key: 'wedding',
      name: 'Wedding',
      icon: '💍',
      sub: '150+ guests · 6 events',
      summary:
        "I planned my sister's wedding from the first idea to the last thank-you email, including every event leading up to the ceremony and reception for 150+ guests. I found and coordinated every venue and vendor, ran operations before, during and after the day, and was also her maid of honour and the bilingual MC.",
      stats: [
        { value: '150+', label: 'guests' },
        { value: '6', label: 'events' },
        { value: '1', label: 'planner: me' },
        { value: '2', label: 'languages as MC' },
      ],
      roles: [
        'Wedding Event Planner',
        'Maid of Honour',
        'Bilingual MC',
        'Venues & Vendors (end to end)',
        'Operations: Tea Ceremony, Family Functions, Rehearsal, Ceremony, Reception',
        'Post-Event Follow-Up',
      ],
      chapters: [
        { title: 'Tea ceremony', caption: 'A traditional tea ceremony with both families.', photos: ['wedding-tea-1.jpg', 'wedding-tea-2.jpg'] },
        { title: 'Family banquet', caption: 'A celebration meal for the families after the tea ceremony.', photos: ['wedding-meal-1.jpg', 'wedding-meal-2.jpg', 'wedding-meal-3.jpg'] },
        { title: 'Blue Jays game', caption: 'A 20-person family and extended family outing.', photos: ['wedding-jays-1.jpg'] },
        { title: 'Rehearsal', caption: 'Walking through the ceremony with everyone.', photos: ['wedding-rehearsal-1.jpg', 'wedding-rehearsal-2.jpg'] },
        { title: 'Ceremony', caption: 'An indoor ceremony with family and friends.', photos: ['wedding-ceremony-1.jpg', 'wedding-ceremony-2.jpg', 'wedding-ceremony-3.jpg', 'wedding-ceremony-4.jpg'] },
        { title: 'Reception', caption: "The reception for 150+ guests, which I MC'd in two languages.", photos: ['wedding-reception-1.jpg'] },
      ],
    },
    {
      key: 'gala',
      name: 'Gala',
      icon: '✨',
      sub: '200+ guests · CAISA',
      summary:
        'A large-scale cultural showcase planned under CAISA with 2 other large Asian student clubs at Western, featuring performances from our own talented members. As one of the main event leads, I handled operations before and during the event, helped with the budget, took on venue hunting, troubleshot technical issues and anything else that came up on the day, and coordinated the afterparty at a nearby event space. 200+ people came, planned on a 4-month timeline, and the feedback was great.',
      stats: [
        { value: '200+', label: 'attendees' },
        { value: '3', label: 'clubs' },
        { value: '4', label: 'months to plan' },
        { value: '1', label: 'afterparty' },
      ],
      roles: ['Event Lead', 'Cross-Club Collaboration', 'Budgeting', 'Day-of Troubleshooting', 'Afterparty Coordination'],
      rolesOneLine: true,
      chapters: [
        { title: 'Setup', caption: 'Setting up the venue before guests arrived.', photos: ['gala-setup.jpg'] },
        { title: 'Gala night', caption: 'Dressed up for the night with the team.', photos: ['gala-1.jpg'] },
        { title: 'Performances', caption: 'Our members performed to showcase culture and talent.', photos: ['gala-2.jpg'] },
        { title: 'Afterparty', caption: 'The afterparty at a nearby event space.', photos: ['gala-3.jpg', 'gala-4.jpg'] },
      ],
    },
  ] as PlannedEvent[],
};

// --------------------------------------------------------- community centre

export interface CommunityItem {
  name: string;
  icon: string;
  role: string;
  when: string;
  /** Earlier positions in the same club, most recent first. `key` marks the one to bold. */
  pastRoles?: Array<{ title: string; when: string; key?: boolean }>;
  /** The headline number on the ticket stub. */
  headline: { value: string; label: string };
  detail?: string;
  /** Accent colour, used softly on the ticket. */
  tint: string;
}

// Shown as event tickets in the Community Centre, in this order.
export const community: { clubs: CommunityItem[]; activities: CommunityItem[]; service: CommunityItem[] } = {
  clubs: [
    {
      name: 'Canadian Asian International Students Association',
      icon: '🎉',
      role: 'Senior Advisor',
      when: '2026–present',
      pastRoles: [
        { title: 'President', when: '2025–26', key: true },
        { title: 'VP Internal', when: '2024–25' },
        { title: 'Special Events Director', when: '2023–24' },
        { title: 'Special Events Representative', when: '2022–23' },
      ],
      headline: { value: '200+', label: 'at flagship events' },
      detail:
        'A cultural club that builds community and celebrates Asian identity at Western. Directed a 60-person executive team and doubled membership through social campaigns, influencer outreach and partnerships. Ran 2 events a month, including flagships of 200+ attendees. Managed $20K in funds and secured 15 sponsors.',
      tint: '#E8B828',
    },
    {
      name: 'Women in Tech Society+',
      icon: '💻',
      role: 'Development Director',
      when: '2023–25',
      headline: { value: '100+', label: 'hackers' },
      detail:
        "Worked with 5 other developers to build the website for SheHacks+, one of Canada's largest hackathons for women and non-binary people, with 100+ participants. Ran internal code reviews and workshops.",
      tint: '#FF8CC0',
    },
    {
      name: 'Western Tech for Social Impact',
      icon: '🏒',
      role: 'Developer Director',
      when: '2023–24',
      headline: { value: '500+', label: 'kids served' },
      detail:
        'Lead backend developer, working through sprints, code reviews, project planning and wireframes. Worked on a platform for GO Hockey, a non-profit serving 500+ kids, to automate the manual work spread across 50+ Google Forms and spreadsheets.',
      tint: '#5FA8E8',
    },
  ],
  activities: [],
  service: [],
};
