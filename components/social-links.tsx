import {
  DiscordIcon,
  GithubIcon,
  InstagramIcon,
  Linkedin01Icon,
  Mail01Icon,
  NewTwitterIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { socialLinks, type SocialLink } from "@/lib/site"
import { cn } from "@/lib/utils"

// dev.to has no Hugeicons glyph, so the mark is inlined.
function DevToMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 448 512" className={className} fill="currentColor" aria-hidden="true">
      <path d="M120.12 208.29c-3.88-2.9-7.77-4.35-11.65-4.35H91.03v104.47h17.45c3.88 0 7.77-1.45 11.65-4.35 3.88-2.9 5.82-7.25 5.82-13.06v-69.65c-.01-5.8-1.96-10.16-5.83-13.06zM404.1 32H43.9C19.7 32 .06 51.59 0 75.8v360.4C.06 460.41 19.7 480.01 43.9 480h360.2c24.21.01 43.84-19.59 43.9-43.8V75.8c-.06-24.21-19.7-43.81-43.9-43.8zM154.2 291.19c0 18.81-11.61 47.31-48.36 47.25h-46.4V172.98h47.38c35.44 0 47.36 28.46 47.37 47.28l.01 70.93zm100.68-88.66H201.6v38.42h32.57v29.57H201.6v38.41h53.29v29.57h-62.18c-11.16.29-20.44-8.53-20.72-19.69V193.7c-.27-11.15 8.56-20.41 19.71-20.69h63.19l-.01 29.52zm103.64 115.29c-13.2 30.75-36.85 24.63-47.44 0l-38.53-144.8h32.57l29.71 113.72 29.57-113.72h32.58l-38.46 144.8z" />
    </svg>
  )
}

const ICONS = {
  github: GithubIcon,
  linkedin: Linkedin01Icon,
  x: NewTwitterIcon,
  instagram: InstagramIcon,
  discord: DiscordIcon,
  email: Mail01Icon,
} as const

function LinkIcon({ link, className }: { link: SocialLink; className?: string }) {
  if (link.key === "devto") return <DevToMark className={className} />
  return <HugeiconsIcon icon={ICONS[link.key]} className={className} strokeWidth={1.6} />
}

export function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-1", className)}>
      {socialLinks.map((link) => {
        const isMail = link.key === "email"
        return (
          <li key={link.key}>
            <a
              href={link.href}
              aria-label={`${link.label}: ${link.handle}`}
              title={link.handle}
              target={isMail ? undefined : "_blank"}
              rel={isMail ? undefined : "noopener noreferrer"}
              className="group inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <LinkIcon
                link={link}
                className="size-5 transition-colors group-hover:text-brand"
              />
            </a>
          </li>
        )
      })}
    </ul>
  )
}
