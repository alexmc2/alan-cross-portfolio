// sanity/queries/split/split-contact-form.ts
import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const splitContactFormQuery = groq`
  _type == "split-contact-form" => {
    _type,
    _key,
    heading,
    body,
    formspreeFormId,
    submitButtonLabel,
    successMessage,
  }
`;
