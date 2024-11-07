import { db } from "@/server";
import { products } from "@/server/schema";
import placeholder from "@/public/placeholder-user.jpg";
import { DataTable } from "./data-table";
import { columns } from "./columns";
export default async function page() {
  const products = await db.query.products.findMany({
    with: {
      productVariants: { with: { variantImages: true, variantTags: true } },
    },
    orderBy: (products, { desc }) => [desc(products.id)],
  });
  if (!products) throw new Error("no products found");
  const dataTable = products.map((product) => {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      variants: [],
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
