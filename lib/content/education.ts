import { driveFile, type Attachment } from "@/lib/content/attachments"

/**
 * Degrees, single-sourced for /about, /about/education, the printed résumé,
 * JSON-LD and llms.txt. Newest first. Dates are ISO ("2025-09", or a bare
 * year when only the year is known) and formatted where they are shown.
 */

export type Honor = {
  title: string
  /** ISO date, as precise as the record: "2025-05-30" or "2024-05". */
  date: string
  body: string
  /** The certificate itself, and any supporting papers. */
  documents?: Attachment[]
}

export type Education = {
  /** Anchor on /about/education. */
  slug: string
  school: string
  schoolUrl: string
  degree: string
  /** "M.S.", for tight spots like section labels. */
  abbr: string
  /** schema.org educationalLevel. */
  level: string
  field: string
  /** The program's own name, when it differs from the field. */
  program?: string
  start: string
  end: string
  current?: boolean
  /** Two or three sentences: the lede of the degree's sheet. */
  summary: string
  /** One line for the run log on /about. */
  note: string
  studies: string[]
  skills: string[]
  /** Case studies on /work that came out of the degree. */
  projects: string[]
  honors?: Honor[]
}

/** Recorded date of the last meaningful change to this content. */
export const educationUpdatedAt = "2026-10-11"

export const education: Education[] = [
  {
    slug: "ms-computer-engineering",
    school: "Lebanese International University",
    schoolUrl: "https://www.liu.edu.lb",
    degree: "Master of Science",
    abbr: "M.S.",
    level: "Master's degree",
    field: "Computer Engineering",
    program: "Computer and Communication Engineering (MCCE)",
    start: "2025-09",
    end: "2027",
    current: true,
    summary:
      "The master's program in computer and communication engineering. My focus is machine learning and where it fits inside engineering systems, on a base of signal processing, digital communications and networks.",
    note: "MCCE program. I also built and maintain the program's independent study hub.",
    studies: [
      "Machine learning and its applications in engineering systems",
      "Digital signal processing and digital communications",
      "Network and wireless communication systems",
      "Embedded systems and real-time operating systems",
      "Simulation and analysis in MATLAB",
    ],
    skills: [
      "Machine Learning",
      "Python",
      "C",
      "MATLAB",
      "Embedded Systems",
      "RTOS",
      "Digital Communication",
    ],
    projects: ["mcce", "freertos-riscv"],
  },
  {
    slug: "bs-computer-engineering",
    school: "Lebanese International University",
    schoolUrl: "https://www.liu.edu.lb",
    degree: "Bachelor of Science",
    abbr: "B.S.",
    level: "Bachelor's degree",
    field: "Computer Engineering",
    start: "2021-10",
    end: "2025-06",
    summary:
      "Computer engineering from the hardware up: assembly, architecture and operating systems, then networks, databases and the web. It closed with Yalla Learn, the senior project that took 3rd place at the 6th Bekaa Engineering Day.",
    note: "Senior project: Yalla Learn, an AI learning platform on web, mobile and desktop.",
    studies: [
      "Java, object-oriented programming, data structures and algorithms",
      "Operating systems, computer architecture and assembly language",
      "Networking fundamentals and Cisco technologies",
      "Web applications in HTML, CSS, JavaScript, PHP and MySQL",
      "Python, C and Linux systems",
      "Mobile development in Android Studio, and basic electronics",
    ],
    skills: [
      "Java",
      "C",
      "Python",
      "JavaScript",
      "PHP",
      "SQL",
      "MySQL",
      "HTML5",
      "CSS",
      "Data Structures",
      "Algorithms",
      "OOP",
      "Operating Systems",
      "Assembly Language",
      "Database Systems",
      "Linux",
      "Front-End Development",
      "Back-End Development",
      "Android Development",
    ],
    projects: ["yalla-learn"],
    honors: [
      {
        title: "3rd place, 6th Bekaa Engineering Day",
        date: "2025-05-30",
        body: "Computer and Communication Engineering category at LIU, judged by the evaluation committee among computer, mechanical and electrical engineering graduates. Awarded for Yalla Learn, a collaborative platform with AI and productivity tools for students.",
        documents: [
          {
            label: "award certificate",
            href: driveFile("1C5CIn-SIn9T1MfvInB5lHumegQtO3oTp"),
          },
          {
            label: "participation certificate",
            href: driveFile("1E3CY75NqCUjwRC9CeU6nxj5HTm3nEHP0"),
          },
        ],
      },
      {
        title: "Dean's Honor List, Spring 2023-2024",
        date: "2024-05",
        body: "Named to the Dean's Honor List by the Lebanese International University for academic performance in the spring semester of the 2023-2024 year.",
        documents: [
          {
            label: "certificate",
            href: driveFile("1866zC1ydlAR0BDGtDPvxXNnhjv3K5mRq"),
          },
        ],
      },
    ],
  },
]

/** Every honor, from the latest degree back. */
export const honors = education.flatMap((e) => e.honors ?? [])

/** The degree in progress, if any, else the latest. */
export const currentEducation = education.find((e) => e.current) ?? education[0]

/** Every school attended, once each, for structured data. */
export const schools = [
  ...new Map(education.map((e) => [e.school, e.schoolUrl])).entries(),
].map(([name, url]) => ({ name, url }))
