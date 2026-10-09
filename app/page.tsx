import { ContactSheet } from "@/components/home/contact-sheet"
import { Datasheet } from "@/components/home/datasheet"
import { Hero } from "@/components/home/hero"
import { LatestWriting } from "@/components/home/latest-writing"
import { SelectedWork } from "@/components/home/selected-work"

export default function Page() {
  return (
    <>
      <Hero />
      <div className="space-y-32 pt-16 sm:space-y-40 lg:pt-8">
        <SelectedWork />
        <Datasheet />
        <LatestWriting />
        <ContactSheet />
      </div>
    </>
  )
}
