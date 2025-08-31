/* eslint-disable no-unused-vars */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { invoices } from "../Home/AssetTable";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserAssets } from "@/Redux/Assets/Action";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getAllOrdersForUser } from "@/Redux/Order/Action";
import { calculateProfite } from "@/Util/calculateProfite";
import { readableDate } from "@/Util/readableDate";

const TreadingHistory = () => {
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState("portfolio");
  const { asset, order } = useSelector((store) => store);

  useEffect(() => {
    dispatch(getUserAssets(localStorage.getItem("jwt")));
    dispatch(getAllOrdersForUser({ jwt: localStorage.getItem("jwt") }));
  }, [dispatch]);

  const handleTabChange = (value) => {
    setCurrentTab(value);
  };

  console.log("currentTab-----", currentTab);
  
  return (
    <div className="">
      <Table className="px-5 relative">
        <TableHeader className="py-9">
          <TableRow className="sticky top-0 left-0 right-0 bg-background">
            <TableHead className="py-3">Date & Time</TableHead>
            <TableHead>Treading Pair</TableHead>
            <TableHead>Buy Price</TableHead>
            <TableHead>Selling Price</TableHead>
            <TableHead>Order Type</TableHead>
            <TableHead>Profite/Loss</TableHead>
            <TableHead className="text-right">VALUE</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {order.orders?.map((item) => {
            const orderType = item.orderType.toLowerCase(); // Normalize orderType to lowercase
            const profit = calculateProfite(item);
            const isProfitNegative = profit < 0;
            const isProfitPositive = profit > 0;
            const hasProfit = isProfitPositive || isProfitNegative;

            // Get the date and time in Indian format
            const dateTime = readableDate(item.timestamp);
            
            return (
              <TableRow key={item.id}>
                {/* Date & Time */}
                <TableCell>
                  <p>{dateTime.date}</p>
                  <p className="text-gray-400">{dateTime.time}</p>
                </TableCell>
                
                {/* Treading Pair */}
                <TableCell className="font-medium flex items-center gap-2">
                  <Avatar className="-z-50">
                    <AvatarImage
                      src={item.orderItem.coin.image}
                      alt={item.orderItem.coin.symbol}
                    />
                  </Avatar>
                  <span>{item.orderItem.coin.name}</span>
                </TableCell>

                {/* Buy Price */}
                <TableCell>${item.orderItem.buyPrice.toFixed(2)}</TableCell>

                {/* Selling Price with Conditional Styling */}
                <TableCell
                  className={`${
                    orderType === "sell"
                      ? profit > 0
                        ? "text-green-500 font-bold"
                        : profit < 0
                        ? "text-red-500"
                        : "text-gray-500"
                      : "text-gray-500"
                  }`}
                >
                  {item.orderItem.sellPrice
                    ? `$${item.orderItem.sellPrice.toFixed(2)}`
                    : "-"}
                </TableCell>

                {/* Order Type with Conditional Styling */}
                <TableCell
                  className={`${
                    orderType === "buy"
                      ? "text-green-500 font-semibold"
                      : orderType === "sell"
                      ? "text-red-500 font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  {item.orderType.toUpperCase()}
                </TableCell>

                {/* Profite/Loss with Conditional Styling */}
                <TableCell
                  className={`${
                    hasProfit
                      ? isProfitPositive
                        ? "text-green-500 font-bold"
                        : "text-red-600 font-bold"
                      : "text-gray-500"
                  }`}
                >
                  {orderType === "sell"
                    ? hasProfit
                      ? isProfitPositive
                        ? `+$${profit.toFixed(2)}`
                        : `-$${Math.abs(profit).toFixed(2)}`
                      : "-"
                    : "-"}
                </TableCell>

                {/* VALUE with Conditional Styling Based on Order Type */}
                <TableCell
                  className={`text-right ${
                    orderType === "buy"
                      ? "text-red-500 font-bold"
                      : orderType === "sell"
                      ? "text-green-500 font-bold"
                      : "text-gray-500 font-bold"
                  }`}
                >
                  ${item.price.toFixed(2)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TreadingHistory;
