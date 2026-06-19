import { useEffect, useRef } from 'react'

// Scroll-scrub close-up: the emitter ignition video is driven by scroll so the
// beam grows only as the user advances. Camera locked, constant velocity.
export default function EmitterReveal() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    if (!section || !video) return

    // Defer loading the emitter clip until the section is about to enter the
    // viewport. With preload="none" the browser would otherwise never fetch it
    // in time for the scroll-scrub, while preload="auto" pulled 2.6MB up front
    // even for users who never scroll that far.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          video.setAttribute('preload', 'auto')
          video.load()
          io.disconnect()
        }
      },
      { rootMargin: '400px 0px' },
    )
    io.observe(section)

    let ready = video.readyState >= 1
    let raf = 0
    const onMeta = () => { ready = true }
    video.addEventListener('loadedmetadata', onMeta)
    const tick = () => {
      if (document.hidden) { raf = requestAnimationFrame(tick); return }
      if (ready && video.duration && !video.seeking) {
        const rect = section.getBoundingClientRect()
        const scrollable = section.offsetHeight - window.innerHeight
        const p = Math.min(1, Math.max(0, -rect.top / scrollable))
        const t = p * video.duration
        if (Math.abs(video.currentTime - t) > 1 / 20) video.currentTime = t
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      video.removeEventListener('loadedmetadata', onMeta)
    }
  }, [])

  return (
    <section id="technology" ref={sectionRef} className="relative h-[300vh]">
      <div className="sticky top-0 grid h-screen w-full place-items-center overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 z-0 h-full w-full object-cover"
          muted playsInline preload="none"
        >
          <source src="assets/video_emitter.mp4" type="video/mp4" />
        </video>
        <div
          className="absolute inset-0 z-10"
          style={{ background: 'radial-gradient(70% 70% at 50% 50%, transparent 40%, oklch(0.13 0.012 240 / 0.6) 100%)' }}
        />
        <div className="relative z-20 px-[6vw] text-center">
          <p className="font-sans text-[0.78rem] uppercase tracking-[0.42em] text-muted">
            Light reads <span className="text-accent">everything</span>
          </p>
          <h2 className="mx-auto mt-5 max-w-[16ch] font-display text-[clamp(2rem,5.5vw,4.4rem)] font-medium leading-[1.04]">
            The emitter never touches you.
          </h2>
        </div>
      </div>
    </section>
  )
}
