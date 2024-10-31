"use client";
import { ResetSchema } from "@/app/type/reset-schema";
import { cn } from "@/lib/utils";
import { reset } from "@/server/actions/password-reset";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import AuthCard from "./auth-card";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";
export default function ResetForm() {
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { execute, status } = useAction(reset, {
    onSuccess(data) {
      if (data?.error) setError(data.error);
      if (data?.success) setSuccess(data.success);
    },
  });
  // const { handleSubmit, control } = form;
  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    execute(values);
  };
  return (
    <AuthCard
      cardTitle="forgot your password!"
      backButtonHref="/auth/login"
      backButtonLabel="back to login"
      showSpcials
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Password </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="hellendongyun@gmail.com"
                        type="email"
                        autoComplete="email"
                        disabled={status === "executing"}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormSuccess message={success} />
              <FormError message={error} />
              <Button size={"sm"} variant={"link"} asChild>
                <Link href="/auth/reset">Forgot yout password</Link>
              </Button>
            </div>
            <Button
              type="submit"
              className={cn(
                "w-full",
                status === "executing" ? "animation-pulse-slow" : ""
              )}
            >
              Reset Password
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
}
