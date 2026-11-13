import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Archivo loaded, or 2.5s. Reveals wait on it, so text never fades in set in the system font.
 *  `fonts.load`, not `fonts.ready`: ready resolves at once if loading hasn't started. */
let fontsReady: Promise<unknown> | undefined
const whenFontsReady = () =>
  (fontsReady ??= Promise.race([
    Promise.all([document.fonts.load('700 1em Archivo'), document.fonts.load('400 1em Archivo')]).catch(() => {}),
    new Promise((resolve) => setTimeout(resolve, 2500)),
  ]))

/** Reveals each `[data-reveal]` element once it scrolls into view; re-runs on route change, and on
 *  a query change too, since the index's filters (`?type=`) mount and unmount elements.
 *  ponytail: IO + CSS transitions, no library; add GSAP only for pinning or scrubbed timelines. */
export function useReveal() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    const targets = document.querySelectorAll('[data-reveal]:not([data-revealed])')

    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.setAttribute('data-revealed', ''))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-revealed', '')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    )

    let live = true
    whenFontsReady().then(() => live && targets.forEach((el) => observer.observe(el)))

    // Reveals anything still hidden that is now on screen: an element observed under a
    // display:none ancestor never intersects
    const sweep = () => {
      for (const el of document.querySelectorAll('[data-reveal]:not([data-revealed])')) {
        const rect = el.getBoundingClientRect()
        if (rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0) {
          el.setAttribute('data-revealed', '')
          observer.unobserve(el)
        }
      }
    }

    window.addEventListener('resize', sweep)
    return () => {
      live = false
      observer.disconnect()
      window.removeEventListener('resize', sweep)
    }
  }, [pathname, search])
}
