"use client";
import { motion } from "framer-motion";
import { VariantsWithImagesTags } from "@/lib/infer-type";
import { useSearchParams } from "next/navigation";

export default function ProductType({
  variants,
}: {
  variants: VariantsWithImagesTags[];
}) {
  const searchParams = useSearchParams();
  const selectedType = searchParams.get("type");
  // console.log(variants);
  return variants.map((variant) => {
    if (variant.productType === selectedType) {
      return (
        <motion.div
          key={variant.id}
          animate={{ y: 0, opacity: 1 }}
          initial={{ opacity: 0, y: 6 }}
          className="text-secondary-foreground font-medium"
        >
          {selectedType}
        </motion.div>
      );
    }
  });
}
