import { createClient } from "@sanity/client";
import {
  htmlToBlocks,
  randomKey,
  type DeserializerRule,
} from "@sanity/block-tools";
import { Schema } from "@sanity/schema";
import { load, type CheerioAPI } from "cheerio";
import * as dotenv from "dotenv";
import { JSDOM } from "jsdom";
import { createHash } from "node:crypto";
import path from "node:path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const WIX_BLOG_URL = "https://www.alanx.uk/blog-1";
const WIX_FEED_URL = "https://www.alanx.uk/blog-feed.xml";
const WIX_POST_SITEMAP_URL = "https://www.alanx.uk/blog-posts-sitemap.xml";
const REQUEST_DELAY_MS = 1_000;
const API_VERSION = "2024-10-31";
const DRY_RUN = process.argv.includes("--dry-run");
const UPDATE_EXISTING = process.argv.includes("--update-existing");
const LIMIT = parseLimitArg(process.argv.slice(2));

const projectId =
  process.env.SANITY_PROJECT_ID ?? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset =
  process.env.SANITY_DATASET ?? process.env.NEXT_PUBLIC_SANITY_DATASET;

const client = createClient({
  projectId: requireEnv(
    "SANITY_PROJECT_ID (or NEXT_PUBLIC_SANITY_PROJECT_ID)",
    projectId
  ),
  dataset: requireEnv(
    "SANITY_DATASET (or NEXT_PUBLIC_SANITY_DATASET)",
    dataset
  ),
  token: requireEnv("SANITY_API_WRITE_TOKEN", process.env.SANITY_API_WRITE_TOKEN),
  apiVersion: API_VERSION,
  useCdn: false,
});

const compiledSchema = Schema.compile({
  name: "wixBlogMigration",
  types: [
    {
      name: "post",
      type: "document",
      fields: [{ name: "body", type: "block-content" }],
    },
    {
      name: "block-content",
      title: "Block Content",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H1", value: "h1" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Number", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                fields: [{ name: "href", type: "url" }],
              },
            ],
          },
        },
        {
          type: "image",
          fields: [{ name: "alt", type: "string" }],
        },
        {
          name: "youtube",
          type: "object",
          fields: [{ name: "videoId", type: "string" }],
        },
      ],
    },
  ],
} as const);

const postSchemaType = compiledSchema.get("post") as
  | {
      fields?: Array<{
        name: string;
        type: unknown;
      }>;
    }
  | undefined;

const blockContentType = postSchemaType?.fields?.find(
  (field) => field.name === "body"
)?.type;

if (!blockContentType) {
  throw new Error("Unable to resolve the compiled block content schema type.");
}

type FeedEntry = {
  url: string;
  categories: string[];
  publishedAt?: string;
  featuredImageUrl?: string;
  author?: string;
  description?: string;
};

type ExistingPost = {
  _id: string;
  slug: string | null;
};

type ExistingPostRecord = {
  draftId?: string;
  publishedId?: string;
};

type ExistingCategory = {
  _id: string;
  title: string;
  slug: string | null;
};

type ScrapedPost = {
  url: string;
  slug: string;
  title: string;
  publishedAt: string;
  bodyHtml: string;
  bodyText: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  categories: string[];
  author?: string;
  readTime?: string;
};

type PortableTextNode = Record<string, unknown>;

type SanityReference = {
  _type: "reference";
  _ref: string;
};

type SanityImageField = {
  _type: "image";
  _key: string;
  asset: {
    _type: "reference";
    _ref: string;
  };
  alt?: string;
};

type UploadResult = {
  assetRef: string;
};

type UploadKind = "featured" | "body";

type MigrationSummary = {
  discovered: number;
  attempted: number;
  processed: number;
  created: number;
  updated: number;
  skippedExisting: number;
  failed: number;
  featuredImagesProcessed: number;
  bodyImagesProcessed: number;
};

type JsonObject = Record<string, unknown>;

type CategoryAssignment = {
  primaryCategory: SanityReference;
  categories: SanityReference[];
  categoryTitles: string[];
};

const customBlockRules: DeserializerRule[] = [
  {
    deserialize(node, _next, createBlock) {
      if (!isElementNode(node) || node.tagName.toLowerCase() !== "div") {
        return undefined;
      }

      const objectType = node.getAttribute("data-sanity-object");

      if (objectType === "image") {
        const assetRef = node.getAttribute("data-asset-ref");
        const alt = normalizeWhitespace(node.getAttribute("data-alt"));

        if (!assetRef) {
          return undefined;
        }

        return createBlock({
          _type: "image",
          asset: {
            _type: "reference",
            _ref: assetRef,
          },
          ...(alt ? { alt } : {}),
        });
      }

      if (objectType === "youtube") {
        const videoId = normalizeWhitespace(node.getAttribute("data-video-id"));

        if (!videoId) {
          return undefined;
        }

        return createBlock({
          _type: "youtube",
          videoId,
        });
      }

      return undefined;
    },
  },
];

