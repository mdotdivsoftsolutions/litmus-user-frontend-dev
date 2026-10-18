import { useEffect, useState } from "react";

/**
 * Keeps a closed panel (drawer, chat window) out of the DOM until it is first opened, then keeps
 * it mounted so the close transition still plays.
 *
 * `shown` turns on one frame after mounting, so the panel's CSS enter transition runs from its
 * closed state instead of appearing already open.
 */
export function useDeferredMount(open: boolean) {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(open);
  if (open && !mounted) setMounted(true);

  useEffect(() => {
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setShown(open));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [open]);

  return { mounted, shown: open && shown };
}
