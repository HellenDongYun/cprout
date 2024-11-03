import DashboardNav from "@/components/navigation/dashboard-nav";
import { auth } from "@/server/auth";
import { BarChart, Package, PenSquare, Settings, Truck } from "lucide-react";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const userLinks = [
    {
      label: "orders",
      path: "/dashboard/orders",
      icon: <Truck size={16} />,
    },
    {
      label: "settings",
      path: "/dashboard/settings",
      icon: <Settings size={16} />,
    },
  ] as const;
  const adminLinks =
    session?.user.role === "admin"
      ? [
          {
            label: "analytics",
            path: "/dashboard/analytics",
            icon: <BarChart size={16} />,
          },
          {
            label: "add-product",
            path: "/dashboard/add-product",
            icon: <PenSquare size={16} />,
          },
          {
            label: "products",
            path: "/dashboard/products",
            icon: <Package size={16} />,
          },
        ]
      : [];
  //shalow copy
  const allLinks = [...userLinks, ...adminLinks];

  return (
    <div>
      <DashboardNav allLinks={allLinks} />
      {children}
    </div>
  );
}
