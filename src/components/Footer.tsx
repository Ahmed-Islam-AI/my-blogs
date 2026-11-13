import { Link } from 'react-router-dom'
import { posts } from 'virtual:blog'
import { analyticsOn } from '../analytics'
import { OPEN_CONSENT } from './ConsentBanner'
import { SOCIALS } from '../data/socials'
import { MAIN } from '../site'

const EMAIL = 'hello@ahmedislam.tech'

/** The portfolio's sections with its own numbering, so both footers read as one site. */
const PORTFOLIO = [
  { id: 'about', index: '02', label: 'About' },
  { id: 'experience', index: '03', label: 'Experience' },
  { id: 'skills', index: '04', label: 'Skills' },
  { id: 'services', index: '05', label: 'Services' },
  { id: 'reviews', index: '06', label: 'Reviews' },
  { id: 'method', index: '07', label: 'Method' },
  { id: 'projects', index: '08', label: 'Projects' },
  { id: 'certifications', index: '09', label: 'Certifications' },
  { id: 'contact', index: '10', label: 'Contact' },
]

const RECENT = 5

const linkClass =
  'text-sm text-dark-muted transition-colors hover:text-white focus-visible:text-white'

export default function Footer() {
  return (
    // -mt with z-10 tucks the rounded top over the page; the hairline makes the curve visible.
    <footer
      id="site-footer"
      className="relative z-10 -mt-10 overflow-hidden rounded-t-[2.5rem] border-t border-white/[0.08] bg-ink-deep lg:-mt-14"
    >
      <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 lg:px-20 lg:pt-20">
        {/* Name, role and availability */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="type-hero text-h3 text-white">
              Ahmed Islam<span className="text-brand">.</span>
            </p>
            <p className="text-eyebrow mt-2 text-dark-muted uppercase">
              Full-Stack AI Engineer <span className="text-white/25">·</span> Islamabad, PK
            </p>
          </div>

          {/* Green only for availability, as on the portfolio. */}
          <p className="inline-flex shrink-0 items-center gap-2.5 self-start rounded-full bg-white/[0.06] px-4 py-2 text-[0.6875rem] font-semibold tracking-[0.14em] text-white uppercase ring-1 ring-white/10">
            <span className="relative flex size-2 shrink-0">
              <span className="absolute inline-flex size-full rounded-full bg-success opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            Available for work
          </p>
        </div>

        {/* Portfolio and Writing stay side by side even on a phone; Elsewhere spans below. */}
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:mt-14 lg:grid-cols-[1fr_1fr_auto] lg:gap-16">
          <nav aria-label="Portfolio">
            <p className="text-eyebrow text-brand-bright uppercase">Portfolio</p>
            {/* Two sub-columns only from lg: a phone column is too narrow to split. */}
            <ul className="mt-5 grid gap-3 lg:grid-cols-2 lg:gap-y-3.5">
              {PORTFOLIO.map((section) => (
                <li key={section.id}>
                  <a href={`${MAIN}/#${section.id}`} className={linkClass}>
                    <span className="mr-2 text-[0.6875rem] text-white/50 tabular-nums">{section.index}</span>
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Recent writing">
            <p className="text-eyebrow text-brand-bright uppercase">Recent writing</p>
            <ul className="mt-5 grid gap-3.5">
              {posts.slice(0, RECENT).map((post) => (
                <li key={post.slug}>
                  <Link to={`/${post.slug}`} className={`${linkClass} line-clamp-2`}>
                    {post.title}
                  </Link>
                </li>
              ))}
              {/* An arrow in front: this one is the whole list, the others are single posts. */}
              <li>
                <Link to="/" className={linkClass}>
                  <span aria-hidden className="mr-2 text-[0.6875rem] text-brand-bright">
                    &rarr;
                  </span>
                  All posts
                </Link>
              </li>
            </ul>
          </nav>

          {/* Icon-only below lg; aria-label keeps each name for screen readers. */}
          <div className="col-span-2 lg:col-span-1">
            <p className="text-eyebrow text-brand-bright uppercase">Elsewhere</p>
            <ul className="mt-5 flex flex-wrap gap-2.5 lg:grid lg:gap-3.5">
              {SOCIALS.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className={`${linkClass} group inline-flex items-center gap-2.5`}
                  >
                    <span className="grid size-11 place-items-center rounded-full bg-white/[0.05] text-white/45 ring-1 ring-white/10 transition-colors group-hover:bg-brand group-hover:text-white group-hover:ring-brand lg:size-4 lg:bg-transparent lg:text-white/30 lg:ring-0 lg:group-hover:bg-transparent lg:group-hover:text-brand">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-[18px] shrink-0 lg:size-4"
                        aria-hidden
                      >
                        <path d={social.path} />
                      </svg>
                    </span>
                    <span className="hidden lg:inline">{social.name}</span>
                  </a>
                </li>
              ))}
            </ul>

            <a href={`${MAIN}/Ahmed-Islam-CV.pdf`} download className={`${linkClass} mt-6 inline-block`}>
              <span className="border-b border-white/20 pb-0.5">Download CV</span>
            </a>
          </div>
        </div>

        {/* Email */}
        <a
          href={`mailto:${EMAIL}`}
          data-track="email_click"
          data-track-from="footer"
          className="group mt-16 flex flex-wrap items-baseline gap-x-4 gap-y-2 border-t border-white/10 pt-10"
        >
          <span className="text-eyebrow shrink-0 text-dark-muted uppercase">Start here</span>
          <span className="type-hero min-w-0 text-[1.125rem] break-all text-white transition-colors group-hover:text-brand-bright sm:text-[1.5rem] lg:text-[1.875rem]">
            {EMAIL}
          </span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5 shrink-0 self-center text-brand transition-transform group-hover:translate-x-1"
            aria-hidden
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>

      {/* Full-bleed wordmark; leading-[0.72] crops the font's built-in shoulder.
          "AHMED." is 4.238em wide in Archivo at this tracking, so 21.5vw spans ~91vw. */}
      <p
        aria-hidden
        className="type-hero mt-12 flex select-none justify-center text-[21.5vw] leading-[0.72] tracking-[-0.045em] whitespace-nowrap uppercase lg:mt-16"
      >
        <span className="bg-gradient-to-b from-white/[0.18] to-white/[0.06] bg-clip-text text-transparent">
          Ahmed
        </span>
        <span className="text-brand/80">.</span>
      </p>

      {/* Bottom bar */}
      <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-20">
        {/* Centred while stacked, split left/right once there's room for one line. */}
        <div className="flex flex-col items-center gap-3 border-t border-white/10 pt-6 text-center text-[0.6875rem] font-semibold tracking-[0.12em] text-white/60 uppercase sm:flex-row sm:justify-between sm:text-left">
          {/* The prerendered year can lag the browser's after New Year; one stale node is fine. */}
          <div className="flex flex-wrap items-center justify-center gap-x-3">
            <p suppressHydrationWarning>© {new Date().getFullYear()} Ahmed Islam</p>
            <span aria-hidden className="text-white/25">
              ·
            </span>
            {/* Required by GA's terms and EU consent law; -my/py keep 44px targets. */}
            <a href={`${MAIN}/privacy`} className="-my-3 py-3 transition-colors hover:text-white">
              Privacy policy
            </a>
            {analyticsOn && (
              <>
                <span aria-hidden className="text-white/25">
                  ·
                </span>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT))}
                  className="-my-3 py-3 font-semibold tracking-[0.12em] uppercase transition-colors hover:text-white"
                >
                  Cookie settings
                </button>
              </>
            )}
          </div>
          <p className="flex items-center gap-1.5">
            Built with
            <span role="img" aria-label="love" className="text-[0.875rem] leading-none">
              ❤️
            </span>
            by Ahmed Islam
          </p>
        </div>
      </div>
    </footer>
  )
}
