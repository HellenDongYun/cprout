"use server";

import { paymentIntentSchema } from "@/app/type/payment-intent-schema";
import { createSafeActionClient } from "next-safe-action";
import Stripe from "stripe";
import * as z from "zod";
import { auth } from "../auth";
const stripe = new Stripe(process.env.STRIPE_SECRET!);
const action = createSafeActionClient();
type CartItem = z.infer<typeof paymentIntentSchema>["cart"][number];
export const createPaymentIntent = action(
  paymentIntentSchema,
  async ({ amount, cart, currency }) => {
    const user = await auth();
    if (!user) return { error: "Please login to continue" };
    if (!amount) return { error: "No Product to checkout" };

    // 简化 cart 数据，保留必要的信息
    const simplifiedCart = cart.map(
      ({ productID, quantity, title, price }: CartItem) => ({
        productID,
        quantity,
        title,
        price,
      })
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        cart: JSON.stringify(simplifiedCart),
      },
    });
    return {
      success: {
        paymentIntentID: paymentIntent.id,
        clientSecretID: paymentIntent.client_secret,
        user: user.user.email,
      },
    };
  }
);
