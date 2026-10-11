import { ContactSheet } from "@/components/home/contact-sheet"
import { Credentials } from "@/components/home/credentials"
import { Datasheet } from "@/components/home/datasheet"
import { Hero } from "@/components/home/hero"
import { LatestWriting } from "@/components/home/latest-writing"
import { SelectedWork } from "@/components/home/selected-work"

export default function Page() {
  return (
    <>
      <Hero />
      <div className="space-y-32 pt-16 sm:space-y-40 lg:pt-8">
        <SelectedWork index={1} />
        <Datasheet index={2} />
        <Credentials index={3} />
        <LatestWriting index={4} />
        <ContactSheet index={5} />
      </div>
    </>
  )
}
