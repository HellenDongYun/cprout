"use client";
import { signIn } from "next-auth/react";
import { Button } from "../ui/button";

export default function Socials() {
  return (
    <div>
      <Button
        onClick={() =>
          signIn("google", {
            redirect: false,
            callbackUrl: "http://localhost:3000",
          })
        }
      >
        Sign in with Google
      </Button>
      <Button
        onClick={() =>
          signIn("github", {
            redirect: false,
            callbackUrl: "http://localhost:3000",
          })
        }
      >
        Sign in with Github
      </Button>
    </div>
  );
}
