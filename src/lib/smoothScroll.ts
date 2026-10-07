import type Lenis from "lenis";

/**
 * Smooth (inertia) wheel scrolling with Lenis, tuned for performance:
 * - Only on devices with a precise pointer (mouse/trackpad). Phones and tablets keep native
 *   touch scrolling, which is already smooth, so most visitors download and run nothing.
 * - Lenis is loaded on demand (separate chunk) after the page is idle, never in the first paint.
 * - The animation loop runs only while a scroll is in progress, instead of 60 times a second
 *   for as long as the tab is open.
 * - Users who ask for reduced motion get native scrolling.
 */
let instance: Lenis | null = null;

export const getLenis = () => instance;

/** Jump to the top instantly (route changes), keeping Lenis' internal position in sync. */
export function scrollToTopInstant() {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  instance?.scrollTo(0, { immediate: true, force: true });
}

const supportsSmoothScroll = () =>
  window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Scroll containers inside overlays must scroll natively (dialogs, drawers, menus, chat).
const NATIVE_SCROLL_AREAS =
  '[role="dialog"], [role="alertdialog"], [role="listbox"], [role="menu"], [data-radix-scroll-area-viewport]';

// Frames to keep the loop alive after movement stops (lets the easing settle).
const IDLE_FRAMES_BEFORE_SLEEP = 12;

export async function initSmoothScroll(): Promise<() => void> {
  if (instance || !supportsSmoothScroll()) return () => {};

  const { default: LenisCtor } = await import("lenis");
  const lenis = new LenisCtor({
    autoRaf: false,
    prevent: (node) => node.matches?.(NATIVE_SCROLL_AREAS) ?? false,
  });
  instance = lenis;

  let rafId = 0;
  let idleFrames = 0;
  const loop = (time: number) => {
    lenis.raf(time);
    idleFrames = lenis.isScrolling ? 0 : idleFrames + 1;
    rafId = idleFrames > IDLE_FRAMES_BEFORE_SLEEP ? 0 : requestAnimationFrame(loop);
  };
  const wake = () => {
    idleFrames = 0;
    if (rafId) return;
    lenis.time = 0; // first frame after sleeping advances by 0ms instead of jumping
    rafId = requestAnimationFrame(loop);
  };

  const wakeEvents = ["wheel", "keydown", "scroll"] as const;
  wakeEvents.forEach((type) => window.addEventListener(type, wake, { passive: true }));

  // Pause while a modal/drawer locks page scrolling (Radix marks <body data-scroll-locked>).
  const syncLock = () => (document.body.hasAttribute("data-scroll-locked") ? lenis.stop() : lenis.start());
  const lockObserver = new MutationObserver(syncLock);
  lockObserver.observe(document.body, { attributes: true, attributeFilter: ["data-scroll-locked"] });
  syncLock();

  return () => {
    wakeEvents.forEach((type) => window.removeEventListener(type, wake));
    lockObserver.disconnect();
    if (rafId) cancelAnimationFrame(rafId);
    lenis.destroy();
    instance = null;
  };
}
