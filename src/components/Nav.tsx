import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { TYPES, filterTo, useFilters } from '../filters'
import Search, { SearchIcon } from './Search'

const linkClass = 'text-[0.75rem] font-semibold uppercase tracking-[0.12em] transition-colors'

/** The portfolio's floating pill, with the blog's own contents: the topics (which filter the
 *  index) and search. Fixed, so it stays on screen; below lg the topics move into the menu sheet. */
export default function Nav() {
  const [open, setOpen] = useState(false)
  const [searching, setSearching] = useState(false)
  const { pathname } = useLocation()
  const { type } = useFilters()
  // which topic is current; none off the index
  const active = pathname === '/' ? type : null

  const header = useRef<HTMLElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  const links = useRef<HTMLUListElement>(null)
  // Where the current-topic dot sits, in px from the start of the link row; null hides it.
  const [dot, setDot] = useState<number | null>(null)

  // The sheet closes the way any sheet does: Escape, or a tap outside it.
  // Escape hands focus back to the toggle so keyboard users aren't dropped.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      toggle.current?.focus()
    }
    const onDown = (e: PointerEvent) => {
      if (!header.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  // "/" or Ctrl/Cmd+K opens search, unless you are typing somewhere
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement).closest('input, textarea, [contenteditable]')
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault()
        setSearching(true)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // Measured, since the links differ in width; again on resize and once the web font lands.
  useLayoutEffect(() => {
    const measure = () => {
      const el = links.current?.querySelector<HTMLElement>('[aria-current]')
      setDot(el ? el.offsetLeft + el.offsetWidth / 2 : null)
    }
    measure()
    window.addEventListener('resize', measure)
    document.fonts?.ready.then(measure)
    return () => window.removeEventListener('resize', measure)
  }, [active])

  return (
    <>
      {/* pointer-events-none so the fixed header never eats taps on the page; pill and sheet opt back in */}
      <header ref={header} className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 sm:pt-6">
        <nav
          aria-label="Main"
          className="pointer-events-auto mx-auto flex max-w-7xl items-center rounded-2xl bg-ink/95 px-4 py-3 ring-1 ring-white/10 backdrop-blur-md sm:px-5"
        >
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <span aria-hidden className="h-8 w-[3px] rounded-full bg-brand" />
            <span className="type-hero text-[0.8125rem] leading-[1.05] tracking-[0.08em] text-white uppercase">
              Ahmed
              <br />
              Islam
            </span>
          </Link>

          {/* Right-hand group; search stays in normal flow so it can't overlap the topics. */}
          <div className="ml-auto flex items-center gap-3 sm:gap-4 xl:gap-7">
            <ul ref={links} className="relative hidden items-center gap-4 lg:flex xl:gap-7">
              {/* A sliding dot marks the current topic, so position isn't carried by hue alone. */}
              <span
                aria-hidden
                className={`absolute -bottom-2 left-0 size-1 rounded-full bg-brand-bright transition-[translate,opacity] duration-500 ease-spring ${
                  dot === null ? 'opacity-0' : 'opacity-100'
                }`}
                // centred by subtracting half its 4px width: an inline `translate`
                // would override a -translate-x-1/2 class, not add to it
                style={dot === null ? undefined : { translate: `${dot - 2}px 0` }}
              />
              {TYPES.map((t) => {
                const on = active === t.id
                return (
                  <li key={t.id}>
                    <Link
                      to={filterTo(t.id)}
                      aria-current={on ? 'page' : undefined}
                      className={`${linkClass} ${on ? 'text-brand-bright' : 'text-white/70 hover:text-white'}`}
                    >
                      {t.label}
                    </Link>
                  </li>
                )
              })}
            </ul>

            <button
              type="button"
              onClick={() => setSearching(true)}
              className="press inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[0.75rem] font-bold tracking-[0.12em] text-white uppercase ring-1 ring-white/25 hover:bg-white/10 lg:py-2.5"
            >
              <SearchIcon className="size-4" />
              Search
            </button>

            <button
              ref={toggle}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="press grid size-11 place-items-center rounded-full text-white hover:bg-white/10 lg:hidden"
            >
              {/* Three bars fold into an X, so the control visibly turns into its own undo. */}
              <span aria-hidden className="relative block h-3.5 w-[1.125rem]">
                {['top-0', 'top-1/2 -translate-y-1/2', 'bottom-0'].map((pos, i) => (
                  <span
                    key={pos}
                    className={`absolute left-0 h-[1.75px] w-full rounded-full bg-current transition-[translate,rotate,opacity] duration-300 ease-out ${pos} ${
                      !open
                        ? ''
                        : i === 0
                          ? 'translate-y-[6.125px] rotate-45'
                          : i === 1
                            ? 'opacity-0'
                            : '-translate-y-[6.125px] -rotate-45'
                    }`}
                  />
                ))}
              </span>
            </button>
          </div>
        </nav>

        {/* Always mounted so it animates both ways; `invisible` drops it from the tab order.
            Absolute, not in flow, or the header box would block taps on the page below it. */}
        <div
          id="mobile-menu"
          className={`pointer-events-auto absolute inset-x-4 top-full mx-auto mt-2 max-w-7xl origin-top rounded-2xl bg-ink/98 p-3 backdrop-blur-md transition-[opacity,translate,scale,visibility] sm:inset-x-6 lg:hidden ${
            open
              ? 'visible translate-y-0 scale-100 opacity-100 duration-500 ease-spring'
              : 'invisible -translate-y-2 scale-[0.97] opacity-0 duration-200 ease-out'
          }`}
        >
          <ul className="divide-y divide-white/10">
            {TYPES.map((t) => {
              const on = active === t.id
              return (
                <li key={t.id}>
                  <Link
                    to={filterTo(t.id)}
                    onClick={() => setOpen(false)}
                    aria-current={on ? 'page' : undefined}
                    className={`block px-2 py-3 text-[0.8125rem] font-semibold tracking-[0.14em] uppercase transition-colors ${
                      on ? 'text-brand-bright' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </header>

      <Search open={searching} onClose={() => setSearching(false)} />
    </>
  )
}
