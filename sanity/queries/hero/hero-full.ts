// sanity/queries/hero/hero-full.ts
import { groq } from "next-sanity";
import { bodyQuery } from "../shared/body";
import { imageQuery } from "../shared/image";

// @sanity-typegen-ignore
export const heroFullQuery = groq`
  _type == "hero-full" => {
    _type,
    _key,
    tagLine,
    title,
    body[]{
      ${bodyQuery}
    },
    images[]{
      ${imageQuery}
    },
    image{
      ${imageQuery}
    },
    height,
    overlay,
    frosted,
    overlayStrength,
    contentAlignment,
    initialHeaderVisible,
  }
`;
