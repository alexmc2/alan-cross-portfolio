import { fetchSanityPosts } from '@/sanity/lib/fetch';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import Nav from '@/components/nav';
import SiteFooter from '@/components/sections/site-footer';
import type { Metadata } from 'next';
import type { Post } from '@/types';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Thoughts on filmmaking, AI video production, and creative technology.',
};

const POSTS_PER_PAGE = 6;

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function buildHref(params: { category?: string; page?: number }) {
  const sp = new URLSearchParams();
  if (params.category) sp.set('category', params.category);
  if (params.page && params.page > 1) sp.set('page', String(params.page));
  const qs = sp.toString();
  return qs ? `/blog?${qs}` : '/blog';
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const { category, page } = await searchParams;
  const allPosts = ((await fetchSanityPosts()) || []) as Post[];

  // Extract unique categories
  const categories = Array.from(
    new Set(
      allPosts
        .map((p) => p.category?.title)
        .filter((t): t is string => Boolean(t))
    )
  ).sort();

  // Filter by category
  const filteredPosts = category
    ? allPosts.filter((p) => p.category?.title === category)
    : allPosts;

  // Pagination
  const currentPage = Math.max(1, parseInt(page || '1', 10) || 1);
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const safePage = Math.min(currentPage, Math.max(1, totalPages));
  const paginatedPosts = filteredPosts.slice(
    (safePage - 1) * POSTS_PER_PAGE,
    safePage * POSTS_PER_PAGE
  );

  return (
    <>
      <Nav />
      <section className="pt-40 pb-28 px-12 max-md:pt-32 max-md:pb-20 max-md:px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="slabel">Blog</div>
          <h1 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.1] mb-10">
            Latest Posts
          </h1>

          {/* Category filters */}
          {categories.length > 0 && (
            <div className="flex gap-3 mb-12 overflow-x-auto max-md:pb-2 md:flex-wrap">
              <Link
                href="/blog"
                className={`shrink-0 text-[0.7rem] tracking-[0.15em] uppercase px-4 py-2 border transition-colors duration-300 no-underline whitespace-nowrap ${
                  !category
                    ? 'bg-accent text-bg-primary border-accent font-semibold'
                    : 'border-accent/30 text-text-secondary hover:border-accent hover:text-accent'
                }`}
              >
                All
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={buildHref({ category: cat })}
                  className={`shrink-0 text-[0.7rem] tracking-[0.15em] uppercase px-4 py-2 border transition-colors duration-300 no-underline whitespace-nowrap ${
                    category === cat
                      ? 'bg-accent text-bg-primary border-accent font-semibold'
                      : 'border-accent/30 text-text-secondary hover:border-accent hover:text-accent'
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}

          {paginatedPosts.length === 0 ? (
            <p className="text-text-secondary">No posts found.</p>
          ) : (
            <div className="grid grid-cols-2 gap-8 max-[900px]:grid-cols-1">
              {paginatedPosts.map((post) => (
                <div key={post.slug.current} className="flex">
                  <Link
                    href={`/blog/${post.slug.current}`}
                    className="group no-underline flex flex-1"
                  >
                    <article className="flex flex-col flex-1 bg-bg-card overflow-hidden border border-accent/20 transition-all duration-300 hover:bg-bg-elevated hover:border-accent/40">
                      {/* Image */}
                      <div className="aspect-video relative overflow-hidden">
                        {post.mainImage?.asset ? (
                          <Image
                            src={urlFor(post.mainImage)
                              .width(800)
                              .height(450)
                              .url()}
                            alt={post.mainImage.alt || post.title}
                            fill
                            className="object-cover transition-transform duration-600 group-hover:scale-[1.03]"
                            sizes="600px"
                            placeholder={
                              post.mainImage.asset.metadata?.lqip
                                ? 'blur'
                                : undefined
                            }
                            blurDataURL={post.mainImage.asset.metadata?.lqip}
                          />
                        ) : (
                          <div
                            className="w-full h-full"
                            style={{
                              background:
                                'linear-gradient(135deg, #151318, #1a1816 50%, #12110f)',
                            }}
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          {post.category?.title && (
                            <span className="text-[0.65rem] tracking-[0.2em] uppercase text-accent font-medium">
                              {post.category.title}
                            </span>
                          )}
                          <span className="text-[0.7rem] text-text-secondary">
                            {formatDate(post.publishedAt)}
                          </span>
                        </div>
                        <h2 className="font-display text-[1.2rem] font-semibold leading-[1.3] mb-2 text-text-primary">
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="text-[0.88rem] text-text-secondary leading-[1.7] line-clamp-2 mt-auto">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                    </article>
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              aria-label="Blog pagination"
              className="flex items-center justify-center gap-1.5 mt-16"
            >
              {/* Previous */}
              {safePage > 1 ? (
                <Link
                  href={buildHref({ category, page: safePage - 1 })}
                  className="text-[0.75rem] w-9 h-9 flex items-center justify-center border border-accent/30 text-text-secondary no-underline transition-colors duration-300 hover:border-accent hover:text-accent"
                  aria-label="Previous page"
                >
                  &larr;
                </Link>
              ) : (
                <span className="text-[0.75rem] w-9 h-9 flex items-center justify-center border border-white/10 text-text-muted cursor-default">
                  &larr;
                </span>
              )}

              {/* Page numbers — truncated with ellipsis */}
              {(() => {
                const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] =
                  [];
                if (totalPages <= 5) {
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                  pages.push(1);
                  if (safePage > 3) pages.push('ellipsis-start');
                  const start = Math.max(2, safePage - 1);
                  const end = Math.min(totalPages - 1, safePage + 1);
                  for (let i = start; i <= end; i++) pages.push(i);
                  if (safePage < totalPages - 2) pages.push('ellipsis-end');
                  pages.push(totalPages);
                }
                return pages.map((p) =>
                  typeof p === 'string' ? (
                    <span
                      key={p}
                      className="text-[0.75rem] w-7 h-9 flex items-center justify-center text-text-muted"
                    >
                      &hellip;
                    </span>
                  ) : (
                    <Link
                      key={p}
                      href={buildHref({ category, page: p })}
                      className={`text-[0.75rem] w-9 h-9 flex items-center justify-center border no-underline transition-colors duration-300 ${
                        p === safePage
                          ? 'bg-accent text-bg-primary border-accent font-semibold'
                          : 'border-accent/30 text-text-secondary hover:border-accent hover:text-accent'
                      }`}
                    >
                      {p}
                    </Link>
                  )
                );
              })()}

              {/* Next */}
              {safePage < totalPages ? (
                <Link
                  href={buildHref({ category, page: safePage + 1 })}
                  className="text-[0.75rem] w-9 h-9 flex items-center justify-center border border-accent/30 text-text-secondary no-underline transition-colors duration-300 hover:border-accent hover:text-accent"
                  aria-label="Next page"
                >
                  &rarr;
                </Link>
              ) : (
                <span className="text-[0.75rem] w-9 h-9 flex items-center justify-center border border-white/10 text-text-muted cursor-default">
                  &rarr;
                </span>
              )}
            </nav>
          )}
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
