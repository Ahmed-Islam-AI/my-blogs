/** Compiles src/content/posts/*.md into `virtual:blog` (all metadata) and `virtual:blog/<slug>`
 *  (one lazy chunk per post), and writes each post's HTML page and the sitemap. */
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { Marked } from 'marked'
import hljs from 'highlight.js/lib/common'
import type { Plugin } from 'vite'
import type { PostMeta, TocEntry } from './src/content/types.ts'
import { BLOG, HOME, MAIN } from './src/site.ts'

const DIR = join(import.meta.dirname, 'src/content/posts')
const WORDS_PER_MINUTE = 220
/** Posts live at `/<slug>`, so a slug can't be a folder `public/` or the build already owns. */
const RESERVED = ['assets', 'fonts', 'blog-images', 'index', '404', 'sitemap', 'robots']

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/** Flat `key: value` frontmatter: title, description, date, `tags: [a, b]`, `type`, `project`, `draft`.
 *  ponytail: not YAML (no nesting, no multi-line values); use a YAML parser if a post needs either. */
function parseFrontmatter(src: string, file: string) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(src)
  if (!match) throw new Error(`${file}: missing --- frontmatter ---`)
  const data: Record<string, string> = {}
  for (const line of match[1].split(/\r?\n/)) {
    const kv = /^(\w+):\s*(.*)$/.exec(line.trim())
    if (kv) data[kv[1]] = kv[2].replace(/^["']|["']$/g, '')
  }
  for (const key of ['title', 'description', 'date']) {
    if (!data[key]) throw new Error(`${file}: frontmatter needs \`${key}\``)
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) throw new Error(`${file}: date must be YYYY-MM-DD`)
  if (data.type && data.type !== 'article' && data.type !== 'case-study')
    throw new Error(`${file}: type must be \`article\` or \`case-study\`, not \`${data.type}\``)
  if (data.project && !/^https?:\/\//.test(data.project))
    throw new Error(`${file}: project must be a full https:// URL`)
  const tags = (data.tags ?? '')
    .replace(/^\[|\]$/g, '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
  return { data, tags, body: src.slice(match[0].length) }
}

function render(body: string) {
  const toc: TocEntry[] = []
  const used = new Set<string>()

  const marked = new Marked({
    renderer: {
      heading({ tokens, depth }) {
        const html = this.parser.parseInline(tokens)
        let id = slugify(html)
        for (let n = 2; used.has(id); n++) id = `${slugify(html)}-${n}`
        used.add(id)
        if (depth === 2 || depth === 3) {
          toc.push({ id, text: html.replace(/<[^>]+>/g, ''), depth })
        }
        return `<h${depth} id="${id}">${html}</h${depth}>\n`
      },

      // Highlighted at build time; one delegated listener in BlogPostPage.tsx runs the copy buttons.
      // ```output is program output: labelled "Output", never highlighted, styled as a printout.
      code({ text, lang }) {
        const output = lang === 'output'
        const language = !output && lang && hljs.getLanguage(lang) ? lang : undefined
        const code = language ? hljs.highlight(text, { language }).value : escapeHtml(text)
        const label = output
          ? 'Output'
          : language
            ? (hljs.getLanguage(language)?.name ?? language)
            : 'Text'
        const kind = output ? 'code-block code-block--output' : 'code-block'
        return `<figure class="${kind}"><figcaption><span>${escapeHtml(label)}</span><button type="button" data-copy aria-label="Copy ${output ? 'output' : 'code'}">Copy</button></figcaption><pre><code class="hljs">${code}</code></pre></figure>\n`
      },

      // `![alt](src "caption")` becomes a figure. Alt and caption do different jobs; keep both.
      image({ href, title, text }) {
        const img = `<img src="${escapeHtml(href)}" alt="${escapeHtml(text)}" loading="lazy" decoding="async" />`
        return title
          ? `<figure class="figure">${img}<figcaption>${escapeHtml(title)}</figcaption></figure>`
          : img
      },

      link({ href, title, tokens }) {
        const external = /^https?:\/\//.test(href)
        const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : ''
        const t = title ? ` title="${escapeHtml(title)}"` : ''
        return `<a href="${escapeHtml(href)}"${t}${attrs}>${this.parser.parseInline(tokens)}</a>`
      },
    },
    hooks: {
      // Wide tables scroll inside their own box instead of widening the page.
      postprocess: (html) =>
        html.replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, '</table></div>'),
    },
  })

  const html = marked.parse(body, { async: false })
  const words = body.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length
  return { html, toc, minutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)) }
}

function loadPosts(includeDrafts: boolean) {
  return readdirSync(DIR)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const slug = file.replace(/\.md$/, '')
      if (RESERVED.includes(slug) || !/^[a-z0-9-]+$/.test(slug))
        throw new Error(`${file}: rename it; the filename is the URL, so use a-z, 0-9 and - only, and not ${RESERVED.join('/')}`)
      const src = readFileSync(join(DIR, file), 'utf8')
      const { data, tags, body } = parseFrontmatter(src, file)
      const { html, toc, minutes } = render(body)
      const meta: PostMeta = {
        slug,
        type: data.type === 'case-study' ? 'case-study' : 'article',
        title: data.title,
        description: data.description,
        date: data.date,
        tags,
        minutes,
        ...(data.project && { project: data.project }),
      }
      return { meta, html, toc, draft: data.draft === 'true' }
    })
    .filter((p) => includeDrafts || !p.draft)
    .sort((a, b) => b.meta.date.localeCompare(a.meta.date))
}

/** Swaps the shell's head tags for one page's; `jsonLd` adds a second structured-data block.
 *  Throws if index.html lacks a tag it rewrites, so a deleted tag fails the build, not the share card. */