async function main() {
  console.log("===========================================");
  console.log("Alan Cross Wix Blog Migration");
  console.log(`Mode: ${DRY_RUN ? "DRY RUN" : "EXECUTE"}`);
  console.log(`Project: ${projectId}`);
  console.log(`Dataset: ${dataset}`);
  console.log(`Source: ${WIX_BLOG_URL}`);
  console.log(
    `Existing posts: ${UPDATE_EXISTING ? "update matching slugs" : "skip matching slugs"}`
  );
  console.log(
    `Dates: preserving each post's original publish date from Wix, never today's date`
  );
  if (LIMIT) {
    console.log(`Limit: ${LIMIT} post(s)`);
  }
  console.log("===========================================");

  const discoveredEntries = await discoverPostEntries();
  const entries = LIMIT ? discoveredEntries.slice(0, LIMIT) : discoveredEntries;
  const existingPosts = await getExistingPostsBySlug();
  const existingCategories = await getExistingCategoriesBySlug();

  const summary: MigrationSummary = {
    discovered: discoveredEntries.length,
    attempted: entries.length,
    processed: 0,
    created: 0,
    updated: 0,
    skippedExisting: 0,
    failed: 0,
    featuredImagesProcessed: 0,
    bodyImagesProcessed: 0,
  };

  console.log("");
  console.log(`Discovered ${discoveredEntries.length} unique post URL(s).`);
  console.log(`Processing ${entries.length} post(s).`);
  console.log(`Found ${existingPosts.size} existing Sanity post(s) by slug.`);

  for (const [index, entry] of entries.entries()) {
    const progressLabel = `[${index + 1}/${entries.length}]`;

    console.log("");
    console.log(`${progressLabel} ${entry.url}`);

    try {
      const scrapedPost = await scrapePost(entry);
      const categoryAssignment = await ensureCategoryAssignments(
        scrapedPost.categories,
        existingCategories
      );
      const body = await convertBodyHtmlToPortableText(
        scrapedPost.bodyHtml,
        scrapedPost.url,
        scrapedPost.featuredImageUrl,
        summary
      );
      const mainImage = scrapedPost.featuredImageUrl
        ? await buildSanityImageField(
            scrapedPost.featuredImageUrl,
            scrapedPost.featuredImageAlt ?? scrapedPost.title,
            "featured",
            summary
          )
        : undefined;
      const ogImage = mainImage
        ? {
            _type: "image" as const,
            asset: mainImage.asset,
          }
        : undefined;

      const documentPayload = {
        title: scrapedPost.title,
        slug: {
          _type: "slug" as const,
          current: scrapedPost.slug,
        },
        publishedAt: scrapedPost.publishedAt,
        excerpt: scrapedPost.excerpt,
        body,
        category: categoryAssignment.primaryCategory,
        categories: categoryAssignment.categories,
        meta_title: scrapedPost.metaTitle,
        meta_description: scrapedPost.metaDescription,
        ...(mainImage ? { mainImage } : {}),
        ...(ogImage ? { ogImage } : {}),
      };

      const existingPost = existingPosts.get(scrapedPost.slug);
      const hasExistingPost = Boolean(
        existingPost?.publishedId || existingPost?.draftId
      );
      const operation = hasExistingPost
        ? UPDATE_EXISTING
          ? "update"
          : "skip existing"
        : "create";

      console.log(`  Title: ${scrapedPost.title}`);
      console.log(`  Slug: ${scrapedPost.slug}`);
      console.log(`  Published At: ${scrapedPost.publishedAt}`);
      console.log(
        `  Wix Categories: ${
          scrapedPost.categories.length > 0
            ? scrapedPost.categories.join(", ")
            : "(none)"
        }`
      );
      console.log(
        `  Sanity Primary Category: ${categoryAssignment.categoryTitles[0]}`
      );
      console.log(
        `  Sanity Categories: ${categoryAssignment.categoryTitles.join(", ")}`
      );
      console.log(`  Body Blocks: ${body.length}`);
      console.log(`  Action: ${DRY_RUN ? `would ${operation}` : operation}`);

      if (hasExistingPost && !UPDATE_EXISTING) {
        summary.skippedExisting += 1;
        summary.processed += 1;
        continue;
      }

      if (DRY_RUN) {
        if (hasExistingPost) {
          summary.updated += 1;
        } else {
          summary.created += 1;
        }
        summary.processed += 1;
        continue;
      }

      if (hasExistingPost) {
        const publishedId = existingPost?.publishedId ?? `wix-post-${scrapedPost.slug}`;

        if (existingPost?.publishedId) {
          await client.patch(existingPost.publishedId).set(documentPayload).commit();
        } else {
          await client.create({
            _id: publishedId,
            _type: "post",
            ...documentPayload,
          });
        }

        if (existingPost?.draftId) {
          await client.patch(existingPost.draftId).set(documentPayload).commit();
        }

        summary.updated += 1;
      } else {
        const newId = `wix-post-${scrapedPost.slug}`;

        await client.create({
          _id: newId,
          _type: "post",
          ...documentPayload,
        });

        existingPosts.set(scrapedPost.slug, {
          publishedId: newId,
        });
        summary.created += 1;
      }

      summary.processed += 1;
    } catch (error) {
      summary.failed += 1;
      console.error(
        `  Failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  console.log("");
  console.log("===========================================");
  console.log("Migration Summary");
  console.log(`Discovered: ${summary.discovered}`);
  console.log(`Attempted: ${summary.attempted}`);
  console.log(`Succeeded: ${summary.processed}`);
  console.log(`Failed: ${summary.failed}`);
  console.log(
    `${DRY_RUN ? "Would Create" : "Created"}: ${summary.created}`
  );
  console.log(
    `${DRY_RUN ? "Would Update" : "Updated"}: ${summary.updated}`
  );
  console.log(
    `${DRY_RUN ? "Would Skip Existing" : "Skipped Existing"}: ${summary.skippedExisting}`
  );
  console.log(
    `${DRY_RUN ? "Featured Images Prepared" : "Featured Images Uploaded"}: ${summary.featuredImagesProcessed}`
  );
  console.log(
    `${DRY_RUN ? "Body Images Prepared" : "Body Images Uploaded"}: ${summary.bodyImagesProcessed}`
  );
  console.log("===========================================");
}

async function discoverPostEntries(): Promise<FeedEntry[]> {
  const fromFeed = await discoverFromFeed();
  const fromSitemap = await discoverFromPostSitemap();
  const fromListing = await discoverFromListing();
  const mergedEntries = new Map<string, FeedEntry>();

  for (const entry of fromFeed) {
    mergedEntries.set(entry.url, entry);
  }

  for (const entry of fromSitemap) {
    const existing = mergedEntries.get(entry.url);

    mergedEntries.set(entry.url, {
      url: entry.url,
      categories: dedupeStrings([
        ...(existing?.categories ?? []),
        ...entry.categories,
      ]),
      publishedAt: existing?.publishedAt ?? entry.publishedAt,
      featuredImageUrl: existing?.featuredImageUrl ?? entry.featuredImageUrl,
      author: existing?.author ?? entry.author,
      description: existing?.description ?? entry.description,
    });
  }

  for (const entry of fromListing) {
    const existing = mergedEntries.get(entry.url);

    mergedEntries.set(entry.url, {
      url: entry.url,
      categories: dedupeStrings([
        ...(existing?.categories ?? []),
        ...entry.categories,
      ]),
      publishedAt: existing?.publishedAt ?? entry.publishedAt,
      featuredImageUrl: existing?.featuredImageUrl ?? entry.featuredImageUrl,
      author: existing?.author ?? entry.author,
      description: existing?.description ?? entry.description,
    });
  }

  if (fromFeed.length > 0) {
    console.log(
      `Using RSS discovery from ${WIX_FEED_URL}, supplementing with ${WIX_POST_SITEMAP_URL}, and using paginated listing pages as a backstop.`
    );
    return Array.from(mergedEntries.values());
  }

  if (fromSitemap.length > 0) {
    console.log(
      `RSS feed unavailable or empty, using ${WIX_POST_SITEMAP_URL} with paginated listing backfill.`
    );
    return Array.from(mergedEntries.values());
  }

  console.log("RSS feed and sitemap unavailable, using paginated listing discovery.");
  return fromListing;
}

async function discoverFromFeed(): Promise<FeedEntry[]> {
  try {
    const response = await sourceFetcher.fetch(WIX_FEED_URL);

    if (!response.ok) {
      console.log(`Feed returned ${response.status}, skipping RSS discovery.`);
      return [];
    }

    const xml = await response.text();
    const $ = load(xml, { xmlMode: true });
    const entries = new Map<string, FeedEntry>();

    $("item").each((_, item) => {
      const itemRoot = $(item);
      const url = toAbsoluteUrl(
        normalizeString(itemRoot.find("link").first().text()),
        WIX_BLOG_URL
      );

      if (!url || !isPostUrl(url)) {
        return;
      }

      const categories = itemRoot
        .find("category")
        .toArray()
        .map((element) => normalizeWhitespace($(element).text()))
        .filter((value): value is string => Boolean(value));

      entries.set(url, {
        url,
        categories: dedupeStrings(categories),
        publishedAt: normalizeString(itemRoot.find("pubDate").first().text()),
        featuredImageUrl: toAbsoluteUrl(
          itemRoot.find("enclosure").attr("url"),
          WIX_BLOG_URL
        ),
        author: normalizeWhitespace(itemRoot.find("dc\\:creator").first().text()),
        description: normalizeWhitespace(
          itemRoot.find("description").first().text()
        ),
      });
    });

    return Array.from(entries.values());
  } catch (error) {
    console.log(
      `Feed discovery failed: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    return [];
  }
}

async function discoverFromPostSitemap(): Promise<FeedEntry[]> {
  try {
    const response = await sourceFetcher.fetch(WIX_POST_SITEMAP_URL);

    if (!response.ok) {
      console.log(
        `Post sitemap returned ${response.status}, skipping sitemap discovery.`
      );
      return [];
    }

    const xml = await response.text();
    const $ = load(xml, { xmlMode: true });
    const entries = new Map<string, FeedEntry>();

    $("url").each((_, urlNode) => {
      const node = $(urlNode);
      const url = toAbsoluteUrl(
        normalizeString(node.find("loc").first().text()),
        WIX_BLOG_URL
      );

      if (!url || !isPostUrl(url)) {
        return;
      }

      entries.set(url, {
        url,
        categories: [],
        featuredImageUrl: toAbsoluteUrl(
          normalizeString(node.find("image\\:loc").first().text()),
          WIX_BLOG_URL
        ),
      });
    });

    return Array.from(entries.values());
  } catch (error) {
    console.log(
      `Post sitemap discovery failed: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    return [];
  }
}

async function discoverFromListing(): Promise<FeedEntry[]> {
  const visitedPages = new Set<string>();
  const discoveredEntries = new Map<string, FeedEntry>();
  let nextPageUrl: string | undefined = WIX_BLOG_URL;

  while (nextPageUrl && !visitedPages.has(nextPageUrl)) {
    const currentPageUrl: string = nextPageUrl;

    visitedPages.add(currentPageUrl);
    console.log(`Scraping listing page: ${currentPageUrl}`);

    const response = await sourceFetcher.fetch(currentPageUrl);

    if (!response.ok) {
      throw new Error(
        `Listing page fetch failed (${response.status} ${response.statusText}) for ${currentPageUrl}`
      );
    }

    const html = await response.text();
    const $ = load(html);

    $('a[href*="/post/"]').each((_, element) => {
      const href = $(element).attr("href");
      const url = toAbsoluteUrl(href, currentPageUrl);

      if (!url || !isPostUrl(url) || discoveredEntries.has(url)) {
        return;
      }

      discoveredEntries.set(url, {
        url,
        categories: [],
      });
    });

    nextPageUrl =
      toAbsoluteUrl($('link[rel="next"]').attr("href"), currentPageUrl) ??
      toAbsoluteUrl($('a[rel="next"]').attr("href"), currentPageUrl) ??
      undefined;
  }

  return Array.from(discoveredEntries.values());
}

async function getExistingPostsBySlug(): Promise<
  Map<string, ExistingPostRecord>
> {
  const posts = await client.fetch<ExistingPost[]>(
    '*[_type == "post"]{_id, "slug": slug.current}'
  );

  const bySlug = new Map<string, ExistingPostRecord>();

  for (const post of posts) {
    if (!post.slug) {
      continue;
    }

    const entry = bySlug.get(post.slug) ?? {};

    if (post._id.startsWith("drafts.")) {
      entry.draftId = post._id;
    } else {
      entry.publishedId = post._id;
    }

    bySlug.set(post.slug, entry);
  }

  return bySlug;
}

async function getExistingCategoriesBySlug(): Promise<
  Map<string, ExistingCategory>
> {
  const categories = await client.fetch<ExistingCategory[]>(
    '*[_type == "category"]{_id, title, "slug": slug.current}'
  );

  const bySlug = new Map<string, ExistingCategory>();

  for (const category of categories) {
    if (category.slug) {
      bySlug.set(category.slug, category);
    }
  }

  return bySlug;
}

async function ensureCategoryAssignments(
  wixCategories: string[],
  existingCategories: Map<string, ExistingCategory>
): Promise<CategoryAssignment> {
  const categoryTitles = dedupeStrings(
    (wixCategories.length > 0 ? wixCategories : ["General"]).map(
      formatCategoryTitle
    )
  );

  const categoryRefs: SanityReference[] = [];

  for (const categoryTitle of categoryTitles) {
    const categoryDocument = await getOrCreateCategoryDocument(
      categoryTitle,
      existingCategories
    );

    categoryRefs.push({
      _type: "reference",
      _ref: categoryDocument._id,
    });
  }

  return {
    primaryCategory: categoryRefs[0],
    categories: categoryRefs,
    categoryTitles,
  };
}

async function getOrCreateCategoryDocument(
  title: string,
  existingCategories: Map<string, ExistingCategory>
): Promise<ExistingCategory> {
  const slug = slugify(title);
  const cached = existingCategories.get(slug);

  if (cached) {
    return cached;
  }

  const categoryDocument: ExistingCategory = {
    _id: `wix-category-${slug}`,
    title,
    slug,
  };

  if (!DRY_RUN) {
    await client.createIfNotExists({
      _id: categoryDocument._id,
      _type: "category",
      title,
      slug: {
        _type: "slug",
        current: slug,
      },
    });
  }

  existingCategories.set(slug, categoryDocument);
  return categoryDocument;
}

async function scrapePost(feedEntry: FeedEntry): Promise<ScrapedPost> {
  const response = await sourceFetcher.fetch(feedEntry.url);

  if (!response.ok) {
    throw new Error(
      `Post fetch failed (${response.status} ${response.statusText})`
    );
  }

  const html = await response.text();
  const $ = load(html);
  const jsonLd = extractBlogPostingJsonLd($);
  const articleBody = $('section[data-hook="post-description"]').first();
  const bodyHtml = articleBody.html()?.trim();
  const bodyText = normalizeWhitespace(articleBody.text()) ?? "";
  const slug = extractSlugFromPostUrl(feedEntry.url);
  const title = firstNonEmptyString([
    normalizeWhitespace($('h1[data-hook="post-title"]').first().text()),
    getJsonLdString(jsonLd, "headline"),
    normalizeWhitespace($("title").first().text()),
  ]);

  if (!slug) {
    throw new Error(`Unable to derive a slug from ${feedEntry.url}`);
  }

  if (!title) {
    throw new Error("Unable to extract a title from the Wix post page.");
  }

  if (!bodyHtml) {
    throw new Error("Unable to extract body HTML from the Wix post page.");
  }

  const publishedAt = parseSourceDate(
    firstNonEmptyString([
      normalizeWhitespace($('[data-hook="time-ago"]').first().text()),
      getJsonLdString(jsonLd, "datePublished"),
      normalizeString(
        $('meta[property="article:published_time"]').attr("content")
      ),
      feedEntry.publishedAt,
    ])
  );

  if (!publishedAt) {
    throw new Error(
      "Unable to parse the original publish date from the Wix post."
    );
  }

  const categories = dedupeStrings([
    ...$('ul[aria-label="Post categories"] a')
      .toArray()
      .map((element) => normalizeWhitespace($(element).text()))
      .filter((value): value is string => Boolean(value)),
    ...feedEntry.categories,
  ]);

  const featuredImageUrl = firstNonEmptyString([
    extractFeaturedImageFromJsonLd(jsonLd),
    toAbsoluteUrl($('meta[property="og:image"]').attr("content"), feedEntry.url),
    feedEntry.featuredImageUrl,
  ]);

  const featuredImageAlt = firstNonEmptyString([
    normalizeString($('meta[property="og:image:alt"]').attr("content")),
    title,
  ]);
  const metaDescription =
    firstNonEmptyString([
      normalizeString($('meta[name="description"]').attr("content")),
      normalizeString($('meta[property="og:description"]').attr("content")),
      feedEntry.description,
      bodyText,
      title,
    ]) ?? title;

  return {
    url: feedEntry.url,
    slug,
    title,
    publishedAt,
    bodyHtml,
    bodyText,
    excerpt: buildExcerpt(bodyText || feedEntry.description || title),
    metaTitle: title,
    metaDescription,
    featuredImageUrl,
    featuredImageAlt,
    categories,
    author: firstNonEmptyString([
      normalizeWhitespace($('[data-hook="user-name"]').first().text()),
      extractAuthorFromJsonLd(jsonLd),
      feedEntry.author,
    ]),
    readTime: normalizeWhitespace($('[data-hook="time-to-read"]').first().text()),
  };
}

async function convertBodyHtmlToPortableText(
  bodyHtml: string,
  sourceUrl: string,
  featuredImageUrl: string | undefined,
  summary: MigrationSummary
): Promise<PortableTextNode[]> {
  const dom = new JSDOM(`<body>${bodyHtml}</body>`);
  const { document } = dom.window;
  const body = document.body;

  body
    .querySelectorAll("script, style, noscript")
    .forEach((node: Element) => node.remove());

  removeLeadingFeaturedImageDuplicate(body, sourceUrl, featuredImageUrl);

  const figures = Array.from(
    body.querySelectorAll("figure")
  ) as HTMLElement[];

  for (const figure of figures) {
    const imageElement = figure.querySelector("img");

    if (!imageElement) {
      continue;
    }

    const imageField = await buildSanityImageFieldFromElement(
      imageElement,
      sourceUrl,
      "body",
      summary
    );

    if (!imageField) {
      continue;
    }

    const placeholder = createImagePlaceholder(document, imageField);
    const caption = normalizeWhitespace(
      figure.querySelector("figcaption")?.textContent
    );

    if (caption) {
      const paragraph = document.createElement("p");
      paragraph.textContent = caption;
      figure.replaceWith(placeholder, paragraph);
      continue;
    }

    figure.replaceWith(placeholder);
  }

  const remainingImages = Array.from(body.querySelectorAll("img")) as Element[];

  for (const imageElement of remainingImages) {
    const imageField = await buildSanityImageFieldFromElement(
      imageElement,
      sourceUrl,
      "body",
      summary
    );

    if (!imageField) {
      imageElement.remove();
      continue;
    }

    imageElement.replaceWith(createImagePlaceholder(document, imageField));
  }

  const embeds = Array.from(
    body.querySelectorAll("iframe, video, oembed")
  ) as HTMLElement[];

  for (const embed of embeds) {
    const embedUrl = resolveUrl(
      firstNonEmptyString([
        normalizeString(embed.getAttribute("src")),
        normalizeString(embed.getAttribute("data-src")),
        normalizeString(embed.getAttribute("url")),
        normalizeString(embed.getAttribute("data-url")),
      ]),
      sourceUrl
    );

    const youtubeVideoId = embedUrl ? extractYouTubeVideoId(embedUrl) : undefined;

    if (youtubeVideoId) {
      const placeholder = document.createElement("div");
      placeholder.setAttribute("data-sanity-object", "youtube");
      placeholder.setAttribute("data-video-id", youtubeVideoId);
      embed.replaceWith(placeholder);
      continue;
    }

    if (embedUrl) {
      const paragraph = document.createElement("p");
      const link = document.createElement("a");
      link.href = embedUrl;
      link.textContent = "Embedded video";
      paragraph.appendChild(link);
      embed.replaceWith(paragraph);
      continue;
    }

    embed.remove();
  }

  const blocks = htmlToBlocks(body.innerHTML, blockContentType as never, {
    parseHtml: (html) => new JSDOM(html).window.document,
    rules: customBlockRules,
  });

  return removeWhitespaceOnlyPortableTextBlocks(
    blocks as unknown as PortableTextNode[]
  );
}

function removeLeadingFeaturedImageDuplicate(
  body: HTMLElement,
  sourceUrl: string,
  featuredImageUrl: string | undefined
): void {
  const featuredImageKey = getImageIdentity(featuredImageUrl, sourceUrl);

  if (!featuredImageKey) {
    return;
  }

  const leadingElements = Array.from(body.children) as HTMLElement[];

  for (const element of leadingElements) {
    if (isElementEmpty(element)) {
      element.remove();
      continue;
    }

    if (isLeadingDuplicateImageElement(element, sourceUrl, featuredImageKey)) {
      element.remove();
      continue;
    }

    break;
  }
}

function isLeadingDuplicateImageElement(
  element: HTMLElement,
  sourceUrl: string,
  featuredImageKey: string
): boolean {
  if (element.tagName.toLowerCase() === "figure") {
    const image = element.querySelector("img");

    if (!image) {
      return false;
    }

    return (
      getImageIdentity(resolveImageUrlFromElement(image, sourceUrl), sourceUrl) ===
      featuredImageKey
    );
  }

  if (element.tagName.toLowerCase() === "img") {
    return (
      getImageIdentity(resolveImageUrlFromElement(element, sourceUrl), sourceUrl) ===
      featuredImageKey
    );
  }

  if (!["div", "p"].includes(element.tagName.toLowerCase())) {
    return false;
  }

  const images = Array.from(element.querySelectorAll("img"));

  if (images.length !== 1) {
    return false;
  }

  const clone = element.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("img").forEach((image) => image.remove());

  if (normalizeWhitespace(clone.textContent)) {
    return false;
  }

  return (
    getImageIdentity(resolveImageUrlFromElement(images[0], sourceUrl), sourceUrl) ===
    featuredImageKey
  );
}

function isElementEmpty(element: HTMLElement): boolean {
  const hasMedia = Boolean(
    element.querySelector("img, iframe, video, oembed, figure")
  );

  if (hasMedia) {
    return false;
  }

  return !normalizeWhitespace(element.textContent);
}

async function buildSanityImageFieldFromElement(
  imageElement: Element,
  sourceUrl: string,
  kind: UploadKind,
  summary: MigrationSummary
): Promise<SanityImageField | undefined> {
  const imageUrl = resolveImageUrlFromElement(imageElement, sourceUrl);
  const alt = normalizeWhitespace(
    firstNonEmptyString([
      normalizeString(imageElement.getAttribute("alt")),
      normalizeString(imageElement.getAttribute("title")),
      normalizeString(imageElement.getAttribute("aria-label")),
    ])
  );

  if (!imageUrl) {
    return undefined;
  }

  return buildSanityImageField(imageUrl, alt, kind, summary);
}

async function buildSanityImageField(
  imageUrl: string,
  alt: string | undefined,
  kind: UploadKind,
  summary: MigrationSummary
): Promise<SanityImageField | undefined> {
  const upload = await getOrUploadImage(imageUrl, kind, summary);

  if (!upload) {
    return undefined;
  }

  return {
    _type: "image",
    _key: randomKey(12),
    asset: {
      _type: "reference",
      _ref: upload.assetRef,
    },
    ...(alt ? { alt } : {}),
  };
}

async function getOrUploadImage(
  imageUrl: string,
  kind: UploadKind,
  summary: MigrationSummary
): Promise<UploadResult | undefined> {
  const normalizedUrl = resolveUrl(imageUrl, WIX_BLOG_URL);

  if (!normalizedUrl) {
    return undefined;
  }

  const existingUpload = imageUploadCache.get(normalizedUrl);

  if (existingUpload) {
    return existingUpload;
  }

  const uploadPromise = uploadImage(normalizedUrl, kind, summary);
  imageUploadCache.set(normalizedUrl, uploadPromise);

  return uploadPromise;
}

async function uploadImage(
  imageUrl: string,
  kind: UploadKind,
  summary: MigrationSummary
): Promise<UploadResult | undefined> {
  const filename = buildFilenameFromUrl(imageUrl);

  if (DRY_RUN) {
    if (kind === "featured") {
      summary.featuredImagesProcessed += 1;
    } else {
      summary.bodyImagesProcessed += 1;
    }

    return {
      assetRef: `image-${createHash("sha1")
        .update(imageUrl)
        .digest("hex")
        .slice(0, 24)}-dryrun-jpg`,
    };
  }

  const response = await sourceFetcher.fetch(imageUrl);

  if (!response.ok) {
    console.log(
      `  Image download failed (${response.status}) for ${imageUrl}; continuing without it.`
    );
    return undefined;
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const contentType = normalizeString(response.headers.get("content-type"));

  const asset = await client.assets.upload("image", buffer, {
    filename,
    ...(contentType ? { contentType } : {}),
  });

  if (kind === "featured") {
    summary.featuredImagesProcessed += 1;
  } else {
    summary.bodyImagesProcessed += 1;
  }

  return {
    assetRef: asset._id,
  };
}

function createImagePlaceholder(
  document: Document,
  imageField: SanityImageField
): HTMLDivElement {
  const placeholder = document.createElement("div");
  placeholder.setAttribute("data-sanity-object", "image");
  placeholder.setAttribute("data-asset-ref", imageField.asset._ref);

  if (imageField.alt) {
    placeholder.setAttribute("data-alt", imageField.alt);
  }

  return placeholder;
}

function removeWhitespaceOnlyPortableTextBlocks(
  blocks: PortableTextNode[]
): PortableTextNode[] {
  return blocks.filter((block) => !isWhitespaceOnlyPortableTextBlock(block));
}

function isWhitespaceOnlyPortableTextBlock(block: PortableTextNode): boolean {
  if (block._type !== "block" || !Array.isArray(block.children)) {
    return false;
  }

  return block.children.every((child) => {
    if (!isRecord(child)) {
      return false;
    }

    return (
      child._type === "span" &&
      typeof child.text === "string" &&
      child.text.trim().length === 0
    );
  });
}

function extractBlogPostingJsonLd($: CheerioAPI): JsonObject | undefined {
  const nodes: JsonObject[] = [];

  $('script[type="application/ld+json"]').each((_, element) => {
    const raw = $(element).contents().text().trim();

    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as unknown;
      nodes.push(...collectJsonLdObjects(parsed));
    } catch {
      return;
    }
  });

  return nodes.find((node) => hasJsonLdType(node, "BlogPosting"));
}

function collectJsonLdObjects(value: unknown): JsonObject[] {
  if (Array.isArray(value)) {
    return value.flatMap((entry) => collectJsonLdObjects(entry));
  }

  if (!isRecord(value)) {
    return [];
  }

  const graph = value["@graph"];

  if (Array.isArray(graph)) {
    return [value, ...graph.flatMap((entry) => collectJsonLdObjects(entry))];
  }

  return [value];
}

function hasJsonLdType(node: JsonObject, expectedType: string): boolean {
  const typeValue = node["@type"];

  if (typeof typeValue === "string") {
    return typeValue === expectedType;
  }

  if (Array.isArray(typeValue)) {
    return typeValue.some((value) => value === expectedType);
  }

  return false;
}

function extractFeaturedImageFromJsonLd(node: JsonObject | undefined): string | undefined {
  if (!node) {
    return undefined;
  }

  const imageValue = node.image;

  if (typeof imageValue === "string") {
    return resolveUrl(imageValue, WIX_BLOG_URL);
  }

  if (Array.isArray(imageValue)) {
    for (const entry of imageValue) {
      const url = extractUrlFromUnknown(entry);

      if (url) {
        return resolveUrl(url, WIX_BLOG_URL);
      }
    }
  }

  return resolveUrl(extractUrlFromUnknown(imageValue), WIX_BLOG_URL);
}

function extractAuthorFromJsonLd(node: JsonObject | undefined): string | undefined {
  if (!node) {
    return undefined;
  }

  const author = node.author;

  if (typeof author === "string") {
    return normalizeWhitespace(author);
  }

  if (Array.isArray(author)) {
    for (const entry of author) {
      const name = extractPersonName(entry);

      if (name) {
        return name;
      }
    }
  }

  return extractPersonName(author);
}

function extractPersonName(value: unknown): string | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  return normalizeWhitespace(asString(value.name));
}

function getJsonLdString(
  node: JsonObject | undefined,
  key: string
): string | undefined {
  if (!node) {
    return undefined;
  }

  return asString(node[key]);
}

function parseSourceDate(rawDate: string | undefined): string | undefined {
  const normalized = normalizeWhitespace(rawDate);

  if (!normalized) {
    return undefined;
  }

  if (/^\d{4}-\d{2}-\d{2}$/u.test(normalized)) {
    const parsed = new Date(`${normalized}T12:00:00.000Z`);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
  }

  if (
    /^[A-Za-z]{3,9}\s+\d{1,2},\s+\d{4}$/u.test(normalized) ||
    /^\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4}$/u.test(normalized)
  ) {
    const parsed = new Date(`${normalized} 12:00:00 UTC`);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
  }

  const parsed = new Date(normalized);

  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed.toISOString();
}

function buildExcerpt(text: string): string {
  const normalized = normalizeWhitespace(text) ?? "";

  if (normalized.length <= 200) {
    return normalized;
  }

  const truncated = normalized.slice(0, 200).trimEnd();
  const lastSpace = truncated.lastIndexOf(" ");
  const safeTruncate =
    lastSpace > 120 ? truncated.slice(0, lastSpace).trimEnd() : truncated;

  return `${safeTruncate}...`;
}

function extractSlugFromPostUrl(url: string): string | undefined {
  try {
    const pathname = new URL(url).pathname;
    const match = pathname.match(/^\/post\/([^/]+)\/?$/u);
    return match?.[1];
  } catch {
    return undefined;
  }
}

function resolveImageUrlFromElement(
  element: Element,
  baseUrl: string
): string | undefined {
  const srcsetCandidate = pickLargestSrcFromSrcset(
    normalizeString(element.getAttribute("srcset"))
  );

  return resolveUrl(
    firstNonEmptyString([
      normalizeString(element.getAttribute("data-image-url")),
      normalizeString(element.getAttribute("data-src")),
      normalizeString(element.getAttribute("data-lazy-src")),
      srcsetCandidate,
      normalizeString(element.getAttribute("src")),
    ]),
    baseUrl
  );
}

function getImageIdentity(
  imageUrl: string | undefined,
  baseUrl: string
): string | undefined {
  const resolvedUrl = resolveUrl(imageUrl, baseUrl);

  if (!resolvedUrl) {
    return undefined;
  }

  try {
    const parsedUrl = new URL(resolvedUrl);
    const wixMediaMatch = parsedUrl.pathname.match(/\/media\/([^/]+)/);

    if (wixMediaMatch?.[1]) {
      return wixMediaMatch[1];
    }

    return `${parsedUrl.origin}${parsedUrl.pathname}`;
  } catch {
    return undefined;
  }
}

function pickLargestSrcFromSrcset(srcset: string | undefined): string | undefined {
  if (!srcset) {
    return undefined;
  }

  const candidates = srcset
    .split(",")
    .map((part) => normalizeString(part.split(/\s+/u)[0]))
    .filter((value): value is string => Boolean(value));

  return candidates.at(-1);
}

function resolveUrl(
  rawUrl: string | undefined,
  baseUrl: string
): string | undefined {
  const normalized = normalizeString(rawUrl);

  if (!normalized || normalized.startsWith("data:")) {
    return undefined;
  }

  if (normalized.startsWith("wix:image://v1/")) {
    const mediaId = normalized.replace("wix:image://v1/", "").split("/")[0];

    if (mediaId) {
      return `https://static.wixstatic.com/media/${mediaId}`;
    }
  }

  try {
    return new URL(normalized, baseUrl).toString();
  } catch {
    return undefined;
  }
}

function extractYouTubeVideoId(url: string): string | undefined {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace(/^www\./u, "");

    if (hostname === "youtu.be") {
      return parsedUrl.pathname.split("/").filter(Boolean)[0];
    }

    if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      if (parsedUrl.pathname === "/watch") {
        return parsedUrl.searchParams.get("v") ?? undefined;
      }

      const segments = parsedUrl.pathname.split("/").filter(Boolean);

      if (segments[0] === "embed" || segments[0] === "shorts") {
        return segments[1];
      }
    }

    return undefined;
  } catch {
    return undefined;
  }
}

function buildFilenameFromUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    const lastSegment = parsedUrl.pathname.split("/").filter(Boolean).at(-1);
    return normalizeFilename(lastSegment ?? "wix-image");
  } catch {
    return "wix-image";
  }
}

function normalizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/gu, "-");
}

function extractUrlFromUnknown(value: unknown): string | undefined {
  if (typeof value === "string") {
    return normalizeString(value);
  }

  if (!isRecord(value)) {
    return undefined;
  }

  return firstNonEmptyString([
    asString(value.url),
    asString(value.contentUrl),
    asString(value["@id"]),
  ]);
}

function formatCategoryTitle(category: string): string {
  const normalized = normalizeWhitespace(category) ?? category;
  const segments = normalized.split(/[\s_-]+/u).filter(Boolean);
  const uppercaseTokens = new Set(["AI", "DJI", "SFX", "TV", "VFX", "3D"]);

  if (segments.length === 0) {
    return "General";
  }

  return segments
    .map((segment) => {
      const upper = segment.toUpperCase();

      if (uppercaseTokens.has(upper) || /^\d+[A-Za-z]+$/u.test(segment)) {
        return upper;
      }

      return segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase();
    })
    .join(" ");
}

function slugify(value: string): string {
  return (
    normalizeWhitespace(value)
      ?.toLowerCase()
      .replace(/&/gu, " and ")
      .replace(/[^a-z0-9]+/gu, "-")
      .replace(/^-+|-+$/gu, "") || "general"
  );
}

