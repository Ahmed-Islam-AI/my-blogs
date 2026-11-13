import { useEffect } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { BackPill } from './BlogPostPage'
import { EMAIL, PRIVACY } from '../site'

const external = { target: '_blank', rel: 'noopener noreferrer' } as const

/** `/privacy`. DRAFT, not legal advice; update it whenever analytics.ts changes or a form appears.
 *  "Up to 14 months" assumes the GA4 property's retention is set to 14 months. */
export default function PrivacyPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
    const previous = document.title
    document.title = PRIVACY.title
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <>
      <Nav />
      <main id="top" className="min-h-screen bg-paper">
        <div className="pt-nav px-4 pb-28 sm:px-6 lg:px-20 lg:pb-36">
          <div className="mx-auto max-w-6xl">
            {/* Same as a post: no back pill on a phone. */}
            <nav aria-label="Back" className="pt-8 max-sm:hidden lg:pt-10">
              <BackPill href="/">All posts</BackPill>
            </nav>

            <header className="mt-8 sm:mt-12 lg:mt-16">
              <h1 data-reveal className="type-hero text-display leading-[0.92] uppercase">
                <span className="block text-heading">Privacy</span>{' '}
                <span className="block text-heading/50">
                  policy<span className="text-brand">.</span>
                </span>
              </h1>
              <p data-reveal className="text-lead mt-8 max-w-[52ch] text-muted [--reveal-delay:120ms]">
                This policy explains what information blog.ahmedislam.tech collects, how it is used, and
                the choices available to you.
              </p>
              <p data-reveal className="text-eyebrow mt-6 text-muted uppercase [--reveal-delay:160ms]">
                Last updated 13 November 2026
              </p>
            </header>

            <div data-reveal className="prose mt-14 max-w-[44rem] lg:mt-20 [--reveal-delay:200ms]">
              <h2>About this site</h2>
              <p>
                blog.ahmedislam.tech is the blog of Ahmed Islam, a Full-Stack AI Engineer based in
                Islamabad, Pakistan. It publishes articles and case studies. Ahmed Islam is responsible
                for the information collected through this site.
              </p>

              <h2>Information collected</h2>
              <p>
                <strong>Analytics data.</strong> Where consent is given or not required, the site uses
                Google Analytics 4 to collect information about your visit: the pages you read, how you
                reached the site (for example, a search engine or a link from another website), your
                approximate location (country and city), and your device and browser type. Google
                Analytics uses cookies to distinguish returning readers from new ones.
              </p>
              <p>
                <strong>Email.</strong> The site has no forms and no comments. If you write to{' '}
                {EMAIL}, your message and email address are received like any other email.
              </p>

              <h2>How information is used</h2>
              <p>
                Analytics data is used solely to understand which posts are useful and how readers find
                them, so that the writing can be improved. Email is used only to reply to you. No
                information is used for advertising, and no information is sold or rented to third
                parties.
              </p>

              <h2>Cookies and your choices</h2>
              <p>
                Visitors from the European Economic Area, the United Kingdom and Switzerland are asked for
                consent before any analytics cookies are set. Until consent is given, or if it is
                declined, Google receives only anonymous, cookieless signals that cannot identify you.
              </p>
              <p>
                Visitors from every region can review or withdraw their choice at any time through the
                &ldquo;Cookie settings&rdquo; link at the bottom of each page. You can also block cookies
                in your browser settings, or install Google&rsquo;s{' '}
                <a href="https://tools.google.com/dlpage/gaoptout" {...external}>
                  opt-out browser add-on
                </a>
                .
              </p>

              <h2>Third-party services</h2>
              <ul>
                <li>
                  <strong>Google Analytics</strong>, provided by Google LLC, processes analytics data under
                  the{' '}
                  <a href="https://policies.google.com/privacy" {...external}>
                    Google Privacy Policy
                  </a>
                  . Google also explains{' '}
                  <a href="https://policies.google.com/technologies/partner-sites" {...external}>
                    how it uses information from sites that use its services
                  </a>
                  .
                </li>
                <li>
                  <strong>GitHub Pages</strong> (
                  <a href="https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages#data-collection" {...external}>
                    about its data collection
                  </a>
                  ) hosts the site and may log visitors&rsquo; IP addresses for security.
                </li>
                <li>
                  <strong>Cloudflare</strong> (
                  <a href="https://www.cloudflare.com" {...external}>
                    cloudflare.com
                  </a>
                  ) forwards email sent to {EMAIL} to my mailbox.
                </li>
                <li>
                  <strong>Brevo</strong> (
                  <a href="https://www.brevo.com" {...external}>
                    brevo.com
                  </a>
                  ) delivers my email replies.
                </li>
              </ul>

              <h2>Data retention</h2>
              <p>
                Analytics data is retained in Google Analytics for up to 14 months. Email is kept for as
                long as is needed to reply.
              </p>

              <h2>Your rights</h2>
              <p>
                Depending on where you live, you may have the right to access, correct or delete the
                personal information held about you, or to object to its processing. To make a request,
                use the contact details below.
              </p>

              <h2>Changes to this policy</h2>
              <p>
                This policy may be updated from time to time. The date at the top of this page shows when
                it was last revised.
              </p>

              <h2>Contact</h2>
              <p>
                Questions about this policy or about your information can be sent to{' '}
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
