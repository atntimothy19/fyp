// @ts-nocheck
import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { CREATE_ORDER } from "../utils/constants";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import { useRouter } from "next/router";

const stripePromise = loadStripe("pk_test_51PSvYkCAeMrUOrjyLIRH8OVjuQTqfOrKeDLctyOTpBi8RByEyNnU2qED3Zn5gUpMNgjTIxx3WnPuLLS69Ek25ilU00agddExEN");

function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const router = useRouter();
  const { gigId } = router.query;

  useEffect(() => {
    const createOrderIntent = async () => {
      try {
        const { data } = await axios.post(
          CREATE_ORDER,
          { gigId },
          { withCredentials: true }
        );
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Error creating order intent:", error);
      }
    };

    if (gigId) createOrderIntent();
  }, [gigId]);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="px-4 md:px-8 py-6 md:py-10">
      <h1 className="text-2xl md:text-3xl text-center mb-4">
        Please complete the payment to place the order.
      </h1>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}

export default Checkout;
