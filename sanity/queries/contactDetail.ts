import { groq } from 'next-sanity';

export const CONTACT_DETAILS_QUERY = groq`*[_type == "contactDetail"] | order(order asc)`;
