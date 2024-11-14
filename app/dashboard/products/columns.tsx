"use client";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Divide, MoreHorizontal, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/server/actions/delete-product";
import { toast } from "sonner";
import Link from "next/link";
import { VariantsWithImagesTags } from "@/lib/infer-type";
import { ProductVariant } from "./product-variant";
type productColumn = {
  title: string;
  price: number;
  image: string;
  variants: VariantsWithImagesTags[];
  id: number;
};
async function deleteProductWrapper(id: number) {
  const { data } = await deleteProduct({ id });
  if (!data) return new Error("no data found!");
  if (data.success) toast.success(data.success);
  if (data.error) toast.error(data.error);
}
export const columns: ColumnDef<productColumn>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "usd",
      }).format(price);
      return <div className="font-medium text-xs">{formatted}</div>;
    },
  },
  {
    accessorKey: "variants",
    header: "Variants",
    cell: ({ row }) => {
      const variants = row.getValue("variants") as VariantsWithImagesTags[];
      return (
        <div className="flex gap-2">
          {variants.map((variant) => (
            <div key={variant.id}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ProductVariant
                      productID={variant.productID}
                      variant={variant}
                      editMode={true}
                    >
                      <div
                        className="w-5 h-5 rounded-full"
                        key={variant.id}
                        style={{ background: variant.color }}
                      />
                    </ProductVariant>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{variant.productType}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <ProductVariant productID={row.original.id} editMode={false}>
                    <PlusCircle className="h-5 w-5" />
                  </ProductVariant>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create a new product variant</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        currency: "USD",
        style: "currency",
      }).format(price);
      return <div className="font-medium text-xs">{formatted}</div>;
    },
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const cellImage = row.getValue("image") as string;
      const cellTitle = row.getValue("title") as string;
      return (
        <div>
          <Image
            src={cellImage}
            alt={cellTitle}
            width={50}
            height={50}
            className="rounded-full"
          />
        </div>
      );
    },
  },

  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="dark:focus:bg-primary dark:focus:text-black focus:bg-primary/50 cursor-pointer">
              <Link href={`/dashboard/add-product?id=${product.id}`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="dark:focus:bg-destructive focus:bg-destructive/50 cursor-pointer"
              onClick={() => deleteProductWrapper(product.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
