import './style.css'

const canvas = document.querySelector<HTMLCanvasElement>('#hero-canvas')
let disposeScene: (() => void) | undefined
let disposed = false

requestAnimationFrame(() => {
  void Promise.all([import('./three-scene'), import('./animations')]).then(([scene, motion]) => {
    if (disposed) return
    if (canvas) {
      try {
        disposeScene = scene.createHeroScene(canvas)
      } catch {
        canvas.hidden = true
      }
    }
    motion.setupAnimations()
  })
})

const header = document.querySelector<HTMLElement>('.site-header')
const observer = new IntersectionObserver(([entry]) => {
  header?.classList.toggle('scrolled', !entry.isIntersecting)
}, { threshold: 0.1 })
const hero = document.querySelector('.hero')
if (hero) observer.observe(hero)

addEventListener('pagehide', () => {
  disposed = true
  disposeScene?.()
  observer.disconnect()
}, { once: true })
