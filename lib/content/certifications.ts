/**
 * Certifications, single-sourced for /about, /about/certifications, the
 * printed résumé, JSON-LD and llms.txt. Copy follows the brand rules:
 * sentence case, no em dashes, no emoji.
 *
 * To add one: pick (or add) its issuer and category below, then add an entry
 * anywhere in `entries`. The list is sorted by date for every page.
 */

export type CertificationCategory =
  | "ai"
  | "backend"
  | "frontend"
  | "languages"
  | "fundamentals"
  | "devops"
  | "projects"

export const categories: Record<
  CertificationCategory,
  {
    title: string
    /** For tight spots, like the tally on /about. */
    short: string
    blurb: string
  }
> = {
  ai: {
    title: "AI and machine learning",
    short: "ai and ml",
    blurb:
      "How models learn, and how to put them to work inside real products.",
  },
  backend: {
    title: "Backend and data",
    short: "backend",
    blurb: "Servers, APIs and the databases underneath them.",
  },
  frontend: {
    title: "Frontend and design",
    short: "frontend",
    blurb: "React, the web platform, and the interface on top of it.",
  },
  languages: {
    title: "Languages",
    short: "languages",
    blurb: "JavaScript, TypeScript, Python and Go, learned properly.",
  },
  fundamentals: {
    title: "Computer science",
    short: "computer science",
    blurb:
      "Data structures, algorithms, memory and the paradigms underneath every language.",
  },
  devops: {
    title: "DevOps and tooling",
    short: "devops",
    blurb:
      "Linux, version control, containers and the pipeline that ships it all.",
  },
  projects: {
    title: "Projects",
    short: "projects",
    blurb:
      "Programs built end to end, from an empty directory to a working tool.",
  },
}

/** The order categories appear in on /about/certifications. */
export const categoryOrder: CertificationCategory[] = [
  "ai",
  "backend",
  "frontend",
  "languages",
  "fundamentals",
  "devops",
  "projects",
]

export const issuers = {
  anthropic: { name: "Anthropic", url: "https://www.anthropic.com" },
  bootdev: { name: "Boot.dev", url: "https://www.boot.dev" },
  datacamp: { name: "DataCamp", url: "https://www.datacamp.com" },
  freecodecamp: { name: "freeCodeCamp", url: "https://www.freecodecamp.org" },
  google: { name: "Google", url: "https://www.google.com" },
  ibm: { name: "IBM", url: "https://www.ibm.com" },
  linkedin: {
    name: "LinkedIn Learning",
    url: "https://www.linkedin.com/learning",
  },
  maps: { name: "Multi-Aid Programs (MAPS)" },
  meta: { name: "Meta", url: "https://www.meta.com" },
  mongodb: { name: "MongoDB", url: "https://learn.mongodb.com" },
  nasba: { name: "NASBA", url: "https://www.nasba.org" },
  "python-institute": {
    name: "OpenEDG Python Institute",
    url: "https://pythoninstitute.org",
  },
  scrimba: { name: "Scrimba", url: "https://scrimba.com" },
  udemy: { name: "Udemy", url: "https://www.udemy.com" },
  vercel: { name: "Vercel", url: "https://vercel.com" },
} as const satisfies Record<string, { name: string; url?: string }>

export type IssuerKey = keyof typeof issuers

export type Certification = {
  /** Anchor on /about/certifications. */
  slug: string
  name: string
  issuer: IssuerKey
  /** ISO month, "2026-09". */
  issued: string
  category: CertificationCategory
  skills: string[]
  credentialId?: string
  /** Where the issuer verifies it. */
  url?: string
  /** What it covered, when the name does not say. */
  note?: string
  /** A result worth calling out: a rank, a prize. */
  distinction?: string
  /** Case studies on /work that came out of it. */
  projects?: string[]
  /** Shown on /about and the printed résumé. */
  featured?: boolean
}

