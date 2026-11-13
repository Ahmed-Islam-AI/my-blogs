import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { posts } from 'virtual:blog'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import PostCover from '../components/PostCover'
import type { PostMeta } from '../content/types'
import { HOME } from '../site'
import { TYPES, filterTo, formatDate, kindOf, tie, useFilters } from '../filters'

/** A cover's props. Issues count within a type, so the first case study is No. 01 too. */
export function coverOf(post: PostMeta) {
  const same = posts.filter((p) => p.type === post.type) // newest first
  return {
    slug: post.slug,
    issue: same.length - same.findIndex((p) => p.slug === post.slug),
    label: post.type === 'case-study' ? 'Case study' : 'Notes from the build',
  }
}

/** Tags of the given posts, most used first. */
function tagsOf(list: PostMeta[]) {
  const count = new Map<string, number>()
  for (const p of list) for (const t of p.tags) count.set(t, (count.get(t) ?? 0) + 1)
  return [...count].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([t]) => t)
}

/** The index, `/`: the newest post featured, then every post as a row, filtered by the nav's
 *  topic (`?type=`) and the chips' tag (`?tag=`). Posts are Markdown in `src/content/posts/`. */
export default function BlogPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = HOME.title
  }, [])

  const { type, tag } = useFilters()
  const ofType = type === 'all' ? posts : posts.filter((p) => p.type === type)
  const shown = tag ? ofType.filter((p) => p.tags.includes(tag)) : ofType
  const filtered = type !== 'all' || tag !== null
  const label = type === 'all' ? 'All posts' : TYPES.find((t) => t.id === type)!.label
  const hasCaseStudies = posts.some((p) => p.type === 'case-study')

  return (
    <>
      <Nav />

      <main id="top" className="min-h-screen bg-paper">
        <div className="pt-nav px-4 pb-28 sm:px-6 lg:px-20 lg:pb-36">
          <div className="mx-auto max-w-6xl">
            <header className="flex flex-col gap-8 pt-10 lg:flex-row lg:items-end lg:justify-between lg:pt-14">
              <h1 data-reveal className="type-hero text-display leading-[0.92] uppercase">
                <span className="block text-heading">Notes from</span>{' '}
                <span className="block text-heading/50">
                  the build<span className="text-brand">.</span>
                </span>
              </h1>
              {/* Promises case studies only once one exists. */}
              <p data-reveal className="text-lead max-w-[38ch] text-muted [--reveal-delay:120ms] lg:pb-2">
                {hasCaseStudies ? 'Case studies from shipped work and guides' : 'Guides and short notes'} on AI
                engineering and the web: what worked, what broke, and the code that fixed it.
              </p>
            </header>

            {!filtered && posts[0] && <Featured post={posts[0]} />}

            <section id="posts" aria-labelledby="posts-title" className={filtered ? 'mt-14 lg:mt-16' : 'mt-20 lg:mt-24'}>
              <div className="flex items-baseline justify-between border-b border-hairline pb-4">
                <h2 id="posts-title" className="text-eyebrow text-heading uppercase">
                  {label}
                </h2>
                <span className="text-eyebrow text-muted tabular-nums">
                  {String(shown.length).padStart(2, '0')}
                </span>
              </div>

              {tagsOf(ofType).length > 0 && (
                <ul aria-label="Topics" className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
                  {[null, ...tagsOf(ofType)].map((t) => {
                    const on = t === tag
                    return (
                      <li key={t ?? 'all'} className="shrink-0">
                        <Link
                          to={filterTo(type, t)}
                          replace
                          aria-current={on ? 'true' : undefined}
                          className={`press inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium transition-colors ${
                            on ? 'bg-ink text-white' : 'bg-white text-heading ring-1 ring-hairline hover:ring-heading/25'
                          }`}
                        >
                          {t ?? 'All topics'}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}

              {shown.length > 0 ? (
                <ul className="mt-4">
                  {shown.map((post) => (
                    <li key={post.slug} className="border-b border-hairline">
                      <Row post={post} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-10 text-lead text-muted">
                  No {label.toLowerCase()} {tag ? <>tagged &ldquo;{tag}&rdquo; </> : null}yet.
                </p>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

/** "Data Science · 25 Oct 2026", the eyebrow every post carries; a case study reads "Case study". */
export function Kicker({ post, className = '' }: { post: PostMeta; className?: string }) {
  const kind = kindOf(post)
  return (
    <p className={`text-eyebrow flex flex-wrap items-center gap-x-2.5 uppercase ${className}`}>
      {kind && <span className="text-brand">{kind}</span>}
      {kind && <span aria-hidden className="size-1 rounded-full bg-heading/25" />}
      <time dateTime={post.date} className="text-muted">
        {formatDate(post.date)}
      </time>
    </p>
  )
}

/** The arrow chip that moves on hover. */
function Arrow() {
  return (
    <span
      aria-hidden
      className="grid size-7 shrink-0 place-items-center rounded-full bg-heading text-white transition-[translate,background-color] duration-300 group-hover:translate-x-1 group-hover:bg-brand"
    >
      &rarr;
    </span>
  )
}

/** The newest post: cover and copy side by side from lg, stacked below. The
 *  whole card is one link, so the target is the full card. */
function Featured({ post }: { post: PostMeta }) {
  return (
    <article data-reveal className="mt-14 [--reveal-delay:180ms] lg:mt-16">
      <Link
        to={`/${post.slug}`}
        className="group press grid overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_70px_-45px_rgb(20_19_18/0.5)] ring-1 ring-hairline [--press:0.99] hover:ring-heading/15 lg:grid-cols-[1.15fr_1fr]"
      >
        <PostCover {...coverOf(post)} className="aspect-[16/10] lg:aspect-auto lg:min-h-[26rem]" />
        <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
          <p className="text-eyebrow text-muted uppercase">Latest</p>
          <Kicker post={post} className="mt-3" />
          <h2 className="type-hero mt-5 text-h2 leading-[1.06] text-balance text-heading">{tie(post.title)}</h2>
          <p className="mt-4 text-body text-muted">{post.description}</p>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6">
            <span className="text-sm text-muted">{post.minutes} min read</span>
            <span className="inline-flex items-center gap-2 text-[0.75rem] font-bold tracking-[0.14em] text-heading uppercase">
              {post.type === 'case-study' ? 'Read the case study' : 'Read the post'}
              <Arrow />
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}

/** One post in the list: date, then kind, title and summary, then reading time. */
function Row({ post }: { post: PostMeta }) {
  const kind = kindOf(post)
  return (
    <Link
      to={`/${post.slug}`}
      className="group press grid gap-x-10 gap-y-2 py-7 [--press:0.99] sm:grid-cols-[7.5rem_minmax(0,1fr)_auto] sm:items-baseline lg:py-8"
    >
      <time dateTime={post.date} className="text-sm text-muted tabular-nums">
        {formatDate(post.date)}
      </time>
      <div className="min-w-0">
        {kind && <p className="text-eyebrow text-brand uppercase">{kind}</p>}
        <h3 className="type-hero mt-2 text-h3 leading-snug text-balance text-heading transition-colors group-hover:text-brand">
          {tie(post.title)}
        </h3>
        <p className="mt-2 line-clamp-2 max-w-[62ch] text-body text-muted">{post.description}</p>
      </div>
      <span className="flex items-center gap-3 text-sm text-muted sm:self-center">
        {post.minutes} min read
        <Arrow />
      </span>
    </Link>
  )
}
