import { Hero } from '../components/Hero'
import { About } from '../components/About'
import { Projects } from '../components/Projects'
import { Contact } from '../components/Contact'
import { NewsSection } from '../components/NewsSection'

export function Home() {
  return (
    <>
      <Hero />
      <NewsSection />
      <About />
      <Projects />
      <Contact />
    </>
  )
}
