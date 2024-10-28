"use client";

import { signOut } from "@/server/auth";
import { Session } from "next-auth";

export default function UserButton({ user }: Session) {
  return (
    <div>
      <h1>{user?.name}</h1>
      <button onClick={() => signOut()}>sign out</button>
    </div>
  );
}
