import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PaymentDetailsForm from "./PaymentDetailsForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getPaymentDetails } from "@/Redux/Withdrawal/Action";
import { maskAccountNumber } from "@/Util/maskAccountNumber";

const PaymentDetails = () => {
  const dispatch = useDispatch();
  const { withdrawal } = useSelector((store) => store);

  useEffect(() => {
    dispatch(getPaymentDetails({ jwt: localStorage.getItem("jwt") }));
  }, []);

  return (
    <div className="max-w-md sm:max-w-2xl mx-auto sm:px-6 px-4 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8">
        Payment Details
      </h1>
      {withdrawal.paymentDetails ? (
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              {withdrawal.paymentDetails?.bankName.toUpperCase()}
            </CardTitle>
            <CardDescription className="text-sm">
              A/C No:{" "}
              {maskAccountNumber(withdrawal.paymentDetails?.accountNumber)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm sm:text-base">
              <p className="font-medium">A/C Holder</p>
              <p className="text-gray-500">
                {withdrawal.paymentDetails.accountHolderName}
              </p>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <p className="font-medium">IFSC</p>
              <p className="text-gray-500">
                {withdrawal.paymentDetails.ifsc.toUpperCase()}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex justify-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="default"
                className="w-full sm:w-auto px-6 py-3 text-sm sm:text-base"
              >
                Add Payment Details
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader className="pb-5">
                <DialogTitle>Payment Details</DialogTitle>
              </DialogHeader>
              <PaymentDetailsForm />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default PaymentDetails;
