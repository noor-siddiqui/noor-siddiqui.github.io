import * as THREE from 'three'

export function createHeroScene(canvas: HTMLCanvasElement) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
  camera.position.set(0, 0, 8)
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: devicePixelRatio <= 1.5 })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.25))
  const group = new THREE.Group()
  group.position.set(1.8, 0, 0)
  scene.add(group)

  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.55, 0.38, 96, 12, 2, 3),
    new THREE.MeshBasicMaterial({ color: 0xf4d000, wireframe: true, transparent: true, opacity: 0.72 })
  )
  group.add(knot)

  const pointsGeometry = new THREE.BufferGeometry()
  const positions = new Float32Array(240)
  for (let index = 0; index < positions.length; index += 3) {
    const radius = 2.3 + Math.random() * 2.5
    const angle = Math.random() * Math.PI * 2
    positions[index] = Math.cos(angle) * radius
    positions[index + 1] = (Math.random() - 0.5) * 5.5
    positions[index + 2] = Math.sin(angle) * radius
  }
  pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const pointsMaterial = new THREE.PointsMaterial({ color: 0xf4d000, size: 0.025, transparent: true, opacity: 0.7 })
  const points = new THREE.Points(pointsGeometry, pointsMaterial)
  group.add(points)

  let pointerX = 0
  let pointerY = 0
  let frame = 0
  let active = false
  const onPointerMove = (event: PointerEvent) => {
    pointerX = event.clientX / innerWidth - 0.5
    pointerY = event.clientY / innerHeight - 0.5
  }
  const draw = () => renderer.render(scene, camera)
  const render = () => {
    if (!active || document.hidden || reducedMotion) return
    knot.rotation.x += 0.0015
    knot.rotation.y += 0.0025
    points.rotation.y -= 0.0008
    group.rotation.y += (pointerX * 0.35 - group.rotation.y) * 0.025
    group.rotation.x += (-pointerY * 0.2 - group.rotation.x) * 0.025
    draw()
    frame = requestAnimationFrame(render)
  }
  const start = () => {
    if (active || reducedMotion || document.hidden) return
    active = true
    addEventListener('pointermove', onPointerMove, { passive: true })
    frame = requestAnimationFrame(render)
  }
  const stop = () => {
    active = false
    cancelAnimationFrame(frame)
    removeEventListener('pointermove', onPointerMove)
  }
  const observer = new IntersectionObserver(([entry]) => entry.isIntersecting ? start() : stop(), { threshold: 0 })
  observer.observe(canvas)

  const resize = () => {
    const rect = canvas.getBoundingClientRect()
    renderer.setSize(rect.width, rect.height, false)
    camera.aspect = rect.width / rect.height
    camera.updateProjectionMatrix()
    group.position.x = rect.width < 800 ? 0.7 : 1.8
    group.scale.setScalar(rect.width < 500 ? 0.72 : 1)
    draw()
  }
  const onVisibilityChange = () => document.hidden ? stop() : canvas.getBoundingClientRect().bottom > 0 && start()
  resize()
  draw()
  addEventListener('resize', resize, { passive: true })
  document.addEventListener('visibilitychange', onVisibilityChange)

  return () => {
    stop()
    observer.disconnect()
    removeEventListener('resize', resize)
    document.removeEventListener('visibilitychange', onVisibilityChange)
    knot.geometry.dispose()
    ;(knot.material as THREE.Material).dispose()
    pointsGeometry.dispose()
    pointsMaterial.dispose()
    renderer.dispose()
  }
}
