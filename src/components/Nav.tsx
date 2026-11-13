import { Link, useLocation } from 'react-router-dom'

/** The name and the Blog pill, nothing else: the blog links to no other site.
 *  The pill is always lit, since every page here is the blog. */
export default function Nav() {
  const { pathname } = useLocation()

  return (
    // Fixed, and pointer-events-none so the header never eats taps on the page; the pill opts back in.
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 sm:pt-6">
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

        <Link
          to="/"
          aria-current={pathname === '/' ? 'page' : undefined}
          className="press ml-auto inline-flex shrink-0 items-center rounded-full bg-white px-4 py-2 text-[0.75rem] font-bold tracking-[0.12em] text-ink uppercase lg:py-2.5"
        >
          Blog
        </Link>
      </nav>
    </header>
  )
}
