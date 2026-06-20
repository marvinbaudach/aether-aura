import { useEffect, useRef, type JSX } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useMediaQuery } from '../lib/useMediaQuery'

const SRC_DESKTOP = 'assets/aura_centerpiece_film.mp4'
const SRC_MOBILE = 'assets/aura_centerpiece_film_720.mp4'

// Scroll-scrubbed centerpiece: the product film is driven frame by frame by
// scroll, so the watch swings from its titanium back around to the front and
// settles on the display as the user advances. The camera is locked to the
// scroll axis. Falls back to a muted autoplay loop on touch / reduced-motion
// where scrubbing video is unreliable and costly.
const Centerpiece = (): JSX.Element => {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const coarse = useMediaQuery('(pointer: coarse)')
  const reduced = useReducedMotion()
  const desktop = useMediaQuery('(min-width: 768px)')
  const scrub = !coarse && !reduced

  // The `media` attribute on a <video><source> is ignored by browsers (it only
  // works inside <picture>), so we pick the right file in JS instead — otherwise
  // every device downloads the full-size desktop clip.
  const videoSrc = desktop ? SRC_DESKTOP : SRC_MOBILE

  useEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    if (!section || !video) return

    if (!scrub) {
      // Autoplay loop fallback.
      video.loop = true
      const play = () => { void video.play().catch(() => undefined) }
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) play()
            else video.pause()
          })
        },
        { threshold: 0.2 },
      )
      io.observe(section)
      return () => { io.disconnect() }
    }

    let ready = video.readyState >= 2
    let raf = 0
    let inView = true
    let pendingSeek = false

    const onMeta = () => { ready = true }
    const onSeeked = () => { pendingSeek = false }
    video.addEventListener('loadedmetadata', onMeta)
    video.addEventListener('seeked', onSeeked)

    // Only run the scrub loop while the section is on screen — no point
    // burning decode budget / seeking a clip the user can't see.
    const io = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { inView = e.isIntersecting }) },
      { threshold: 0 },
    )
    io.observe(section)

    const seekTo = (target: number) => {
      if (pendingSeek) return
      if (Math.abs(video.currentTime - target) < 1 / 12) return
      pendingSeek = true
      if (typeof video.fastSeek === 'function') {
        try { video.fastSeek(target); return } catch { /* fall through */ }
      }
      video.currentTime = target
    }

    const tick = () => {
      if (inView && !document.hidden && ready && video.duration && !video.seeking) {
        const rect = section.getBoundingClientRect()
        const scrollable = section.offsetHeight - window.innerHeight
        if (scrollable > 0) {
          const progress = Math.min(1, Math.max(0, -rect.top / scrollable))
          seekTo(progress * video.duration)
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      video.removeEventListener('loadedmetadata', onMeta)
      video.removeEventListener('seeked', onSeeked)
    }
  }, [scrub, videoSrc])

  return (
    <section ref={sectionRef} className="relative h-[300vh] bg-bg">
      <div className="sticky top-0 grid h-screen w-full place-items-center overflow-hidden">
        <video
          key={videoSrc}
          ref={videoRef}
          src={videoSrc}
          className="absolute inset-0 z-0 h-full w-full object-contain"
          muted
          playsInline
          preload="auto"
          poster="assets/aura_centerpiece_film_poster.jpg"
          autoPlay={!scrub}
        />

        <div
          aria-hidden
          className="absolute inset-0 z-10"
          style={{ background: 'radial-gradient(60% 70% at 50% 50%, transparent 30%, oklch(0.13 0.013 245 / 0.5) 78%, oklch(0.13 0.013 245 / 0.92) 100%)' }}
        />
      </div>
    </section>
  )
}

export default Centerpiece
