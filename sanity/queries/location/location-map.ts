// sanity/queries/location/location-map.ts
import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const locationMapQuery = groq`
  _type == "location-map" => {
    _type,
    _key,
    padding,
    colorVariant,
    heading,
    headingAlignment,
    locationLabel,
    locationName,
    address,
    latitude,
    longitude,
    mapZoom,
  }
`;
