"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Session } from "next-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { SettingsSchema } from "@/app/type/settings-schema";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { useState } from "react";
type SettingsCardProps = {
  session: Session;
};
export default function SettingsCard({ session }: SettingsCardProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const form = useForm<z.infer<typeof SettingsSchema>>({
    defaultValues: {
      name: session.user?.name || undefined,
      email: session.user?.email || undefined,
      // isTwoFactorEnabled: session.user?.isTwoFactorEnabled || undefined,
    },
  });
  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    execute(values);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Settings</CardTitle>
        <CardDescription>Update your account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="hellen"
                      disabled={status === "executing"}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>avatar</FormLabel>
                  <div className="flex items-center gap-4">
                    {!form.getValues("image") && (
                      <div className="font-bold ">
                        {session.user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {form.getValues("image") && (
                      <Image
                        className="rouded-full"
                        src={form.getValues("image")!}
                        width={42}
                        height={42}
                        alt="user avatar"
                      />
                    )}
                  </div>
                  <FormControl>
                    <Input
                      placeholder="hellen"
                      type="hidden"
                      disabled={status === "executing"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="******"
                      disabled={status === "executing"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="******"
                      disabled={status === "executing"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isTwoFactorEnabled"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two Factor Authentication</FormLabel>
                  <FormDescription>
                    Enable two factor authentication for your account.
                  </FormDescription>
                  <FormControl>
                    <Switch disabled={status === "executing"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError />
            <FormSuccess />
            <Button
              type="submit"
              disabled={status === "executing" || avatarUploading}
            >
              Update your settings
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
