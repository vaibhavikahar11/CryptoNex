// src/components/SessionBlur.jsx
import { Shield, Lock } from "lucide-react";
import { useIdleTimer } from "@/hooks/useIdleTimer";

export function SessionBlur() {
  const isIdle = useIdleTimer({
    timeoutMs: 15 * 60 * 1000, // 15 minutes
  });

  if (!isIdle) return null;

  return (
    <div className="session-blur-overlay">
      <div className="session-blur-card fade-in-up">
        {/* Lock icon */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.25))",
            border: "1px solid rgba(99,102,241,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            boxShadow: "0 0 30px rgba(99,102,241,0.3)",
          }}
        >
          <Lock size={32} color="#a5b4fc" />
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#e2e8f0",
            marginBottom: 8,
            letterSpacing: "-0.02em",
          }}
        >
          Session Paused
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 14,
            color: "rgba(148,163,184,0.8)",
            marginBottom: 32,
            lineHeight: 1.6,
          }}
        >
          Your session was paused after 15 minutes of inactivity.
          <br />
          Click anywhere to resume securely.
        </p>

        {/* Security badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            borderRadius: 999,
            background: "rgba(16,245,160,0.08)",
            border: "1px solid rgba(16,245,160,0.2)",
            color: "rgba(16,245,160,0.8)",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.05em",
          }}
        >
          <Shield size={12} />
          SESSION PROTECTED
        </div>
      </div>
    </div>
  );
}
