// lib/media-lifecycle.ts
//
// Tracks whether the page is "idle" (nobody watching) so components can
// tear down heavy iframes and reclaim memory.
//
// Idle = true when ANY of:
//   - Tab is hidden (user switched browser tabs)
//   - Window has been blurred for IDLE_TIMEOUT_MS (user switched to another app)
//
// This covers the two main scenarios where Vimeo/YouTube iframes silently
// accumulate hundreds of MB with nobody watching.

type IdleCallback = (idle: boolean) => void;

const IDLE_TIMEOUT_MS = 60_000; // 60s after window blur → idle

const listeners = new Set<IdleCallback>();
let initialized = false;
let currentlyIdle = false;
let blurTimer: ReturnType<typeof setTimeout> | null = null;

function notify(idle: boolean) {
  if (idle === currentlyIdle) return;
  currentlyIdle = idle;
  for (const cb of listeners) {
    cb(idle);
  }
}

function init() {
  if (initialized || typeof document === 'undefined') return;
  initialized = true;

  // Tab switch (covers switching between browser tabs)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Tab hidden → immediately idle
      if (blurTimer) {
        clearTimeout(blurTimer);
        blurTimer = null;
      }
      notify(true);
    } else {
      // Tab visible → active (if window is also focused)
      if (blurTimer) {
        clearTimeout(blurTimer);
        blurTimer = null;
      }
      notify(false);
    }
  });

  // Window focus/blur (covers switching to another app like VS Code)
  window.addEventListener('blur', () => {
    // Don't start timer if tab is already hidden
    if (document.hidden) return;
    if (blurTimer) clearTimeout(blurTimer);
    blurTimer = setTimeout(() => {
      blurTimer = null;
      notify(true);
    }, IDLE_TIMEOUT_MS);
  });

  window.addEventListener('focus', () => {
    if (blurTimer) {
      clearTimeout(blurTimer);
      blurTimer = null;
    }
    // Only reactivate if the tab is also visible
    if (!document.hidden) {
      notify(false);
    }
  });
}

/** Subscribe to idle state changes. Returns an unsubscribe function. */
export function onIdleChange(cb: IdleCallback): () => void {
  init();
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

/** Whether the page is currently idle. */
export function isPageIdle(): boolean {
  if (typeof document === 'undefined') return false;
  return currentlyIdle || document.hidden;
}

