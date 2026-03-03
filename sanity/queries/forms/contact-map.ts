// sanity/queries/forms/contact-map.ts
import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const formContactMapQuery = groq`
  _type == "form-contact-map" => {
    _type,
    _key,
    padding,
    colorVariant,
    heading,
    body,
    formspreeFormId,
    submitButtonLabel,
    successMessage,
    locationName,
    address,
    latitude,
    longitude,
    mapZoom,
  }
`;
