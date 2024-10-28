import { auth } from "@/server/auth";
import UserButton from "./user-button";

export default async function Nav() {
  const session = await auth();
  return (
    <header className="bg-slate-500 text-white py-4">
      <nav>
        <ul className="flex justify-between items-center">
          <li>logo</li>
          <li>
            <UserButton
              expires={session?.expires ?? "default"}
              user={session?.user}
            />
          </li>
        </ul>
      </nav>
    </header>
  );
}
