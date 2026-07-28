import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Grid } from '@react-three/drei'
import * as THREE from 'three'
import { BRAND, createArrowGeometry } from './geometry'
import { ArrowCore, DustField, SpeedStreaks, TunnelRings } from './TunnelParts'

/**
 * The hero corridor.
 *
 * A single meaningful scene rather than decoration: you are inside a lit bore,
 * the G10X arrow is suspended at the centre, and scrolling accelerates the
 * whole environment toward the vanishing point. Streaks stretch, the road grid
 * rushes, the camera pushes in.
 *
 * Default-exported and consumed through React.lazy, so three.js lands in its
 * own chunk and never blocks first paint.
 */
export default function HeroScene({ velocity, pointer, active = true }) {
  const geometry = useMemo(
    () => createArrowGeometry({ depth: 0.3, bevel: 0.04, scale: 1.35 }),
    [],
  )

  // Geometry is created outside the reconciler, so dispose it explicitly.
  useEffect(() => () => geometry.dispose(), [geometry])

  return (
    <Canvas
      // Cap DPR: past ~1.75 the extra pixels are invisible and cost real frames.
      dpr={[1, 1.75]}
      frameloop={active ? 'always' : 'never'}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      }}
      camera={{ position: [0, 0, 6.2], fov: 52, near: 0.1, far: 90 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
      }}
      style={{ pointerEvents: 'none' }}
    >
      {/* Depth fog: the vanishing point, and the reason nothing needs culling. */}
      <fog attach="fog" args={['#050814', 7, 30]} />

      <CameraRig velocity={velocity} pointer={pointer} />

      {/* Headlight pair. Purple left, coral right — the ramp, made physical. */}
      <ambientLight intensity={0.32} />
      <pointLight
        position={[-4, 1.6, 3]}
        intensity={38}
        distance={16}
        color={BRAND.purple}
      />
      <pointLight
        position={[4.2, -1, 2.4]}
        intensity={32}
        distance={16}
        color={BRAND.coral}
      />
      {/* Rim light from behind the mark, separating it from the fog. */}
      <pointLight
        position={[0, 0.5, -4]}
        intensity={26}
        distance={14}
        color={BRAND.pink}
      />

      <ArrowCore geometry={geometry} velocity={velocity} pointer={pointer} />
      <TunnelRings velocity={velocity} />
      <SpeedStreaks velocity={velocity} />
      <DustField pointer={pointer} />

      <RoadGrid velocity={velocity} />
      <RoadGrid velocity={velocity} ceiling />
    </Canvas>
  )
}

/**
 * Camera behaviour: pointer parallax at rest, and a push down the tunnel as
 * scroll velocity builds. Damped rather than bound directly, so the motion has
 * weight and never snaps.
 */
function CameraRig({ velocity, pointer }) {
  const { camera } = useThree()
  const target = useRef(new THREE.Vector3(0, 0, 0))

  useFrame(() => {
    const px = pointer.x.get()
    const py = pointer.y.get()

    // Parallax offsets stay small — the scene should sway, not lurch.
    const wantX = px * 0.55
    const wantY = -py * 0.36
    const wantZ = 6.2 - velocity.current * 8

    camera.position.x += (wantX - camera.position.x) * 0.045
    camera.position.y += (wantY - camera.position.y) * 0.045
    camera.position.z += (wantZ - camera.position.z) * 0.06

    // Slight roll into the turn.
    camera.rotation.z += (-px * 0.03 - camera.rotation.z) * 0.04

    target.current.set(px * 0.18, -py * 0.12, -6)
    camera.lookAt(target.current)
  })

  return null
}

/**
 * The digital road. drei's infinite grid gives a properly antialiased,
 * distance-faded surface for free; animating its z within one cell size makes
 * the motion endless without ever rebuilding geometry.
 *
 * Two notes on drei's Grid, both easy to get wrong:
 *  - It needs no rotation to lie flat. Its vertex shader swizzles the plane's
 *    `position.xzy`, so an unrotated Grid is already horizontal.
 *  - That swizzle mirrors face winding, which is why drei defaults to
 *    `BackSide`. The mirrored ceiling copy flips the winding a second time and
 *    would be culled, so both copies are drawn `DoubleSide`.
 */
function RoadGrid({ velocity, ceiling = false }) {
  const ref = useRef(null)
  const CELL = 1.4

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    // Wrap within one cell so the surface streams forever without moving far.
    ref.current.position.z =
      (ref.current.position.z + dt * (3 + velocity.current * 34)) % CELL
  })

  return (
    <Grid
      ref={ref}
      position={[0, ceiling ? 3.4 : -3.4, 0]}
      rotation={[ceiling ? Math.PI : 0, 0, 0]}
      args={[44, 44]}
      side={THREE.DoubleSide}
      cellSize={CELL}
      cellThickness={0.6}
      cellColor="#2a2150"
      sectionSize={CELL * 5}
      sectionThickness={1.1}
      sectionColor="#7c2ff4"
      fadeDistance={30}
      fadeStrength={1.4}
      infiniteGrid
      followCamera={false}
    />
  )
}
