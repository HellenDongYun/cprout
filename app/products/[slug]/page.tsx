import ProductPick from "@/components/products/product-pick";
import ProductType from "@/components/products/product-type";
import { Separator } from "@/components/ui/separator";
import formatPrice from "@/lib/format-price";
import { db } from "@/server";
import { productVariants } from "@/server/schema";
import { eq } from "drizzle-orm";
import { number } from "zod";
//this function will fetch everything before hand and pass down the result and render out the static page
export async function generateStaticParams() {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });
  if (data) {
    const slugID = data.map((variant) => ({ slug: variant.id.toString() }));
    return slugID;
  }
  return [];
}

export default async function Page({ params }: { params: { slug: string } }) {
  const variant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, Number(params.slug)),
    with: {
      product: {
        with: {
          productVariants: { with: { variantImages: true, variantTags: true } },
        },
      },
    },
  });
  if (variant) {
    return (
      <main>
        <section>
          <div className="flex-1">
            <h1>image</h1>
          </div>
          <div className="flex gap-2 flex-col flex-1">
            <h2>{variant?.product.title}</h2>
            <div>
              <ProductType variants={variant.product.productVariants} />
            </div>
            <Separator />
            <p className="text-2xl font-medium">
              {formatPrice(variant.product.price)}
            </p>
            <div
              dangerouslySetInnerHTML={{ __html: variant.product.description }}
            ></div>
            <p className="text-secondary-foreground"> Available colors</p>
            <div className="flex gap-4">
              {variant.product.productVariants.map((prodVariant) => (
                <ProductPick
                  key={prodVariant.id}
                  productID={variant.product.id}
                  productType={prodVariant.productType}
                  id={prodVariant.id}
                  color={prodVariant.color}
                  price={variant.product.price}
                  title={variant.product.title}
                  image={prodVariant.variantImages[0].url}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  }
}