import { notFound } from "next/navigation";
import {
  fetchSiteSettingsMetadata,
  fetchSanityPostBySlug,
  fetchSanityPostsStaticParams,
} from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/nav";
import SiteFooter from "@/components/sections/site-footer";
import PortableTextRenderer from "@/components/portable-text-renderer";
import { siteUrl } from "@/lib/siteConfig";
import ShareActions from "./share-actions";
import type { Metadata } from "next";
import type { Post } from "@/types";
import { buildMetadata, resolveSiteDescription } from "@/lib/metadata";

export async function generateStaticParams() {
  const posts = await fetchSanityPostsStaticParams();
  return (posts || []).map((post: any) => ({
    slug: post.slug?.current,
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const [post, siteSettings] = await Promise.all([
    fetchSanityPostBySlug({
      slug: params.slug,
    }),
    fetchSiteSettingsMetadata(),
  ]);

  if (!post) return {};

  const socialTitle = post.meta_title || post.title;
  const socialDescription =
    post.meta_description ||
    post.excerpt ||
    resolveSiteDescription(siteSettings);
  const generatedMainImage = post.mainImage?.asset
    ? {
        asset: {
          url: urlFor(post.mainImage)
            .width(1200)
            .height(630)
            .format("jpg")
            .url(),
          metadata: {
            dimensions: {
              width: 1200,
              height: 630,
            },
          },
        },
      }
    : null;

  return buildMetadata({
    title: socialTitle,
    description: socialDescription,
    canonicalPath: `/blog/${params.slug}`,
    image: post.ogImage?.asset?.url
      ? post.ogImage
      : generatedMainImage || siteSettings?.ogImage,
    noindex: post.noindex,
    type: "article",
    publishedTime: post.publishedAt,
  });
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isWhitespaceOnlyBlock(block: any) {
  if (block?._type !== "block" || !Array.isArray(block.children)) {
    return false;
  }

  return !block.children.some((child: any) =>
    typeof child?.text === "string" ? child.text.trim().length > 0 : false
  );
}

function removeLeadingBodyImage(body: Post["body"], hasMainImage: boolean) {
  if (!hasMainImage || !Array.isArray(body)) {
    return body;
  }

  const normalizedBody = [...body];

  while (normalizedBody[0] && isWhitespaceOnlyBlock(normalizedBody[0])) {
    normalizedBody.shift();
  }

  if (normalizedBody[0]?._type === "image") {
    normalizedBody.shift();
  }

  return normalizedBody;
}

function getPostCategories(post: Post) {
  const categories = new Map<string, NonNullable<Post["category"]>>();

  for (const category of [post.category, ...(post.categories ?? [])]) {
    if (!category?.title) continue;

    const key = category.slug?.current ?? category.title;
    if (!categories.has(key)) {
      categories.set(key, category);
    }
  }

  return Array.from(categories.values());
}

export default async function PostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = (await fetchSanityPostBySlug({
    slug: params.slug,
  })) as Post | null;

  if (!post) {
    notFound();
  }

  const body = removeLeadingBodyImage(post.body, Boolean(post.mainImage?.asset));
  const categories = getPostCategories(post);
  const publishedDate = formatDate(post.publishedAt);
  const shareUrl = `${siteUrl}/blog/${params.slug}`;
  const metaRow = (
    <div
      className="mb-12 flex items-center justify-between gap-8 border-t border-border pt-6 opacity-0 animate-fade-up max-md:flex-col max-md:items-start max-md:gap-5"
      style={{ animationDelay: post.mainImage?.asset ? "300ms" : "200ms" }}
    >
      <span className="text-[1rem] font-medium leading-none text-accent">
        {publishedDate}
      </span>
      <ShareActions title={post.title} url={shareUrl} />
    </div>
  );

  return (
    <>
      <Nav />
      <article className="pt-40 pb-28 px-12 max-md:pt-32 max-md:pb-20 max-md:px-6">
        <div className="max-w-[800px] mx-auto">
          {/* Back link */}
          <Link
            href="/blog"
            className="text-[0.72rem] tracking-[0.15em] uppercase text-text-muted no-underline transition-colors duration-300 hover:text-accent mb-8 inline-block opacity-0 animate-fade-up"
          >
            &larr; Back to Blogs
          </Link>

          {/* Header */}
          <header
            className="mb-12 opacity-0 animate-fade-up"
            style={{ animationDelay: '100ms' }}
          >
            {categories.length > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-4">
                {categories.map((category) => (
                  <span
                    key={category.slug?.current ?? category.title}
                    className="text-[0.65rem] tracking-[0.2em] uppercase text-accent font-medium"
                  >
                    {category.title}
                  </span>
                ))}
              </div>
            )}
            <h1 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.1]">
              {post.title}
            </h1>
          </header>

          {/* Main image */}
          {post.mainImage?.asset && (
            <div
              className="aspect-video relative overflow-hidden mb-12 opacity-0 animate-fade-up"
              style={{ animationDelay: '200ms' }}
            >
              <Image
                src={urlFor(post.mainImage).width(1200).height(675).url()}
                alt={post.mainImage.alt || post.title}
                fill
                className="object-cover"
                sizes="800px"
                priority
                placeholder={
                  post.mainImage.asset.metadata?.lqip ? "blur" : undefined
                }
                blurDataURL={post.mainImage.asset.metadata?.lqip}
              />
            </div>
          )}

          {metaRow}

          {/* Body */}
          {body && (
            <div
              className="text-text-secondary leading-[1.8] opacity-0 animate-fade-up [&>p]:mb-6 [&>h1]:text-text-primary [&>h1]:font-display [&>h1]:mt-12 [&>h1]:mb-6 [&>h2]:text-text-primary [&>h2]:font-display [&>h2]:text-[1.8rem] [&>h2]:mt-10 [&>h2]:mb-4 [&>h3]:text-text-primary [&>h3]:font-display [&>h3]:text-[1.3rem] [&>h3]:mt-8 [&>h3]:mb-3 [&>h4]:text-text-primary [&>h4]:font-display [&>a]:text-accent [&>a]:underline [&>blockquote]:border-l-2 [&>blockquote]:border-accent [&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:text-text-secondary [&>blockquote]:my-8 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6"
              style={{ animationDelay: post.mainImage?.asset ? '400ms' : '300ms' }}
            >
              <PortableTextRenderer value={body} />
            </div>
          )}
        </div>
      </article>
      <SiteFooter />
    </>
  );
}
