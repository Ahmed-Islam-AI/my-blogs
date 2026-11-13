import { Link } from 'react-router-dom'
import { analyticsOn } from '../analytics'
import { OPEN_CONSENT } from './ConsentBanner'
import { EMAIL } from '../site'

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
            <Link to="/privacy" className="-my-3 py-3 transition-colors hover:text-white">
              Privacy policy
            </Link>
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
