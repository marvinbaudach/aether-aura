import { useEffect, useRef, type JSX } from 'react'
import { Renderer, Triangle, Program, Mesh } from 'ogl'
import { useReducedMotion } from 'framer-motion'

// Fragment shader: flowing aurora light from fractal brownian motion noise.
// Two offset FBM fields drift at different rates over time so the light never
// repeats; the result is masked to a soft central falloff so it stays around
// the title rather than washing the whole section.
const FRAG = /* glsl */ `
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform vec3  uColorA;
uniform vec3  uColorB;

// Classic 2D hash + value noise, then fBm. Cheap and smooth enough for a glow.
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  vec2 p = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0) * 2.2;

  float t = uTime * 0.08;
  // Two noise fields on different axes/rates — they shear against each other
  // and produce the flowing, non-repeating aurora bands.
  float n1 = fbm(p * 1.0 + vec2(t, -t * 0.6));
  float n2 = fbm(p * 1.4 + vec2(-t * 0.7, t * 0.9) + n1);
  float light = smoothstep(0.2, 0.9, n2);

  vec3 col = mix(uColorA, uColorB, n1);
  col *= light;

  // Soft radial mask so the glow concentrates near the centre.
  float d = length(uv - 0.5);
  float mask = smoothstep(0.72, 0.18, d);
  col *= mask;

  gl_FragColor = vec4(col, mask * light * 0.9);
}
`

// WebGL aurora background. Resizes with its container, pauses when offscreen or
// for reduced-motion users. Renders one full-screen triangle — cheap on the GPU.
const AuroraGlow = (): JSX.Element => {
  const reduced = useReducedMotion()
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced) return
    const mount = mountRef.current
    if (!mount) return

    const renderer = new Renderer({ alpha: true, antialias: false, dpr: Math.min(window.devicePixelRatio, 2) })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    mount.appendChild(gl.canvas)

    const program = new Program(gl, {
      vertex: /* glsl */ `
        attribute vec2 position;
        void main() { gl_Position = vec4(position, 0.0, 1.0); }
      `,
      fragment: FRAG,
      uniforms: {
        uRes: { value: [1, 1] },
        uTime: { value: 0 },
        // Project accent tokens converted to linear-ish sRGB for the shader.
        // --accent-deep oklch(0.700 0.150 215) and --accent oklch(0.820 0.140 205).
        uColorA: { value: [0.18, 0.62, 0.92] },
        uColorB: { value: [0.40, 0.85, 0.97] },
      },
    })
    const uniforms = program.uniforms as {
      uRes: { value: number[] }
      uTime: { value: number }
    }

    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })

    const resize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      renderer.setSize(w, h)
      uniforms.uRes.value = [w * renderer.dpr, h * renderer.dpr]
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(mount)

    let raf = 0
    let running = true
    const start = performance.now()
    const render = () => {
      if (!running) return
      uniforms.uTime.value = (performance.now() - start) / 1000
      renderer.render({ scene: mesh })
      raf = requestAnimationFrame(render)
    }

    // Pause when the section leaves the viewport — no point burning the GPU.
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? false
        if (visible && !running) {
          running = true
          raf = requestAnimationFrame(render)
        } else if (!visible && running) {
          running = false
          cancelAnimationFrame(raf)
        }
      },
      { threshold: 0 },
    )
    io.observe(mount)
    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      gl.canvas.remove()
      // ogl contexts leak otherwise; lose it explicitly.
      const lose = gl.getExtension('WEBGL_lose_context')
      lose?.loseContext()
    }
  }, [reduced])

  return <div ref={mountRef} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" />
}

export default AuroraGlow
