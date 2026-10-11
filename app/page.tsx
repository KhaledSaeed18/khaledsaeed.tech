import { ContactSheet } from "@/components/home/contact-sheet"
import { Credentials } from "@/components/home/credentials"
import { Datasheet } from "@/components/home/datasheet"
import { Experience } from "@/components/home/experience"
import { Hero } from "@/components/home/hero"
import { LatestWriting } from "@/components/home/latest-writing"
import { SelectedWork } from "@/components/home/selected-work"

export default function Page() {
  return (
    <>
      <Hero />
      <div className="space-y-32 pt-16 sm:space-y-40 lg:pt-8">
        <SelectedWork index={1} />
        <Experience index={2} />
        <Datasheet index={3} />
        <Credentials index={4} />
        <LatestWriting index={5} />
        <ContactSheet index={6} />
      </div>
    </>
  )
}
