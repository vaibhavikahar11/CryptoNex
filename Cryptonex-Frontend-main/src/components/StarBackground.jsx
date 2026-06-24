import { useEffect, useMemo } from "react";

/**
 * StarBackground — Parallax Pixel Stars for global use across all pages.
 *
 * 3 layers of white dot stars scrolling upward at different speeds,
 * producing a deep-space parallax effect over the dark horizon gradient.
 *
 * Technique: random box-shadow values generated in JS (mirrors the Sass
 * multiple-box-shadow() function). A dynamic <style> tag is injected so
 * that ::after pseudo-elements carry the same shadows — enabling the
 * seamless infinite scroll loop.
 */

function multipleBoxShadow(n, color = "#FFF") {
  const entries = [];
  for (let i = 0; i < n; i++) {
    const x = Math.floor(Math.random() * 2000);
    const y = Math.floor(Math.random() * 2000);
    entries.push(`${x}px ${y}px ${color}`);
  }
  return entries.join(", ");
}

export default function StarBackground() {
  // 700 small (1px) | 200 medium (2px) | 100 large (3px, faint blue tint)
  const shadowsSmall  = useMemo(() => multipleBoxShadow(700, "#FFF"), []);
  const shadowsMedium = useMemo(() => multipleBoxShadow(200, "#FFF"), []);
  const shadowsBig    = useMemo(() => multipleBoxShadow(100, "#d0e8ff"), []);

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
