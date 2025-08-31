import { transferMoney } from "@/Redux/Wallet/Action";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const TransferForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    amount: "",
    walletId: "",
    purpose: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    dispatch(
      transferMoney({
        jwt: localStorage.getItem("jwt"),
        walletId: formData.walletId,
        reqData: {
          amount: formData.amount,
          purpose: formData.purpose,
        },
      })
    );
    console.log(formData);
     toast.success(`Successfully transferred $${formData.amount}!`);
  };

  return (
    <div className="pt-6 space-y-5 mx-auto px-5 sm:px-6 w-full max-w-md">
      <div>
        <h1 className="pb-2 text-lg sm:text-xl font-medium">Enter Amount</h1>
        <Input
          name="amount"
          type="number"
          onChange={handleChange}
          value={formData.amount}
          className="py-3 w-full text-base sm:text-lg"
          placeholder="$9999"
        />
      </div>
      <div>
        <h1 className="pb-2 text-lg sm:text-xl font-medium">Enter Wallet Id</h1>
        <Input
          name="walletId"
          onChange={handleChange}
          value={formData.walletId}
          className="py-3 w-full text-base sm:text-lg"
          placeholder="Enter only last numeric part of id"
        />
      </div>

      <div>
        <h1 className="pb-2 text-lg sm:text-xl font-medium">Purpose</h1>
        <Input
          name="purpose"
          onChange={handleChange}
          value={formData.purpose}
          className="py-3 w-full text-base sm:text-lg"
          placeholder="Gift for your friend..."
        />
      </div>

      <DialogClose asChild>
        <Button
          onClick={handleSubmit}
          variant="primary"
          className="w-full py-3 text-lg sm:text-xl"
        >
          Send
        </Button>
      </DialogClose>
    </div>
  );
};

export default TransferForm;
