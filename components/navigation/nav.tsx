import { auth } from "@/server/auth";
import UserButton from "./user-button";
import { Button } from "../ui/button";
import Link from "next/link";
import { LogIn } from "lucide-react";

export default async function Nav() {
  const session = await auth();
  return (
    <header className="bg-slate-500 text-white py-4">
      <nav>
        <ul className="flex justify-between">
          <li>logo</li>
          {!session ? (
            <li>
              <Button asChild>
                <Link className="flex gap-2" href="api/auth/signin">
                  <LogIn size={16} />
                  <span>Log in</span>
                </Link>
              </Button>
            </li>
          ) : (
            <li>
              <UserButton
                expires={session?.expires ?? "user"}
                user={session?.user}
              />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
