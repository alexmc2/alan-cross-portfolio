// sanity/structure.ts
import {
  Settings,
  Film,
  Briefcase,
  Files,
  FileText,
  Link,
} from "lucide-react";

export const structure = (S: any) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .icon(Settings)
        .child(
          S.editor()
            .id("siteSettings")
            .schemaType("siteSettings")
            .documentId("siteSettings")
        ),
      S.divider(),
      S.listItem()
        .title("Portfolio")
        .icon(Film)
        .child(
          S.documentTypeList("portfolioItem")
            .title("Portfolio Items")
            .defaultOrdering([{ field: "order", direction: "asc" }])
        ),
      S.listItem()
        .title("Services")
        .icon(Briefcase)
        .child(
          S.documentTypeList("service")
            .title("Services")
            .defaultOrdering([{ field: "order", direction: "asc" }])
        ),
      S.listItem()
        .title("Pages")
        .icon(Files)
        .child(
          S.documentTypeList("page")
            .title("Pages")
            .defaultOrdering([{ field: "title", direction: "asc" }])
        ),
      S.listItem()
        .title("Blog")
        .icon(FileText)
        .child(
          S.documentTypeList("post")
            .title("Blog Posts")
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }])
        ),
      S.listItem()
        .title("Social Links")
        .icon(Link)
        .child(
          S.documentTypeList("socialLink")
            .title("Social Links")
            .defaultOrdering([{ field: "order", direction: "asc" }])
        ),
    ]);
