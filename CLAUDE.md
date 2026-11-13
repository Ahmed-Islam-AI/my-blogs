# Ahmed Islam — Blog

Articles and case studies at blog.ahmedislam.tech. The portfolio (ahmedislam.tech) is the
sibling repo `Ahmed-Islam-Portfolio`; this site moved out of it on 2026-11-13.

- **README.md** has the rules and how to write a post or case study. Read it first.
- **STYLE.md** is the design contract shared with the portfolio. Read it before touching
  anything visual; "The blog (reading surfaces)" is the part written for this site.
- **HISTORY.md** holds the reason behind each design decision. Read the entry before undoing one.
- Never invent a number, client or metric in a post. Every output block is real output.
- Verify visual changes on the production build (`npm run build && npx vite preview`) at
  ~1440 and 390 wide: no horizontal overflow, no console errors, no node under `#root`
  replaced on load.
- Commits are plain messages, with no Co-Authored-By lines.
