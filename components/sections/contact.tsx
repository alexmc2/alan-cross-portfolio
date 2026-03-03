import type { SiteSettings, ContactDetail } from '@/types';

/**
 * Resolves the href for a contact detail row.
 * - Social / website: uses linkUrl directly
 * - Phone: auto-generates tel: if no explicit linkUrl
 * - Email: auto-generates mailto: if no explicit linkUrl
 * - Location / address / other: uses linkUrl if provided, otherwise no link
 */
function resolveHref(detail: ContactDetail): string | undefined {
  if (detail.linkUrl) return detail.linkUrl;
  switch (detail.detailType) {
    case 'phone':
      return `tel:${detail.value.replace(/\s+/g, '')}`;
    case 'email':
      return `mailto:${detail.value}`;
    case 'social':
    case 'website':
      // If someone forgot to add a linkUrl for a social/website, try the value
      return detail.value.startsWith('http') ? detail.value : undefined;
    default:
      return undefined;
  }
}

export default function Contact({
  settings,
  contactDetails,
}: {
  settings: SiteSettings;
  contactDetails: ContactDetail[];
}) {
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
          {contactDetails.map((detail, i) => {
            const href = resolveHref(detail);
            return (
              <div
                key={detail._id}
                className={`py-6 border-b border-border flex justify-between items-center ${
                  i === 0 ? 'border-t' : ''
                }`}
              >
                <span className="text-[0.7rem] tracking-[0.2em] uppercase text-accent">
                  {detail.label}
                </span>
                <span className="text-[0.95rem] text-text-primary">
                  {href ? (
                    <a
                      href={href}
                      target={
                        detail.detailType === 'phone' ||
                        detail.detailType === 'email'
                          ? undefined
                          : '_blank'
                      }
                      rel={
                        detail.detailType === 'phone' ||
                        detail.detailType === 'email'
                          ? undefined
                          : 'noopener noreferrer'
                      }
                      className="text-text-primary no-underline transition-colors duration-300 hover:text-accent"
                    >
                      {detail.value}
                    </a>
                  ) : (
                    detail.value
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
