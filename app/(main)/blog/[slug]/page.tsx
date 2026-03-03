import { notFound } from "next/navigation";
import {
  fetchSanityPostBySlug,
  fetchSanityPostsStaticParams,
} from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/nav";
import SiteFooter from "@/components/sections/site-footer";
import PortableTextRenderer from "@/components/portable-text-renderer";
import type { Metadata } from "next";
import type { Post } from "@/types";

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
  const post = (await fetchSanityPostBySlug({
    slug: params.slug,
  })) as Post | null;

  if (!post) return {};

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      ...(post.ogImage?.asset?.url && {
        images: [{ url: post.ogImage.asset.url }],
      }),
    },
    robots: post.noindex ? "noindex, nofollow" : undefined,
  };
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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

  return (
    <>
      <Nav />
      <article className="pt-40 pb-28 px-12 max-md:pt-32 max-md:pb-20 max-md:px-6">
        <div className="max-w-[800px] mx-auto">
          {/* Back link */}
          <Link
            href="/blog"
            className="text-[0.72rem] tracking-[0.15em] uppercase text-text-muted no-underline transition-colors duration-300 hover:text-accent mb-8 inline-block"
          >
            &larr; Back to Blog
          </Link>

          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              {post.category && (
                <span className="text-[0.65rem] tracking-[0.2em] uppercase text-accent font-medium">
                  {post.category}
                </span>
              )}
              <span className="text-[0.7rem] text-text-muted">
                {formatDate(post.publishedAt)}
              </span>
            </div>
            <h1 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.1]">
              {post.title}
            </h1>
          </header>

          {/* Main image */}
          {post.mainImage?.asset && (
            <div className="aspect-video relative overflow-hidden mb-12">
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

          {/* Body */}
          {post.body && (
            <div className="text-text-secondary leading-[1.8] [&>p]:mb-6 [&>h1]:text-text-primary [&>h1]:font-display [&>h1]:mt-12 [&>h1]:mb-6 [&>h2]:text-text-primary [&>h2]:font-display [&>h2]:text-[1.8rem] [&>h2]:mt-10 [&>h2]:mb-4 [&>h3]:text-text-primary [&>h3]:font-display [&>h3]:text-[1.3rem] [&>h3]:mt-8 [&>h3]:mb-3 [&>h4]:text-text-primary [&>h4]:font-display [&>a]:text-accent [&>a]:underline [&>blockquote]:border-l-2 [&>blockquote]:border-accent [&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:text-text-secondary [&>blockquote]:my-8 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6">
              <PortableTextRenderer value={post.body} />
            </div>
          )}
        </div>
      </article>
      <SiteFooter />
    </>
  );
}
