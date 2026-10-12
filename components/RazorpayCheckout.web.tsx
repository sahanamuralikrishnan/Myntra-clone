import { useEffect, useRef } from "react";

// Browser version of RazorpayCheckout. Expo picks this file instead of
// RazorpayCheckout.tsx when the app runs in a browser, so checkout.tsx
// doesn't need to change.

type RazorpaySuccess = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type Props = {
  visible: boolean;
  keyId: string;
  razorpayOrderId: string;
  amount: number; // in paise, same value the backend returned
  name: string;
  email: string;
  onSuccess: (data: RazorpaySuccess) => void;
  onClose: () => void;
};

const SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

// Add Razorpay's script to the page once, and reuse it after that
function loadRazorpayScript(): Promise<void> {
  if ((window as any).Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load Razorpay"));
    document.body.appendChild(script);
  });
}

export default function RazorpayCheckout({
  visible,
  keyId,
  razorpayOrderId,
  amount,
  name,
  email,
  onSuccess,
  onClose,
}: Props) {
  // Keep the latest callbacks without reopening the popup when they change
  const onSuccessRef = useRef(onSuccess);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;

    loadRazorpayScript()
      .then(() => {
        if (cancelled) return;
        const rzp = new (window as any).Razorpay({
          key: keyId,
          amount: String(amount),
          currency: "INR",
          order_id: razorpayOrderId,
          name: "Myntra Clone",
          prefill: { name, email },
          method: {
            netbanking: false,
            card: false,
            wallet: true,
            upi: true,
          },
          handler: (response: RazorpaySuccess) => {
            onSuccessRef.current({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
          },
          modal: {
            ondismiss: () => onCloseRef.current(),
          },
        });
        // Razorpay keeps its popup open after a failed attempt so the user can retry
        rzp.on("payment.failed", (response: any) => {
          window.alert(
            "Payment failed: " +
              ((response.error && response.error.description) || "Please try another payment method.")
          );
        });
        rzp.open();
      })
      .catch(() => {
        window.alert("Could not load the payment page. Please check your connection and try again.");
        onCloseRef.current();
      });

    return () => {
      cancelled = true;
    };
  }, [visible, keyId, razorpayOrderId, amount, name, email]);

  // Razorpay draws its own popup on top of the page, so nothing to render here
  return null;
}
