import React, { useState } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import axios from "axios";

const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#000",
      color: "#96979B",
      fontWeight: "500",
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": {
        color: "#fce883",
      },
      "::placeholder": {
        color: "#96979B",
      },
    },
    invalid: {
      iconColor: "#000",
      color: "#96979B",
    },
  },
};

export default function PaymentForm() {
  const [success, setSuccess] = useState(false);
  const [cardNumberComplete, setCardNumberComplete] = useState(false);
  const [cardNumberError, setCardNumberError] = useState(false);
  const [cardNumberErrorMsg, setCardNumberErrorMsg] = useState("");
  const [cardDateComplete, setCardDateComplete] = useState(false);
  const [cardDateError, setCardDateError] = useState(false);
  const [cardDateErrorMsg, setCardDateErrorMsg] = useState("");
  const [cardCVVComplete, setCardCVVComplete] = useState(false);
  const [cardCVVError, setCardCVVError] = useState(false);
  const [cardCVVErrorMsg, setCardCVVErrorMsg] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleChange = (e) => {
    if (e.elementType === "cardNumber") {
      if (e.complete) {
        setCardNumberComplete(true);
        setCardNumberError(false);
      } else if (e.error && !e.complete) {
        setCardNumberError(true);
        setCardNumberErrorMsg(e.error.message);
      }
    } else if (e.elementType === "cardExpiry") {
      if (e.complete === true) {
        setCardDateError(false);
        setCardDateComplete(true);
      } else if (e.error && !e.complete) {
        setCardDateError(true);
        setCardDateErrorMsg(e.error.message);
      }
    } else if (e.elementType === "cardCvc") {
      if (e.complete) {
        setCardCVVError(false);
        setCardCVVComplete(true);
      } else if (e.error && !e.complete) {
        setCardCVVError(true);
        setCardCVVErrorMsg(e.error.message);
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setisLoading(true);
    if (!stripe || !elements) {
      return;
    }
    const CardElement = elements.getElement(CardNumberElement,CardExpiryElement,CardCvcElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: CardElement,
    });

    if (!error) {
      try {
        const { id } = paymentMethod;
        const response = await axios.post("http://localhost:4000/payment", {
          amount: 50,
          id,
        });

        if (response.data.success) {
          setisLoading(false);
          console.log("Successful Payment");
          setSuccess(true);
        }
      } catch (error) {
        setisLoading(false);
        console.log("ERROR: ", error);
      }
    } else {
      setisLoading(false);
      console.log(error.message);
    }
  };

  return (
    <>
      {!success ? (
        <form onSubmit={handleSubmit}>
          <fieldset className="row">
            <div className="col-12 form-group">
              <label>Enter Card Number</label>
              <div className="FormGroup">
                <CardNumberElement
                  className="form-control"
                  options={CARD_OPTIONS}
                  onChange={handleChange}
                />
              </div>
              {cardNumberError && (
                <span className="text-danger">{cardNumberErrorMsg}</span>
              )}
            </div>
          </fieldset>
          <fieldset className="row">
            <div className="col-sm-12 col-md-6 form-group">
              <label>Enter Expiry Date</label>
              <div className="FormGroup">
                <CardExpiryElement
                  className="form-control"
                  options={CARD_OPTIONS}
                  onChange={handleChange}
                />
              </div>
              {cardDateError && (
                <span className="text-danger">{cardDateErrorMsg}</span>
              )}
            </div>
            <div className="col-sm-12 col-md-6 form-group">
              <label>Enter CVV</label>
              <div className="FormGroup">
                <CardCvcElement
                  type="password"
                  className="form-control"
                  options={CARD_OPTIONS}
                  onChange={handleChange}
                />
              </div>
              {cardCVVError && (
                <span className="text-danger">{cardCVVErrorMsg}</span>
              )}
            </div>
          </fieldset>
          <button
            className="payment-btn"
            type="submit"
            onClick={handleSubmit}
            disabled={
              !cardNumberComplete || !cardDateComplete || !cardCVVComplete
            }
          >
            {isLoading && (
              <i
                className="fa fa-spinner fa-pulse fa-3x fa-fw"
                style={{ fontSize: "15px", marginRight: "5px", color: "white" }}
              ></i>
            )}
            Pay
          </button>
        </form>
      ) : (
        <div>
          <h2>Congratulations! You just did a successful payment.</h2>
        </div>
      )}
    </>
  );
}
