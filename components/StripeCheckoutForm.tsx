

"use client";

import { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  AddressElement
} from "@stripe/react-stripe-js";
import { Layout } from "@stripe/stripe-js";
import { Button } from "@mui/material";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("payment_intent_client_secret");
    setConfirmed(param !== null);
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "https://stripe-test-app.vercel.app/payment-complete",
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      console.log(error)
      setMessage("An error occurred.");
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: 'accordion' as Layout,
  };

  if (!stripe || !elements) {
    return <></>;
  }

  return (
    <div className="column" id="payment-form" style={{ width: "100%" }}>
      <PaymentElement
        id="payment-element"
        options={paymentElementOptions}
      />
      <Button variant="contained" fullWidth onClick={handleSubmit}>
        Continue to Checkout
      </Button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </div>
  );
}