/** Shared by the build plugin (`blog.vite.ts`) and the pages that render posts. */

export type PostType = 'article' | 'case-study'

export interface PostMeta {
  slug: string
  /** `type: case-study` in the frontmatter; a post without it is an article */
  type: PostType
  title: string
  description: string
  /** ISO date, `YYYY-MM-DD` */
  date: string
  tags: string[]
  /** Reading time, from the word count with code blocks left out */
  minutes: number
  /** Optional `project:` URL, the live site or repo the post is about */
  project?: string
}

export interface TocEntry {
  id: string
  text: string
  depth: 2 | 3
}
