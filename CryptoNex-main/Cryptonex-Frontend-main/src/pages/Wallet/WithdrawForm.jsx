import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withdrawalRequest } from "@/Redux/Withdrawal/Action";
import { DialogClose } from "@/components/ui/dialog";
import { maskAccountNumber } from "@/Util/maskAccountNumber";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const WithdrawForm = () => {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState("");
  const { wallet, withdrawal } = useSelector((store) => store);
  const navigate = useNavigate();

  const handleChange = (e) => {
    let value = e.target.value;
    if (value.toString().length < 6) {
      setAmount(value);
    }
  };

  const handleSubmit = () => {
    const availableBalance = wallet.userWallet?.balance || 0;

    if (!amount || amount <= 0) {
      toast.error("Please enter a valid withdrawal amount.");
      return;
    }

    if (amount > availableBalance) {
      toast.error("Insufficient balance. Please enter a smaller amount.");
      return;
    }

    dispatch(withdrawalRequest({ jwt: localStorage.getItem("jwt"), amount }));
    toast.success(`Withdrawal of $${amount} is being processed.`);
    setAmount("");
  };

  if (!withdrawal.paymentDetails) {
    return (
      <div className="h-[20rem] flex flex-col gap-5 justify-center items-center px-6 text-center">
        <p className="text-lg sm:text-xl font-bold">Add Payment Method</p>
        <Button 
          className="w-full sm:w-auto py-3 text-lg" 
          onClick={() => navigate("/payment-details")}
        >
          Add Payment Details
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-6 px-5 sm:px-8 space-y-6 max-w-md mx-auto">
      {/* Balance Section */}
     <div className="container mx-auto p-4">
  <div className="flex flex-wrap items-center gap-4 border px-4 py-3 rounded-lg">
    <p>Available Balance</p>
    <p>${wallet.userWallet?.balance}</p>
  </div>
</div>



      {/* Withdrawal Input */}
      <div className="text-center">
        <h1 className="text-lg sm:text-xl font-semibold mb-3">Enter Amount</h1>
        <Input
          onChange={handleChange}
          value={amount}
          className="w-full py-4 text-lg text-center border rounded-md"
          placeholder="$9999"
          type="number"
        />
      </div>

      {/* Transfer To Section */}
      <div>
        <p className="pb-2 text-base font-semibold">Transfer To</p>
        <div className="flex flex-wrap items-center gap-4 border px-4 py-3 rounded-lg">
          <img 
            className="h-10 w-10 sm:h-8 sm:w-8" 
            src="https://cdn.pixabay.com/photo/2020/02/18/11/03/bank-4859142_1280.png" 
            alt="Bank Icon" 
          />
          <div className="text-sm sm:text-base">
            <p className="font-bold">{withdrawal.paymentDetails?.bankName}</p>
            <p>{maskAccountNumber(withdrawal.paymentDetails?.accountNumber)}</p>
          </div>
        </div>
      </div>

    {/* Submit Button */}
{/* Submit Button */}
<DialogClose className="w-full">
  <Button
    onClick={handleSubmit}
     className={`w-full py-6 `}
    style={{
        height: '60px',  // Default height for larger screens
        display: 'flex',  // Flexbox layout for full width clickability
        justifyContent: 'center',  // Centers text horizontally
        alignItems: 'center',  // Centers text vertically
        pointerEvents: 'auto',  // Ensure button is always clickable
     
        
        zIndex: 10, // Ensure this button stays on top if there are layers
      }}
      className="sm:py-4 sm:text-lg lg:py-6 lg:text-xl" // Adjust padding and text size for smaller screens
    >
  
    Withdraw {amount && <span className="ml-2">${amount}</span>}
  </Button>
</DialogClose>



    </div>
  );
};

export default WithdrawForm;
