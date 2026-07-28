import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { BRAND } from './geometry'

/**
 * Structural rings of the corridor, receding toward the vanishing point.
 *
 * One instanced draw call for the whole tunnel. Depth fade is handled by the
 * scene fog rather than per-instance opacity, which is what keeps this to a
 * single instanced mesh.
 */
export function TunnelRings({ count = 18, spacing = 2.9, velocity }) {
  const mesh = useRef(null)
  const offset = useRef(0)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const total = count * spacing

  useFrame((state, delta) => {
    // Clamp delta so a backgrounded tab doesn't fling the tunnel forward.
    const dt = Math.min(delta, 0.05)
    offset.current = (offset.current + dt * (2.2 + velocity.current * 22)) % total

    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      const z = 5 - ((i * spacing + offset.current) % total)
      dummy.position.set(0, 0, z)
      // Slow twist along the length: reads as a machined bore, not a stack.
      dummy.rotation.z = i * 0.16 + t * 0.05
      // Breathing, so the tunnel never looks like a static prop.
      dummy.scale.setScalar(1 + Math.sin(i * 0.55 + t * 0.7) * 0.022)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      {/* Low radial segments — it is a hairline ring, nobody counts the facets. */}
      <torusGeometry args={[3.6, 0.011, 3, 56]} />
      <meshBasicMaterial
        color={BRAND.violet}
        transparent
        opacity={0.5}
        toneMapped={false}
      />
    </instancedMesh>
  )
}

/**
 * Speed streaks. Thin boxes that stretch along z as scroll velocity rises —
 * a physical stand-in for motion blur that costs one instanced draw call
 * instead of a post-processing pass.
 */
export function SpeedStreaks({ count = 160, velocity }) {
  const mesh = useRef(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Stable random layout inside the tunnel bore.
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, () => {
        const angle = Math.random() * Math.PI * 2
        const radius = 0.5 + Math.random() * 3.1
        return {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          z: -Math.random() * 46,
          speed: 6 + Math.random() * 16,
          len: 0.5 + Math.random() * 2.2,
        }
      }),
    [count],
  )

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    const boost = 1 + velocity.current * 30
    // Streaks elongate with speed instead of just moving faster.
    const stretch = 1 + velocity.current * 34

    for (let i = 0; i < count; i++) {
      const s = seeds[i]
      s.z += s.speed * boost * dt
      if (s.z > 6) s.z = -46 - Math.random() * 6

      dummy.position.set(s.x, s.y, s.z)
      dummy.scale.set(1, 1, s.len * stretch)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[0.013, 0.013, 1]} />
      <meshBasicMaterial
        color={BRAND.pink}
        transparent
        opacity={0.55}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </instancedMesh>
  )
}

/**
 * Ambient dust. Reacts to the pointer, which is what sells the scene as a
 * space you are inside rather than a video playing behind the text.
 */
export function DustField({ count = 380, pointer }) {
  const points = useRef(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10
      arr[i * 3 + 2] = -Math.random() * 34
    }
    return arr
  }, [count])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    // Whole field drifts against the cursor — cheap, convincing parallax.
    points.current.rotation.y = pointer.x.get() * 0.06 + t * 0.012
    points.current.rotation.x = -pointer.y.get() * 0.04
  })

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        {/* `args` constructs the attribute; count and itemSize come from it. */}
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.028}
        sizeAttenuation
        color="#cfd6ea"
        transparent
        opacity={0.5}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  )
}

/**
 * The mark itself, machined and suspended at the centre of the corridor.
 * Lit from the left in purple and the right in coral so the brand ramp is
 * produced by the lighting rather than painted on.
 */
export function ArrowCore({ geometry, velocity, pointer }) {
  const group = useRef(null)
  const wire = useRef(null)

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const dt = Math.min(delta, 0.05)

    // Idle: a slow, heavy rotation. Under scroll: it points down the tunnel.
    const target = velocity.current * 4
    group.current.rotation.y += (Math.sin(t * 0.28) * 0.34 - group.current.rotation.y) * 0.03
    group.current.rotation.z += (target - group.current.rotation.z) * 0.05
    // Engine idle — a vibration small enough to feel rather than see.
    group.current.position.y =
      Math.sin(t * 1.4) * 0.045 + Math.sin(t * 11) * 0.004
    group.current.position.x += (pointer.x.get() * 0.28 - group.current.position.x) * 0.04

    // Wireframe shell rotates counter to the solid: depth without extra geometry.
    wire.current.rotation.z -= dt * 0.14
  })

  return (
    <group ref={group}>
      <mesh geometry={geometry} castShadow={false}>
        <meshStandardMaterial
          color="#10142c"
          metalness={0.92}
          roughness={0.22}
          emissive={BRAND.purple}
          emissiveIntensity={0.14}
        />
      </mesh>

      {/* Blueprint shell — the wireframe→real language, held at both states. */}
      <mesh ref={wire} geometry={geometry} scale={1.12}>
        <meshBasicMaterial
          color={BRAND.pink}
          wireframe
          transparent
          opacity={0.14}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}
