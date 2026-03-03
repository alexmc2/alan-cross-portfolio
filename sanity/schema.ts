// sanity/schema.ts
import { type SchemaTypeDefinition } from "sanity";

// documents
import siteSettings from "./schemas/documents/siteSettings";
import portfolioItem from "./schemas/documents/portfolioItem";
import service from "./schemas/documents/service";
import page from "./schemas/documents/page";
import post from "./schemas/documents/post";
import socialLink from "./schemas/documents/socialLink";

// shared objects
import blockContent from "./schemas/blocks/shared/block-content";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // documents
    siteSettings,
    portfolioItem,
    service,
    page,
    post,
    socialLink,
    // shared objects
    blockContent,
  ],
};
