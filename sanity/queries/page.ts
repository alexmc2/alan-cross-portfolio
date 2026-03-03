import { groq } from "next-sanity";
import { bodyQuery } from "./shared/body";

export const PAGE_QUERY = groq`*[_type == "page" && slug.current == $slug][0]{
  title,
  slug,
  body[]{
    ${bodyQuery}
  },
  meta_title,
  meta_description,
  noindex,
  ogImage {
    asset->{
      _id,
      url,
      metadata {
        dimensions {
          width,
          height
        }
      }
    }
  }
}`;

export const PAGES_SLUGS_QUERY = groq`*[_type == "page" && defined(slug)]{slug}`;
