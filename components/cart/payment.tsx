"use client";
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/client-store";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./payment-form";
import getStripe from "@/lib/get-stripe";
import { useTheme } from "next-themes";

const stripe = getStripe();

export default function Payment() {
  const { cart } = useCartStore();
  const { theme } = useTheme();

  const totalPrice = Math.round(
    cart.reduce((acc, item) => {
      return acc + item.price * item.variant.quantity;
    }, 0)
  );

  return (
    <motion.div className="max-w-2xl mx-auto">
      <Elements
        stripe={stripe}
        options={{
          mode: "payment",
          currency: "usd",
          amount: totalPrice * 100,
          appearance: { theme: theme === "dark" ? "night" : "flat" },
        }}
      >
        <PaymentForm totalPrice={totalPrice} />
      </Elements>
    </motion.div>
  );
}
