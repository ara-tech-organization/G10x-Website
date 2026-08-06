import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { scenePalette } from './geometry'

/**
 * The stage — one WebGL scene behind the entire page.
 *
 * This canvas mounts once and never unmounts. A single cloud of particles
 * spells G10X at the top of the page in the site's own typeface, then bursts
 * outward from the centre as you scroll — a firework, driven entirely by
 * scroll position, so it detonates as you go down and reassembles as you come
 * back up.
 *
 * Each particle keeps its own outward direction and speed, so the spray reads
 * as one shell breaking rather than a mass of dots sliding apart. The cloud
 * does not spin: it holds level and breathes vertically, so the wordmark stays
 * readable the whole time it is on screen.
 *
 * Cost is deliberately flat: one draw call, one geometry, no per-frame
 * allocation, and the whole thing sleeps when the tab is hidden.
 */
const COUNT = 4200
// How far the shell throws, in world units, at full scroll.
//
// Tuned so the spray still fills the frame at the bottom of the page rather
// than clearing it: at 34 the particles were off-screen well before the last
// section and the effect simply vanished.
const BURST = 13
// The shell is thrown wider than it is tall, so the spray fills the width of
// the section below instead of stacking into a narrow column.
const SPREAD_X = 2.6
const SPREAD_Y = 1.15
const SPREAD_Z = 0.7

/* ---- Formations --------------------------------------------------------- */

/**
 * Points sampled from rendered glyphs.
 *
 * The wordmark is drawn to an offscreen 2D canvas and the opaque pixels are
 * sampled — which means the particles spell the word in the site's actual
 * typeface rather than in a hand-plotted approximation, and changing the string
 * needs no new geometry. Sampling is weighted by scanning every other pixel,
 * which is dense enough to read cleanly at 4k particles.
 */
function textFormation(count, text) {
  const W = 1024
  const H = 320
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d', { willReadFrequently: true })

  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `900 200px "Open Sauce Sans", system-ui, sans-serif`
  ctx.fillText(text, W / 2, H / 2)

  const data = ctx.getImageData(0, 0, W, H).data
  const hits = []
  for (let y = 0; y < H; y += 2) {
    for (let x = 0; x < W; x += 2) {
      if (data[(y * W + x) * 4 + 3] > 128) hits.push(x, y)
    }
  }

  const out = new Float32Array(count * 3)
  const n = hits.length / 2
  // Nothing sensible to draw if the glyphs rasterise empty.
  if (!n) return out

  for (let i = 0; i < count; i++) {
    const k = Math.floor(Math.random() * n) * 2
    const x = hits[k] + Math.random() * 2
    const y = hits[k + 1] + Math.random() * 2
    // Sized in the formation itself rather than via the page scale, so making
    // the wordmark bigger leaves the arrow, rings, road and globe exactly as
    // they were. The two multipliers keep the canvas aspect (1024:320).
    out[i * 3] = (x / W - 0.5) * 15.4
    out[i * 3 + 1] = -(y / H - 0.5) * 4.81
    out[i * 3 + 2] = (Math.random() - 0.5) * 0.35
  }
  return out
}


/* ---- Scene -------------------------------------------------------------- */

