"use client";
import { useCartStore } from "@/lib/client-store";
import { motion } from "framer-motion";
import { DrawerDescription, DrawerTitle } from "../ui/drawer";
export default function CartMessage() {
  const { checkoutProgress, setCheckoutProgress } = useCartStore();
  return (
    <motion.div animate={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: 10 }}>
      <DrawerTitle>
        {checkoutProgress === "cart-page" ? "Your cart items" : null}
        {checkoutProgress === "payment-page" ? "Choose a payment" : null}
        {checkoutProgress === "confirmation-page" ? "Order confirmation" : null}
      </DrawerTitle>
      <DrawerDescription className="py-1">
        View and edit your bag!
      </DrawerDescription>
    </motion.div>
  );
}
