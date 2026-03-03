// sanity/queries/lottie-animation.ts
import { groq } from "next-sanity";
import { bodyQuery } from "./shared/body";

// @sanity-typegen-ignore
export const lottieAnimationQuery = groq`
  _type == "lottie-animation" => {
    _type,
    _key,
    padding,
    colorVariant,
    colorVariantDark,
    sectionWidth,
    animationAlign,
    verticalSpacing,
    animationSize,
    title[]{
      ${bodyQuery}
    },
    textOrientation,
    textPlacement,
    textSpacing,
    ariaLabel,
    animation{
      asset->{
        _id,
        url,
        mimeType,
        size,
        originalFilename
      }
    },
    animationDark{
      asset->{
        _id,
        url,
        mimeType,
        size,
        originalFilename
      }
    }
  }
`;
