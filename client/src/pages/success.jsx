import { ORDER_SUCCESS_ROUTE } from "../utils/constants";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

function Success() {
  const router = useRouter();
  const { payment_intent } = router.query;

  useEffect(() => {
    const changeOrderStatus = async () => {
      try {
        await axios.put(
          ORDER_SUCCESS_ROUTE,
          { paymentIntent: payment_intent },
          { withCredentials: true }
        );
      } catch (err) {
        console.error(err);
      }
    };
    
    if (payment_intent) {
      changeOrderStatus();
      setTimeout(() => router.push("/buyer/orders"), 5000);
    } else {
      router.push("/");
    }
  }, [payment_intent, router]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6">
      <h1 className="text-2xl md:text-4xl text-center mb-4">
        Payment successful. You are being redirected to the orders page.
      </h1>
      <h1 className="text-2xl md:text-4xl text-center mb-4">
        Please do not close the page.
      </h1>
    </div>
  );
}

export default Success;
