import { groq } from "next-sanity";
import { imageQuery } from "./shared/image";
import { bodyQuery } from "./shared/body";

export const SITE_SETTINGS_QUERY = groq`*[_type == "siteSettings"][0]{
  ...,
  heroVideo{ asset-> },
  aboutImage{ ${imageQuery} },
  aboutBody[]{
    ${bodyQuery}
  },
  ogImage{
    ...,
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
