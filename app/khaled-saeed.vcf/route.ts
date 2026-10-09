import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { siteConfig, socialLinks } from "@/lib/site"

export const dynamic = "force-static"

/** vCard 3.0 lines fold at 75 octets, continuing with a leading space. */
const fold = (line: string) =>
  line.length <= 75
    ? line
    : line
        .match(/.{1,74}/g)!
        .map((part, i) => (i ? " " + part : part))
        .join("\r\n")

/**
 * "Save contact" on the postcard: a vCard a phone imports in one tap, with
 * the dithered portrait as the contact photo.
 */
export async function GET() {
  const photo = (
    await readFile(join(process.cwd(), "public/character.png"))
  ).toString("base64")
  const email = socialLinks.find((l) => l.key === "email")!
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:Saeed;Khaled;;;",
    `FN:${siteConfig.name}`,
    `TITLE:${siteConfig.role}`,
    `EMAIL;TYPE=INTERNET,PREF:${email.handle}`,
    `URL:${siteConfig.url}`,
    `ADR;TYPE=WORK:;;;;;;${siteConfig.location}`,
    ...socialLinks
      .filter((l) => l.key !== "email")
      .map((l) => `X-SOCIALPROFILE;TYPE=${l.key}:${l.href}`),
    `NOTE:${siteConfig.description}`,
    `PHOTO;ENCODING=b;TYPE=PNG:${photo}`,
    "END:VCARD",
  ]
  return new Response(lines.map(fold).join("\r\n") + "\r\n", {
    headers: {
      "content-type": "text/vcard; charset=utf-8",
      "content-disposition": 'attachment; filename="khaled-saeed.vcf"',
    },
  })
}
