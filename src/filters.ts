import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { PostMeta, PostType } from './content/types'

export type TypeFilter = 'all' | PostType

/** The nav's topics; `id` is the `?type=` value. */
export const TYPES: { id: TypeFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'article', label: 'Articles' },
  { id: 'case-study', label: 'Case studies' },
]

let hydrated = false

/** `?type=` and `?tag=`. Ignored until the first render has hydrated: the prerendered index is
 *  the unfiltered page, and the browser's first render must match it. Later mounts read it at once. */
export function useFilters() {
  const [params] = useSearchParams()
  const [ready, setReady] = useState(hydrated)
  useEffect(() => {
    hydrated = true
    setReady(true)
  }, [])
  const raw = ready ? params.get('type') : null
  const type = TYPES.find((t) => t.id === raw)?.id ?? 'all'
  return { type, tag: ready ? params.get('tag') : null }
}

/** The index URL for a filter. */
export function filterTo(type: TypeFilter, tag?: string | null) {
  const q = new URLSearchParams()
  if (type !== 'all') q.set('type', type)
  if (tag) q.set('tag', tag)
  const s = q.toString()
  return s ? `/?${s}` : '/'
}

/** "25 Oct 2026". en-GB to match the site's British spelling; UTC so a post
 *  dated the 25th never renders as the 24th west of Greenwich. */
export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })

/** Ties a short word (a, an, and, of…) to the next one with a no-break space, so
 *  `text-balance` can never end a title's line on "A". */
export const tie = (title: string) =>
  title.replace(/ (a|an|the|and|or|of|to|in|on|for|&) /gi, (_, word: string) => ` ${word} `)

/** What a post is, in one word or two: "Case study", or an article's first tag. */
export const kindOf = (post: PostMeta) => (post.type === 'case-study' ? 'Case study' : post.tags[0])
