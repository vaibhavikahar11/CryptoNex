import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Exported for backward compatibility with TreadingHistory.jsx and Search.jsx
export const invoices = [
  { invoice: "INV001", paymentStatus: "Paid",    totalAmount: "$250.00", paymentMethod: "Credit Card" },
  { invoice: "INV002", paymentStatus: "Pending", totalAmount: "$150.00", paymentMethod: "PayPal" },
  { invoice: "INV003", paymentStatus: "Unpaid",  totalAmount: "$350.00", paymentMethod: "Bank Transfer" },
  { invoice: "INV004", paymentStatus: "Paid",    totalAmount: "$450.00", paymentMethod: "Credit Card" },
  { invoice: "INV005", paymentStatus: "Paid",    totalAmount: "$550.00", paymentMethod: "PayPal" },
  { invoice: "INV006", paymentStatus: "Pending", totalAmount: "$200.00", paymentMethod: "Bank Transfer" },
  { invoice: "INV007", paymentStatus: "Unpaid",  totalAmount: "$300.00", paymentMethod: "Credit Card" },
];
// --- usePrevious hook for live-ink effect ---
function usePrevious(value) {
  const ref = useRef(value);
  useEffect(() => { ref.current = value; }, [value]);
  return ref.current;
}

// Row animation variants for framer-motion
const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: i * 0.03, ease: "easeOut" },
  }),
};

// Individual coin row with live-ink price animation
function CoinRow({ item, index, navigate }) {
  const originalPrice  = item.current_price  ?? 0;
  const simulatedPrice = item.simulatedPrice ?? originalPrice;
  const prevSimPrice   = usePrevious(simulatedPrice);

  const priceChange    = simulatedPrice - originalPrice;
  const priceChangePct = originalPrice !== 0 ? (priceChange / originalPrice) * 100 : 0;
  const totalVolume    = item.total_volume  ?? 0;
  const marketCap      = item.market_cap    ?? 0;
  const change24h      = item.market_cap_change_percentage_24h ?? 0;
  const symbol         = item.symbol        ?? "";

  // Determine if price went up/down since last tick
  const priceTrend = simulatedPrice > prevSimPrice ? "up" : simulatedPrice < prevSimPrice ? "down" : null;

  // Animate class resets after animation completes
  const [priceClass, setPriceClass] = useState("");
  useEffect(() => {
    if (priceTrend) {
      setPriceClass(priceTrend === "up" ? "price-up" : "price-down");
      const t = setTimeout(() => setPriceClass(""), 1900);
      return () => clearTimeout(t);
    }
  }, [simulatedPrice]);

  const handleClick = useCallback(() => {
    navigate(`/market/${item.id}`);
  }, [item.id, navigate]);

  return (
    <motion.tr
      custom={index}
      variants={rowVariants}
      initial="hidden"
      animate="visible"
      className="coin-row cursor-pointer border-b border-white/5"
      onClick={handleClick}
      whileTap={{ scale: 0.99 }}
    >
      {/* Coin Name */}
      <TableCell className="font-medium py-3 px-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 ring-1 ring-white/10">
            <AvatarImage src={item.image} alt={symbol} />
          </Avatar>
          <div>
            <p className="font-semibold text-sm text-slate-100 leading-tight">{item.name}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wider">{symbol}</p>
          </div>
        </div>
      </TableCell>

      {/* Volume */}
      <TableCell className="hidden sm:table-cell text-center text-sm text-slate-400">
        {totalVolume.toLocaleString("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 2 })}
      </TableCell>

      {/* Market Cap */}
      <TableCell className="hidden sm:table-cell text-center text-sm text-slate-400">
        {marketCap.toLocaleString("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 2 })}
      </TableCell>

      {/* 24h Change */}
      <TableCell className="text-center">
        <span
          className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold ${
            change24h >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
          }`}
        >
          {change24h >= 0 ? "▲" : "▼"} {Math.abs(change24h).toFixed(2)}%
        </span>
      </TableCell>

      {/* Simulated Price with Live-Ink */}
      <TableCell className="text-center">
        <div className={`text-sm font-bold tabular-nums ${priceClass}`} style={{ transition: "none" }}>
          {simulatedPrice.toLocaleString("en-US", { style: "currency", currency: "USD" })}
        </div>
        <div className={`text-xs mt-0.5 ${priceChange >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
          {priceChange >= 0 ? "+" : ""}
          {priceChange.toLocaleString("en-US", { style: "currency", currency: "USD" })}
          {" "}({priceChangePct.toFixed(2)}%)
        </div>
      </TableCell>
    </motion.tr>
  );
}

export function AssetTable({ coins, category }) {
  const navigate = useNavigate();

  const safeCoins = Array.isArray(coins) ? coins : [];

  const [simulatedCoins, setSimulatedCoins] = useState(
    safeCoins.map((item) => ({ ...item, simulatedPrice: item.current_price ?? 0 }))
  );

  // Sync when coins prop changes
  useEffect(() => {
    const safe = Array.isArray(coins) ? coins : [];
    setSimulatedCoins(safe.map((item) => ({ ...item, simulatedPrice: item.current_price ?? 0 })));
  }, [coins]);

  // Simulate live price ticks every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedCoins((prev) =>
        prev.map((item) => {
          const factor = (Math.random() - 0.5) / 100; // ±0.5%
          return { ...item, simulatedPrice: (item.simulatedPrice ?? 0) * (1 + factor) };
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Table className="min-w-full table-fixed px-2 sm:px-5 border-t border-white/5 relative">
      <ScrollArea className={category === "all" ? "h-[74vh]" : "h-[82vh]"}>
        <TableHeader>
          <TableRow className="sticky top-0 left-0 right-0 bg-background/80 backdrop-blur-md z-10 border-b border-white/8">
            <TableHead className="w-2/5 py-4 text-left pl-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
              Coin
            </TableHead>
            <TableHead className="hidden sm:table-cell text-center text-xs font-semibold uppercase tracking-widest text-slate-500">
              Volume
            </TableHead>
            <TableHead className="hidden sm:table-cell text-center text-xs font-semibold uppercase tracking-widest text-slate-500">
              Market Cap
            </TableHead>
            <TableHead className="text-center text-xs font-semibold uppercase tracking-widest text-slate-500">
              24H
            </TableHead>
            <TableHead className="text-center text-xs font-semibold uppercase tracking-widest text-slate-500">
              Price
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <AnimatePresence>
            {simulatedCoins.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <div style={{
                      width: 48, height: 48, borderRadius: "50%",
                      background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 22
                    }}>📡</div>
                    <p className="text-slate-500 text-sm font-medium">No data available</p>
                    <p className="text-slate-600 text-xs">API may be rate-limited — please try again in a moment</p>
                  </div>
                </td>
              </tr>
            ) : (
              simulatedCoins.map((item, i) => (
                <CoinRow key={item.id} item={item} index={i} navigate={navigate} />
              ))
            )}
          </AnimatePresence>
        </TableBody>
      </ScrollArea>
    </Table>
  );
}
