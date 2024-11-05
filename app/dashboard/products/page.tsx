import { db } from "@/server";
import { products } from "@/server/schema";
import placeholder from "@/public/placeholder-user.jpg";
import { DataTable } from "./data-table";
import { columns } from "./columns";
export default async function page() {
  const products = await db.query.products.findMany({
    orderBy: (products, { desc }) => [desc(products.id)],
  });
  if (!products) throw new Error("no products found");
  const dataTable = products.map((product) => {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      variant: [],
      image: placeholder.src,
    };
  });
  if (!dataTable) throw new Error("no data found!");
  return (
    <div>
      <DataTable columns={columns} data={dataTable} />
    </div>
  );
}
