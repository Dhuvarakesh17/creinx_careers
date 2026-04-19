export type Sector = "technical" | "digital-marketing";
export type WorkMode = "Remote" | "Hybrid" | "Onsite";
export type JobType = "Full-time" | "Part-time" | "Internship" | "Contract";
export type JobStatus = "New" | "Hot" | "Urgent" | "Remote";

export type JobOpening = {
  id: string;
  slug: string;
  title: string;
  department: "Technical" | "Digital Marketing";
  sector: Sector;
  team: string;
  location: "Chennai" | "Bengaluru" | "Remote";
  workMode: WorkMode;
  experienceLevel: "Fresher" | "Junior" | "Mid" | "Senior";
  experienceRange: "0-1" | "1-3" | "3-5" | "5+";
  type: JobType;
  salaryRange: string;
  summary: string;
  skills: string[];
  postedDaysAgo: number;
  statusTags: JobStatus[];
  openings: number;
  responsibilities: string[];
  requiredQualifications: string[];
  niceToHave: string[];
  perks: string[];
  aboutRole: string[];
};

export const sectorMeta: Record<Sector, { title: string; accent: string }> = {
  technical: {
    title: "Technical Roles",
    accent: "from-cyan-400 to-blue-600",
  },
  "digital-marketing": {
    title: "Digital Marketing Roles",
    accent: "from-amber-300 to-orange-500",
  },
};

export const companyStory = [
  {
    heading: "Why We Started",
    body: "We saw visionary businesses struggle to scale — not because their ideas lacked potential, but because their digital infrastructure could not keep up. That gap became our launching platform.",
  },
  {
    heading: "How We Work",
    body: "Small focused squads of engineers and designers united by a single ethos — build digital assets that drive tangible results. We specialize in delivering affordable premium solutions that consistently generate value.",
  },
  {
    heading: "How We Grow",
    body: "Our team grows through real client impact, continuous learning, and a culture that rewards clarity, execution, and trust. We build with intention — laying the foundation for long-term impact rather than short-term wins.",
  },
];

export const companyStats = {
  teamSize: 80,
  foundedYear: 2019,
  projectsDelivered: 200,
};

export const whyJoinUs = [
  {
    title: "Clarity in Everything",
    description:
      "We cut through the noise. No bureaucracy, no confusion — just clear goals, clear communication, and clear results.",
  },
  {
    title: "Function Over Decoration",
    description:
      "Every role here has purpose. You will build things that actually work and actually matter to real businesses.",
  },
  {
    title: "Built to Scale",
    description:
      "You will work on robust systems designed for growth. Your skills will be challenged and expanded on every project.",
  },
  {
    title: "Partners Not Employees",
    description:
      "We value long-term relationships over short-term transactions. You grow with CREINX and CREINX grows with you.",
  },
];