function dedupeStrings(values: string[]): string[] {
  return Array.from(
    new Set(
      values
        .map((value) => normalizeWhitespace(value))
        .filter((value): value is string => Boolean(value))
    )
  );
}

function isPostUrl(url: string): boolean {
  try {
    return new URL(url).pathname.startsWith("/post/");
  } catch {
    return false;
  }
}

function firstNonEmptyString(
  values: Array<string | undefined | null>
): string | undefined {
  for (const value of values) {
    const normalized = normalizeString(value);

    if (normalized) {
      return normalized;
    }
  }

  return undefined;
}

function normalizeString(value: string | undefined | null): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function normalizeWhitespace(
  value: string | undefined | null
): string | undefined {
  const normalized = value?.replace(/\s+/gu, " ").trim();
  return normalized ? normalized : undefined;
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? normalizeString(value) : undefined;
}

function isRecord(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null;
}

function isElementNode(value: Node): value is Element {
  return value.nodeType === 1;
}

function toAbsoluteUrl(
  rawUrl: string | undefined,
  baseUrl: string
): string | undefined {
  return resolveUrl(rawUrl, baseUrl);
}

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`${name} is required in .env.local.`);
  }

  return value;
}

function parseLimitArg(args: string[]): number | undefined {
  const directMatch = args.find((arg) => arg.startsWith("--limit="));

  if (directMatch) {
    const value = Number.parseInt(directMatch.split("=")[1] ?? "", 10);
    return Number.isFinite(value) && value > 0 ? value : undefined;
  }

  const flagIndex = args.indexOf("--limit");

  if (flagIndex === -1) {
    return undefined;
  }

  const value = Number.parseInt(args[flagIndex + 1] ?? "", 10);
  return Number.isFinite(value) && value > 0 ? value : undefined;
}

class RateLimitedFetcher {
  private lastRequestAt = 0;

  constructor(private readonly delayMs: number) {}

  async fetch(url: string, init?: RequestInit): Promise<Response> {
    const waitFor = this.delayMs - (Date.now() - this.lastRequestAt);

    if (this.lastRequestAt > 0 && waitFor > 0) {
      await sleep(waitFor);
    }

    this.lastRequestAt = Date.now();

    return fetch(url, {
      redirect: "follow",
      ...init,
      headers: {
        "user-agent": "alan-cross-wix-migration/1.0 (+https://www.alanx.uk)",
        accept:
          "text/html,application/xml,application/xhtml+xml,image/avif,image/webp,*/*;q=0.8",
        ...(init?.headers ?? {}),
      },
    });
  }
}

const sourceFetcher = new RateLimitedFetcher(REQUEST_DELAY_MS);
const imageUploadCache = new Map<string, Promise<UploadResult | undefined>>();

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
