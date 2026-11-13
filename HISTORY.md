# History

Why the blog looks and works the way it does. Rules are in README.md; this is the reasoning.

These notes were written while the blog lived inside the portfolio at
`ahmedislam.tech/blog` (repo `Ahmed-Islam-Portfolio`), until 2026-11-13. Read the old
paths as the new ones: `src/content/blog/` is `src/content/posts/`, `/blog/:slug` is
`/:slug`, `blog/<slug>.html` is `<slug>.html`, and the page writer is the `blog-pages`
plugin in `blog.vite.ts`. "This site" in the text means the portfolio and the blog together.

## Moved to its own site (2026-11-13)

On Ahmed's instruction the blog moved to this repo, served at **blog.ahmedislam.tech**,
and gained a second kind of post, the case study:

- **`type: case-study`** in the frontmatter. The index files it under **Case studies**,
  above **Articles**; its kicker and cover read "Case study"; its issue number counts
  within its own type, so the first case study is No. 01 even after ten articles. A group
  heading only appears once it has a post besides the featured one, and the index lead
  only mentions case studies once one exists: the page never promises work it can't show.
- **`project:`** is an optional URL that adds a "View the project" button under the
  byline. It works on articles too.
- Posts live at the root (`/<slug>`). Because a folder in `public/` beats an `.html` file
  on GitHub Pages, the build refuses a slug that names a folder it owns.
- **The nav and footer point back to the portfolio.** The nav keeps the portfolio's links
  (as absolute URLs) so both sites read as one; its Blog pill is always lit. The footer's
  columns are Portfolio, Recent writing (the newest five posts, derived) and Elsewhere.
  The portfolio's privacy policy covers this site, so the consent banner and footer link there.
- `index.css` is a copy of the portfolio's, whole: the post pages lean on its tokens,
  `type-hero`, `press`, the reveal rules and `hero-grid` (the covers), and trimming it by
  hand risked breaking something quietly for a few kB.
- Analytics is the portfolio's GA4 property, gated on this host. One report covers both
  sites; consent is per-site, since `localStorage` is per-origin.
- The old addresses forward here: the portfolio's build writes `blog/index.html` and
  `blog/<slug>.html` as instant meta-refresh pages with a canonical to the new URL.
- Why a subdomain at all: Ahmed's call. The trade-off he accepted is that search engines
  treat a subdomain largely as its own site, so posts no longer add weight to
  ahmedislam.tech itself.

## Blog

### How it works

**How it works** — `blog.vite.ts`, two plugins:

- Posts are Markdown files in `src/content/blog/`, compiled to virtual modules: `virtual:blog` (every post's metadata,
  newest first; small and eager) and
  `virtual:blog/<slug>` (HTML + contents, one lazy chunk each). `marked` and
  `highlight.js` are **devDependencies and never reach the browser**.
- The post body is set with `dangerouslySetInnerHTML` (in `Article`,
  `BlogPostPage.tsx`). That is safe only
  because it is our own Markdown from the repo; never feed it user input.
