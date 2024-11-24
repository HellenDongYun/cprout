import { db } from "@/server";
import { orders } from "@/server/schema";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// export const config = { api: { bodyParser: false } };

// export async function POST(req: NextRequest) {
//   const stripe = new Stripe(process.env.STRIPE_SECRET || "", {
//     apiVersion: "2024-10-28.acacia",
//   });
//   const sig = req.headers.get("stripe-signature") || "";
//   const signingSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

//   // Read the request body as text
//   const reqText = await req.text();
//   // Convert the text to a buffer
//   const reqBuffer = Buffer.from(reqText);

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(reqBuffer, sig, signingSecret);
//   } catch (err: any) {
//     return new NextResponse(`Webhook Error: ${err.message}`, {
//       status: 400,
//     });
//   }

//   // Handle the event just an example!
//   switch (event.type) {
//     case "payment_intent.succeeded":
//       const retrieveOrder = await stripe.paymentIntents.retrieve(
//         event.data.object.id,
//         { expand: ["latest_charge"] }
//       );
//       const charge = retrieveOrder.latest_charge as Stripe.Charge;

//       await db
//         .update(orders)
//         .set({
//           status: "succeeded",
//           receiptURL: charge.receipt_url,
//         })
//         .where(eq(orders.paymentIntentID, event.data.object.id))
//         .returning();

//       // Then define and call a function to handle the event product.created
//       break;

//     default:
//       console.log(`${event.type}`);
//   }

//   return new Response("ok", { status: 200 });
// }
export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET || "", {
    apiVersion: "2024-11-20.acacia",
  });
  const sig = req.headers.get("stripe-signature") || "";
  const signingSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  const reqText = await req.text();
  const reqBuffer = Buffer.from(reqText);

  let event;

  try {
    event = stripe.webhooks.constructEvent(reqBuffer, sig, signingSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("Payment succeeded:", paymentIntent.id);

        const retrieveOrder = await stripe.paymentIntents.retrieve(
          paymentIntent.id,
          {
            expand: ["latest_charge"],
          }
        );

        const charge = retrieveOrder.latest_charge as Stripe.Charge | null;

        if (!charge) {
          console.error(
            "Charge not found for Payment Intent ID:",
            paymentIntent.id
          );
          return new Response("Charge not found", { status: 400 });
        }

        const updatedOrder = await db
          .update(orders)
          .set({
            status: "succeeded",
            receiptURL: charge.receipt_url,
          })
          .where(eq(orders.paymentIntentID, paymentIntent.id))
          .returning();

        if (!updatedOrder.length) {
          console.error(
            "Order update failed. Payment Intent ID:",
            paymentIntent.id
          );
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response("Event received", { status: 200 });
  } catch (err) {
    console.error("Error handling event:", err);
    return new Response("Internal server error", { status: 500 });
  }
}
