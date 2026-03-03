// sanity/queries/split/split-row.ts
import { groq } from "next-sanity";
import { splitContentQuery } from "./split-content";
import { splitCardsListQuery } from "./split-cards-list";
import { splitImageQuery } from "./split-image";
import { splitInfoListQuery } from "./split-info-list";
import { richTextBlockQuery } from "@/sanity/queries/rich-text-block";
import { splitContactFormQuery } from "./split-contact-form";
import { splitLocationMapQuery } from "./split-location-map";

// @sanity-typegen-ignore
export const splitRowQuery = groq`
  _type == "split-row" => {
    _type,
    _key,
    padding,
    colorVariant,
    colorVariantDark,
    sectionId,
    noGap,
    splitColumns[]{
      ${splitContentQuery},
      ${splitCardsListQuery},
      ${splitImageQuery},
      ${splitInfoListQuery},
      ${richTextBlockQuery},
      ${splitContactFormQuery},
      ${splitLocationMapQuery},
    },
  }
`;
