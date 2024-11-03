"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function DashboardNav({
  allLinks,
}: {
  allLinks: { label: string; icon: JSX.Element; path: string }[];
}) {
  const pathName = usePathname();
  return (
    <nav className="py-2 overflow-auto mb-5">
      <ul className="flex gap-6 text-sm font-bold">
        <AnimatePresence>
          {allLinks.map((link) => (
            <motion.li key={link.path} whileTap={{ scale: 0.95 }}>
              <Link
                href={link.path}
                className={cn(
                  "flex flex-col items-center gap-1 relative",
                  pathName === link.path && "text-primary"
                )}
              >
                {link.icon}
                {link.label}
                {pathName === link.path ? (
                  <motion.div
                    className="h-[2px] w-full rounded-full absolute bg-primary z-0 left-0 -bottom-1"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    layoutId="underline"
                    transition={{ type: "spring", stiffness: 35 }}
                  />
                ) : null}
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </nav>
  );
}
