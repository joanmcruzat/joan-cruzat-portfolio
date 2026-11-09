/** True when the browser can observe visibility and the visitor accepts motion. */
export function canAnimateOnScroll(): boolean {
  return typeof IntersectionObserver !== 'undefined'
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Calls `onEnter` the first time `element` scrolls into view, then stops observing.
 * Browser-only: call it from afterNextRender. Returns a cleanup function.
 */
export function observeOnce(element: Element, onEnter: () => void, threshold = 0.15): () => void {
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      observer.disconnect();
      onEnter();
    }
  }, { threshold });
  observer.observe(element);
  return () => observer.disconnect();
}
