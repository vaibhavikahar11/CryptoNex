import { paymentHandler } from "@/Redux/Wallet/Action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { DotFilledIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UpiPayment from "./UpiPayment";

const TopupForm = () => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("STRIPE");
  const [showUpiModal, setShowUpiModal] = useState(false);
  const wallet = useSelector((store) => store.wallet);
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");

  const handleChange = (e) => {
    setAmount(e.target.value);
  };

  const handleSubmit = () => {
    if (!amount || Number(amount) <= 0) return;

    if (paymentMethod === "UPI") {
      // Show our custom UPI payment modal
      setShowUpiModal(true);
      return;
    }

    dispatch(
      paymentHandler({
        jwt,
        paymentMethod,
        amount,
      })
    );
  };

  return (
    <>
      {/* UPI Payment Modal */}
      {showUpiModal && (
        <UpiPayment
          amount={amount}
          jwt={jwt}
          onClose={() => setShowUpiModal(false)}
        />
      )}

      <div className="pt-10 space-y-5 max-w-md mx-auto px-4 sm:px-6 md:px-8 lg:max-w-lg">
        <div>
          <h1 className="pb-1 text-lg font-semibold">Enter Amount</h1>
          <Input
            onChange={handleChange}
            value={amount}
            className="py-4 text-lg w-full"
            placeholder="₹999"
            type="number"
            min="1"
          />
        </div>

        <div>
          <h1 className="pb-1 text-lg font-semibold">Select Payment Method</h1>
          <RadioGroup
            onValueChange={(value) => setPaymentMethod(value)}
            className="flex flex-col space-y-3"
            defaultValue="STRIPE"
          >
            {/* ── Stripe ── */}
            <div className="flex items-center space-x-2 border p-3 px-5 rounded-md w-full">
              <RadioGroupItem
                icon={DotFilledIcon}
                className="h-9 w-9"
                iconClassName="h-8 w-8"
                value="STRIPE"
                id="r2"
              />
              <Label htmlFor="r2" className="cursor-pointer flex-1">
                <div className="bg-white rounded-md px-5 py-2 w-32 flex justify-center items-center">
                  <span className="text-[#635BFF] font-bold text-lg">Stripe</span>
                </div>
                <p className="text-xs text-gray-400 mt-1 pl-1">Card / International</p>
              </Label>
            </div>

            {/* ── Razorpay (Card, Netbanking, Wallet) ── */}
            <div className="flex items-center space-x-2 border p-3 px-5 rounded-md w-full">
              <RadioGroupItem
                icon={DotFilledIcon}
                className="h-9 w-9"
                iconClassName="h-8 w-8"
                value="RAZORPAY"
                id="r3"
              />
              <Label htmlFor="r3" className="cursor-pointer flex-1">
                <div className="flex items-center gap-3">
                  <div className="bg-white rounded-md px-5 py-2 w-32 flex justify-center items-center">
                    <span className="text-[#3395FF] font-bold text-lg">Razorpay</span>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-purple-300">
                      Cards
                    </span>
                    <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-orange-300">
                      Netbanking
                    </span>
                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-blue-300">
                      Wallet
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1 pl-1">Pay by Card, Netbanking or Wallet</p>
              </Label>
            </div>

            {/* ── UPI (Custom — QR + UPI ID) ── */}
            <div className="flex items-center space-x-2 border p-3 px-5 rounded-md w-full border-green-700/50 bg-green-950/20">
              <RadioGroupItem
                icon={DotFilledIcon}
                className="h-9 w-9"
                iconClassName="h-8 w-8"
                value="UPI"
                id="r4"
              />
              <Label htmlFor="r4" className="cursor-pointer flex-1">
                <div className="flex items-center gap-3">
                  <div className="bg-white rounded-md px-5 py-2 w-32 flex justify-center items-center">
                    <span className="text-green-600 font-bold text-lg">📱 UPI</span>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-green-300">
                      QR Code
                    </span>
                    <span className="bg-teal-100 text-teal-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-teal-300">
                      UPI ID
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1 pl-1">
                  Google Pay · PhonePe · Paytm · BHIM
                </p>
              </Label>
            </div>
          </RadioGroup>

          {/* Info box when UPI selected */}
          {paymentMethod === "UPI" && (
            <div className="mt-3 p-3 rounded-lg bg-green-950/30 border border-green-700/40 flex items-start gap-2">
              <span className="text-green-400 text-xl mt-0.5">📲</span>
              <div>
                <p className="text-green-300 text-sm font-medium">Scan QR or Enter UPI ID</p>
                <p className="text-green-400/70 text-xs mt-0.5">
                  After clicking Submit, a QR code will appear. Scan with any UPI app to pay instantly.
                </p>
              </div>
            </div>
          )}
        </div>

        {wallet.loading ? (
          <Skeleton className="py-4 w-full" />
        ) : (
          <Button
            onClick={handleSubmit}
            className={`w-full py-4 text-lg ${
              paymentMethod === "UPI"
                ? "bg-green-600 hover:bg-green-500"
                : ""
            }`}
          >
            {paymentMethod === "UPI"
              ? "📱 Pay via UPI"
              : paymentMethod === "RAZORPAY"
              ? "💳 Pay with Razorpay"
              : "Submit"}
          </Button>
        )}
      </div>
    </>
  );
};

export default TopupForm;
