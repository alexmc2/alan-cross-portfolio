"use client";

import { useState } from "react";
import { Check, Facebook, Link2, Linkedin } from "lucide-react";

type ShareActionsProps = {
  title: string;
  url: string;
};

const iconButtonClassName =
  "flex h-11 w-11 items-center justify-center rounded-full border border-border bg-bg-card text-text-secondary  transition-[transform,border-color,background-color,color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:bg-[color:var(--color-accent-soft)] hover:text-accent hover:shadow-[0_7px_15px_rgba(0,0,0,0.08)] focus-visible:outline-none focus-visible:-translate-y-0.5 focus-visible:border-accent/30 focus-visible:bg-[color:var(--color-accent-soft)] focus-visible:text-accent focus-visible:shadow-[0_14px_30px_rgba(0,0,0,0.16)]";

function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-[1.05rem] w-[1.05rem] fill-current"
    >
      <path d="M18.901 2H22l-6.768 7.736L23.193 22H16.96l-4.884-7.435L5.57 22H2.469l7.238-8.272L1.807 2H8.2l4.415 6.73L18.901 2Zm-1.087 18.124h1.717L7.267 3.78H5.425l12.389 16.344Z" />
    </svg>
  );
}

export default function ShareActions({ title, url }: ShareActionsProps) {
  const [isCopied, setIsCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      label: "Share on X",
      icon: XIcon,
    },
    {
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      label: "Share on LinkedIn",
      icon: Linkedin,
    },
    {
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      label: "Share on Facebook",
      icon: Facebook,
    },
  ];

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setIsCopied(true);
    window.setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-4 max-sm:w-full max-sm:flex-wrap">
      <span className="text-[0.95rem] text-text-secondary">Share this post</span>
      <div className="flex items-center gap-2">
        {shareLinks.map(({ href, label, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className={iconButtonClassName}
          >
            <Icon className="h-[1.05rem] w-[1.05rem]" />
          </a>
        ))}
        <button
          type="button"
          onClick={copyLink}
          aria-label={isCopied ? "Link copied" : "Copy link"}
          className={iconButtonClassName}
        >
          {isCopied ? (
            <Check className="h-[1.05rem] w-[1.05rem]" />
          ) : (
            <Link2 className="h-[1.05rem] w-[1.05rem]" />
          )}
        </button>
      </div>
    </div>
  );
}
