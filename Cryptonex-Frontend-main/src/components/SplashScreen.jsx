import { useEffect, useRef, useState } from "react";

/**
 * SplashScreen — shown once per browser session on first app load.
 * Features:
 *  - Full-screen dark background with aurora orbs
 *  - "CRYPTONEX" as a massive SVG text with a radial gradient that follows the mouse
 *  - Tagline fades in at 1s
 *  - Thin progress bar counts down at the bottom
 *  - Whole screen fades + scales out after 4s, then calls onComplete()
 */
export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState("entering"); // entering → visible → exiting
  const [progress, setProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const containerRef = useRef(null);

  const DURATION = 4000; // 4 seconds visible

  useEffect(() => {
    // Short delay before starting progress so the enter animation finishes
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
          setTimeout(onComplete, 700); // wait for fade-out animation
        }
      }, 16);

      return () => clearInterval(interval);
    }, 300);

    return () => clearTimeout(enterDelay);
  }, [onComplete]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  // Map normalised mouse 0-1 to SVG coordinate space (viewBox 0 0 1000 400)
  const gx = mousePos.x * 1000;
  const gy = mousePos.y * 400;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`splash-root splash-${phase}`}
    >
      {/* ── Ambient orbs ── */}
      <div className="splash-orb splash-orb-1" />
      <div className="splash-orb splash-orb-2" />
      <div className="splash-orb splash-orb-3" />

      {/* ── Main content ── */}
      <div className="splash-content">

        {/* ── SVG CRYPTONEX text ── */}
        <svg
          className="splash-svg"
          viewBox="0 0 1000 260"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="CryptoNex"
        >
          <defs>
            {/* Radial gradient that tracks the mouse */}
            <radialGradient
              id="splash-mouse-grad"
              gradientUnits="userSpaceOnUse"
              cx={gx}
              cy={gy}
              r="380"
            >
              <stop offset="0%"   stopColor="#c4b5fd" />
              <stop offset="30%"  stopColor="#818cf8" />
              <stop offset="60%"  stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </radialGradient>

            {/* Static linear gradient for the always-visible outline */}
            <linearGradient id="splash-stroke-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#7c3aed" />
              <stop offset="50%"  stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>

            {/* Glow filter */}
            <filter id="splash-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Layer 1 — dark base fill so text is always legible */}
          <text
            x="500" y="150"
            textAnchor="middle"
            dominantBaseline="middle"
            className="splash-text-base"
            fill="#1e1b4b"
          >
            CRYPTONEX
          </text>

          {/* Layer 2 — glowing outline */}
          <text
            x="500" y="150"
            textAnchor="middle"
            dominantBaseline="middle"
            className="splash-text-outline"
            fill="none"
            stroke="url(#splash-stroke-grad)"
            strokeWidth="1.5"
            filter="url(#splash-glow)"
          >
            CRYPTONEX
          </text>

          {/* Layer 3 — mouse-tracked gradient fill */}
          <text
            x="500" y="150"
            textAnchor="middle"
            dominantBaseline="middle"
            className="splash-text-fill"
            fill="url(#splash-mouse-grad)"
          >
            CRYPTONEX
          </text>
        </svg>

        {/* ── Tagline ── */}
        <p className="splash-tagline">
          Trade Smarter.&nbsp;&nbsp;Live Better.
        </p>

        {/* ── Spinning coin icon ── */}
        <div className="splash-coin">₿</div>
      </div>

      {/* ── Progress bar at the very bottom ── */}
      <div className="splash-progress-track">
        <div
          className="splash-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