- At build, a `post`-phase plugin writes `dist/blog/index.html` and
  `dist/blog/<slug>.html`, copies of the shell with that page's own title,
  description, canonical and `og:*` tags, so a LinkedIn/X share previews the
  post (crawlers don't run JS) and Pages serves a 200. It must run after
  Vite's HTML plugin, so the page writer (`site-pages`) is `enforce: 'post'`;
  that is why `blog()` returns two plugins (the virtual modules resolve in the
  normal phase). In the normal phase `index.html` isn't in the bundle and the
  pages were silently not written (measured: `dist/` had no `blog/` at all). It
  now throws instead.
- **`blog/index.html`, not `blog.html`, and images in `blog-images/`** — the
  post pages make `dist/blog/` a directory, and a directory named like a route
  is the trap that broke `/projects`. `/blog` 301s to `/blog/` and serves.
- `withMeta` throws if `index.html` loses any tag it rewrites (title,
  description, canonical, og:title/description/url/type). Don't delete them.

### Code, output and figures in a post

Code is highlighted in `render`, at build time. The copy button is wired by one
delegated listener in `BlogPostPage.tsx` (`Article`), so there is no per-block
script. A ```` ```output ```` fence is what a program printed: it is labelled
"Output", never highlighted, and styled as a printout on paper
(`.code-block--output`) so a reader can tell what to run from what it returns.

`![alt](src "caption")` becomes a figure. Alt and caption are separate jobs: alt
describes the image to someone who can't see it, the caption tells everyone what
to take from it. So both are kept.

Syntax colours (`.hljs-*` in `index.css`) keep to one accent, like the rest of the
site: keywords carry the orange, strings a warm sand in the same family, and
comments recede. A rainbow theme would be fifteen accents on a site that allows
one.

### The first post

**The first post is DRAFT content written on Ahmed's instruction.** He asked
for a generic rewrite of his Stackademic article (written for Bytewise), which
could not be fetched (403), so it was written fresh. Every number in it is real
output: the code was run against seaborn's Titanic dataset (pandas 3.1,
scikit-learn 1.9) and both charts in `public/blog-images/` were rendered from
that data. If you edit a code block, re-run it and update its output block.

### Reading surface

**Reading surface rules** (STYLE.md has the visual ones): paper, not ink;
`.prose` in `index.css` styles the compiled HTML by element; post titles are
**mixed case** — a sentence to read, not a section heading.

`.prose` is written by hand, not @tailwindcss/typography: the plugin's defaults
are the generic blog look this site exists to avoid, and overriding them would be
more CSS than this. The post body is HTML compiled from Markdown, so it can't
take utility classes; `.prose` styles it by element instead. Measure is 68ch; body
is 1.125rem/1.75, a step up from `text-body`, because long reading wants a
slightly larger size and looser leading than a section lead. Text is `heading`,
not `muted`: muted is for secondary copy, and a whole article in it would read as
a caption. `/privacy` uses the same `.prose`.

### Redesigned 2026-10-25

**Redesigned 2026-10-25 (branch `design/blog-redesign`)** after Ahmed rejected
v1 ("not attractive", and the bare `← ALL POSTS` text link in particular). He
chose each of these from options:

- **Editorial, centred masthead** on the post (kicker, title, dek, byline with
  his portrait), a wide drawn cover, then the 44rem column. The masthead is the
  one centred block on the site, and only because a centred masthead is the
  editorial convention a reader recognises; the article body stays left-aligned,
  as STYLE.md asks of all running text. The index stays left-aligned like every
  other page; only the post masthead centres. The index is laid out like a
  newsroom: the newest post as a featured story (cover beside the copy from
  `lg`), everything older as a two-column grid of cover cards. Paper, not ink:
  this is reading, and the site's reading ground is light.
- **Automatic drawn covers** — `PostCover.tsx`. A dot field seeded from the
  slug (mulberry32, `seeded`), so each post's cover is unique and stable: ink,
  the hero's hairline grid and a dot field, a "data landscape". Faint dots are
  data, hollow ones gaps, orange ones signal. STYLE.md rules out stock and
  generated imagery, which is why every post gets a designed plate. A diagram, same licence as
  `ProjectMark`. It carries no category text on purpose: every cover sits next
  to a kicker that already prints it. Dot radii are sized for a phone, where
  the plate renders at ~0.25 scale, so anything under ~4 viewBox units
  disappears; signal dots get a soft halo so the orange reads as light, not as a
  printed dot. The SVG uses `preserveAspectRatio="xMidYMid slice"`, so one
  drawing serves the 21:9 post header, the 16:10 cards and a phone's 4:3: it
  crops, never stretches.
- **Back pill only**: `‹ All posts`, hidden on phones. It had a
  `Blog / Category / Title` trail beside it until 2026-11-12, when Ahmed had
  it removed (see Site layout › No breadcrumb trails) because it read as an
  AI-generated site. The pill is `max-sm:hidden`, same as the service pages.
- Contents (`Toc`): from `xl` a sticky list in the left margin on a hairline
  track, the current entry drawn as an orange segment, so position is shown by a
  shape on a line, not by colour alone; below `xl` a native `<details>` above the
  article, so keyboard, screen readers and the open state come free. "Current" is
  the last heading that has scrolled past a line a quarter of the way down the
  viewport. The IntersectionObserver is only the trigger (a heading crossed the
  line); which entry is current is read from geometry, so a fast scroll that
  skips a heading entirely still lands on the right entry.
- After the article: topics, share (copy link, LinkedIn, X — icons reused from
  `socials.ts`), an author card, previous/next, and the ink "Let's talk" panel.
- `tie()` in BlogPage.tsx joins short words (a, an, the, and, or, of, to, in,
  on, for, &) to the next word with a no-break space, so `text-balance` can't
  strand "A" at a line end: `text-balance` evens the lines, `tie` stops it
  choosing a break that strands an article.
- The reading column is `44rem`, not `68ch`: a wrapper's `ch` is measured at
  16px while `.prose` sets 68ch at 18px, so the two disagreed by ~80px.
  From `xl` the body is three tracks: contents | 44rem column | empty. The empty
  right track is what keeps the column on the page's centre line, under the
  masthead, instead of shoved right by the contents.
- A 2px reading-progress line along the top edge fills as you read
  (`ReadingProgress`, `.reading-progress`). It uses native
  `animation-timeline: scroll()`, so there is no scroll listener; where that
  isn't supported the line simply isn't drawn. It is kept under reduced motion:
  it moves only with your own scrolling, the kind of motion HIG says is fine.
