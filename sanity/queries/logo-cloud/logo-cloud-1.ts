// sanity/queries/logo-cloud/logo-cloud-1.ts
import { groq } from "next-sanity";
import { imageQuery } from "../shared/image";

// @sanity-typegen-ignore
export const logoCloud1Query = groq`
  _type == "logo-cloud-1" => {
    _type,
    _key,
    padding,
    colorVariant,
    title,
    images[]{
      ${imageQuery}
    },
  }
`;
