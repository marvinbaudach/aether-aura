import { useEffect, useRef, type JSX } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useMediaQuery } from '../lib/useMediaQuery'

const SRC_MOBILE = 'assets/aura_centerpiece_film_720.mp4'

// Pre-rendered frame sequence for the scrub. Drawing decoded images to a canvas
// is glass-smooth because there is no per-seek video decode — the whole point.
const FRAME_COUNT = 151
const framePath = (i: number): string =>
  `assets/cp_frames/f_${String(i + 1).padStart(3, '0')}.jpg`

// Cinematic centerpiece. On fine-pointer / motion-allowed devices the film is a
// scroll-scrubbed image sequence painted to a <canvas>: the watch swings from
// its titanium back round to the front and settles on the display as the user
// scrolls. Touch / reduced-motion fall back to a muted autoplay video loop,
// where scrubbing is unreliable and a decoded frame sequence is wasted bytes.
const Centerpiece = (): JSX.Element => {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const coarse = useMediaQuery('(pointer: coarse)')
  const reduced = useReducedMotion()
  const scrub = !coarse && !reduced

  // ---- Scrub path: decoded frame sequence on a canvas ----------------------
  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!scrub || !section || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const frames: HTMLImageElement[] = Array.from({ length: FRAME_COUNT }, (_, i) => {
      const img = new Image()
      img.decoding = 'async'
      img.src = framePath(i)
      return img
    })

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const sizeCanvas = () => {
      canvas.width = Math.round(canvas.clientWidth * dpr)
      canvas.height = Math.round(canvas.clientHeight * dpr)
    }
    sizeCanvas()

    // Pick the nearest already-decoded frame so a fast scroll never blocks on a
    // not-yet-loaded image.
    const nearestReady = (idx: number): HTMLImageElement | null => {
      for (let d = 0; d < FRAME_COUNT; d++) {
        const a = frames[idx - d]
        if (a && a.complete && a.naturalWidth > 0) return a
        const b = frames[idx + d]
        if (b && b.complete && b.naturalWidth > 0) return b
      }
      return null
    }

    let lastDrawn = -1
    const draw = (idx: number) => {
      if (idx === lastDrawn) return
      const img = nearestReady(idx)
      if (!img) return
      lastDrawn = idx
      const cw = canvas.width
      const ch = canvas.height
      const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight) // contain
      const w = img.naturalWidth * scale
      const h = img.naturalHeight * scale
      ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h)
    }

    let raf = 0
    let inView = true
    let shown = 0
    const io = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { inView = e.isIntersecting }) },
      { threshold: 0 },
    )
    io.observe(section)

    const targetIndex = () => {
      const rect = section.getBoundingClientRect()
      const scrollable = section.offsetHeight - window.innerHeight
      if (scrollable <= 0) return shown
      const progress = Math.min(1, Math.max(0, -rect.top / scrollable))
      return progress * (FRAME_COUNT - 1)
    }

    const tick = () => {
      if (inView && !document.hidden) {
        const target = targetIndex()
        // Eased chase so the swing glides between frames instead of snapping.
        shown += (target - shown) * 0.28
        if (Math.abs(target - shown) < 0.25) shown = target
        draw(Math.round(shown))
      }
      raf = requestAnimationFrame(tick)
    }

    // Draw the first frame as soon as it decodes so there's no blank flash.
    const first = frames[0]
    if (first) {
      if (first.complete) draw(0)
      else first.onload = () => { draw(0); }
    }
    raf = requestAnimationFrame(tick)

    const onResize = () => { sizeCanvas(); lastDrawn = -1; draw(Math.round(shown)) }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [scrub])

  // ---- Fallback path: muted autoplay video loop (touch / reduced-motion) ----
  useEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    if (scrub || !section || !video) return
    video.loop = true
    const play = () => { void video.play().catch(() => undefined) }
    const io = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) play(); else video.pause(); }) },
      { threshold: 0.2 },
    )
    io.observe(section)
    return () => { io.disconnect() }
  }, [scrub])

  return (
    <section ref={sectionRef} className="relative h-[200vh] snap-start bg-bg">
      <div className="sticky top-0 grid h-screen w-full place-items-center overflow-hidden">
        {scrub ? (
          <canvas ref={canvasRef} className="absolute inset-0 z-0 h-full w-full" />
        ) : (
          <video
            ref={videoRef}
            src={SRC_MOBILE}
            className="absolute inset-0 z-0 h-full w-full object-contain"
            muted
            playsInline
            preload="auto"
            poster="assets/aura_centerpiece_film_poster.jpg"
            autoPlay
          />
        )}

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
