import { about, credentials, education } from "@/lib/content/profile"
import { groups, projects } from "@/lib/content/projects"
import { getArticles } from "@/lib/data/devto"
import { siteConfig, socialLinks } from "@/lib/site"

export const revalidate = 86400

/**
 * llms.txt (https://llmstxt.org): a plain-text brief for answer engines and
 * AI assistants, generated from the same content as the site.
 */
export async function GET() {
  const url = (p: string) => `${siteConfig.url}${p}`
  const articles = await getArticles()

  const text = `# ${siteConfig.name}

> ${about.short}

${about.paragraphs.join("\n\n")}

## Key facts

- Role: ${siteConfig.role}, based in ${siteConfig.location}
- Languages and platforms: TypeScript (Node.js, NestJS, React, Next.js, React Native, Electron), Swift (SwiftUI, macOS), Go, Python
- Education: ${education.map((e) => `${e.degree} in ${e.field}, ${e.school} (${e.start} to ${e.end})`).join("; ")}
- Credentials: ${credentials.map((c) => `${c.name} (${c.issuer}, ${c.date})${c.note ? `, ${c.note}` : ""}`).join("; ")}

## Pages

- [Home](${url("/")}): overview, selected work, stack, writing
- [Work](${url("/work")}): all projects with case studies
- [About](${url("/about")}): background, education, credentials, principles
- [Writing](${url("/writing")}): articles, originally published on DEV
- [Uses](${url("/uses")}): current focus and setup
- [Contact](${url("/contact")}): email and booking

## Projects

${(Object.keys(groups) as (keyof typeof groups)[])
  .map(
    (g) =>
      `### ${groups[g].title}\n\n` +
      projects
        .filter((p) => p.group === g)
        .map(
          (p) =>
            `- [${p.name}](${url(`/work/${p.slug}`)}): ${p.tagline} Stack: ${p.stack.join(", ")}.`
        )
        .join("\n")
  )
  .join("\n\n")}

## Writing

${articles.map((a) => `- [${a.title}](${a.url}): ${a.description}`).join("\n")}

## Contact

${socialLinks.map((l) => `- ${l.label}: ${l.key === "email" ? l.handle : l.href}`).join("\n")}
`
  return new Response(text, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  })
}
