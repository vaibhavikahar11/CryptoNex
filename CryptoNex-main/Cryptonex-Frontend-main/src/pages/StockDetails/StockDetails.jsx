/* eslint-disable no-unused-vars */
/* eslint-disable no-constant-condition */
import { Button } from "@/components/ui/button";
import {
  BookmarkFilledIcon,
  BookmarkIcon,
} from "@radix-ui/react-icons";
import StockChart from "./StockChart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TreadingForm from "./TreadingForm";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoinDetails } from "@/Redux/Coin/Action";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { existInWatchlist } from "@/Util/existInWatchlist";
import { addItemToWatchlist, getUserWatchlist } from "@/Redux/Watchlist/Action";
import { getUserWallet } from "@/Redux/Wallet/Action";
import SpinnerBackdrop from "@/components/custome/SpinnerBackdrop";

const StockDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { coin, watchlist, auth } = useSelector((store) => store);

  useEffect(() => {
    dispatch(
      fetchCoinDetails({
        coinId: id,
        jwt: auth.jwt || localStorage.getItem("jwt"),
      })
    );
  }, [id]);

  useEffect(() => {
    dispatch(getUserWatchlist());
    dispatch(getUserWallet(localStorage.getItem("jwt")));
  }, []);

  const handleAddToWatchlist = () => {
    dispatch(addItemToWatchlist(coin.coinDetails?.id));
  };

  if (coin.loading) {
    return <SpinnerBackdrop />;
  }

  return (
    <div className="p-5 mt-5 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4">
        {/* Coin Details Section */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left w-full">
          <Avatar className="w-16 h-16">
            <AvatarImage src={coin.coinDetails?.image?.large} />
          </Avatar>
          <p className="text-2xl font-bold mt-2">{coin.coinDetails?.name}</p>
          <p className="text-gray-400 uppercase text-lg">{coin.coinDetails?.symbol}</p>
          <p className="text-2xl font-bold mt-2">${coin.coinDetails?.market_data.current_price.usd}</p>
          <p className={`text-lg ${coin.coinDetails?.market_data.market_cap_change_24h < 0 ? "text-red-600" : "text-green-600"}`}>
            {coin.coinDetails?.market_data.market_cap_change_24h} ({coin.coinDetails?.market_data.market_cap_change_percentage_24h}%)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 items-center mt-4 sm:mt-0">
          <Button
            onClick={handleAddToWatchlist}
            className="h-12 w-12 flex items-center justify-center"
            variant="outline"
            size="icon"
          >
            {existInWatchlist(watchlist.items, coin.coinDetails) ? (
              <BookmarkFilledIcon className="h-6 w-6" />
            ) : (
              <BookmarkIcon className="h-6 w-6" />
            )}
          </Button>
          <Dialog>
            <DialogTrigger>
              <Button size="lg" className="px-6 py-3 text-lg">Trade</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-center text-xl font-semibold">
                  How much do you want to spend?
                </DialogTitle>
              </DialogHeader>
              <TreadingForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Chart Section */}
      <div className="mt-10">
        <StockChart coinId={coin.coinDetails?.id} />
      </div>
    </div>
  );
};

export default StockDetails;
