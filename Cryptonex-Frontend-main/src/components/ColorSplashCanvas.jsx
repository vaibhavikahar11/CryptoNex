// src/components/ColorSplashCanvas.jsx
// High-performance cursor color splash overlay
// Pure Canvas API — zero dependencies, zero risk to existing code
// pointer-events: none so it never blocks clicks or interactions

import { useEffect, useRef, useCallback } from "react";

// Vivid neon palette — cycles smoothly
const PALETTE = [
  { r: 6,   g: 182, b: 212 },  // cyan
  { r: 99,  g: 102, b: 241 },  // indigo
  { r: 139, g: 92,  b: 246 },  // violet
  { r: 244, g: 63,  b: 94  },  // rose
  { r: 245, g: 158, b: 11  },  // amber
  { r: 16,  g: 245, b: 160 },  // emerald
  { r: 236, g: 72,  b: 153 },  // pink
];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpColor(c1, c2, t) {
  return {
    r: Math.round(lerp(c1.r, c2.r, t)),
    g: Math.round(lerp(c1.g, c2.g, t)),
    b: Math.round(lerp(c1.b, c2.b, t)),
  };
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;

    // Random spread direction
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 1.5 + 0.4;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;

    this.radius = Math.random() * 6 + 3;
    this.maxRadius = Math.random() * 22 + 12;
    this.alpha = 1;
    this.alphaDecay = Math.random() * 0.018 + 0.012;
    this.expanding = true;
    this.expandSpeed = Math.random() * 0.6 + 0.3;
    this.alive = true;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.97; // friction
    this.vy *= 0.97;

    if (this.expanding) {
      this.radius += this.expandSpeed;
      if (this.radius >= this.maxRadius) this.expanding = false;
    } else {
      this.radius = Math.max(0, this.radius - 0.3);
    }

    this.alpha -= this.alphaDecay;
    if (this.alpha <= 0) this.alive = false;
  }

  draw(ctx) {
    const { r, g, b } = this.color;
    const a = Math.max(0, this.alpha);

    ctx.save();
    ctx.globalAlpha = a;
    ctx.globalCompositeOperation = "lighter"; // additive blending = natural glow

    // Outer soft glow
    const glow = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.radius * 2.2
    );
    glow.addColorStop(0,   `rgba(${r},${g},${b},0.6)`);
    glow.addColorStop(0.4, `rgba(${r},${g},${b},0.2)`);
    glow.addColorStop(1,   `rgba(${r},${g},${b},0)`);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 2.2, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    // Bright core
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 0.45, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r},${g},${b},0.9)`;
    ctx.shadowBlur = 18;
    ctx.shadowColor = `rgba(${r},${g},${b},0.8)`;
    ctx.fill();

    ctx.restore();
  }
}

// Ring ripple spawned on click
class RippleRing {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = 4;
    this.maxRadius = 80;
    this.alpha = 0.9;
    this.alive = true;
  }
  update() {
    this.radius += 4;
    this.alpha -= 0.04;
    if (this.radius >= this.maxRadius || this.alpha <= 0) this.alive = false;
  }
  draw(ctx) {
    const { r, g, b } = this.color;
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.globalCompositeOperation = "lighter";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${r},${g},${b},0.9)`;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 20;
    ctx.shadowColor = `rgba(${r},${g},${b},0.7)`;
    ctx.stroke();
    ctx.restore();
  }
}

export function ColorSplashCanvas() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const ripplesRef = useRef([]);
  const rafRef = useRef(null);
  const colorIndexRef = useRef(0);
  const colorTRef = useRef(0);
  const frameRef = useRef(0);
  const mouseRef = useRef({ x: -999, y: -999, moved: false });

  // Respect prefers-reduced-motion
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const getColor = useCallback(() => {
    colorTRef.current += 0.025;
    if (colorTRef.current >= 1) {
      colorTRef.current = 0;
      colorIndexRef.current = (colorIndexRef.current + 1) % PALETTE.length;
    }
    const next = (colorIndexRef.current + 1) % PALETTE.length;
    return lerpColor(
      PALETTE[colorIndexRef.current],
      PALETTE[next],
      colorTRef.current
    );
  }, []);

  const spawnParticles = useCallback((x, y, count = 3) => {
    const color = getColor();
    for (let i = 0; i < count; i++) {
      particlesRef.current.push(new Particle(x, y, color));
    }
    // Cap particle count to prevent memory bloat
    if (particlesRef.current.length > 350) {
      particlesRef.current.splice(0, particlesRef.current.length - 350);
    }
  }, [getColor]);

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Resize canvas to full window
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Mouse move → spawn particles every 2 frames
    const onMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, moved: true };
    };

    // Click → ring ripple burst
    const onClick = (e) => {
      const color = getColor();
      ripplesRef.current.push(new RippleRing(e.clientX, e.clientY, color));
      spawnParticles(e.clientX, e.clientY, 12);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("click", onClick);

    // Animation loop
    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      frameRef.current++;

      // Clear with slight trail for motion blur effect
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn on mouse move every other frame
      if (mouseRef.current.moved && frameRef.current % 2 === 0) {
        spawnParticles(mouseRef.current.x, mouseRef.current.y, 3);
        mouseRef.current.moved = false;
      }

      // Update + draw particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.update();
        if (p.alive) p.draw(ctx);
        return p.alive;
      });

      // Update + draw ripples
      ripplesRef.current = ripplesRef.current.filter((r) => {
        r.update();
        if (r.alive) r.draw(ctx);
        return r.alive;
      });
    };

    loop();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
      particlesRef.current = [];
      ripplesRef.current = [];
    };
  }, [reducedMotion, spawnParticles, getColor]);

  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",   // never blocks any click or hover
        zIndex: 1,               // above orbs (z:0), below all content (z:10+)
        willChange: "transform", // GPU compositing layer hint
      }}
      aria-hidden="true"
    />
  );
}
