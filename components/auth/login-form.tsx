"use client";

import AuthCard from "./auth-card";

export default function LoginForm() {
  return (
    <AuthCard
      cardTitle="welcome back!"
      backButtonHref="/auth/register"
      backButtonLabel="create a new account"
      showSpcials
    >
      <div>
        <h1>hi</h1>
      </div>
    </AuthCard>
  );
}
