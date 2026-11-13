# Ahmed Islam — Blog

Articles and case studies, live at **https://blog.ahmedislam.tech**.
The portfolio is a separate repo and site, at https://ahmedislam.tech.

```
npm install
npm run dev        # http://localhost:5173 (shows drafts)
npm run build      # type-check → build → one HTML page per post → prerender
npx vite preview   # serve dist/ the way GitHub Pages will
```

Every push to `main` builds and deploys through `.github/workflows/deploy.yml`.

## Write a post

1. Create `src/content/posts/<slug>.md`. The filename is the URL:
   `rag-evals.md` is published at `blog.ahmedislam.tech/rag-evals`.
   Use `a-z`, `0-9` and `-` only.
2. Start it with frontmatter. Flat `key: value` lines only (it is not YAML):

   ```
   ---
   title: Missing Values and Outliers: A Practical Guide
   description: One sentence. It is the share-card text and the index blurb.
   date: 2026-10-25
   tags: [Data Science, pandas]
   draft: true
   ---
   ```

3. Write Markdown. Fenced code is highlighted at build time. Fence program
   output as ` ```output ` and it renders as a labelled printout.
   `![alt](/blog-images/<slug>/x.svg "caption")` becomes a figure with a caption;
   put the image in `public/blog-images/<slug>/`. `##` and `###` headings fill
   the "Contents" box automatically.
4. Remove `draft: true` (or set it to `false`) and push.

## Write a case study

Same as a post, with two more lines in the frontmatter:

```
type: case-study
project: https://github.com/Ahmed-Islam-AI/some-repo
```

- `type: case-study` files it under **Case studies** on the index, labels its
  cover and kicker "Case study", and numbers it separately from articles.
- `project:` is optional, and works on articles too. It adds a
  "View the project" button under the author line. It must be a full `https://` URL.

Anything without `type:` is an article. A group on the index only appears once
it has a post that is not the featured one (the newest post is always featured).

## Rules worth knowing

- **Read STYLE.md before touching anything visual.** It is the portfolio's design
  contract, copied here because both sites share it; "The blog (reading surfaces)"
  is the part written for this site. HISTORY.md holds the reasons behind the design.
- **Never name a `public/` folder like a post slug.** GitHub Pages serves a
  folder before an `.html` file, so a folder called `rag-evals/` would break the
  post `rag-evals`. That is why images live in `blog-images/`. The build refuses
  slugs that collide with the folders it owns.
- **The post body is HTML built from these Markdown files**, inserted with
  `dangerouslySetInnerHTML`. That is safe only because the Markdown is ours.
  Never feed it anything a visitor typed.
- If you edit a code block, re-run it and update its ` ```output ` block. Every
  number in a post should be real output.
- `src/site.ts` holds the two addresses (`BLOG`, `MAIN`) and the index page's
  title. To move to another subdomain, change `BLOG` there and the URLs in
  `index.html` and `public/robots.txt`, then update the custom domain in
  Settings → Pages and the DNS record.
- The nav, footer and `src/index.css` are copies of the portfolio's. If the
  portfolio's design tokens or social links change, copy the change here.
- Analytics is the portfolio's GA4 property (`src/analytics.ts`). It only runs on
  the live host. The consent banner and the privacy policy link go to the portfolio.

## Hosting

GitHub Pages, deployed by GitHub Actions. The custom domain is set in this repo's
**Settings → Pages**, not in a `CNAME` file: an Actions deploy ignores that file.
DNS is a `CNAME` record `blog` → `ahmed-islam-ai.github.io` on Cloudflare, set to
**DNS only (grey cloud)**, because GitHub issues the HTTPS certificate itself.
