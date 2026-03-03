// sanity/queries/menu-google-section.ts
import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const menuGoogleSectionQuery = groq`
  _type == "menu-google-section" => {
    _type,
    _key,
    padding,
    sectionId,
    eyebrow,
    title,
    intro,
    accordionBehaviour,
    headingAlignment,
    appearance{
      backgroundColor,
      backgroundColorDark,
      panelColor,
      panelColorDark,
      accentColor,
      accentColorDark,
      headingColor,
      headingColorDark,
      tabColor,
      tabColorDark,
      categoryColor,
      categoryColorDark,
      borderColor,
      borderColorDark
    },
    categories[]{
      _key,
      title,
      tagline,
      itemEntryMode,
      items[]{
        _key,
        name,
        price,
        description,
        dietary
      },
      rawItems
    }
  }
`;
