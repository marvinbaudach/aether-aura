import { useEffect, useRef, useState, type JSX } from 'react'
import type { ImageSegmenter } from '@mediapipe/tasks-vision'
import Reveal from './Reveal'

// "Try the hologram": the visitor's camera feed turned into the Aura's
// projection. MediaPipe selfie segmentation (WASM/GPU, fully on-device) cuts
// the person out of their room, so only the figure floats over the beam — the
// difference between "webcam with a filter" and a hologram. The segmented
// figure is composited on a canvas with ghost offsets and scanlines, then
// re-lit cyan and edge-glowed via CSS filters (drop-shadow follows the
// silhouette because the canvas is transparent). If the segmenter can't load,
// the demo still runs with the raw (unsegmented) frame. The camera starts only
// on an explicit click; every track is stopped on end/unmount.
type Phase = 'idle' | 'starting' | 'live' | 'error'

// One segmenter per page — model + WASM init is expensive, never re-created.
let segmenterPromise: Promise<ImageSegmenter> | null = null
const loadSegmenter = (): Promise<ImageSegmenter> => {
  segmenterPromise ??= (async () => {
    const vision = await import('@mediapipe/tasks-vision')
    const fileset = await vision.FilesetResolver.forVisionTasks('assets/mediapipe')
    return vision.ImageSegmenter.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: 'assets/mediapipe/selfie_segmenter.tflite', delegate: 'GPU' },
      runningMode: 'VIDEO',
      outputConfidenceMasks: true,
      outputCategoryMask: false,
    })
  })()
  return segmenterPromise
}

