import { useEffect, useRef, useState, useMemo } from "react";

/**
 * Generates N random box-shadow entries — mirrors the Sass multiple-box-shadow() function.
 * Returns a string like "123px 456px #FFF , 789px 012px #FFF , ..."
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

/**
 * SplashScreen — shown once per browser session on first app load.
 *
 * Background: Parallax Pixel Stars (3 layers — small/medium/big, different speeds)
 *   - Mirrors the classic CSS codepen "Pure CSS Parallax Pixel Stars" effect
 *   - Stars scroll upward infinitely at different speeds (50s / 100s / 150s)
 *   - Radial gradient base: dark navy → near-black
 *
 * Foreground:
 *   - "CRYPTONEX" as a massive SVG text with gradient that tracks the mouse
 *   - Tagline fades in at 1.2s
 *   - ₿ coin spins in at 1.6s
 *   - Thin progress bar at bottom counts to 4s then fades out
 */
export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState("entering");
  const [progress, setProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const containerRef = useRef(null);

  const DURATION = 4000;

  // Generate star shadows once — expensive but static
  const shadowsSmall  = useMemo(() => multipleBoxShadow(700), []);
  const shadowsMedium = useMemo(() => multipleBoxShadow(200), []);
  const shadowsBig    = useMemo(() => multipleBoxShadow(100), []);

  // Inject a <style> tag so ::after pseudo-elements can also carry the box-shadow values
  // (inline styles cannot target pseudo-elements in React)
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.id = "splash-stars-dynamic";
    styleEl.textContent = `
      .splash-stars-small  { box-shadow: ${shadowsSmall}; }
      .splash-stars-small::after  { box-shadow: ${shadowsSmall}; }
      .splash-stars-medium { box-shadow: ${shadowsMedium}; }
      .splash-stars-medium::after { box-shadow: ${shadowsMedium}; }
      .splash-stars-big    { box-shadow: ${shadowsBig}; }
      .splash-stars-big::after    { box-shadow: ${shadowsBig}; }
    `;
    document.head.appendChild(styleEl);
    return () => {
      const el = document.getElementById("splash-stars-dynamic");
      if (el) el.remove();
    };
  }, [shadowsSmall, shadowsMedium, shadowsBig]);

  // Progress timer + phase management
  useEffect(() => {
    const enterDelay = setTimeout(() => {
      setPhase("visible");

      const start = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - start;
        const p = Math.min((elapsed / DURATION) * 100, 100);
        setProgress(p);

        if (p >= 100) {
          clearInterval(interval);
          setPhase("exiting");
          setTimeout(onComplete, 700);
        }
      }, 16);

      return () => clearInterval(interval);
    }, 300);

    return () => clearTimeout(enterDelay);
  }, [onComplete]);

  // Track mouse for SVG gradient
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  // Map 0-1 mouse to SVG viewBox space (0 0 1000 260)
  const gx = mousePos.x * 1000;
  const gy = mousePos.y * 260;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`splash-root splash-${phase}`}
    >
      {/* ── Parallax Pixel Stars (3 layers) ── */}
      <div className="splash-stars-small" />
      <div className="splash-stars-medium" />
      <div className="splash-stars-big" />

      {/* ── Subtle colour orbs for depth (low opacity) ── */}
      <div className="splash-orb splash-orb-1" />
      <div className="splash-orb splash-orb-2" />

      {/* ── Main content ── */}
      <div className="splash-content">

        {/* SVG CRYPTONEX text with mouse-tracked gradient */}
        <svg
          className="splash-svg"
          viewBox="0 0 1000 260"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="CryptoNex"
        >
          <defs>
            {/* Radial gradient that follows the cursor */}
            <radialGradient
              id="splash-mouse-grad"
              gradientUnits="userSpaceOnUse"
              cx={gx}
              cy={gy}
              r="360"
            >
              <stop offset="0%"   stopColor="#e0c8ff" />
              <stop offset="25%"  stopColor="#a78bfa" />
              <stop offset="55%"  stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </radialGradient>

            {/* Stroke outline gradient */}
            <linearGradient id="splash-stroke-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#7c3aed" />
              <stop offset="50%"  stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>

            {/* Glow filter */}
            <filter id="splash-glow" x="-20%" y="-30%" width="140%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Layer 1 — dark base so text is legible even without mouse hover */}
          <text
            x="500" y="140"
            textAnchor="middle"
            dominantBaseline="middle"
            className="splash-text-base"
            fill="#1a1040"
          >
            CRYPTONEX
          </text>

          {/* Layer 2 — glowing purple/cyan stroke outline */}
          <text
            x="500" y="140"
            textAnchor="middle"
            dominantBaseline="middle"
            className="splash-text-outline"
            fill="none"
            stroke="url(#splash-stroke-grad)"
            strokeWidth="1.2"
            filter="url(#splash-glow)"
          >
            CRYPTONEX
          </text>

          {/* Layer 3 — mouse-tracked gradient fill */}
          <text
            x="500" y="140"
            textAnchor="middle"
            dominantBaseline="middle"
            className="splash-text-fill"
            fill="url(#splash-mouse-grad)"
          >
            CRYPTONEX
          </text>
        </svg>

        {/* Tagline */}
        <p className="splash-tagline">
          Trade Smarter.&nbsp;&nbsp;Live Better.
        </p>

        {/* Spinning Bitcoin symbol */}
        <div className="splash-coin">₿</div>
      </div>

      {/* Progress bar */}
      <div className="splash-progress-track">
        <div
          className="splash-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
