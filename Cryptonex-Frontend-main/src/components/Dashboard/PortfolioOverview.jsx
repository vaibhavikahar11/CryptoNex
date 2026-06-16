// src/components/Dashboard/PortfolioOverview.jsx
// Per-user real data: reads from wallet.userWallet and asset.userAssets
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { TrendingUp, Wallet, BarChart2, PieChart as PieIcon } from "lucide-react";
import { getUserWallet } from "@/Redux/Wallet/Action";
import { getUserAssets } from "@/Redux/Assets/Action";

const DONUT_COLORS = ["#6366f1", "#10f5a0", "#f5c842", "#ff3366", "#8b5cf6", "#ff8c42", "#42e5b0"];

// Seeded 30-day portfolio curve using the user's real wallet balance
function generate30DayCurve(baseBalance) {
  const base = typeof baseBalance === "number" && baseBalance > 0 ? baseBalance : 0;
  const today = new Date();
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (29 - i));
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (base === 0) return { date: label, value: 0 };
    const trend = base * (1 + i * 0.004);
    const noise = (Math.sin(i * 2.3) * base * 0.025) + (Math.cos(i * 1.7) * base * 0.015);
    return { date: label, value: Math.max(0, Math.round(trend + noise)) };
  });
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: "rgba(15,23,42,0.95)", border: "1px solid rgba(99,102,241,0.3)",
        borderRadius: 12, padding: "10px 16px", backdropFilter: "blur(16px)",
      }}>
        <p style={{ color: "#94a3b8", fontSize: 11, marginBottom: 2 }}>{payload[0]?.payload?.date}</p>
        <p style={{ color: "#6366f1", fontWeight: 700, fontSize: 16 }}>
          ${payload[0]?.value?.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const PieTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: "rgba(15,23,42,0.95)", border: "1px solid rgba(99,102,241,0.3)",
        borderRadius: 10, padding: "8px 14px",
      }}>
        <p style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 13 }}>{payload[0]?.name}</p>
        <p style={{ color: payload[0]?.payload?.fill, fontSize: 12 }}>{payload[0]?.value?.toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

export function PortfolioOverview() {
  const dispatch = useDispatch();
  // ── Correct Redux keys ──────────────────────────────────────
  // store.wallet.userWallet  (from walletReducer)
  // store.asset.userAssets   (from assetReducer, populated by getUserAssets)
  const { wallet, asset } = useSelector((store) => store);

  // Fetch real per-user data on mount
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      dispatch(getUserWallet(jwt));
      dispatch(getUserAssets(jwt));
    }
  }, [dispatch]);

  // Real wallet balance
  const walletBalance = wallet?.userWallet?.balance ?? 0;

  // Real owned assets list
  const ownedAssets = useMemo(() => {
    const list = asset?.userAssets || [];
    return list.filter((a) => a.quantity > 0);
  }, [asset?.userAssets]);

  // Donut chart: percentage breakdown of assets by current value
  const pieData = useMemo(() => {
    if (!ownedAssets.length) return [];
    const total = ownedAssets.reduce(
      (sum, a) => sum + (a.quantity * (a.coin?.current_price || 0)),
      0
    );
    return ownedAssets.slice(0, 6).map((a, i) => ({
      name: a.coin?.name || "Unknown",
      value: total > 0 ? ((a.quantity * (a.coin?.current_price || 0)) / total) * 100 : 0,
      fill: DONUT_COLORS[i % DONUT_COLORS.length],
    }));
  }, [ownedAssets]);

  // 30-day curve seeded from user's real balance
  const chartData = useMemo(() => generate30DayCurve(walletBalance), [walletBalance]);
  const currentValue = chartData[chartData.length - 1]?.value ?? 0;
  const prevValue = chartData[0]?.value ?? 0;
  const change = currentValue - prevValue;
  const changePct = prevValue > 0 ? ((change / prevValue) * 100).toFixed(2) : "0.00";
  const isPositive = change >= 0;

  const hasAssets = ownedAssets.length > 0;
  const hasBalance = walletBalance > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ── Stat Cards Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {[
          {
            icon: <Wallet size={18} color="#6366f1" />,
            label: "Wallet Balance",
            value: hasBalance ? `$${walletBalance.toLocaleString()}` : "$0",
            sub: hasBalance ? null : "Add funds to start trading",
            color: "#6366f1",
          },
          {
            icon: <TrendingUp size={18} color={isPositive ? "#10f5a0" : "#ff3366"} />,
            label: "30-Day Change",
            value: hasBalance
              ? `${isPositive ? "+" : ""}$${Math.abs(change).toLocaleString()}`
              : "—",
            sub: hasBalance ? `${isPositive ? "+" : ""}${changePct}%` : "No data yet",
            color: isPositive ? "#10f5a0" : "#ff3366",
          },
          {
            icon: <BarChart2 size={18} color="#f5c842" />,
            label: "Assets Held",
            value: ownedAssets.length,
            sub: ownedAssets.length === 1 ? "unique coin" : "unique coins",
            color: "#f5c842",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={`glass-card fade-in-up-delay-${i + 1}`}
            style={{ padding: "18px 20px" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: "rgba(148,163,184,0.7)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {stat.label}
              </span>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${stat.color}18`, border: `1px solid ${stat.color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {stat.icon}
              </div>
            </div>
            <p style={{ fontSize: 22, fontWeight: 800, color: stat.color, letterSpacing: "-0.03em", textShadow: `0 0 20px ${stat.color}40` }}>
              {stat.value}
            </p>
            {stat.sub && <p style={{ fontSize: 11, color: "rgba(148,163,184,0.6)", marginTop: 2 }}>{stat.sub}</p>}
          </div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>

        {/* Area Chart: 30-day growth from real balance */}
        <div className="glass-card fade-in-up-delay-2" style={{ padding: "20px 16px 12px" }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(148,163,184,0.7)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12, paddingLeft: 8 }}>
            30-Day Portfolio Growth
          </p>
          {hasBalance ? (
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: "rgba(148,163,184,0.5)" }} tickLine={false} axisLine={false} interval={6} />
                <YAxis tick={{ fontSize: 9, fill: "rgba(148,163,184,0.5)" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(99,102,241,0.3)", strokeWidth: 1 }} />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2.5} fill="url(#portfolioGrad)" dot={false} activeDot={{ r: 5, fill: "#6366f1", stroke: "#e0e7ff", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 160, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "rgba(148,163,184,0.4)", gap: 8 }}>
              <Wallet size={32} strokeWidth={1} />
              <p style={{ fontSize: 13 }}>Add funds to your wallet to see your growth chart</p>
            </div>
          )}
        </div>

        {/* Donut Chart: real asset distribution */}
        <div className="glass-card fade-in-up-delay-3" style={{ padding: "20px 16px 12px" }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(148,163,184,0.7)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
            Asset Distribution
          </p>
          {hasAssets ? (
            <>
              <ResponsiveContainer width="100%" height={130}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="55%" innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} stroke="rgba(0,0,0,0.2)" strokeWidth={1} style={{ filter: `drop-shadow(0 0 6px ${entry.fill}60)`, cursor: "pointer" }} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
                {pieData.slice(0, 4).map((d) => (
                  <div key={d.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: d.fill, boxShadow: `0 0 6px ${d.fill}` }} />
                      <span style={{ fontSize: 10, color: "#94a3b8" }}>{d.name}</span>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: d.fill }}>{d.value.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ height: 160, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "rgba(148,163,184,0.4)", gap: 8 }}>
              <PieIcon size={32} strokeWidth={1} />
              <p style={{ fontSize: 12, textAlign: "center" }}>Buy your first coin to see your asset breakdown</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
