// sanity/queries/menu-section.ts
import { groq } from "next-sanity";
import { imageQuery } from "./shared/image";

// @sanity-typegen-ignore
export const menuSectionQuery = groq`
  _type == "menu-section" => {
    _type,
    _key,
    padding,
    background{
      style,
      colorVariant,
      texturePreset,
      textureTint,
      customImage{
        ${imageQuery},
        alt,
        opacity
      }
    },
    eyebrow,
    title,
    sectionId,
    intro,
    headingFont,
    displayMode,
    menuImages[]{
      _key,
      ${imageQuery},
      alt,
      focus
    },
    imagePlacement,
    imageLayout,
    categories[]{
      title,
      description,
      items[]{
        _key,
        name,
        description,
        price,
        dietary,
        itemImage{
          ${imageQuery},
          alt
        }
      }
    },
    lottieAnimation{
      asset->{
        _id,
        url,
        mimeType,
        size,
        originalFilename
      }
    },
    lottiePlacement
  }
`;
