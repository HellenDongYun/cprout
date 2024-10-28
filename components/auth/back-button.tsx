import Link from "next/link";
import { Button } from "../ui/button";

export default function BackButton({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Button className="font-medium w-full">
      <Link aria-label={label} href={href}>
        {label}
      </Link>
    </Button>
  );
}
