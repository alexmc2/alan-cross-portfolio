import Nav from "@/components/nav";
import SiteFooter from "@/components/sections/site-footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFoundPage() {
  return (
    <>
      <Nav />
      <section className="min-h-screen flex items-center justify-center px-12">
        <div className="text-center">
          <h1 className="font-display text-[4rem] font-bold text-accent mb-4">
            404
          </h1>
          <p className="text-text-secondary text-lg mb-8">
            Page not found.
          </p>
          <Link
            href="/"
            className="text-[0.8rem] tracking-[0.12em] uppercase text-text-secondary no-underline transition-colors duration-300 hover:text-accent"
          >
            &larr; Back to Home
          </Link>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
