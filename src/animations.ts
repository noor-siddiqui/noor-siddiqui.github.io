import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function setupAnimations() {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reducedMotion) {
    gsap.set('.reveal, .project, .contact-title span', { opacity: 1, clearProps: 'transform' })
    return
  }

  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
  intro.from('.site-header', { y: -30, opacity: 0, duration: 0.7 })
    .from('.eyebrow', { y: 20, opacity: 0, duration: 0.5 }, '-=.35')
    .from('.hero-title > span', { yPercent: 110, opacity: 0, duration: 1.1, stagger: 0.12 }, '-=.25')
    .from('.hero-bottom', { y: 30, opacity: 0, duration: 0.7 }, '-=.45')

  gsap.utils.toArray<HTMLElement>('.reveal').forEach((element) => {
    if (element.closest('.hero')) return
    gsap.from(element, {
      y: 60,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: element, start: 'top 86%', once: true }
    })
  })

  gsap.from('.project', {
    y: 50,
    opacity: 0,
    stagger: 0.09,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.project-list', start: 'top 82%', once: true }
  })

  gsap.from('.contact-title span', {
    yPercent: 100,
    opacity: 0,
    stagger: 0.14,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.contact-title', start: 'top 85%', once: true }
  })

}