/** Recorded date of the last meaningful change to this content. */
export const certificationsUpdatedAt = "2026-10-11"

const entries: Certification[] = [
  {
    slug: "understanding-machine-learning",
    name: "Understanding Machine Learning",
    issuer: "datacamp",
    issued: "2026-09",
    category: "ai",
    skills: ["Machine Learning", "Artificial Intelligence"],
    credentialId: "423764d37620753faded34261e571043095273c5",
    url: "https://www.datacamp.com/completed/statement-of-accomplishment/course/423764d37620753faded34261e571043095273c5",
    featured: true,
  },
  {
    slug: "introduction-to-ai-for-work",
    name: "Introduction to AI for Work",
    issuer: "datacamp",
    issued: "2026-09",
    category: "ai",
    skills: ["Artificial Intelligence"],
    credentialId: "d78c9c166f3490ab41515bc6816270f9dd6d8753",
    url: "https://www.datacamp.com/completed/statement-of-accomplishment/course/d78c9c166f3490ab41515bc6816270f9dd6d8753",
  },
  {
    slug: "v0-foundations",
    name: "v0 Foundations",
    issuer: "vercel",
    issued: "2026-05",
    category: "ai",
    skills: ["v0", "Artificial Intelligence", "Web Development"],
    credentialId: "v0-foundations",
    url: "https://vercel.com/academy/v0-foundations/certificate/6XbtAmcFuhHdDnXne5ohvuh5",
    featured: true,
  },
  {
    slug: "mongodb-nodejs-developer-path",
    name: "MongoDB Node.js Developer Path",
    issuer: "mongodb",
    issued: "2026-04",
    category: "backend",
    skills: [
      "MongoDB",
      "Node.js",
      "NoSQL",
      "Database Design",
      "Back-End Development",
      "JavaScript",
    ],
    credentialId: "MDB0gd5rdd2wu",
    url: "https://ti-user-certificates.s3.amazonaws.com/ae62dcd7-abdc-4e90-a570-83eccba49043/1a1d6e63-4d10-460b-848c-7afc3564c4b9-khaled-saeed-d2ed878f-3641-49f2-8bef-3ea5863f6909-certificate.pdf",
    featured: true,
  },
  {
    slug: "web-development-back-end",
    name: "Web Development, Back End",
    issuer: "maps",
    issued: "2026-03",
    category: "backend",
    skills: [
      "NestJS",
      "Express",
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "MongoDB",
      "Git",
      "Postman",
    ],
    credentialId: "2026-CECS-12888-5678",
    note: "96 hours of backend training, finished with two production-style projects: a multi-tenant agile workspace API and a server-rendered e-commerce platform.",
    distinction: "Ranked 1st in the cohort and awarded a prize.",
    projects: ["team-flow"],
    featured: true,
  },
  {
    slug: "claude-101",
    name: "Claude 101",
    issuer: "anthropic",
    issued: "2026-03",
    category: "ai",
    skills: ["Claude", "Artificial Intelligence"],
    credentialId: "648w6os3jb3j",
    url: "https://verify.skilljar.com/c/648w6os3jb3j",
    featured: true,
  },
  {
    slug: "programming-with-python",
    name: "Programming with Python Professional Certificate",
    issuer: "python-institute",
    issued: "2026-02",
    category: "languages",
    skills: ["Python", "Object-Oriented Programming"],
    credentialId:
      "38cc6a1301c5fd3de7e398df5924d597e3ba25892df2cc4f4c08878501743e35",
    featured: true,
  },
  {
    slug: "python-object-oriented-programming",
    name: "Python Object-Oriented Programming",
    issuer: "linkedin",
    issued: "2026-02",
    category: "fundamentals",
    skills: ["Python", "Object-Oriented Programming"],
    credentialId:
      "aa8786a4d5b6c0245fd34bc72f8a5b85ba83ec0ac8d8c6f14c01cba0d92c7fa3",
  },
  {
    slug: "python-essential-training",
    name: "Python Essential Training",
    issuer: "linkedin",
    issued: "2026-01",
    category: "languages",
    skills: ["Python", "Software Development"],
    credentialId:
      "4e4307cb070a8f7ae7572c45b7c66a0be28963923965d1dc1d45c56061df3b2c",
  },
  {
    slug: "learning-docker",
    name: "Learning Docker",
    issuer: "linkedin",
    issued: "2025-12",
    category: "devops",
    skills: ["Docker", "Containers"],
    credentialId:
      "1d0b92802e3ffc8aa7d678783ed5bee713d488b6e1574e1c34bca57091610290",
    featured: true,
  },
  {
    slug: "learn-nextjs",
    name: "Learn Next.js",
    issuer: "scrimba",
    issued: "2025-07",
    category: "frontend",
    skills: ["Next.js", "React"],
    credentialId: "cert29m6qiCmMgWmU9xs6TnwGd8kJyG5j1MA9x4tVQqRJMTgv",
    url: "https://scrimba.com/certificate-cert29m6qiCmMgWmU9xs6TnwGd8kJyG5j1MA9x4tVQqRJMTgv",
  },
  {
    slug: "learn-typescript",
    name: "Learn TypeScript",
    issuer: "scrimba",
    issued: "2025-07",
    category: "languages",
    skills: ["TypeScript", "React"],
    credentialId: "cert24zAwJ77fGzCX2sUoSLcM9Unbr5vBQu5rSjRL",
    url: "https://scrimba.com/certificate-cert24zAwJ77fGzCX2sUoSLcM9Unbr5vBQu5rSjRL",
  },
  {
    slug: "introduction-to-generative-ai",
    name: "Introduction to Generative AI",
    issuer: "google",
    issued: "2025-06",
    category: "ai",
    skills: ["Generative AI"],
    credentialId: "16388527",
  },
  {
    slug: "become-a-full-stack-web-developer",
    name: "Become a Full-Stack Web Developer",
    issuer: "linkedin",
    issued: "2025-06",
    category: "frontend",
    skills: ["Full-Stack Development", "Front-End Development"],
    credentialId:
      "e1d4d6632e99c10d813abae6c9748f1fcc558440198d5ca985cfd4a87a23c3c1",
  },
  {
    slug: "devops-foundations",
    name: "DevOps Foundations",
    issuer: "linkedin",
    issued: "2025-06",
    category: "devops",
    skills: ["DevOps", "CI/CD"],
    credentialId:
      "3b20d2ddad8c64335bebb8f39ef021d23e2e30b9d37f88140ee5364cbb820b77",
  },
  {
    slug: "sql-essential-training",
    name: "SQL Essential Training",
    issuer: "nasba",
    issued: "2024-12",
    category: "backend",
    skills: ["SQL", "SQLite"],
    credentialId:
      "43301eebbcd0fb87b8cd1844dbdd535b45f1b6fd7c623d16d0a0ee5c8660f895",
  },
  {
    slug: "javascript-foundations",
    name: "JavaScript Foundations Professional Certificate by Mozilla",
    issuer: "linkedin",
    issued: "2024-12",
    category: "languages",
    skills: ["JavaScript", "Web Development"],
    credentialId:
      "7fbbd4d70a62b5cddf62060d0ea58c040728bfcbd69f5be65a62c49334d7f4c4",
  },
  {
    slug: "principles-of-ux-ui-design",
    name: "Principles of UX/UI Design",
    issuer: "meta",
    issued: "2024-08",
    category: "frontend",
    skills: ["Web Design", "Responsive Web Design"],
    credentialId: "NHKPH458K0DU",
    url: "https://www.coursera.org/account/accomplishments/verify/NHKPH458K0DU",
  },
  {
    slug: "responsive-web-design",
    name: "Responsive Web Design",
    issuer: "freecodecamp",
    issued: "2024-08",
    category: "frontend",
    skills: ["CSS", "Web Development"],
    credentialId: "khaledsaeed-rwd",
    url: "https://www.freecodecamp.org/certification/khaledsaeed/responsive-web-design",
  },
  {
    slug: "back-end-apps-with-nodejs-and-express",
    name: "Developing Back-End Apps with Node.js and Express",
    issuer: "ibm",
    issued: "2024-06",
    category: "backend",
    skills: ["Node.js", "Express", "Back-End Development"],
    credentialId: "JEXT2PSZH24T",
    url: "https://www.coursera.org/account/accomplishments/verify/JEXT2PSZH24T",
  },
  {
    slug: "version-control",
    name: "Version Control",
    issuer: "meta",
    issued: "2024-02",
    category: "devops",
    skills: ["Git", "GitHub"],
    credentialId: "XBF9WNBX4E5Y",
    url: "https://www.coursera.org/account/accomplishments/verify/XBF9WNBX4E5Y",
  },
  {
    slug: "html-and-css-in-depth",
    name: "HTML and CSS in Depth",
    issuer: "meta",
    issued: "2024-02",
    category: "frontend",
    skills: ["HTML5", "CSS"],
    credentialId: "45FLQ2CU585S",
    url: "https://www.coursera.org/account/accomplishments/verify/45FLQ2CU585S",
  },
  {
    slug: "advanced-react",
    name: "Advanced React",
    issuer: "meta",
    issued: "2024-01",
    category: "frontend",
    skills: ["React", "JSX", "Jest"],
    credentialId: "ZTEZ2QL2M6HG",
    url: "https://www.coursera.org/account/accomplishments/verify/ZTEZ2QL2M6HG",
  },
  {
    slug: "react-basics",
    name: "React Basics",
    issuer: "meta",
    issued: "2023-12",
    category: "frontend",
    skills: ["React", "Front-End Development"],
    credentialId: "QMM975UV4JXX",
    url: "https://www.coursera.org/account/accomplishments/verify/QMM975UV4JXX",
  },
  {
    slug: "introduction-to-front-end-development",
    name: "Introduction to Front-End Development",
    issuer: "meta",
    issued: "2023-12",
    category: "frontend",
    skills: ["DOM", "Front-End Development"],
    credentialId: "EZ8LZZTME3D4",
    url: "https://www.coursera.org/account/accomplishments/verify/EZ8LZZTME3D4",
  },
  {
    slug: "php-and-mysql",
    name: "PHP and MySQL",
    issuer: "udemy",
    issued: "2023-11",
    category: "backend",
    skills: ["PHP", "MySQL", "Back-End Development"],
    credentialId: "UC-892aef99-58b2-43ce-a11d-bdb593fc7e8d",
    url: "https://www.udemy.com/certificate/UC-892aef99-58b2-43ce-a11d-bdb593fc7e8d/",
  },
  {
    slug: "programming-with-javascript",
    name: "Programming with JavaScript",
    issuer: "meta",
    issued: "2023-11",
    category: "languages",
    skills: ["JavaScript", "DOM"],
    credentialId: "PBLT857EWVB5",
    url: "https://www.coursera.org/account/accomplishments/verify/PBLT857EWVB5",
  },
  {
    slug: "learn-go",
    name: "Learn Go",
    issuer: "bootdev",
    issued: "2026-06",
    category: "languages",
    skills: [
      "Go",
      "Structs and Methods",
      "Interfaces",
      "Error Handling",
      "Slices and Maps",
      "Pointers",
      "Package Management",
      "Concurrency",
      "Mutexes",
    ],
    credentialId: "8dcb7f69-37b5-43f3-b90a-edbbad7bd3a8",
    url: "https://www.boot.dev/certificates/8dcb7f69-37b5-43f3-b90a-edbbad7bd3a8",
  },
  {
    slug: "first-personal-project",
    name: "First Personal Project",
    issuer: "bootdev",
    issued: "2026-05",
    category: "projects",
    skills: ["Project Scoping", "Software Development"],
    credentialId: "beefa9c2-b78e-438c-9f7a-06a5c3f65164",
    url: "https://www.boot.dev/certificates/beefa9c2-b78e-438c-9f7a-06a5c3f65164",
    note: "Boot.dev's solo build: pick an idea, scope it down, build it without a guide and put it up for community review.",
    projects: ["jwt-toolkit"],
  },
  {
    slug: "learn-memory-management-in-c",
    name: "Learn Memory Management in C",
    issuer: "bootdev",
    issued: "2026-05",
    category: "fundamentals",
    skills: [
      "C",
      "Pointers and Memory Addressing",
      "Stack and Heap",
      "Manual Memory Management",
      "Stack Data Structures",
      "Reference Counting",
      "Mark and Sweep",
      "Memory Safety",
    ],
    credentialId: "db2c920c-b216-4ef3-ac3d-4d9cbe10d264",
    url: "https://www.boot.dev/certificates/db2c920c-b216-4ef3-ac3d-4d9cbe10d264",
  },
  {
    slug: "build-a-static-site-generator-in-python",
    name: "Build a Static Site Generator in Python",
    issuer: "bootdev",
    issued: "2026-05",
    category: "projects",
    skills: [
      "Python",
      "Static Site Generation",
      "Object-Oriented Design",
      "HTML Generation",
      "Regular Expressions",
      "Markdown Parsing",
      "Recursion",
      "File System Operations",
    ],
    credentialId: "27762f1f-2db9-4bc3-a8d7-4d63cf472aff",
    url: "https://www.boot.dev/certificates/27762f1f-2db9-4bc3-a8d7-4d63cf472aff",
  },
  {
    slug: "learn-data-structures-and-algorithms-in-python",
    name: "Learn Data Structures and Algorithms in Python",
    issuer: "bootdev",
    issued: "2026-05",
    category: "fundamentals",
    skills: [
      "Python",
      "Algorithm Analysis",
      "Sorting Algorithms",
      "Stacks and Queues",
      "Linked Lists",
      "Trees",
      "Hash Maps",
      "Graph Algorithms",
      "NP-Completeness",
    ],
    credentialId: "398c7cad-2d82-408f-a4cb-5ffd29789427",
    url: "https://www.boot.dev/certificates/398c7cad-2d82-408f-a4cb-5ffd29789427",
  },
  {
    slug: "learn-functional-programming-in-python",
    name: "Learn Functional Programming in Python",
    issuer: "bootdev",
    issued: "2026-04",
    category: "fundamentals",
    skills: [
      "Python",
      "First-Class Functions",
      "Pure Functions and Immutability",
      "Recursion",
      "Function Transformations",
      "Closures",
      "Currying",
      "Decorators",
      "Sum Types",
    ],
    credentialId: "1171f827-0f98-404b-81d0-3c71756b6400",
    url: "https://www.boot.dev/certificates/1171f827-0f98-404b-81d0-3c71756b6400",
  },
  {
    slug: "build-an-ai-agent-in-python",
    name: "Build an AI Agent in Python",
    issuer: "bootdev",
    issued: "2026-04",
    category: "ai",
    skills: [
      "Python",
      "LLM API Integration",
      "Context Management",
      "Prompt Engineering",
      "Tool Use",
      "Function Calling",
      "System Instructions",
      "Automated Code Execution",
      "File System Operations",
    ],
    credentialId: "feea7500-83bd-46bd-9916-cca304c5ef69",
    url: "https://www.boot.dev/certificates/feea7500-83bd-46bd-9916-cca304c5ef69",
  },
  {
    slug: "learn-object-oriented-programming-in-python",
    name: "Learn Object Oriented Programming in Python",
    issuer: "bootdev",
    issued: "2026-04",
    category: "fundamentals",
    skills: [
      "Python",
      "Clean Code Principles",
      "Classes",
      "Encapsulation",
      "Abstraction",
      "Inheritance",
      "Polymorphism",
    ],
    credentialId: "ca7d6228-3034-4690-9918-f08a5fcd8601",
    url: "https://www.boot.dev/certificates/ca7d6228-3034-4690-9918-f08a5fcd8601",
  },
  {
    slug: "build-asteroids-in-python",
    name: "Build Asteroids using Python and Pygame",
    issuer: "bootdev",
    issued: "2026-04",
    category: "projects",
    skills: [
      "Python",
      "Pygame",
      "2D Graphics",
      "Game Loop Architecture",
      "Event Handling",
      "Sprite Management",
      "Game Physics",
      "Collision Detection",
    ],
    credentialId: "8fc6e87f-9e10-4d71-9abe-05b3f9f48825",
    url: "https://www.boot.dev/certificates/8fc6e87f-9e10-4d71-9abe-05b3f9f48825",
  },
  {
    slug: "learn-git",
    name: "Learn Git",
    issuer: "bootdev",
    issued: "2026-04",
    category: "devops",
    skills: [
      "Git",
      "Version Control",
      "Repository Management",
      "Git Internals",
      "Branching",
      "Merging",
      "Rebasing",
      "Remote Collaboration",
    ],
    credentialId: "a387ac58-4b12-4a3e-a792-07ff5f2e8eb2",
    url: "https://www.boot.dev/certificates/a387ac58-4b12-4a3e-a792-07ff5f2e8eb2",
  },
  {
    slug: "learn-linux",
    name: "Learn Linux",
    issuer: "bootdev",
    issued: "2026-04",
    category: "devops",
    skills: [
      "Linux",
      "Command Line",
      "Shell Scripting",
      "File System Management",
      "Permissions and Security",
      "I/O Redirection and Piping",
      "Process Management",
      "Package Management",
    ],
    credentialId: "ce32277e-17d9-49cb-9bdf-74cd7ab481a7",
    url: "https://www.boot.dev/certificates/ce32277e-17d9-49cb-9bdf-74cd7ab481a7",
  },
  {
    slug: "build-a-bookbot-in-python",
    name: "Build a Bookbot in Python",
    issuer: "bootdev",
    issued: "2026-04",
    category: "projects",
    skills: [
      "Python",
      "File I/O",
      "Text Processing",
      "String Manipulation",
      "Data Analysis",
      "Command Line Arguments",
    ],
    credentialId: "2b194fbb-1e0f-40b4-b02d-a8ad86565406",
    url: "https://www.boot.dev/certificates/2b194fbb-1e0f-40b4-b02d-a8ad86565406",
  },
  {
    slug: "introduction-to-python",
    name: "Introduction to Python",
    issuer: "bootdev",
    issued: "2026-04",
    category: "languages",
    skills: [
      "Python",
      "Programming Fundamentals",
      "Functions and Scope",
      "Testing and Debugging",
      "Conditionals and Loops",
      "Lists",
      "Dictionaries",
      "Sets",
      "Error Handling",
    ],
    credentialId: "765e8ead-59b2-493e-8ddf-40115eeb6c01",
    url: "https://www.boot.dev/certificates/765e8ead-59b2-493e-8ddf-40115eeb6c01",
  },
]

/** Newest first; entries from the same month keep their listed order. */
export const certifications = [...entries].sort((a, b) =>
  b.issued.localeCompare(a.issued)
)

// Slugs are anchors and JSON-LD ids, so a duplicate is a content bug.
for (const [i, c] of certifications.entries())
  if (certifications.findIndex((d) => d.slug === c.slug) !== i)
    throw new Error(`Duplicate certification slug: ${c.slug}`)

export const featuredCertifications = certifications.filter((c) => c.featured)

export const issuerName = (c: Certification) => issuers[c.issuer].name

/** A certification's entry on /about/certifications. */
export const certificationHref = (c: Certification) =>
  `/about/certifications#${c.slug}`
