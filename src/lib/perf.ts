/**
 * "Lite" mode: the same site with the heavy parts swapped for light ones (a still hologram image instead of the live
 * 3D one, no smooth-scroll engine, no blur behind the header, no pixel intro). It switches on for people who ask for
 * less motion, for weaker machines (4 cores or fewer, 4 GB memory or less, data saver, no WebGL 2), and on its own
 * when the page is clearly struggling (see markSlow). The <html> element gets the class "lite" so CSS can follow.
 */
let lite: boolean | null = null;
let forced = false; // ?full or ?lite in the address: no automatic switching
const listeners = new Set<() => void>();

function detect(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const q = new URLSearchParams(location.search);
    if (q.has("full")) { forced = true; return false; } // for testing: force the full version
    if (q.has("lite")) { forced = true; return true; }
  } catch {
    /* ignore */
  }
  const n = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return true;
  if ((n.hardwareConcurrency || 8) <= 4) return true;
  if (n.deviceMemory && n.deviceMemory <= 4) return true;
  if (n.connection?.saveData) return true;
  try {
    const c = document.createElement("canvas");
    if (!c.getContext("webgl2")) return true;
  } catch {
    return true;
  }
  return false;
}

export function isLite(): boolean {
  if (lite === null) {
    lite = detect();
    if (lite && typeof document !== "undefined") document.documentElement.classList.add("lite");
  }
  return lite;
}

/** Called when the live hologram can't keep a steady frame rate: everything heavy steps down for this visit. */
export function markSlow() {
  if (lite || forced) return;
  lite = true;
  document.documentElement.classList.add("lite");
  listeners.forEach((f) => f());
}

export function onLite(f: () => void) {
  listeners.add(f);
  return () => {
    listeners.delete(f);
  };
}
