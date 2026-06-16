// src/components/Dashboard/FearGreedGauge.jsx
import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const LABELS = ["Extreme Fear", "Fear", "Neutral", "Greed", "Extreme Greed"];
const COLORS = ["#ff3366", "#ff8c42", "#f5c842", "#42e5b0", "#10f5a0"];

// Map 0-100 value to degrees: -90deg (left) → +90deg (right)
function valueToDeg(value) {
  return -90 + (value / 100) * 180;
}

function getColor(value) {
  if (value <= 20) return COLORS[0];
  if (value <= 40) return COLORS[1];
  if (value <= 60) return COLORS[2];
  if (value <= 80) return COLORS[3];
  return COLORS[4];
}

function getLabel(value) {
  if (value <= 20) return LABELS[0];
  if (value <= 40) return LABELS[1];
  if (value <= 60) return LABELS[2];
  if (value <= 80) return LABELS[3];
  return LABELS[4];
}

export function FearGreedGauge() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.alternative.me/fng/?limit=1")
      .then((r) => r.json())
      .then((json) => {
        const item = json?.data?.[0];
        if (item) setData({ value: parseInt(item.value), classification: item.value_classification, timestamp: item.timestamp });
        setLoading(false);
      })
      .catch(() => {
        // Fallback demo value if API fails
        setData({ value: 52, classification: "Neutral", timestamp: null });
        setLoading(false);
      });
  }, []);

  const value = data?.value ?? 50;
  const deg = valueToDeg(value);
  const color = getColor(value);
  const label = getLabel(value);

  // SVG arc helpers
  const cx = 120, cy = 110, r = 90;
  function polarToXY(angleDeg) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }
  function arc(startDeg, endDeg, col) {
    const s = polarToXY(startDeg);
    const e = polarToXY(endDeg);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return (
      <path
        d={`M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`}
        fill="none"
        stroke={col}
        strokeWidth={14}
        strokeLinecap="round"
        opacity={0.85}
      />
    );
  }

  return (
    <div
      className="glass-card fade-in-up"
      style={{ padding: "24px 28px", position: "relative", overflow: "hidden" }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(148,163,184,0.7)", textTransform: "uppercase", marginBottom: 2 }}>
            Market Sentiment
          </p>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0", letterSpacing: "-0.02em" }}>
            Fear &amp; Greed Index
          </h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
          <span className={value >= 50 ? "badge-verified" : "badge-unverified"}>
            {value >= 50 ? "Bullish" : "Bearish"} Signal
          </span>
        </div>
      </div>

      {loading ? (
        <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(148,163,184,0.5)", fontSize: 13 }}>
          Loading market sentiment…
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
          {/* SVG Gauge */}
          <svg width={240} height={140} viewBox="0 0 240 140" style={{ overflow: "visible", flexShrink: 0 }}>
            {/* Background track */}
            {arc(180, 360, "rgba(255,255,255,0.06)")}

            {/* Colored segments */}
            {arc(180, 216, "#ff3366")}
            {arc(216, 252, "#ff8c42")}
            {arc(252, 288, "#f5c842")}
            {arc(288, 324, "#42e5b0")}
            {arc(324, 360, "#10f5a0")}

            {/* Needle */}
            <g
              className="gauge-needle"
              style={{ "--needle-angle": `${deg}deg`, transformOrigin: `${cx}px ${cy}px` }}
            >
              <line
                x1={cx} y1={cy}
                x2={cx} y2={cy - 72}
                stroke={color}
                strokeWidth={3}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 6px ${color})` }}
              />
            </g>

            {/* Center dot */}
            <circle cx={cx} cy={cy} r={7} fill={color} style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
            <circle cx={cx} cy={cy} r={3} fill="#0f172a" />

            {/* Value text */}
            <text x={cx} y={cy + 28} textAnchor="middle" fill={color} fontSize={28} fontWeight={800} style={{ filter: `drop-shadow(0 0 10px ${color})` }}>
              {value}
            </text>
          </svg>

          {/* Right panel */}
          <div style={{ flex: 1, minWidth: 120 }}>
            <p style={{ fontSize: 22, fontWeight: 800, color, marginBottom: 4, letterSpacing: "-0.02em", textShadow: `0 0 20px ${color}60` }}>
              {label}
            </p>
            <p style={{ fontSize: 13, color: "rgba(148,163,184,0.7)", lineHeight: 1.6, marginBottom: 16 }}>
              Market participants are currently in a state of{" "}
              <span style={{ color, fontWeight: 600 }}>{label.toLowerCase()}</span>.
            </p>

            {/* Legend */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {LABELS.map((l, i) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 8, opacity: getLabel(value) === l ? 1 : 0.4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[i], flexShrink: 0, boxShadow: `0 0 6px ${COLORS[i]}` }} />
                  <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: getLabel(value) === l ? 700 : 400 }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Last updated */}
      {data?.timestamp && (
        <p style={{ fontSize: 10, color: "rgba(148,163,184,0.4)", marginTop: 12, textAlign: "right" }}>
          Updated: {new Date(parseInt(data.timestamp) * 1000).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