function Particles({ progress, focus, pal }) {
  const { camera } = useThree()
  const points = useRef(null)

  // Built once and never reallocated.
  const { base, burst, positions, colors, sizes, halfSpan } = useMemo(() => {
    const base = textFormation(COUNT, 'G10X')
    const positions = new Float32Array(base)

    // Every particle gets its own escape vector, aimed away from the centre of
    // the wordmark so the shell opens outward rather than drifting sideways,
    // plus a speed so the front of the spray is ragged like a real burst.
    const burst = new Float32Array(COUNT * 4)
    for (let i = 0; i < COUNT; i++) {
      const j = i * 3
      let dx = base[j]
      let dy = base[j + 1]
      let dz = base[j + 2] + (Math.random() - 0.5) * 2
      const len = Math.hypot(dx, dy, dz) || 1
      dx /= len
      dy /= len
      dz /= len
      // Jitter the aim so the letterforms do not stay legible as they fly.
      const k = i * 4
      burst[k] = (dx + (Math.random() - 0.5) * 0.55) * SPREAD_X
      burst[k + 1] = (dy + (Math.random() - 0.5) * 0.55) * SPREAD_Y
      burst[k + 2] = (dz + (Math.random() - 0.5) * 0.55) * SPREAD_Z
      burst[k + 3] = 0.45 + Math.random() * 0.9
    }
    const colors = new Float32Array(COUNT * 3)
    const sizes = new Float32Array(COUNT)

    // Colour by horizontal position along the brand ramp, not by particle
    // index. Sampling the glyphs returns points in arbitrary order, so an
    // index ramp scattered the colours into confetti — mapping on X instead
    // reproduces the left-to-right purple → pink → coral run of the actual
    // logo lockup, so the wordmark reads as the brand rather than as noise.
    const ramp = [
      new THREE.Color('#7c2ff4'),
      new THREE.Color('#a438e8'),
      new THREE.Color('#df4a94'),
      new THREE.Color('#f0655a'),
    ]
    let minX = Infinity
    let maxX = -Infinity
    for (let i = 0; i < COUNT; i++) {
      const x = base[i * 3]
      if (x < minX) minX = x
      if (x > maxX) maxX = x
    }
    const spanX = maxX - minX || 1
    // How far the widest glyph reaches from the cloud's own origin. Measured
    // from the sampled points rather than assumed from the canvas width, since
    // the glyphs never fill their raster edge to edge — this is what lets the
    // scale be solved against the viewport instead of guessed.
    const halfSpan = Math.max(Math.abs(minX), Math.abs(maxX)) || 1

    const c = new THREE.Color()
    for (let i = 0; i < COUNT; i++) {
      const t = ((base[i * 3] - minX) / spanX) * (ramp.length - 1)
      const k = Math.min(ramp.length - 2, Math.floor(t))
      c.copy(ramp[k]).lerp(ramp[k + 1], t - k)
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
      sizes[i] = 0.5 + Math.random() * 0.9
    }
    return { base, burst, positions, colors, sizes, halfSpan }
  }, [])

  useFrame((state) => {
    const attr = points.current.geometry.attributes.position
    const arr = attr.array

    const p = Math.max(0, Math.min(progress.current, 1))
    // Ease out so the shell leaves fast and the tail drifts, the way a real
    // firework decelerates rather than travelling at a constant rate.
    const throwT = (1 - Math.pow(1 - p, 2.2)) * BURST
    const time = state.clock.elapsedTime

    for (let i = 0; i < COUNT; i++) {
      const j = i * 3
      const k = i * 4
      const d = throwT * burst[k + 3]
      // A little flicker so the cloud is never dead still.
      const shimmer = Math.sin(time * 1.4 + i * 0.7) * 0.03
      arr[j] = base[j] + burst[k] * d + shimmer
      arr[j + 1] = base[j + 1] + burst[k + 1] * d + shimmer * 0.7
      arr[j + 2] = base[j + 2] + burst[k + 2] * d
    }
    attr.needsUpdate = true

    // No rotation, no horizontal travel, and nothing driven by the pointer —
    // the cloud holds its place so the wordmark reads as a fixed mark rather
    // than something chasing the cursor. Its only life is a slow vertical
    // breath.
    //
    // Placement on both axes is a fraction of the visible frame, converted here
    // through the camera's own frustum, so the cloud lands on the centre of the
    // column it belongs to at any viewport size. World-space constants were
    // only ever correct at the one aspect ratio they were measured at.
    const g = points.current
    const halfH = camera.position.z * Math.tan((camera.fov * Math.PI) / 360)
    const frameH = 2 * halfH
    const frameW = frameH * camera.aspect
    const wantX = focus.current.xFraction * frameW

    g.position.x += (wantX - g.position.x) * 0.05
    // A shallow breath, deliberately small: the wordmark should look alive
    // without ever drifting far enough to crowd the top or bottom of its
    // column. ±0.13 world units is roughly ±14px on screen.
    const wantY = focus.current.yFraction * frameH + Math.sin(time * 0.5) * 0.13
    g.position.y += (wantY - g.position.y) * 0.06

    // Solve the scale against the frame rather than trusting a tuned number.
    // The wordmark is deliberately wider than its column — it bleeds left,
    // behind the opaque half — so the only real constraint is the right edge,
    // and that constraint moves with the aspect ratio: the frame's world height
    // is fixed by the camera, so a taller viewport renders the same cloud
    // larger in pixels and a hand-set scale that fitted at one size clipped the
    // X at another.
    const limit = focus.current.maxRightFraction * frameW
    const fits = (limit - wantX) / halfSpan
    const wantS = Math.max(0.2, Math.min(focus.current.scale, fits))
    g.scale.setScalar(g.scale.x + (wantS - g.scale.x) * 0.04)

    // The shell thins a little as it disperses, but never fades out — the
    // sparkles have to still be present over the closing sections.
    points.current.material.opacity = pal.particleOpacity * (1 - p * 0.22)
  })

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={pal.particleSize}
        sizeAttenuation
        vertexColors
        transparent
        opacity={pal.particleOpacity}
        depthWrite={false}
        blending={pal.particleBlending}
        toneMapped={false}
      />
    </points>
  )
}

/** Camera pulls back as the cloud grows, so no formation ever crops. */
function Rig({ progress }) {
  const { camera } = useThree()
  useFrame(() => {
    const p = Math.max(0, Math.min(progress.current, 1))
    // Ease back a little as the shell opens so the spray stays in frame. The
    // camera is otherwise fixed — it does not follow the pointer.
    const wantZ = 7.5 + p * 1.6
    camera.position.z += (wantZ - camera.position.z) * 0.03
    camera.lookAt(0, 0, 0)
  })
  return null
}

export default function Stage({ progress, focus, isLight = false }) {
  const pal = useMemo(() => {
    const base = scenePalette(isLight)
    return {
      ...base,
      // On the light ground additive blending washes to white, so the cloud
      // switches to normal blending and leans on saturation instead.
      particleBlending: isLight ? THREE.NormalBlending : THREE.AdditiveBlending,
      particleOpacity: isLight ? 0.85 : 0.75,
      particleSize: isLight ? 0.035 : 0.04,
    }
  }, [isLight])

  // Stop rendering entirely when the tab is not visible.
  const visibleRef = useRef(true)
  useEffect(() => {
    const onVis = () => {
      visibleRef.current = !document.hidden
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: false,
      }}
      camera={{ position: [0, 0, 7.5], fov: 50, near: 0.1, far: 60 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.1
      }}
      style={{ pointerEvents: 'none' }}
    >
      <Rig progress={progress} />
      <Particles progress={progress} focus={focus} pal={pal} />
    </Canvas>
  )
}
