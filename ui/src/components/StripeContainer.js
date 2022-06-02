import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";

const PUBLIC_KEY_STRIPE = process.env.REACT_APP_PUBLIC_KEY;
const StripeTestPromise = loadStripe(PUBLIC_KEY_STRIPE);

export default function StripeContainer() {
  return (
    <Elements stripe={StripeTestPromise}>
      <PaymentForm />
    </Elements>
  );
}
