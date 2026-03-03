// sanity/queries/shared/image.ts
export const imageQuery = `
  ...,
  asset->{
    _id,
    _createdAt,
    url,
    mimeType,
    metadata {
      lqip,
      dimensions {
        width,
        height
      }
    }
  }
`;
