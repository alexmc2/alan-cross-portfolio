import type { PortfolioItem } from "@/types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

export default function Work({ items }: { items: PortfolioItem[] }) {
  return (
    <section id="work" className="py-28 px-12 max-md:py-20 max-md:px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="slabel">Selected Work</div>
        <div className="grid grid-cols-2 gap-6 mt-12 max-[900px]:grid-cols-1">
          {items.map((item) => (
            <a
              key={item._id}
              href={item.vimeoUrl || "#"}
              target={item.vimeoUrl ? "_blank" : undefined}
              rel={item.vimeoUrl ? "noopener noreferrer" : undefined}
              className={`relative overflow-hidden cursor-pointer group ${
                item.featured
                  ? "col-span-2 aspect-[21/9] max-[900px]:col-span-1 max-[900px]:aspect-video"
                  : "aspect-video"
              }`}
              style={{ background: "var(--color-bg-card)" }}
            >
              {/* Thumbnail or placeholder */}
              <div className="w-full h-full transition-transform duration-600 group-hover:scale-[1.03]">
                {item.thumbnail?.asset ? (
                  <Image
                    src={urlFor(item.thumbnail).width(1200).height(item.featured ? 514 : 675).url()}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes={item.featured ? "1200px" : "600px"}
                    placeholder={item.thumbnail.asset.metadata?.lqip ? "blur" : undefined}
                    blurDataURL={item.thumbnail.asset.metadata?.lqip}
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, #151318, #1a1816 50%, #12110f)",
                    }}
                  >
                    <span className="text-[0.65rem] tracking-[0.25em] uppercase text-text-muted border border-[rgba(255,255,255,0.05)] px-5 py-2.5">
                      {item.category || "Video"}
                    </span>
                  </div>
                )}
              </div>

              {/* Hover overlay */}
              <div
                className="absolute inset-0 flex flex-col justify-end p-8 opacity-0 transition-opacity duration-400 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(to top, rgba(10,10,10,0.9), transparent 60%)",
                }}
              >
                <h3 className="font-display text-[1.15rem] font-semibold mb-1">
                  {item.title}
                </h3>
                <p className="text-[0.78rem] text-text-secondary tracking-[0.05em]">
                  {item.category}
                  {item.year && ` \u2014 ${item.year}`}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
