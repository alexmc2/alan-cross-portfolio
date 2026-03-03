// sanity/queries/split/split-location-map.ts
import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const splitLocationMapQuery = groq`
  _type == "split-location-map" => {
    _type,
    _key,
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