export const jobOpenings: JobOpening[] = [
  {
    id: "frontend-engineer",
    slug: "senior-react-developer",
    title: "Senior React Developer",
    department: "Technical",
    sector: "technical",
    team: "Product Engineering Team",
    location: "Chennai",
    workMode: "Hybrid",
    experienceLevel: "Senior",
    experienceRange: "3-5",
    type: "Full-time",
    salaryRange: "₹ 8,00,000 - ₹ 14,00,000",
    summary:
      "Build advanced, high-performance interfaces using React and Next.js for enterprise products.",
    skills: ["React", "Next.js", "TypeScript", "Tailwind", "Testing"],
    postedDaysAgo: 3,
    statusTags: ["Hot"],
    openings: 3,
    responsibilities: [
      "Build and maintain React-based frontend applications.",
      "Collaborate with designers to ship pixel-perfect UI.",
      "Optimize rendering and web performance metrics.",
      "Write reliable unit and integration tests.",
      "Mentor junior developers and review pull requests.",
      "Work with backend teams on API contracts.",
    ],
    requiredQualifications: [
      "3+ years of React production experience.",
      "Strong TypeScript and state management knowledge.",
      "Hands-on experience with Next.js app router.",
      "Solid understanding of accessibility and SEO.",
    ],
    niceToHave: ["Framer Motion", "GSAP", "GraphQL", "Playwright"],
    perks: [
      "Health insurance",
      "Flexible hours",
      "Learning budget",
      "Annual bonus",
    ],
    aboutRole: [
      "You will own key frontend initiatives for high-growth products.",
      "You will partner with product and design to improve conversion and usability.",
      "You will shape engineering standards and frontend architecture.",
    ],
  },
  {
    id: "backend-engineer",
    slug: "backend-node-developer",
    title: "Backend Node Developer",
    department: "Technical",
    sector: "technical",
    team: "Platform Team",
    location: "Chennai",
    workMode: "Remote",
    experienceLevel: "Mid",
    experienceRange: "1-3",
    type: "Full-time",
    salaryRange: "₹ 7,00,000 - ₹ 12,00,000",
    summary:
      "Design robust APIs, data models, and scalable backend services for product and client systems.",
    skills: ["Node.js", "PostgreSQL", "Redis", "AWS", "API Design"],
    postedDaysAgo: 5,
    statusTags: ["Remote", "New"],
    openings: 2,
    responsibilities: [
      "Build APIs",
      "Model data",
      "Own reliability",
      "Write tests",
      "Improve observability",
      "Support launches",
    ],
    requiredQualifications: [
      "2+ years Node.js",
      "SQL and indexing",
      "REST API best practices",
      "Cloud basics",
    ],
    niceToHave: ["Kafka", "Docker", "Kubernetes"],
    perks: ["Remote allowance", "Flexible work", "Learning stipend"],
    aboutRole: [
      "You will own critical backend systems.",
      "You will collaborate with frontend and DevOps.",
      "You will improve speed and reliability.",
    ],
  },
  {
    id: "product-designer",
    slug: "product-designer-ui-ux",
    title: "Product Designer (UI/UX)",
    department: "Technical",
    sector: "technical",
    team: "Design Studio",
    location: "Chennai",
    workMode: "Hybrid",
    experienceLevel: "Mid",
    experienceRange: "1-3",
    type: "Contract",
    salaryRange: "₹ 6,00,000 - ₹ 9,00,000",
    summary:
      "Create intuitive product journeys and scalable design systems for SaaS and web products.",
    skills: ["Figma", "Design Systems", "User Research", "Prototyping"],
    postedDaysAgo: 8,
    statusTags: ["New"],
    openings: 1,
    responsibilities: [
      "Design flows",
      "Build systems",
      "Prototype quickly",
      "Work with developers",
      "Run UX reviews",
      "Improve usability",
    ],
    requiredQualifications: [
      "2+ years product design",
      "Strong portfolio",
      "System thinking",
    ],
    niceToHave: ["Motion design", "Micro-interactions"],
    perks: ["Flexible schedule", "Design learning budget"],
    aboutRole: [
      "You will drive product UX quality.",
      "You will shape the visual language.",
      "You will own user testing loops.",
    ],
  },
  {
    id: "performance-marketer",
    slug: "performance-marketing-specialist",
    title: "Performance Marketing Specialist",
    department: "Digital Marketing",
    sector: "digital-marketing",
    team: "Growth Team",
    location: "Chennai",
    workMode: "Remote",
    experienceLevel: "Mid",
    experienceRange: "1-3",
    type: "Full-time",
    salaryRange: "₹ 6,00,000 - ₹ 10,00,000",
    summary:
      "Run and optimize paid campaigns across channels with strong attribution and experimentation discipline.",
    skills: ["Google Ads", "Meta Ads", "GA4", "Attribution", "Landing Pages"],
    postedDaysAgo: 2,
    statusTags: ["Urgent", "Remote"],
    openings: 2,
    responsibilities: [
      "Own paid funnels",
      "Run A/B tests",
      "Improve ROAS",
      "Analyze cohorts",
      "Partner with design",
      "Scale winning ads",
    ],
    requiredQualifications: [
      "2+ years paid media",
      "Strong analytics",
      "Hands-on campaign execution",
    ],
    niceToHave: ["SQL", "Marketing automation"],
    perks: ["Performance bonus", "Remote flexibility"],
    aboutRole: [
      "You will own acquisition channels.",
      "You will work directly on revenue goals.",
      "You will influence product messaging.",
    ],
  },
  {
    id: "seo-content-strategist",
    slug: "seo-content-strategist",
    title: "SEO Content Strategist",
    department: "Digital Marketing",
    sector: "digital-marketing",
    team: "Content Growth Team",
    location: "Chennai",
    workMode: "Hybrid",
    experienceLevel: "Junior",
    experienceRange: "1-3",
    type: "Full-time",
    salaryRange: "₹ 5,00,000 - ₹ 8,00,000",
    summary:
      "Develop high-intent content and technical SEO programs that grow qualified organic traffic.",
    skills: ["SEO", "Content Strategy", "Search Console", "Analytics"],
    postedDaysAgo: 6,
    statusTags: ["New"],
    openings: 1,
    responsibilities: [
      "Keyword strategy",
      "Content briefs",
      "Optimize pages",
      "Track rankings",
      "Build editorial calendar",
      "Collaborate with writers",
    ],
    requiredQualifications: [
      "SEO fundamentals",
      "Content planning",
      "Data-driven approach",
    ],
    niceToHave: ["Technical SEO", "Link building"],
    perks: ["Learning budget", "Hybrid work"],
    aboutRole: [
      "You will shape organic growth.",
      "You will own content direction.",
      "You will collaborate across teams.",
    ],
  },
  {
    id: "social-media-manager",
    slug: "social-media-manager",
    title: "Social Media Manager",
    department: "Digital Marketing",
    sector: "digital-marketing",
    team: "Brand Team",
    location: "Chennai",
    workMode: "Onsite",
    experienceLevel: "Fresher",
    experienceRange: "0-1",
    type: "Internship",
    salaryRange: "₹ 2,40,000 - ₹ 4,20,000",
    summary:
      "Create social campaigns, manage community, and build brand storytelling across short-form platforms.",
    skills: ["Social Strategy", "Reels", "Community", "Copywriting"],
    postedDaysAgo: 1,
    statusTags: ["Hot"],
    openings: 3,
    responsibilities: [
      "Plan posts",
      "Run campaigns",
      "Track engagement",
      "Respond to community",
      "Support shoots",
      "Report insights",
    ],
    requiredQualifications: [
      "Strong communication",
      "Creative mindset",
      "Basic analytics",
    ],
    niceToHave: ["Canva", "CapCut"],
    perks: ["Mentorship", "Onsite collaboration"],
    aboutRole: [
      "You will drive brand voice.",
      "You will work with creative teams.",
      "You will grow audience engagement.",
    ],
  },
];

export function getJobBySlug(slug: string) {
  return jobOpenings.find((job) => job.slug === slug);
}
