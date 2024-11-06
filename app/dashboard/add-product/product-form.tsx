"use client";
import { ProductSchema, zProductSchema } from "@/app/type/product-schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createProduct } from "@/server/actions/create-product";
import { getProduct } from "@/server/actions/get-product";
import { zodResolver } from "@hookform/resolvers/zod";
import { DollarSign } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Tiptap from "./tiptap";
export default function ProductForm() {
  const form = useForm<zProductSchema>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
    mode: "onChange",
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const editMode = searchParams.get("id");

  const checkProduct = async (id: number) => {
    if (editMode) {
      const data = await getProduct(id);
      if (data.error) {
        toast.error(data.error);
        router.push("/dashboard/products");
        return;
      }
      if (data.success) {
        const id = parseInt(editMode);
        form.setValue("title", data.success.title);
        form.setValue("description", data.success.description);
        form.setValue("price", data.success.price);
        form.setValue("id", id);
      }
    }
  };
  // 首加载的时候就检查是不是在edit mode
  useEffect(() => {
    if (editMode) checkProduct(parseInt(editMode));
  }, []);

  const { execute, status } = useAction(createProduct, {
    onSuccess: (data) => {
      if (data?.success) {
        router.push("/dashboard/products");
        toast.success(data?.success);
      }
      if (data?.error) {
        toast.error(data?.error);
      }
    },
    onExecute: (data) => {
      if (editMode) {
        toast.loading("Editing Product!");
      }
      if (!editMode) {
        toast.loading("Creating Product!");
      }
    },
  });
  async function onSubmit(values: zProductSchema) {
    execute(values);
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {editMode ? <span>Edit Product</span> : <span>Create Product</span>}
        </CardTitle>
        <CardDescription>
          {editMode
            ? "Make a change to existing product"
            : "Add a brand new product"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          {/* //onSubmit={form.handleSubmit(onSubmit)} */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product title</FormLabel>
                  <FormControl>
                    <Input placeholder="saekdong strip" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Tiptap val={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product price</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 items-center">
                      <DollarSign
                        size={32}
                        className="p-2 bg-muted rounded-md"
                      />
                      <Input
                        placeholder="your price in USD"
                        step="0.1"
                        min={0}
                        type="number"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full"
              type="submit"
              disabled={
                status === "executing" ||
                !form.formState ||
                !form.formState.isDirty
              }
            >
              {editMode ? "Save Changes" : "Create product"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
