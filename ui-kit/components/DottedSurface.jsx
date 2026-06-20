// Faithful TypeScript → JavaScript conversion of the DottedSurface component.
// Changes from original:
//   - TypeScript types removed
//   - `cn` (Tailwind merge) + className prop → inline styles
//   - `useTheme` from next-themes removed → always uses dark-theme dot color
//   - `as Float32Array` casts removed (unnecessary in JS)
//   - Declared-but-unused `particles` ref field removed from sceneRef

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function DottedSurface({ style = {}, ...props }) {
  const containerRef = useRef(null)
  const sceneRef     = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const SEPARATION = 150
    const AMOUNTX    = 40
    const AMOUNTY    = 60

    // Scene setup
    const scene   = new THREE.Scene()
    scene.fog     = new THREE.Fog(0xffffff, 2000, 10000)

    const camera  = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000)
    camera.position.set(0, 355, 1220)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(scene.fog.color, 0)
    containerRef.current.appendChild(renderer.domElement)

    // Build geometry
    const positions = []
    const colors    = []
    const geometry  = new THREE.BufferGeometry()

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        positions.push(
          ix * SEPARATION - (AMOUNTX * SEPARATION) / 2,
          0,
          iy * SEPARATION - (AMOUNTY * SEPARATION) / 2
        )
        // Dark-mode dot color (always, since this app is dark-only)
        colors.push(200, 200, 200)
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('color',    new THREE.Float32BufferAttribute(colors,    3))

    const material = new THREE.PointsMaterial({
      size:         8,
      vertexColors: true,
      transparent:  true,
      opacity:      0.8,
      sizeAttenuation: true,
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    let count       = 0
    let animationId = null

    const animate = () => {
      animationId = requestAnimationFrame(animate)

      const posAttr   = geometry.attributes.position
      const posArray  = posAttr.array
      let i = 0

      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          posArray[i * 3 + 1] =
            Math.sin((ix + count) * 0.3) * 50 +
            Math.sin((iy + count) * 0.5) * 50
          i++
        }
      }
      posAttr.needsUpdate = true

      renderer.render(scene, camera)
      count += 0.1
    }

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    animate()

    sceneRef.current = { scene, camera, renderer, animationId, count }

    return () => {
      window.removeEventListener('resize', handleResize)

      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId)

        sceneRef.current.scene.traverse((object) => {
          if (object instanceof THREE.Points) {
            object.geometry.dispose()
            if (Array.isArray(object.material)) {
              object.material.forEach((m) => m.dispose())
            } else {
              object.material.dispose()
            }
          }
        })

        sceneRef.current.renderer.dispose()

        if (containerRef.current && sceneRef.current.renderer.domElement) {
          containerRef.current.removeChild(sceneRef.current.renderer.domElement)
        }
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        pointerEvents: 'none',
        position:      'fixed',
        inset:         0,
        zIndex:        -1,
        ...style,
      }}
      {...props}
    />
  )
}
