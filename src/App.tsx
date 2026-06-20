import { useEffect, useState, type JSX } from 'react'
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation } from 'framer-motion'
import Lenis from 'lenis'
import { useMediaQuery } from './lib/useMediaQuery'
import Preloader from './components/Preloader'
import Topbar from './components/Topbar'
import HeroReveal from './components/HeroReveal'
import Marquee from './components/Marquee'
import Highlights from './components/Highlights'
import Centerpiece from './components/Centerpiece'
import CloserLook from './components/CloserLook'
import HealthFeature from './components/HealthFeature'
import TelephonyFeature from './components/TelephonyFeature'
import HoloFeature from './components/HoloFeature'
import BatteryRing from './components/BatteryRing'
import Specs from './components/Specs'
import CTA from './components/CTA'
import Footer from './components/Footer'

const App = (): JSX.Element => {
  const [ready, setReady] = useState(false)

  // Smooth scroll is opt-out on touch / reduced-motion (see effect below); the
  // same signals decide whether Lenis runs at all.
  const coarse = useMediaQuery('(pointer: coarse)')
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')

  // Lock scroll behind the preloader.
  useEffect(() => {
    document.body.style.overflow = ready ? '' : 'hidden'
  }, [ready])

  // The hero is now an image (fast), so a short branded hold is enough; bail
  // early once the window load event fires.
  useEffect(() => {
    const t = window.setTimeout(() => { setReady(true); }, 2200)
    const onLoad = () => window.setTimeout(() => { setReady(true); }, 600)
    window.addEventListener('load', onLoad)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('load', onLoad)
    }
  }, [])

  // Smooth inertia scroll on fine-pointer, motion-allowed devices only. Lenis
  // fights native touch momentum on phones and adds RAF overhead for little gain.
  useEffect(() => {
    if (!ready || reduced || coarse) return
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, anchors: true })
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [ready, reduced, coarse])

  return (
    // LazyMotion ships the `m` component instead of the full `motion` bundle and
    // loads the DOM animation feature set once; `strict` makes any stray
    // `motion.*` usage throw, keeping the bundle lean. reducedMotion="user"
    // lets framer drop transform animations for users who ask for it.
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <AnimatePresence>{!ready && <Preloader key="preloader" />}</AnimatePresence>
        <Topbar />
        <main className="bg-bg text-ink">
          <HeroReveal />
          <Marquee />
          <Highlights />
          <Centerpiece />
          <CloserLook />
          <HealthFeature />
          <TelephonyFeature />
          <HoloFeature />
          <BatteryRing />
          <Specs />
          <CTA />
          <Footer />
        </main>
      </MotionConfig>
    </LazyMotion>
  )
}

export default App
