import type { SiteSettings, SocialLink } from "@/types";

export default function Contact({
  settings,
  socialLinks,
}: {
  settings: SiteSettings;
  socialLinks: SocialLink[];
}) {
  // Extract display names from URLs for the detail rows
  const linkedIn = socialLinks.find((s) => s.platform === "LinkedIn");
  const vimeo = socialLinks.find((s) => s.platform === "Vimeo");
  const youtube = socialLinks.find((s) => s.platform === "YouTube");

  const detailRows = [
    { label: "Location", value: "South Coast, UK" },
    linkedIn && {
      label: "LinkedIn",
      value: linkedIn.url.replace(/^https?:\/\//, "").replace(/\/$/, ""),
      href: linkedIn.url,
    },
    vimeo && {
      label: "Vimeo",
      value: vimeo.url.replace(/^https?:\/\//, "").replace(/\/$/, ""),
      href: vimeo.url,
    },
    youtube && {
      label: "YouTube",
      value: youtube.url
        .replace(/^https?:\/\//, "")
        .replace(/\/$/, "")
        .replace("www.", "")
        .replace("/user/", "/"),
      href: youtube.url,
    },
  ].filter(Boolean) as Array<{
    label: string;
    value: string;
    href?: string;
  }>;

  return (
    <section
      id="contact"
      className="py-28 px-12 bg-bg-elevated border-t border-border max-md:py-20 max-md:px-6"
    >
      <div className="max-w-[1200px] mx-auto grid grid-cols-2 gap-20 items-start max-[900px]:grid-cols-1 max-[900px]:gap-12">
        {/* Left column */}
        <div className="reveal">
          <div className="slabel">Get in Touch</div>
          {settings.contactHeading && (
            <h2 className="font-display text-[clamp(2rem,3.5vw,3.2rem)] font-bold leading-[1.15] mb-6">
              {settings.contactHeading}
            </h2>
          )}
          {settings.contactSubheading && (
            <p className="text-text-secondary text-base max-w-[420px] mb-8">
              {settings.contactSubheading}
            </p>
          )}
          {settings.contactEmail && (
            <a
              href={`mailto:${settings.contactEmail}`}
              className="font-display text-[1.3rem] font-semibold text-accent no-underline inline-flex items-center gap-3 transition-all duration-300 hover:gap-5 group"
            >
              {settings.contactEmail}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          )}
        </div>

        {/* Right column */}
        <div className="pt-4 reveal">
          {detailRows.map((row, i) => (
            <div
              key={row.label}
              className={`py-6 border-b border-border flex justify-between items-center ${
                i === 0 ? "border-t" : ""
              }`}
            >
              <span className="text-[0.7rem] tracking-[0.2em] uppercase text-text-muted">
                {row.label}
              </span>
              <span className="text-[0.95rem] text-text-primary">
                {row.href ? (
                  <a
                    href={row.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-primary no-underline transition-colors duration-300 hover:text-accent"
                  >
                    {row.value}
                  </a>
                ) : (
                  row.value
                )}
              </span>
            </div>
          ))}

          {/* Social links row */}
          <div className="flex gap-6 mt-10">
            {socialLinks.map((link) => (
              <a
                key={link._id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.72rem] tracking-[0.15em] uppercase text-text-muted no-underline transition-colors duration-300 hover:text-accent"
              >
                {link.platform}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
