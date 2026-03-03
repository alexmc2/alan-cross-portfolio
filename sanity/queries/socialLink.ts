import { groq } from "next-sanity";

export const SOCIAL_LINKS_QUERY = groq`*[_type == "socialLink"] | order(order asc)`;
