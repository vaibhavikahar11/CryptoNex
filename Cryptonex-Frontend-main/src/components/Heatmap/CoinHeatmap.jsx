// src/components/Heatmap/CoinHeatmap.jsx
import { useNavigate } from "react-router-dom";

// Compute a size weight for treemap layout (square packing)
function buildTreemapLayout(coins, containerWidth, containerHeight) {
  if (!coins?.length) return [];

  const totalMarketCap = coins.reduce((s, c) => s + (c.market_cap || 0), 0);
  const totalArea = containerWidth * containerHeight;

  // Assign relative areas
  const items = coins
    .filter((c) => c.market_cap > 0)
    .slice(0, 40)
    .map((c) => ({
      ...c,
      area: (c.market_cap / totalMarketCap) * totalArea,
    }));

  // Simple slice-and-dice treemap
  const result = [];
  let x = 0, y = 0;
  let rowHeight = 0;
  let rowWidth = 0;

  // Sort descending by area
  items.sort((a, b) => b.area - a.area);

  let remainingArea = totalArea;
  let remainingWidth = containerWidth;
  let remainingItems = [...items];

  function layoutRow(row, x, y, w, h, vertical) {
    const rowTotal = row.reduce((s, i) => s + i.area, 0);
    let cursor = vertical ? y : x;
    row.forEach((item) => {
      const fraction = item.area / rowTotal;
      const blockW = vertical ? fraction * w : w;
      const blockH = vertical ? h : fraction * h;
      const bx = vertical ? x : cursor;
      const by = vertical ? cursor : y;
      result.push({ ...item, x: bx, y: by, w: blockW, h: blockH });
      cursor += vertical ? blockH : blockW;
    });
  }

  // Squarified approximation (simplified)
  let rx = 0, ry = 0, rw = containerWidth, rh = containerHeight;
  while (remainingItems.length > 0) {
    const useVertical = rw < rh;
    const dim = useVertical ? rw : rh;
    const rowItems = [];
    let rowArea = 0;
    let totalR = remainingItems.reduce((s, i) => s + i.area, 0);
    let scale = (rw * rh) / totalR;

    for (let i = 0; i < remainingItems.length; i++) {
      const scaled = remainingItems[i].area * scale;
      rowArea += scaled;
      rowItems.push({ ...remainingItems[i], area: scaled });
      const worst = Math.max(...rowItems.map((r) => {
        const thisDim = rowArea / dim;
        const l1 = (dim * dim * r.area) / (rowArea * rowArea);
        const l2 = (rowArea * rowArea) / (dim * dim * r.area);
        return Math.max(l1, l2);
      }));
      const withNext = i + 1 < remainingItems.length;
      if (withNext) {
        const nextScaled = remainingItems[i + 1].area * scale;
        const nextArea = rowArea + nextScaled;
        const worstNext = Math.max(...[...rowItems, { area: nextScaled }].map((r) => {
          const thisDim = nextArea / dim;
          const l1 = (dim * dim * r.area) / (nextArea * nextArea);
          const l2 = (nextArea * nextArea) / (dim * dim * r.area);
          return Math.max(l1, l2);
        }));
        if (worstNext > worst) {
          // Don't add more to this row
          break;
        }
      }
    }

    const rowBreadth = rowArea / dim;
    layoutRow(rowItems, rx, ry, useVertical ? rowBreadth : rw, useVertical ? rh : rowBreadth, useVertical);
    remainingItems = remainingItems.slice(rowItems.length);
    if (useVertical) { rx += rowBreadth; rw -= rowBreadth; }
    else             { ry += rowBreadth; rh -= rowBreadth; }
    if (rw <= 0 || rh <= 0 || remainingItems.length === 0) break;
  }

  return result;
}

function getHeatColor(change) {
  if (change === null || change === undefined) return "rgba(99,102,241,0.3)";
  if (change > 10)  return "rgba(16, 245, 160, 0.85)";
  if (change > 5)   return "rgba(16, 245, 160, 0.65)";
  if (change > 2)   return "rgba(16, 245, 160, 0.45)";
  if (change > 0)   return "rgba(16, 245, 160, 0.28)";
  if (change > -2)  return "rgba(255, 51,  102, 0.28)";
  if (change > -5)  return "rgba(255, 51,  102, 0.48)";
  if (change > -10) return "rgba(255, 51,  102, 0.65)";
  return "rgba(255, 51, 102, 0.85)";
}

function getTextColor(change) {
  if (!change) return "#94a3b8";
  return change >= 0 ? "#10f5a0" : "#ff3366";
}

export function CoinHeatmap({ coins }) {
  const navigate = useNavigate();
  const W = 900, H = 460;

  const safe = Array.isArray(coins) ? coins.filter((c) => c.market_cap > 0) : [];
  const blocks = buildTreemapLayout(safe, W, H);

  if (!blocks.length) {
    return (
      <div style={{ height: H, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(148,163,184,0.5)", fontSize: 14 }}>
        No market data available for heatmap.
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width: "100%", paddingTop: `${(H / W) * 100}%`, borderRadius: 16, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0 }}>
        {blocks.map((block) => {
          const change = block.market_cap_change_percentage_24h ?? 0;
          const tinyBlock = block.w < 70 || block.h < 50;
          const microBlock = block.w < 45 || block.h < 35;

          return (
            <div
              key={block.id}
              className="heatmap-block"
              onClick={() => navigate(`/market/${block.id}`)}
              title={`${block.name}\n${change >= 0 ? "+" : ""}${(change ?? 0).toFixed(2)}%`}
              style={{
                position: "absolute",
                left: `${(block.x / W) * 100}%`,
                top:  `${(block.y / H) * 100}%`,
                width:  `${(block.w / W) * 100}%`,
                height: `${(block.h / H) * 100}%`,
                background: getHeatColor(change),
                border: "1px solid rgba(0,0,0,0.25)",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: microBlock ? 2 : 6,
                gap: 2,
                overflow: "hidden",
                backdropFilter: "blur(2px)",
              }}
            >
              {!microBlock && block.image && (
                <img
                  src={block.image}
                  alt={block.symbol}
                  style={{ width: tinyBlock ? 16 : 22, height: tinyBlock ? 16 : 22, borderRadius: "50%", objectFit: "cover" }}
                />
              )}
              {!microBlock && (
                <span style={{ fontSize: tinyBlock ? 9 : 11, fontWeight: 700, color: "#e2e8f0", letterSpacing: "0.03em", textAlign: "center", lineHeight: 1.2 }}>
                  {block.symbol?.toUpperCase()}
                </span>
              )}
              {!tinyBlock && (
                <span style={{ fontSize: 10, fontWeight: 600, color: getTextColor(change), textAlign: "center" }}>
                  {change >= 0 ? "+" : ""}{(change ?? 0).toFixed(2)}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
