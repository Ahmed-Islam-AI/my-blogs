import { Routes, Route } from 'react-router-dom'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import ConsentBanner from './components/ConsentBanner'
import { useReveal } from './hooks/useReveal'

export default function App() {
  // Re-runs on route change, so `[data-reveal]` works on every page.
  useReveal()

  return (
    <>
      <Routes>
        <Route path="/" element={<BlogPage />} />
        <Route path="/:slug" element={<BlogPostPage />} />
      </Routes>
      {/* Every route: opens after mount for visitors in Europe (analytics.ts). */}
      <ConsentBanner />
    </>
  )
}
