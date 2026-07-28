import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Services } from '@/components/sections/Services'
import { WhyUs } from '@/components/sections/WhyUs'
import { Industries } from '@/components/sections/Industries'
import { Process } from '@/components/sections/Process'
import { Telemetry } from '@/components/sections/Telemetry'
import { Toolstack } from '@/components/sections/Toolstack'
import { Promises } from '@/components/sections/Promises'
import { Work } from '@/components/sections/Work'
import { Testimonials } from '@/components/sections/Testimonials'
import { Pricing } from '@/components/sections/Pricing'
import { Faq } from '@/components/sections/Faq'
import { Contact } from '@/components/sections/Contact'

/**
 * Home.
 *
 * Section order is the client document's Home content, resequenced into a
 * narrative arc rather than the order it happens to be written in:
 *
 *   who we are → what we do → why us → who we serve → how we work →
 *   what we can prove → what we use → what we promise → the work →
 *   what clients say → what it costs → answers → contact
 *
 * Each section owns its own layout; nothing is a repeated card grid.
 */
export function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <WhyUs />
      <Industries />
      <Process />
      <Telemetry />
      <Toolstack />
      <Promises />
      <Work />
      <Testimonials />
      <Pricing />
      <Faq />
      <Contact />
    </>
  )
}
