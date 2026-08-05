import { defineField, defineType, type ValidationContext } from "sanity";
import { Tags } from "lucide-react";

const API_VERSION = "2024-10-31";

async function isUniqueCategoryTitle(
  value: string | undefined,
  context: ValidationContext
) {
  const documentId = context.document?._id;

  if (!value || !documentId) {
    return true;
  }

  const publishedId = documentId.replace(/^drafts\./u, "");
  const candidateTitle = value.trim().toLowerCase();
  const otherTitles = await context
    .getClient({ apiVersion: API_VERSION })
    .fetch<string[]>(
      '*[_type == "category" && defined(title) && !(_id in $currentIds)].title',
      {
        currentIds: [publishedId, `drafts.${publishedId}`],
      },
      { perspective: "raw" }
    );

  return otherTitles.some(
    (title) => title.trim().toLowerCase() === candidateTitle
  )
    ? "A category with this title already exists."
    : true;
}

export default defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: Tags,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().custom(isUniqueCategoryTitle),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
  },
});
