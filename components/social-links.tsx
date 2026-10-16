import {
  DevtoGlyph,
  DiscordGlyph,
  GithubGlyph,
  InstagramGlyph,
  LinkedinGlyph,
  MailGlyph,
  XGlyph,
} from "@/components/print/glyphs"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { socialLinks, type SocialLink } from "@/lib/site"
import { cn } from "@/lib/utils"

const GLYPHS = {
  github: GithubGlyph,
  linkedin: LinkedinGlyph,
  x: XGlyph,
  devto: DevtoGlyph,
  instagram: InstagramGlyph,
  discord: DiscordGlyph,
  email: MailGlyph,
} as const

export function LinkIcon({
  link,
  className,
}: {
  link: SocialLink
  className?: string
}) {
  const Glyph = GLYPHS[link.key]
  return <Glyph className={className} />
}

export function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-1", className)}>
      {socialLinks.map((link) => {
        const isMail = link.key === "email"
        return (
          <li key={link.key}>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={link.href}
                  aria-label={`${link.label}: ${link.handle}`}
                  target={isMail ? undefined : "_blank"}
                  rel={isMail ? undefined : "noopener noreferrer"}
                  className="group inline-flex size-10 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <LinkIcon
                    link={link}
                    className="size-6 transition-colors group-hover:text-brand"
                  />
                </a>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={8}>
                {link.handle}
              </TooltipContent>
            </Tooltip>
          </li>
        )
      })}
    </ul>
  )
}
