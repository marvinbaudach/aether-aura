import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'
import Preloader from './components/Preloader'
import Topbar from './components/Topbar'
import Hero from './components/Hero'
import ThesisCallout from './components/ThesisCallout'
import ShowcaseA from './components/ShowcaseA'
import EmitterReveal from './components/EmitterReveal'
import PanStrip from './components/PanStrip'
import ShowcaseB from './components/ShowcaseB'
import DetailRows from './components/DetailRows'
import CTA from './components/CTA'
import Footer from './components/Footer'

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    document.body.style.overflow = ready ? '' : 'hidden'
  }, [ready])

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 6000)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!ready) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, anchors: true })
    let raf = 0
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); lenis.destroy() }
  }, [ready])

  return (
    <>
      <AnimatePresence>{!ready && <Preloader key="preloader" />}</AnimatePresence>
      <Topbar />
      <main className="bg-bg text-ink">
        <Hero onReady={() => setReady(true)} />
        <ThesisCallout />
        <ShowcaseA />
        <EmitterReveal />
        <PanStrip />
        <ShowcaseB />
        <DetailRows />
        <CTA />
        <Footer />
      </main>
    </>
  )
}
