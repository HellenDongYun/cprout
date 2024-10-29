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
import { LoginSchema } from "@/app/type/login-schema";
import * as z from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";

export default function LoginForm() {
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // const { handleSubmit, control } = form;
  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    console.log(values);
  };
  return (
    <AuthCard
      cardTitle="welcome back!"
      backButtonHref="/auth/register"
      backButtonLabel="create a new account"
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
              <Button size={"sm"} variant={"link"} asChild>
                <Link href="/auth/reset">Forgot yout password</Link>
              </Button>
            </div>
            <Button type="submit" className="w-full my-2">
              {"login"}
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
}
