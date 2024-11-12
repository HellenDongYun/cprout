"use client";

import { useCartStore } from "@/lib/client-store";
import { useState } from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { redirect, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function AddCart() {
  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const params = useSearchParams();
  const id = Number(params.get("id"));
  const productID = Number(params.get("productID"));
  const title = params.get("title");
  const type = params.get("type");
  const price = Number(params.get("price"));
  const image = params.get("image");
  if (!id || !productID || !title || !type || !price || !image) {
    toast.error("Invalid product!");
    return redirect("/");
  }
  return (
    <>
      <div className="flex items-center gap-4 justify-stretch my-4">
        <Button
          onClick={() => {
            if (quantity > 1) {
              setQuantity(quantity - 1);
            }
          }}
          className="text-primary"
          variant={"secondary"}
        >
          <Minus size={18} strokeWidth={3} />
        </Button>
        <Button className="flex-1">Quantity: {quantity}</Button>
        <Button
          onClick={() => {
            setQuantity(quantity + 1);
          }}
          className="text-primary"
          variant={"secondary"}
        >
          <Plus size={18} strokeWidth={3} />
        </Button>
      </div>
      <Button
        onClick={() => {
          toast.success(`Added ${title + " " + type} to cart!`);
          addToCart({
            id: productID,
            variant: { variantID: id, quantity },
            name: title + type,
            price,
            image,
          });
        }}
      >
        Add to cart
      </Button>
    </>
  );
}
