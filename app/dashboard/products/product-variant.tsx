"use client";

import { VariantsWithImagesTags } from "@/lib/infer-type";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { VariantSchema } from "@/app/type/variant-schema";
import { InputTags } from "./input-tags";
import VariantImages from "./variant-images";
import { useAction } from "next-safe-action/hooks";
import { createVariant } from "@/server/actions/create-variant";
import { toast } from "sonner";
import { forwardRef, useEffect, useState } from "react";
import { deleteVariant } from "@/server/actions/delete-variant";

type VariantProps = {
  children: React.ReactNode;
  editMode: boolean;
  productID?: number;
  variant?: VariantsWithImagesTags;
};

export const ProductVariant = ({
  children,
  editMode,
  productID,
  variant,
}: VariantProps) => {
  const form = useForm<z.infer<typeof VariantSchema>>({
    resolver: zodResolver(VariantSchema),
    defaultValues: {
      tags: [],
      variantImages: [],
      color: "#000000",
      editMode,
      id: undefined,
      productID,
      productType: "Black Notebook",
    },
  });

  const [open, setOpen] = useState(false);

  const setEdit = () => {
    if (!editMode) {
      form.reset();
      return;
    }
    if (editMode && variant) {
      form.setValue("editMode", true);
      form.setValue("id", variant.id);
      form.setValue("productType", variant.productType);
      form.setValue("productID", variant.productID);
      form.setValue("color", variant.color);
      form.setValue(
        "tags",
        variant.variantTags.map((tag) => tag.tag)
      );
      form.setValue(
        "variantImages",
        variant.variantImages.map((img) => ({
          name: img.name,
          size: img.size,
          url: img.url,
        }))
      );
    }
  };
  useEffect(() => {
    setEdit();
  }, [variant]);

  const { execute, status } = useAction(createVariant, {
    onExecute() {
      toast.loading("Creating Variant", { duration: 5000 });
      setOpen(false);
    },
    onSuccess(data) {
      if (data?.error) {
        toast.error(data.error, { duration: 5000 });
      }
      if (data?.success) {
        toast.success(data.success, { duration: 5000 });
      }
    },
  });
  const variantAction = useAction(deleteVariant, {
    onExecute() {
      toast.loading("Deleting Variant", { duration: 1 });
      setOpen(false);
    },
    onSuccess(data) {
      if (data?.error) toast.error(data.error, { duration: 5000 });
      if (data?.success) toast.success(data.success, { duration: 5000 });
    },
  });
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof VariantSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    execute(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-[860px]">
        <DialogHeader>
          <DialogTitle>{editMode ? "Edit" : "Create"} your Variant</DialogTitle>
          <DialogDescription>Manage your product variant</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="productType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>variant title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="pick a title for your variant"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>variant color</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>variant tags</FormLabel>
                  <FormControl>
                    <InputTags {...field} onChange={(e) => field.onChange(e)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <VariantImages />
            {/* since this is a button so it will triggger the form, thats why we need to write prefent default here */}
            <div className="flex gap-4 items-center justify-center">
              {editMode && variant && (
                <Button
                  disabled={variantAction.status === "executing"}
                  variant={"destructive"}
                  type="button"
                  onClick={(e: { preventDefault: () => void }) => {
                    e.preventDefault();
                    variantAction.execute({ id: variant.id });
                  }}
                >
                  Delete variant
                </Button>
              )}

              <Button
                disabled={
                  status === "executing" ||
                  !form.formState.isValid ||
                  !form.formState.isDirty
                }
                type="submit"
              >
                {editMode ? "update variant" : " create variant"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
ProductVariant.displayName = "ProductVariant";
