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

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function BlogPage() {
  const posts = ((await fetchSanityPosts()) || []) as Post[];

  return (
    <>
      <Nav />
      <section className="pt-40 pb-28 px-12 max-md:pt-32 max-md:pb-20 max-md:px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="slabel">Blog</div>
          <h1 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.1] mb-16">
            Latest Posts
          </h1>

          {posts.length === 0 ? (
            <p className="text-text-secondary">No posts yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-8 max-[900px]:grid-cols-1">
              {posts.map((post) => (
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
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
