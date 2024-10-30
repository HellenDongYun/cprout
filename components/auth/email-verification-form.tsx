"use client";
import { newVerification } from "@/server/actions/tokens";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import AuthCard from "./auth-card";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";

export const EmailVerificationForm = () => {
  const token = useSearchParams().get("token");
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handleVerification = useCallback(() => {
    if (success || error) return;
    if (!token) {
      setError("Invalid token");
      return;
    }
    newVerification(token).then((data) => {
      if (data.error) {
        setError(data.error);
      }
      if (data.success) {
        setSuccess(data.success);
        router.push("/auth/login");
      }
    });
  }, []);
  useEffect(() => {
    handleVerification();
  }, []);
  return (
    <AuthCard
      backButtonHref="/auth/login"
      backButtonLabel="back to login"
      cardTitle="verify your account"
    >
      <div className="flex items-center flex-col justify-center">
        <p>{!success && !error && "Verifying your email..."}</p>
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </AuthCard>
  );
};
