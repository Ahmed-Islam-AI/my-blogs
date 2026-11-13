/** Renders one route to HTML at build time, for prerender.mjs to put in that page's root.
 *  Rendering must not read window/document outside effects */
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App'
import { preloadPost } from './pages/BlogPostPage'

export async function render(url: string) {
  const slug = /^\/([^/]+)$/.exec(url)?.[1]
  if (slug) await preloadPost(slug)
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )
}
