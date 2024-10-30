"use client";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from "../ui/form";
import AuthCard from "./auth-card";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/app/type/register-schema";
import * as z from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { emailSignIn } from "@/server/actions/email-signin";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { emailRegister } from "@/server/actions/email-register";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";
export default function RegisterForm() {
  //resolver this just pass the register schema down to zodresolver to check client side if we haev any error
  //
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { execute, status } = useAction(emailRegister, {
    onSuccess(data) {
      if (data.success) setSuccess(data.success);
      if (data.error) setError(data.error);
    },
  });
  // const { handleSubmit, control } = form;
  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    execute(values);
  };
  return (
    <AuthCard
      cardTitle="create an account"
      backButtonHref="/auth/login"
      backButtonLabel="already haev ana account?"
      showSpcials
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Name </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Your name" type="text" />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Email </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="your email"
                        type="email"
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Password </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="*******"
                        type="password"
                        autoComplete="current-password"
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
              Register
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
}
