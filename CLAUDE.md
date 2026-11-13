# Ahmed Islam — Blog

Articles and case studies at blog.ahmedislam.tech. It moved out of the portfolio repo
(`Ahmed-Islam-Portfolio`) on 2026-11-13 and is **fully separate**: neither site links to the
other. Don't add a link either way (HISTORY.md).

- **README.md** has the rules and how to write a post or case study. Read it first.
- **STYLE.md** is the design contract shared with the portfolio. Read it before touching
  anything visual; "The blog (reading surfaces)" is the part written for this site.
- **HISTORY.md** holds the reason behind each design decision. Read the entry before undoing one.
- Never invent a number, client or metric in a post. Every output block is real output.
- Never read `?type=`/`?tag=` (or anything from `window`) during the first render: use
  `useFilters`, which waits for hydration. Index rows and chips carry no `data-reveal`.
- The nav is the portfolio's floating pill, deliberately identical (HISTORY.md). Keep its
  shell in step with the portfolio's `Nav.tsx`; only the contents differ.
- `/privacy` must describe what the site actually collects. Change it with any change to
  `src/analytics.ts`, and if a form is ever added.
- Verify visual changes on the production build (`npm run build && npx vite preview`) at
  ~1440 and 390 wide: no horizontal overflow, no console errors, no node under `#root`
  replaced on load.
- Commits are plain messages, with no Co-Authored-By lines.
