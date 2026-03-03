// sanity/queries/settings.ts
import { groq } from "next-sanity";

const logoQuery = `{
  dark{
    ...,
    asset->{
      _id,
      url,
      mimeType,
      metadata {
        lqip,
        dimensions {
          width,
          height
        }
      }
    }
  },
  light{
    ...,
    asset->{
      _id,
      url,
      mimeType,
      metadata {
        lqip,
        dimensions {
          width,
          height
        }
      }
    }
  },
  width,
  height,
}`;

export const SETTINGS_QUERY = groq`*[_type == "settings"][0]{
  _type,
  siteName,
  headerLogo${logoQuery},
  footerLogo${logoQuery},
  showSiteNameInHeader,
  showSiteNameInFooter,
  copyright
}`;
