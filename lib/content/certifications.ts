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
  | "devops"

export const categories: Record<
  CertificationCategory,
  { title: string; blurb: string }
> = {
  ai: {
    title: "AI and machine learning",
    blurb:
      "How models learn, and how to put them to work inside real products.",
  },
  backend: {
    title: "Backend and data",
    blurb: "Servers, APIs and the databases underneath them.",
  },
  frontend: {
    title: "Frontend and design",
    blurb: "React, the web platform, and the interface on top of it.",
  },
  languages: {
    title: "Languages",
    blurb: "JavaScript, TypeScript and Python, learned properly.",
  },
  devops: {
    title: "DevOps and tooling",
    blurb: "Version control, containers and the pipeline that ships it all.",
  },
}

/** The order categories appear in on /about/certifications. */
export const categoryOrder: CertificationCategory[] = [
  "ai",
  "backend",
  "frontend",
  "languages",
  "devops",
]

export const issuers = {
  anthropic: { name: "Anthropic", url: "https://www.anthropic.com" },
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
    category: "languages",
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
