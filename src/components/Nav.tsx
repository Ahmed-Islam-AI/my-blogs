import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { TYPES, filterTo, useFilters } from '../filters'
import Search, { SearchIcon } from './Search'

const linkClass = 'text-[0.75rem] font-semibold uppercase tracking-[0.12em] transition-colors'

/** A bar pinned to the top edge: the name, the topics (which filter the index), and search.
 *  Scrolled, it tightens by moving, not by resizing: the bar rises 8px and its content drops 4px. */
export default function Nav() {
  const { pathname } = useLocation()
  const { type } = useFilters()
  const [scrolled, setScrolled] = useState(false)
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    // only a boolean changes, and React skips the render when it doesn't
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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

  const topics = TYPES.map((t) => {
    const on = pathname === '/' && type === t.id
    return (
      <li key={t.id} className="shrink-0">
        <Link
          to={filterTo(t.id)}
          aria-current={on ? 'page' : undefined}
          className={`relative inline-flex min-h-11 items-center ${linkClass} ${on ? 'text-white' : 'text-white/70 hover:text-white'}`}
        >
          {t.label}
          {/* the current topic is marked by a shape, not by colour alone */}
          <span
            aria-hidden
            className={`absolute inset-x-0 bottom-1.5 h-0.5 origin-left rounded-full bg-brand transition-[scale] duration-300 ${on ? 'scale-x-100' : 'scale-x-0'}`}
          />
        </Link>
      </li>
    )
  })

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/95 backdrop-blur-md transition-[translate,box-shadow] duration-300 ${
          scrolled ? '-translate-y-2 shadow-[0_14px_30px_-20px_rgb(0_0_0/0.7)]' : ''
        }`}
      >
        <nav aria-label="Main" className="px-4 sm:px-6 lg:px-20">
          <div className={`mx-auto max-w-6xl transition-[translate] duration-300 ${scrolled ? 'translate-y-1' : ''}`}>
            <div className="flex items-center gap-6 py-3 lg:py-4">
              <Link to="/" className="flex shrink-0 items-center gap-3">
                <span aria-hidden className="h-9 w-[3px] rounded-full bg-brand" />
                <span className="flex flex-col gap-0.5">
                  <span className="type-hero text-[0.8125rem] leading-none tracking-[0.08em] text-white uppercase">
                    Ahmed Islam
                  </span>
                  <span className="text-[0.75rem] leading-none text-dark-muted">Notes from the build</span>
                </span>
              </Link>

              <ul className="hidden items-center gap-8 lg:mx-auto lg:flex">{topics}</ul>

              <button
                type="button"
                onClick={() => setSearching(true)}
                aria-label="Search posts"
                className="press ml-auto flex min-h-11 min-w-11 items-center justify-center gap-2.5 rounded-full px-3 text-white/80 ring-1 ring-white/15 hover:bg-white/10 hover:text-white sm:px-4 lg:ml-0"
              >
                <SearchIcon className="size-[1.05rem]" />
                <span className={`hidden sm:inline ${linkClass}`}>Search</span>
                <span aria-hidden className="hidden rounded-md bg-white/10 px-1.5 py-0.5 text-[0.6875rem] leading-none text-white/60 lg:inline">
                  /
                </span>
              </button>
            </div>

            {/* Below lg the topics get their own row, which scrolls sideways if it ever needs to. */}
            <ul className="-mx-4 flex gap-7 overflow-x-auto border-t border-white/10 px-4 sm:-mx-6 sm:px-6 lg:hidden">{topics}</ul>
          </div>
        </nav>
      </header>

      <Search open={searching} onClose={() => setSearching(false)} />
    </>
  )
}
