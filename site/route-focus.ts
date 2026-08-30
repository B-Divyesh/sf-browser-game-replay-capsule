/**
 * These are real static documents, so route changes are full navigations.
 * Put keyboard and screen-reader users at the new page's sole heading after
 * an in-site document navigation without changing the browser's scroll
 * position. A direct first visit retains the expected skip-link tab order.
 */
// Azure Static Web Apps normalizes a configured `/demo` rewrite before it
// reaches the static `/demo/index.html` redirect document. Correct that final
// address-bar edge in the already external, CSP-safe route module.
if (window.location.pathname === '/demo/') window.location.replace('/demo')

const focusRouteHeading = () => {
  const heading = document.querySelector<HTMLElement>('main h1[tabindex="-1"]')
  heading?.focus({ preventScroll: true })
}

const arrivedFromThisSite = (() => {
  if (!document.referrer) return false
  try { return new URL(document.referrer).origin === window.location.origin } catch { return false }
})()

const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
const returnedThroughHistory = navigation?.type === 'back_forward'

if (arrivedFromThisSite || returnedThroughHistory) window.addEventListener('DOMContentLoaded', focusRouteHeading)

let pageWasShown = false
window.addEventListener('pageshow', () => {
  if (pageWasShown) {
    // Browsers restore the old active element during back/forward traversal.
    // Move focus after that restoration, while keeping the visual scroll.
    window.requestAnimationFrame(() => window.setTimeout(focusRouteHeading, 0))
  }
  pageWasShown = true
})
