import type Lenis from "lenis";

declare global {
  interface Window {
    /** Smooth-scroll instance created in app/providers.tsx (client only). */
    __lenis?: Lenis;
  }
}

export {};
