import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { preloadPost } from './pages/BlogPostPage'
import { startAnalytics } from './analytics'
import './index.css'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Browser only: entry-server.tsx never imports this file.
startAnalytics()

/** Adopt the prerendered HTML when its `data-route` is this route; otherwise (dev, or an
 *  unknown URL served 404.html → the home HTML) render from scratch. */
const trim = (path: string) => path.replace(/(.)\/$/, '$1')
const prerendered = root.dataset.route

if (prerendered && trim(prerendered) === trim(location.pathname)) {
  // a post's body is its own chunk; load it first, or the first render would
  // be the loading skeleton and disagree with the article in the HTML
  const slug = /^\/([^/]+?)\/?$/.exec(location.pathname)?.[1]
  ;(slug ? preloadPost(slug) : Promise.resolve()).then(() => hydrateRoot(root, app))
} else {
  createRoot(root).render(app)
}
