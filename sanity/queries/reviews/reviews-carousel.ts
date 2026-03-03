// sanity/queries/reviews/reviews-carousel.ts
import { groq } from "next-sanity";
import { linkQuery } from "../shared/link";

// @sanity-typegen-ignore
export const reviewsCarouselQuery = groq`
  _type == "reviews-carousel" => {
    _type,
    _key,
    padding,
    colorVariant,
    sectionId,
    eyebrow,
    heading,
    intro,
    placeId,
    languageCode,
    maximumReviews,
    minimumRating,
    sortOrder,
    cta {
      ${linkQuery}
    },
  }
`;
