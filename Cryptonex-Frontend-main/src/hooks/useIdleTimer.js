// src/hooks/useIdleTimer.js
import { useEffect, useRef, useState } from "react";

/**
 * Fires `onIdle` after `timeoutMs` milliseconds of no user interaction.
 * Fires `onActive` when the user interacts again.
 */
export function useIdleTimer({ timeoutMs = 15 * 60 * 1000, onIdle, onActive }) {
  const timerRef = useRef(null);
  const [isIdle, setIsIdle] = useState(false);

  const reset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsIdle(true);
      onIdle?.();
    }, timeoutMs);
  };

  const handleActivity = () => {
    if (isIdle) {
      setIsIdle(false);
      onActive?.();
    }
    reset();
  };

  useEffect(() => {
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"];
    events.forEach((e) => window.addEventListener(e, handleActivity, { passive: true }));
    reset(); // start timer on mount
    return () => {
      events.forEach((e) => window.removeEventListener(e, handleActivity));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isIdle]); // re-bind when idle state changes

  return isIdle;
}
