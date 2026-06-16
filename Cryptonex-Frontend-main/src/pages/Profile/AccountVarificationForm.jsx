/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { sendVerificationOtp, verifyOtp } from "@/Redux/Auth/Action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Auth from "../Auth/Auth";



const AccountVerificationForm = ({ handleSubmit }) => {
  const [value, setValue] = useState("");
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);

  const handleSendOtp = (verificationType) => {
    dispatch(
      sendVerificationOtp({
        verificationType,
        jwt: localStorage.getItem("jwt"),
      })
    );
  };

  return (
    <div className="flex justify-center px-4 sm:px-0">
      <div className="space-y-5 mt-10 w-full max-w-sm">
        {/* Email & OTP Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-2 w-full">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <p className="text-sm sm:text-base font-medium whitespace-nowrap">Email:</p>
            <p className="text-sm sm:text-base truncate">{auth.user?.email}</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              {/* Wrapping button inside flex to ensure centering */}
              <div className="flex justify-center w-full sm:w-auto">
                <Button className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base" onClick={() => handleSendOtp("EMAIL")}>
                  Send OTP
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-xs sm:max-w-sm">
              <DialogHeader>
                <DialogTitle className="text-center">Enter OTP</DialogTitle>
              </DialogHeader>
              <div className="py-5 flex flex-col gap-4 items-center">
                <InputOTP value={value} onChange={(value) => setValue(value)} maxLength={6}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <DialogClose asChild>
                  <Button className="w-full sm:w-[10rem] px-4 py-2 text-sm sm:text-base" onClick={() => handleSubmit(value)}>
                    Submit
                  </Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AccountVerificationForm;
