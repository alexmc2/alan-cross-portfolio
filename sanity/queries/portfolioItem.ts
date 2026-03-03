import { groq } from "next-sanity";
import { imageQuery } from "./shared/image";

export const PORTFOLIO_ITEMS_QUERY = groq`*[_type == "portfolioItem"] | order(order asc){
  ...,
  thumbnail{ ${imageQuery} }
}`;
