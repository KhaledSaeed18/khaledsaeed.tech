import type { Metadata } from "next"

import { Misprint } from "@/components/misprint/misprint"
import { PageIntro } from "@/components/print/page-intro"

// Reached from the puzzle in the DevTools console; not linked or indexed.
export const metadata: Metadata = {
  title: "Registration",
  description: "The press room's registration test.",
  robots: { index: false, follow: false },
}

export default function RegisterPage() {
  return (
    <>
      <PageIntro
        crumbs={[{ href: "/", label: "home" }, { label: "registration" }]}
        title="You read the bytes."
        lede="This is the press room's registration test. Two plates, one mark each side. Drag the terracotta plate until its marks sit on the teal ones."
      />
      <div className="frame mt-16 overflow-hidden pb-2">
        <Misprint text="KS" />
      </div>
    </>
  )
}
