import { notFound } from "next/navigation";
import {
  fetchSanityPageBySlug,
  fetchSanityPagesStaticParams,
} from "@/sanity/lib/fetch";
import Nav from "@/components/nav";
import SiteFooter from "@/components/sections/site-footer";
import PortableTextRenderer from "@/components/portable-text-renderer";
import type { Metadata } from "next";
import type { Page } from "@/types";

const RESERVED_SLUGS = new Set(["index", "blog", "studio", "api"]);

export async function generateStaticParams() {
  const pages = await fetchSanityPagesStaticParams();
  return (pages || [])
    .map((page: any) => page.slug?.current)
    .filter((slug: string | undefined): slug is string => Boolean(slug))
    .filter((slug: string) => !RESERVED_SLUGS.has(slug))
    .map((slug: string) => ({ slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  if (RESERVED_SLUGS.has(params.slug)) {
    return {};
  }

  const page = (await fetchSanityPageBySlug({
    slug: params.slug,
  })) as Page | null;

  if (!page) return {};

  return {
    title: page.meta_title || page.title,
    description: page.meta_description,
    openGraph: {
      title: page.meta_title || page.title,
      description: page.meta_description,
      ...(page.ogImage?.asset?.url && {
        images: [{ url: page.ogImage.asset.url }],
      }),
    },
    robots: page.noindex ? "noindex, nofollow" : undefined,
  };
}

export default async function GenericPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;

  if (RESERVED_SLUGS.has(params.slug)) {
    notFound();
  }

  const page = (await fetchSanityPageBySlug({
    slug: params.slug,
  })) as Page | null;

  if (!page) {
    notFound();
  }

  return (
    <>
      <Nav />
      <article className="pt-40 pb-28 px-12 max-md:pt-32 max-md:pb-20 max-md:px-6">
        <div className="max-w-[800px] mx-auto">
          <header className="mb-10">
            <h1 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.1]">
              {page.title}
            </h1>
          </header>

          {page.body && (
            <div className="text-text-secondary leading-[1.8] [&>p]:mb-6 [&>h1]:text-text-primary [&>h1]:font-display [&>h1]:mt-12 [&>h1]:mb-6 [&>h2]:text-text-primary [&>h2]:font-display [&>h2]:text-[1.8rem] [&>h2]:mt-10 [&>h2]:mb-4 [&>h3]:text-text-primary [&>h3]:font-display [&>h3]:text-[1.3rem] [&>h3]:mt-8 [&>h3]:mb-3 [&>h4]:text-text-primary [&>h4]:font-display [&>a]:text-accent [&>a]:underline [&>blockquote]:border-l-2 [&>blockquote]:border-accent [&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:text-text-secondary [&>blockquote]:my-8 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6">
              <PortableTextRenderer value={page.body} />
            </div>
          )}
        </div>
      </article>
      <SiteFooter />
    </>
  );
}
