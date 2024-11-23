// import algoliasearch, { SearchClient } from "algoliasearch";

// export const searchClient: SearchClient = algoliasearch(
//   process.env.NEXT_PUBLIC_ALGOLIA_ID!,
//   process.env.NEXT_PUBLIC_ALGOLIA_SEARCH!
// );

import algoliasearch from "algoliasearch";
import type { SearchClient } from "algoliasearch-helper/types/algoliasearch";

export const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH!
) as unknown as SearchClient;
