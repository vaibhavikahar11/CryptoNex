import { useEffect, useMemo } from "react";

/**
 * StarBackground — Parallax Pixel Stars applied globally to all pages.
 * 3 layers of white star dots scroll upward at different speeds,
 * creating a deep-space parallax effect behind every page of the app.
 *
 * Uses dynamic <style> injection so ::after pseudo-elements can carry
 * the same box-shadow values as their parent divs (inline styles can't target ::after).
 */

function multipleBoxShadow(n) {
  const entries = [];
  for (let i = 0; i < n; i++) {
    const x = Math.floor(Math.random() * 2000);
    const y = Math.floor(Math.random() * 2000);
    entries.push(`${x}px ${y}px #FFF`);
  }
  return entries.join(", ");
}

export default function StarBackground() {
  const shadowsSmall  = useMemo(() => multipleBoxShadow(700), []);
  const shadowsMedium = useMemo(() => multipleBoxShadow(200), []);
  const shadowsBig    = useMemo(() => multipleBoxShadow(100), []);

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.id = "app-stars-dynamic";
    styleEl.textContent = `
      .app-stars-small  { box-shadow: ${shadowsSmall}; }
      .app-stars-small::after  { box-shadow: ${shadowsSmall}; }
      .app-stars-medium { box-shadow: ${shadowsMedium}; }
      .app-stars-medium::after { box-shadow: ${shadowsMedium}; }
      .app-stars-big    { box-shadow: ${shadowsBig}; }
      .app-stars-big::after    { box-shadow: ${shadowsBig}; }
    `;
    document.head.appendChild(styleEl);
    return () => {
      const el = document.getElementById("app-stars-dynamic");
      if (el) el.remove();
    };
  }, [shadowsSmall, shadowsMedium, shadowsBig]);

  return (
    <>
      <div className="app-stars-small" />
      <div className="app-stars-medium" />
      <div className="app-stars-big" />
    </>
  );
}