const HoloDemo = (): JSX.Element => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef(0)
  const [phase, setPhase] = useState<Phase>('idle')

  const stopAll = (): void => {
    cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach((t) => { t.stop() })
    streamRef.current = null
    const v = videoRef.current
    if (v !== null) v.srcObject = null
  }

  const end = (): void => {
    stopAll()
    setPhase('idle')
  }

  const beginLoop = (segmenter: ImageSegmenter | null): void => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (video === null || canvas === null) return
    const ctx = canvas.getContext('2d')
    if (ctx === null) return

    // Person cut-out is built here (frame ∩ mask), then stamped onto the
    // visible canvas with ghosts; keeping it separate means the ghost copies
    // are silhouettes too, not smeared rectangles.
    const person = document.createElement('canvas')
    const personCtx = person.getContext('2d')
    const maskCanvas = document.createElement('canvas')
    const maskCtx = maskCanvas.getContext('2d')
    if (personCtx === null || maskCtx === null) return

    let lastTs = -1
    const tick = (): void => {
      rafRef.current = requestAnimationFrame(tick)
      const w = video.videoWidth
      const h = video.videoHeight
      if (w === 0 || h === 0) return
      if (canvas.width !== w) {
        canvas.width = w
        canvas.height = h
        person.width = w
        person.height = h
      }

      personCtx.clearRect(0, 0, w, h)
      personCtx.globalCompositeOperation = 'source-over'
      personCtx.drawImage(video, 0, 0, w, h)

      if (segmenter !== null) {
        // segmentForVideo needs strictly increasing timestamps.
        const ts = Math.max(performance.now(), lastTs + 1)
        lastTs = ts
        const result = segmenter.segmentForVideo(video, ts)
        const mask = result.confidenceMasks?.[0]
        if (mask !== undefined) {
          const conf = mask.getAsFloat32Array()
          if (maskCanvas.width !== mask.width) {
            maskCanvas.width = mask.width
            maskCanvas.height = mask.height
          }
          const img = maskCtx.createImageData(mask.width, mask.height)
          for (let i = 0; i < conf.length; i++) {
            // Soft alpha from the confidence — softer hologram edges than a
            // hard threshold, and the model's own uncertainty reads as glow.
            img.data[i * 4 + 3] = Math.round((conf[i] ?? 0) * 255)
          }
          maskCtx.putImageData(img, 0, 0)
          personCtx.globalCompositeOperation = 'destination-in'
          personCtx.drawImage(maskCanvas, 0, 0, w, h)
        }
        result.close()
      }

      ctx.clearRect(0, 0, w, h)
      ctx.save()
      // Mirror in the draw (not CSS) so the 3D sway transform stays free.
      ctx.translate(w, 0)
      ctx.scale(-1, 1)
      // Chromatic ghosts: two faint offset copies behind the main figure.
      ctx.globalAlpha = 0.3
      ctx.drawImage(person, -Math.round(w * 0.012), 0)
      ctx.drawImage(person, Math.round(w * 0.012), 0)
      ctx.globalAlpha = 1
      ctx.drawImage(person, 0, 0)
      // Scanlines only where the figure is.
      ctx.globalCompositeOperation = 'source-atop'
      ctx.fillStyle = 'rgba(0, 0, 0, 0.28)'
      for (let y = 0; y < h; y += 4) ctx.fillRect(-w, y, w * 2, 1.5)
      ctx.restore()
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  const start = (): void => {
    // lib.dom types mediaDevices as always present, but insecure origins and
    // older WebViews genuinely lack it — widen the type and check.
    const devices = navigator.mediaDevices as MediaDevices | undefined
    if (devices === undefined) {
      setPhase('error')
      return
    }
    setPhase('starting')
    // Camera permission and model init run in parallel; a failed segmenter
    // load degrades to the unsegmented frame instead of killing the demo.
    void Promise.all([
      devices.getUserMedia({ video: { facingMode: 'user' }, audio: false }),
      loadSegmenter().catch(() => {
        segmenterPromise = null
        return null
      }),
    ])
      .then(async ([stream, segmenter]) => {
        const v = videoRef.current
        if (v === null) {
          stream.getTracks().forEach((t) => { t.stop() })
          return
        }
        streamRef.current = stream
        v.srcObject = stream
        await v.play().catch(() => undefined)
        beginLoop(segmenter)
        setPhase('live')
      })
      .catch(() => { setPhase('error') })
  }

  // Never leave the camera running if the section unmounts mid-demo.
  useEffect(() => stopAll, [])

  return (
    <section id="holo-demo" className="cv-section relative snap-start overflow-hidden px-[max(1.25rem,6vw)] py-[clamp(4rem,9vh,6.5rem)] text-center">
      <Reveal>
        <p className="font-sans text-[0.74rem] uppercase tracking-[0.34em] text-accent">Live demo</p>
        <h2 className="mx-auto mt-4 max-w-[18ch] font-display text-[clamp(2.2rem,5vw,4rem)] font-medium leading-[1.02] text-gradient">
          See yourself in <span className="text-gradient-accent">light</span>.
        </h2>
        <p className="mx-auto mt-5 max-w-[46ch] font-sans text-[1.05rem] text-muted">
          This is what your callers will see: you, lifted out of the room and
          projected — processed entirely on this device. Nothing is recorded,
          nothing leaves the page.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="relative mx-auto mt-12 w-full max-w-md">
        <div className="holo-stage3d relative aspect-4/5 overflow-hidden rounded-[28px] border border-hairline-soft bg-black/60">
          {/* Hidden source feed the canvas samples from. */}
          <video ref={videoRef} muted playsInline aria-hidden className="pointer-events-none absolute h-px w-px opacity-0" />

          {/* Projection beam rising from the emitter, behind the figure. */}
          <div
            aria-hidden
            className={`absolute inset-x-[12%] bottom-10 top-[6%] transition-opacity duration-700 ${phase === 'live' ? 'opacity-100' : 'opacity-0'}`}
            style={{
              background: 'linear-gradient(to top, oklch(0.82 0.14 205 / 0.28), oklch(0.82 0.14 205 / 0.04) 70%, transparent)',
              clipPath: 'polygon(44% 100%, 56% 100%, 100% 0%, 0% 0%)',
            }}
          />

          {/* The hologram: segmented figure, cyan re-light, silhouette glow,
              slow 3D sway. object-contain keeps the camera's aspect ratio. */}
          <canvas
            ref={canvasRef}
            aria-label="Live hologram preview of your own camera"
            className={`holo-cam holo-flicker holo-sway absolute inset-x-0 bottom-9 top-[8%] h-[calc(92%-2.25rem)] w-full object-contain transition-opacity duration-700 ${phase === 'live' ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* Emitter: the "watch" the projection stands on. */}
          <div aria-hidden className="absolute bottom-6 left-1/2 h-1.5 w-24 -translate-x-1/2 rounded-full bg-accent/80 shadow-[0_0_18px_var(--accent),0_0_50px_oklch(0.82_0.14_205/0.5)]" />

          {phase !== 'live' && (
            <div className="absolute inset-0 grid place-items-center p-8">
              {phase === 'error' ? (
                <p className="max-w-[30ch] font-sans text-[0.95rem] text-muted">
                  The projector needs a camera. Check the browser permission and
                  try again.
                </p>
              ) : (
                <p className="font-sans text-[0.9rem] uppercase tracking-[0.3em] text-faint">
                  {phase === 'starting' ? 'Igniting…' : 'Projector standing by'}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mt-8">
          {phase === 'live' ? (
            <button
              type="button"
              onClick={end}
              className="rounded-full border border-hairline px-8 py-3.5 font-sans text-[1rem] font-medium text-muted transition-colors duration-300 hover:border-accent/50 hover:text-ink"
            >
              End projection
            </button>
          ) : (
            <button
              type="button"
              onClick={start}
              disabled={phase === 'starting'}
              className="rounded-full border border-accent/40 bg-accent/10 px-8 py-3.5 font-sans text-[1rem] font-medium text-ink transition-colors duration-300 hover:bg-accent/25 disabled:cursor-wait disabled:opacity-60"
            >
              {phase === 'error' ? 'Try again' : 'Project yourself'}
            </button>
          )}
        </div>
      </Reveal>
    </section>
  )
}

export default HoloDemo
