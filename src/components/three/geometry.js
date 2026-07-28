import * as THREE from 'three'

/**
 * The logo's arrow, lifted straight out of the SVG path and extruded into a
 * solid. Same four points as `ArrowGlyph` — SVG space is y-down and 0..100,
 * so each point is re-centred on the origin and flipped to y-up.
 */
const SVG_POINTS = [
  [12, 50],
  [88, 18],
  [56, 94],
  [46, 58],
]

const toLocal = ([x, y]) => [(x - 50) / 50, (50 - y) / 50]

export function createArrowGeometry({
  depth = 0.26,
  bevel = 0.035,
  scale = 1,
} = {}) {
  const shape = new THREE.Shape()
  SVG_POINTS.forEach((p, i) => {
    const [x, y] = toLocal(p)
    if (i === 0) shape.moveTo(x * scale, y * scale)
    else shape.lineTo(x * scale, y * scale)
  })
  shape.closePath()

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 4,
  })

  // Extrusion grows along +z from the shape plane; recentre so rotation is
  // about the arrow's own middle.
  geometry.center()
  geometry.computeVertexNormals()
  return geometry
}

/** Brand ramp as three.js colors, reused by lights and materials. */
export const BRAND = {
  purple: new THREE.Color('#7c2ff4'),
  violet: new THREE.Color('#a438e8'),
  pink: new THREE.Color('#df4a94'),
  coral: new THREE.Color('#f0655a'),
  void: new THREE.Color('#050814'),
}
