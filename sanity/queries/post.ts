import { groq } from "next-sanity";
import { imageQuery } from "./shared/image";
import { bodyQuery } from "./shared/body";

export const POST_QUERY = groq`*[_type == "post" && slug.current == $slug][0]{
  title,
  slug,
  publishedAt,
  category,
  excerpt,
  mainImage{
    ${imageQuery}
  },
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

export const POSTS_QUERY = groq`*[_type == "post" && defined(slug)] | order(publishedAt desc){
  title,
  slug,
  publishedAt,
  category,
  excerpt,
  mainImage{
    ${imageQuery}
  },
}`;

export const POSTS_SLUGS_QUERY = groq`*[_type == "post" && defined(slug)]{slug}`;
