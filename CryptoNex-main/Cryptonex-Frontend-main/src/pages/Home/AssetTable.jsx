import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

export function AssetTable({ coins, category }) {
  const navigate = useNavigate();

  // Initialize simulated state for coins with a simulatedPrice property.
  const [simulatedCoins, setSimulatedCoins] = useState(
    coins.map((item) => ({ ...item, simulatedPrice: item.current_price }))
  );

  // Update simulatedCoins whenever coins prop changes.
  useEffect(() => {
    setSimulatedCoins(coins.map((item) => ({ ...item, simulatedPrice: item.current_price })));
  }, [coins]);

  // Update simulatedPrice every 3 seconds with a small random fluctuation.
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedCoins((prevCoins) =>
        prevCoins.map((item) => {
          const randomFactor = (Math.random() - 0.5) / 100; // ±0.5%
          return { ...item, simulatedPrice: item.simulatedPrice * (1 + randomFactor) };
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Table className="min-w-full table-fixed px-2 sm:px-5 border-t relative">
      <ScrollArea className={category === "all" ? "h-[74vh]" : "h-[82vh]"}>
        <TableHeader>
          <TableRow className="sticky top-0 left-0 right-0 bg-background z-10">
            <TableHead className="w-1/3 sm:w-1/5 py-4 text-center text-base sm:text-lg">Coin</TableHead>
            <TableHead className="hidden sm:table-cell w-1/8 text-center text-base sm:text-lg">SYMBOL</TableHead>
            <TableHead className="hidden sm:table-cell w-1/8 text-center text-base sm:text-lg">VOLUME</TableHead>
            <TableHead className="hidden sm:table-cell w-1/8 text-center text-base sm:text-lg">MARKET CAP</TableHead>
            <TableHead className="w-1/4 sm:w-1/8 text-center text-base sm:text-lg">24H</TableHead>
            <TableHead className="w-1/3 sm:w-1/5 text-center text-base sm:text-lg">PRICE</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {simulatedCoins.map((item) => {
            const originalPrice = item.current_price;
            const simulatedPrice = item.simulatedPrice;
            const priceChange = simulatedPrice - originalPrice;
            const priceChangePercentage = (priceChange / originalPrice) * 100;

            return (
              <TableRow
                className="cursor-pointer"
                onClick={() => {
                  navigate(`/market/${item.id}`);
                  setTimeout(() => {
                    window.location.reload();
                  }, 100);
                }}
                key={item.id}
              >
                <TableCell className="font-medium flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                    <AvatarImage src={item.image} alt={item.symbol} />
                  </Avatar>
                  <span className="truncate">{item.name}</span>
                </TableCell>

                <TableCell className="hidden sm:table-cell whitespace-nowrap truncate w-1/8 text-center text-sm sm:text-base">
                  {item.symbol.toUpperCase()}
                </TableCell>
                <TableCell className="hidden sm:table-cell whitespace-nowrap truncate w-1/8 text-center text-sm sm:text-base">
                  {item.total_volume.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </TableCell>
                <TableCell className="hidden sm:table-cell whitespace-nowrap truncate w-1/8 text-center text-sm sm:text-base">
                  {item.market_cap.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </TableCell>
                <TableCell
                  className={`whitespace-nowrap text-center text-sm sm:text-base ${
                    item.market_cap_change_percentage_24h < 0
                      ? "text-red-600 font-bold"
                      : "text-green-500 font-bold"
                  } w-1/4 sm:w-1/8`}
                >
                  {item.market_cap_change_percentage_24h.toFixed(2)}%
                </TableCell>
                <TableCell className="text-center whitespace-nowrap px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base w-1/3 sm:w-1/5">
                  <div>
                    {simulatedPrice.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </div>
                  <div className={priceChange >= 0 ? "text-green-500" : "text-red-600"}>
                    {priceChange >= 0 ? "+" : ""}
                    {priceChange.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}{" "}
                    ({priceChangePercentage.toFixed(2)}%)
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </ScrollArea>
    </Table>
  );
}