function withMeta(
  shell: string,
  page: { title: string; description: string; path: string; type: string; jsonLd?: object },
) {
  const replacements: [RegExp, string][] = [
    [/<title>[^<]*<\/title>/, `<title>${escapeHtml(page.title)}</title>`],
    [/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${escapeHtml(page.description)}$2`],
    [/(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${escapeHtml(page.title)}$2`],
    [/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${escapeHtml(page.description)}$2`],
    [/(<meta\s+property="og:url"\s+content=")[^"]*(")/, `$1${BLOG}${page.path}$2`],
    [/(<meta\s+property="og:type"\s+content=")[^"]*(")/, `$1${page.type}$2`],
    [/(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1${BLOG}${page.path}$2`],
  ]
  const html = replacements.reduce((html, [re, value]) => {
    if (!re.test(html)) throw new Error(`blog: index.html is missing ${re}`)
    return html.replace(re, value)
  }, shell)
  if (!page.jsonLd) return html
  // `<` escaped so a title containing "</script>" can't close the block early
  const ld = JSON.stringify(page.jsonLd).replace(/</g, '\\u003c')
  return html.replace('</head>', `<script type="application/ld+json">${ld}</script>\n</head>`)
}

const xmlEscape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

/** Two plugins: the virtual modules resolve in the normal phase, the page writer runs `post`. */
export default function blog(): Plugin[] {
  const VIRTUAL = 'virtual:blog'
  let includeDrafts = true

  const modules: Plugin = {
    name: 'blog',

    configResolved(config) {
      includeDrafts = config.command === 'serve'
    },

    resolveId(id) {
      if (id === VIRTUAL || id.startsWith(`${VIRTUAL}/`)) return `\0${id}`
    },

    load(id) {
      if (!id.startsWith(`\0${VIRTUAL}`)) return
      const posts = loadPosts(includeDrafts)
      for (const file of readdirSync(DIR)) this.addWatchFile(join(DIR, file))

      if (id === `\0${VIRTUAL}`) {
        // One lazy import per post, written out literally so Rollup can split
        // each post into its own chunk.
        const loaders = posts
          .map((p) => `  ${JSON.stringify(p.meta.slug)}: () => import(${JSON.stringify(`${VIRTUAL}/${p.meta.slug}`)}),`)
          .join('\n')
        return `export const posts = ${JSON.stringify(posts.map((p) => p.meta))}\nexport const bodies = {\n${loaders}\n}\n`
      }

      const slug = id.slice(`\0${VIRTUAL}/`.length)
      const post = posts.find((p) => p.meta.slug === slug)
      if (!post) throw new Error(`blog: no post "${slug}"`)
      return `export const html = ${JSON.stringify(post.html)}\nexport const toc = ${JSON.stringify(post.toc)}\n`
    },

    // Editing a post reloads the page in dev; the virtual modules are rebuilt.
    handleHotUpdate({ file, server }) {
      if (!file.replace(/\\/g, '/').includes('/src/content/posts/')) return
      for (const mod of server.moduleGraph.idToModuleMap.values()) {
        if (mod.id?.startsWith(`\0${VIRTUAL}`)) server.moduleGraph.invalidateModule(mod)
      }
      server.ws.send({ type: 'full-reload' })
      return []
    },
  }

  /** Writes `<slug>.html` per post and the sitemap. A real page per post, because Pages then
   *  serves it with a 200 and a share card previews the post, not the index (crawlers don't run JS). */
  const pages: Plugin = {
    name: 'blog-pages',
    // After Vite's HTML plugin, or index.html isn't in the bundle yet
    enforce: 'post',
    // not in the SSR build prerender.mjs renders from: it has no index.html
    apply: (_, env) => env.command === 'build' && !env.isSsrBuild,

    generateBundle(_, bundle) {
      const shell = bundle['index.html']
      if (shell?.type !== 'asset') throw new Error('blog: index.html is not in the bundle yet')
      const html = String(shell.source)
      const posts = loadPosts(false)

      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source:
          '<?xml version="1.0" encoding="UTF-8"?>\n' +
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          [{ loc: '/', lastmod: posts[0]?.meta.date }, ...posts.map(({ meta }) => ({ loc: `/${meta.slug}`, lastmod: meta.date }))]
            .map(
              (u) =>
                `  <url><loc>${xmlEscape(BLOG + u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`,
            )
            .join('\n') +
          '\n</urlset>\n',
      })

      // The index's head comes from HOME too, so index.html's literal title is only what dev shows.
      shell.source = withMeta(html, { ...HOME, path: '/', type: 'website' })

      for (const { meta } of posts) {
        this.emitFile({
          type: 'asset',
          fileName: `${meta.slug}.html`,
          source: withMeta(html, {
            title: `${meta.title} — Ahmed Islam`,
            description: meta.description,
            path: `/${meta.slug}`,
            type: 'article',
            // Lets search engines show the post as an article (date, author). The author is
            // the Person block every page carries, the same @id the portfolio uses.
            jsonLd: {
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: meta.title,
              description: meta.description,
              datePublished: meta.date,
              dateModified: meta.date,
              keywords: meta.tags.join(', '),
              url: `${BLOG}/${meta.slug}`,
              mainEntityOfPage: `${BLOG}/${meta.slug}`,
              image: `${BLOG}/og.png`,
              author: { '@id': `${MAIN}/#person` },
              publisher: { '@id': `${MAIN}/#person` },
              isPartOf: { '@id': `${BLOG}/#blog` },
            },
          }),
        })
      }
    },
  }

  return [modules, pages]
}
