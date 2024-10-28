"use client";

import { Session } from "next-auth";

export default function UserButton({ user }: Session) {
  return <div>{user?.name}</div>;
}
