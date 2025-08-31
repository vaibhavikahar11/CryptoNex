import { getAssetDetails } from "@/Redux/Assets/Action";
import { payOrder } from "@/Redux/Order/Action";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DotIcon } from "@radix-ui/react-icons";
import { DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TreadingForm = () => {
  const { coin, asset, wallet, auth } = useSelector((store) => store);
  const [quantity, setQuantity] = useState(0);
  const [amount, setAmount] = useState(0);
  const dispatch = useDispatch();
  const [orderType, setOrderType] = useState("BUY");

  const handleOnChange = (e) => {
    const amount = e.target.value;
    setAmount(amount);
    const volume = calculateBuyCost(
      amount,
      coin.coinDetails?.market_data.current_price.usd
    );
    setQuantity(volume);
  };

  function calculateBuyCost(amountUSD, cryptoPrice) {
    let volume = amountUSD / cryptoPrice;

    let decimalPlaces = Math.max(
      2,
      cryptoPrice.toString().split(".")[0].length
    );

    return volume.toFixed(decimalPlaces);
  }

  const handleBuyCrypto = () => {
    console.log("Buy/Sell button clicked");

    // Logging the auth state for debugging
    console.log("Auth state:", auth);

    // Verification checks for account and 2FA
    if ( !auth?.user?.verified) {
      toast.error("Your account is not verified. Please verify it first.");
      return;
    }
    if (!auth?.user?.twoFactorAuth?.enabled) {
      toast.error("Two-factor authentication is not enabled. Please enable it.");
      return;
    }

    // Insufficient balance or quantity checks
    if (
      orderType === "SELL" &&
      asset.assetDetails?.quantity * coin.coinDetails?.market_data.current_price <
        amount
    ) {
      toast.error("Insufficient quantity to sell.");
      return;
    }

    if (
      orderType === "BUY" &&
      quantity * coin.coinDetails?.market_data.current_price.usd >
        wallet.userWallet?.balance
    ) {
      toast.error("Insufficient wallet balance to buy.");
      return;
    }

    // Dispatch the order
    dispatch(
      payOrder({
        jwt: localStorage.getItem("jwt"),
        amount,
        orderData: {
          coinId: coin.coinDetails?.id,
          quantity,
          orderType,
        },
      })
    );

    toast.success(`Order placed successfully for ${orderType.charAt(0).toUpperCase() + orderType.slice(1).toLowerCase()}ing crypto!`);

  };

  useEffect(() => {
    if (coin.coinDetails?.id) {
      dispatch(
        getAssetDetails({
          coinId: coin.coinDetails.id,
          jwt: localStorage.getItem("jwt"),
        })
      );
    }
  }, [dispatch, coin.coinDetails?.id]);

  return (
    <div className="space-y-10 p-5">
      <div>
        <div className=" flex gap-4 items-center justify-between">
          <Input
            className="py-7 focus:outline-none "
            placeholder="enter amount..."
            onChange={handleOnChange}
            type="number"
          />
          <div>
            <p className="border text-2xl flex justify-center items-center w-36 h-14 rounded-md">
              {quantity}
            </p>
          </div>
        </div>
        {orderType === "SELL" &&
          asset.assetDetails?.quantity * coin.coinDetails?.market_data.current_price <
            amount && (
            <h1 className="text-red-500 text-bold text-center pt-4">
              Insufficient quantity to sell
            </h1>
          )}
        {orderType === "BUY" &&
          quantity * coin.coinDetails?.market_data.current_price.usd >
            wallet.userWallet?.balance && (
            <h1 className="text-red-500 text-bold text-center pt-4">
              Insufficient Wallet Balance To Buy
            </h1>
          )}
      </div>

      <div className="flex gap-5 items-center">
        <div>
          <Avatar>
            <AvatarImage src={coin.coinDetails?.image.large} />
          </Avatar>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p>{coin.coinDetails?.symbol?.toUpperCase()}</p>
            <DotIcon className="text-gray-400" />
            <p className="text-gray-400">{coin.coinDetails?.name}</p>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-xl font-bold">
              {coin.coinDetails?.market_data.current_price.usd}
            </p>
            <p
              className={`${
                coin.coinDetails?.market_data.market_cap_change_24h < 0
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              <span className="">
                {coin.coinDetails?.market_data.market_cap_change_24h}
              </span>
              <span>
                ({coin.coinDetails?.market_data.market_cap_change_percentage_24h}
                %)
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p>Order Type</p>
        <p>Market Order</p>
      </div>
      <div className="flex items-center justify-between">
        <p>{orderType === "BUY" ? "Available Cash" : "Available Quantity"}</p>
        <div>
          {orderType === "BUY" ? (
            <div className="flex items-center ">
              <DollarSign />
              <span className="text-2xl font-semibold">
                {wallet.userWallet?.balance}
              </span>
            </div>
          ) : (
            <p>{asset.assetDetails?.quantity || 0}</p>
          )}
        </div>
      </div>
<div className="w-full">
  <DialogClose className="w-full">
    <Button
      onClick={handleBuyCrypto}
      className={`w-full py-6 ${orderType === "SELL" ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}
      disabled={
        quantity === 0 ||
        (orderType === "SELL" && !asset.assetDetails?.quantity) ||
        (orderType === "SELL"
          ? asset.assetDetails?.quantity * coin.coinDetails?.market_data.current_price < amount
          : quantity * coin.coinDetails?.market_data.current_price.usd > wallet.userWallet?.balance)
      }
      style={{
        height: '60px',  // Default height for larger screens
        display: 'flex',  // Flexbox layout for full width clickability
        justifyContent: 'center',  // Centers text horizontally
        alignItems: 'center',  // Centers text vertically
        pointerEvents: 'auto',  // Ensure button is always clickable
        backgroundColor: orderType === "SELL" ? "#e53e3e" : "#38a169", // Conditional background color
        color: "white",  // Apply custom text color
        zIndex: 10, // Ensure this button stays on top if there are layers
      }}
      className="sm:py-4 sm:text-lg lg:py-6 lg:text-xl" // Adjust padding and text size for smaller screens
    >
      {orderType}
    </Button>
  </DialogClose>

  <Button
    onClick={() => setOrderType(orderType === "BUY" ? "SELL" : "BUY")}
    className="w-full mt-5 text-xl sm:text-lg"
    variant="link"
    style={{
      height: '50px',  // Button height
      display: 'flex',  // Flexbox layout for consistent button sizing
      justifyContent: 'center',  // Centers text horizontally
      alignItems: 'center',  // Centers text vertically
      textDecoration: 'none',  // Avoid link underline if any
      color: '#3182ce', // Link color
      zIndex: 5,  // Keeps the second button under the first one if needed
    }}
  >
    {orderType === "BUY" ? "Or Sell" : "Or Buy"}
  </Button>
</div>



    </div>
  );
};

export default TreadingForm;
