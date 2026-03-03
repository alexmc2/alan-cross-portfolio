// sanity/lib/client.ts
import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, useCdn } from "../env";
import { siteUrl } from "@/lib/siteConfig";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  perspective: "published",
  stega: {
    studioUrl: `${siteUrl}/studio`,
  },
});
