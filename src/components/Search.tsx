import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { posts } from 'virtual:blog'
import { formatDate, kindOf } from '../filters'

/** Finds posts by title, summary, tag or type. A native <dialog>: Escape, the focus trap and
 *  the backdrop come with it. Every word typed must match somewhere in the post. */
export default function Search({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const d = dialog.current
    if (open && !d?.open) d?.showModal()
    if (!open && d?.open) d.close()
  }, [open])

  const searching = query.trim() !== ''
  const results = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean)
    if (words.length === 0) return posts.slice(0, 5)
    return posts
      .filter((p) => {
        const text = [p.title, p.description, ...p.tags, p.type.replace('-', ' ')].join(' ').toLowerCase()
        return words.every((w) => text.includes(w))
      })
      .slice(0, 8)
  }, [query])

  return (
    <dialog
      ref={dialog}
      aria-label="Search posts"
      onClose={() => {
        setQuery('')
        onClose()
      }}
      // a click on the backdrop lands on the dialog itself; the panel inside fills it
      onClick={(e) => e.target === dialog.current && dialog.current.close()}
      className="m-auto mt-[12vh] w-[min(40rem,calc(100vw-2rem))] overflow-hidden rounded-[1.75rem] bg-paper p-0 text-heading shadow-[0_40px_80px_-40px_rgb(20_19_18/0.7)] ring-1 ring-hairline backdrop:bg-ink/60 backdrop:backdrop-blur-sm"
    >
      <div>
        <label className="flex items-center gap-3 border-b border-hairline px-5 py-4">
          <SearchIcon className="size-5 shrink-0 text-muted" />
          <span className="sr-only">Search posts</span>
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && results[0]) {
                dialog.current?.close()
                navigate(`/${results[0].slug}`)
              }
            }}
            placeholder="Search articles and case studies"
            // the browser's own clear button is blue, and Esc already does its job
            className="min-w-0 flex-1 bg-transparent text-lead text-heading outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:hidden"
          />
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            className="press rounded-full px-3 py-1.5 text-[0.6875rem] font-semibold tracking-[0.14em] text-muted uppercase ring-1 ring-hairline hover:text-heading"
          >
            Esc
          </button>
        </label>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          <p className="text-eyebrow px-4 pt-3 pb-2 text-muted uppercase">
            {searching ? `${results.length} ${results.length === 1 ? 'result' : 'results'}` : 'Latest'}
          </p>
          {results.length === 0 ? (
            <p className="px-4 pb-6 text-body text-muted">Nothing matches &ldquo;{query.trim()}&rdquo;.</p>
          ) : (
            <ul>
              {results.map((post) => (
                <li key={post.slug}>
                  <Link
                    to={`/${post.slug}`}
                    onClick={() => dialog.current?.close()}
                    className="group block rounded-2xl px-4 py-3 transition-colors hover:bg-white focus-visible:bg-white"
                  >
                    <span className="text-eyebrow flex flex-wrap gap-x-2.5 uppercase">
                      {kindOf(post) && <span className="text-brand">{kindOf(post)}</span>}
                      <time dateTime={post.date} className="text-muted">
                        {formatDate(post.date)}
                      </time>
                    </span>
                    <span className="type-hero mt-1 block text-lg leading-snug text-heading transition-colors group-hover:text-brand">
                      {post.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </dialog>
  )
}

export function SearchIcon({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  )
}
