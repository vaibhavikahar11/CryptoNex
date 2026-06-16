import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/Api/api";
import { getUserWallet } from "@/Redux/Wallet/Action";
import { useDispatch } from "react-redux";

// ─── Configuration ────────────────────────────────────────────────────────────
// Update UPI_ID to the merchant UPI ID that will actually receive the money.
// For demo / certification purposes this can be any valid UPI ID.
const MERCHANT_UPI_ID  = "vaibhavikahar11@okicici";
const MERCHANT_NAME    = "CryptoNex";
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Builds a UPI deep-link URL used to generate the QR code.
 * Compatible with Google Pay, PhonePe, Paytm, BHIM, etc.
 */
function buildUpiUrl(amount, note = "Wallet Top-up") {
  const params = new URLSearchParams({
    pa: MERCHANT_UPI_ID,
    pn: MERCHANT_NAME,
    am: String(amount),
    cu: "INR",
    tn: note,
  });
  return `upi://pay?${params.toString()}`;
}

/**
 * UpiPayment — renders a modal-style panel with:
 *   1. Scannable QR code
 *   2. Copyable UPI ID
 *   3. UPI ID text entry (for users who type it in their app)
 *   4. "I have paid" confirmation button that credits the wallet
 *
 * Props:
 *   amount   {number|string}  Amount in INR (whole rupees)
 *   jwt      {string}         Auth token
 *   onClose  {() => void}     Called when the panel should be dismissed
 */
export default function UpiPayment({ amount, jwt, onClose }) {
  const dispatch = useDispatch();
  const [upiId, setUpiId]           = useState("");
  const [step, setStep]             = useState("qr"); // "qr" | "success" | "error"
  const [loading, setLoading]       = useState(false);
  const [copied, setCopied]         = useState(false);

  const upiUrl = buildUpiUrl(amount);

  /* Copy merchant UPI ID to clipboard */
  const handleCopy = () => {
    navigator.clipboard.writeText(MERCHANT_UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* User confirms payment — call deposit API */
  const handleConfirmPayment = async () => {
    console.log("=== UPI Confirm Payment clicked ===");
    console.log("Amount:", amount, "| JWT present:", !!jwt);

    if (!amount || Number(amount) <= 0) {
      console.error("Invalid amount:", amount);
      alert("Invalid amount. Please go back and enter a valid amount.");
      return;
    }
    if (!jwt) {
      console.error("No JWT token found");
      alert("Session expired. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      const amountNum = Math.round(Number(amount));
      console.log("Calling PUT /api/wallet/deposit/amount/" + amountNum);
      const resp = await api.put(
        `/api/wallet/deposit/amount/${amountNum}`,
        null,
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      console.log("Deposit response:", resp.data);
      setStep("success");
      dispatch(getUserWallet(jwt));
    } catch (err) {
      console.error("UPI deposit error:", err?.response?.status, err?.response?.data || err.message);
      setStep("error");
    } finally {
      setLoading(false);
    }
  };

  if (step === "success") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div className="bg-gray-900 border border-green-600/40 rounded-2xl p-8 w-full max-w-sm text-center space-y-4 shadow-2xl">
          <div className="text-6xl">✅</div>
          <h2 className="text-2xl font-bold text-green-400">Payment Successful!</h2>
          <p className="text-gray-300 text-sm">
            ₹{amount} has been added to your CryptoNex wallet.
          </p>
          <Button onClick={onClose} className="w-full mt-2">
            Go to Wallet
          </Button>
        </div>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div className="bg-gray-900 border border-red-600/40 rounded-2xl p-8 w-full max-w-sm text-center space-y-4 shadow-2xl">
          <div className="text-6xl">❌</div>
          <h2 className="text-xl font-bold text-red-400">Deposit Failed</h2>
          <p className="text-gray-300 text-sm">Something went wrong. Please try again.</p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep("qr")} className="flex-1">
              Try Again
            </Button>
            <Button onClick={onClose} className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gradient-to-r from-violet-900/40 to-blue-900/40">
          <div>
            <h2 className="text-lg font-bold text-white">Pay via UPI</h2>
            <p className="text-xs text-gray-400">Amount: <span className="text-green-400 font-semibold">₹{amount}</span></p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none transition"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* QR Code */}
          <div className="flex flex-col items-center space-y-3">
            <div className="bg-white p-4 rounded-xl shadow-inner">
              <QRCodeSVG
                value={upiUrl}
                size={200}
                level="H"
                includeMargin={false}
              />
            </div>
            <p className="text-xs text-gray-400 text-center">
              Scan with <span className="font-semibold text-gray-200">Google Pay, PhonePe, Paytm, BHIM</span> or any UPI app
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 text-gray-500 text-xs">
            <div className="flex-1 h-px bg-gray-700" />
            <span>or enter UPI ID manually</span>
            <div className="flex-1 h-px bg-gray-700" />
          </div>

          {/* UPI ID Copy */}
          <div className="bg-gray-800 rounded-xl px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Pay to UPI ID</p>
              <p className="text-white font-mono font-semibold text-sm">{MERCHANT_UPI_ID}</p>
            </div>
            <button
              onClick={handleCopy}
              className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition"
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>

          {/* UPI ID input (user types their own UPI ID if needed for reference) */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Your UPI ID (optional, for reference)</label>
            <Input
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="yourname@upi"
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-500"
            />
          </div>

          {/* App badges */}
          <div className="flex gap-2 flex-wrap justify-center">
            {[
              { name: "Google Pay", color: "bg-blue-600" },
              { name: "PhonePe", color: "bg-purple-600" },
              { name: "Paytm", color: "bg-blue-500" },
              { name: "BHIM", color: "bg-green-700" },
            ].map((app) => (
              <span
                key={app.name}
                className={`${app.color} text-white text-xs font-medium px-2.5 py-1 rounded-full`}
              >
                {app.name}
              </span>
            ))}
          </div>

          {/* Confirm button */}
          <Button
            onClick={handleConfirmPayment}
            disabled={loading}
            className="w-full py-5 text-base font-semibold bg-green-600 hover:bg-green-500"
          >
            {loading ? "Processing…" : "✅ I have completed the payment"}
          </Button>

          <p className="text-center text-xs text-gray-500">
            Click the button above only after completing the UPI payment in your app.
          </p>
        </div>
      </div>
    </div>
  );
}
