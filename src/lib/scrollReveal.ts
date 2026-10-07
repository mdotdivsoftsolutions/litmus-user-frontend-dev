/**
 * Scroll-reveal animations for elements marked `data-aos="fade-up|fade-left|fade-right|zoom-in"`
 * (with optional `data-aos-delay`). A lightweight replacement for the AOS library:
 * - One shared IntersectionObserver instead of scroll/resize listeners.
 * - Animates only opacity/transform (GPU-composited, no layout work); styles in globals.css.
 * - Each element animates once and is then no longer watched.
 * - Content already on screen when the page loads is never hidden, so the first paint/LCP and
 *   search engines always see it. Without JS, or with reduced motion, nothing is hidden at all.
 * - State lives in data attributes (not classes), so React re-renders can't reset it.
 */
const SELECTOR = "[data-aos]";
const READY_CLASS = "reveal-ready";
const DURATION_MS = 700;
// Start the animation once the element is 100px inside the viewport (same as the old AOS offset).
const ROOT_MARGIN = "0px 0px -100px 0px";

export function initScrollReveal(): () => void {
  if (!("IntersectionObserver" in window)) return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  const root = document.documentElement;
  const seen = new WeakSet<Element>();
  const timers = new Set<number>();

  const finish = (el: HTMLElement) => {
    el.setAttribute("data-aos-shown", "");
    const delay = Number(el.dataset.aosDelay) || 0;
    // After the entrance, drop our transition so the element's own hover transitions apply again.
    const timer = window.setTimeout(() => {
      el.setAttribute("data-aos-done", "");
      timers.delete(timer);
    }, DURATION_MS + delay + 50);
    timers.add(timer);
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        io.unobserve(entry.target);
        finish(entry.target as HTMLElement);
      }
    },
    { rootMargin: ROOT_MARGIN }
  );

  const watch = (el: HTMLElement) => {
    if (seen.has(el)) return;
    seen.add(el);
    const delay = Number(el.dataset.aosDelay);
    if (delay) el.style.setProperty("--aos-delay", `${delay}ms`);
    io.observe(el);
  };

  // Initial pass: read every position first, then write, so the browser lays out only once.
  const initial = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
  const viewportBottom = window.innerHeight;
  // Elements with no box are not on screen: they may still sit in a hidden streaming placeholder
  // (Next.js Suspense) or a hidden breakpoint section. Watch those instead of showing them.
  const onScreen = initial.map((el) => {
    const rect = el.getBoundingClientRect();
    return (rect.width > 0 || rect.height > 0) && rect.top < viewportBottom && rect.bottom > 0;
  });
  initial.forEach((el, i) => {
    if (onScreen[i]) {
      seen.add(el);
      el.setAttribute("data-aos-shown", "");
      el.setAttribute("data-aos-done", "");
    } else {
      watch(el);
    }
  });
  root.classList.add(READY_CLASS);

  // Sections rendered later (client navigation, data loaded after mount) are picked up too.
  let pending: HTMLElement[] = [];
  let frame = 0;
  const mutations = new MutationObserver((records) => {
    for (const record of records) {
      record.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        if (node.matches(SELECTOR)) pending.push(node);
        node.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => pending.push(el));
      });
    }
    if (pending.length && !frame) {
      frame = requestAnimationFrame(() => {
        frame = 0;
        pending.forEach(watch);
        pending = [];
      });
    }
  });
  mutations.observe(document.body, { childList: true, subtree: true });

  return () => {
    mutations.disconnect();
    io.disconnect();
    if (frame) cancelAnimationFrame(frame);
    timers.forEach((t) => clearTimeout(t));
    root.classList.remove(READY_CLASS);
  };
}
