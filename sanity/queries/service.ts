import { groq } from "next-sanity";

export const SERVICES_QUERY = groq`*[_type == "service"] | order(order asc)`;
