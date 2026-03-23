'use client';

import { useState } from 'react';
import type { Service } from '@/types';

const MOBILE_VISIBLE_SERVICES = 3;

export default function Services({ services }: { services: Service[] }) {
  const [visibleCount, setVisibleCount] = useState(MOBILE_VISIBLE_SERVICES);
  const [animatedRange, setAnimatedRange] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const hasToggle = services.length > MOBILE_VISIBLE_SERVICES;
  const hasMoreServices = visibleCount < services.length;

  const handleToggle = () => {
    setVisibleCount((count) => {
      if (count < services.length) {
        const nextCount = Math.min(
          count + MOBILE_VISIBLE_SERVICES,
          services.length,
        );
        setAnimatedRange({ start: count, end: nextCount });
        return nextCount;
      }

      setAnimatedRange(null);
      return MOBILE_VISIBLE_SERVICES;
    });
  };

  return (
    <section
      id="services"
      className="py-28 px-12 bg-bg-elevated border-t border-b border-border max-md:py-20 max-md:px-6"
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="slabel">Services</div>
        <div
          id="services-grid"
          className="grid grid-cols-3 gap-px mt-12 max-[900px]:grid-cols-1"
          style={{ background: 'var(--color-border)' }}
        >
          {services.map((service, index) => {
            const isHiddenOnMobile = index >= visibleCount;
            const isNewlyVisible =
              animatedRange &&
              index >= animatedRange.start &&
              index < animatedRange.end &&
              !isHiddenOnMobile;

            return (
              <div
                key={service._id}
                className={`bg-bg-elevated p-10 transition-colors duration-400 hover:bg-bg-card cursor-default ${
                  isHiddenOnMobile ? 'max-[900px]:hidden' : ''
                } ${isNewlyVisible ? 'max-[900px]:animate-fade-up' : ''}`}
                style={{
                  animationDelay: isNewlyVisible
                    ? `${(index - animatedRange.start) * 90}ms`
                    : undefined,
                }}
              >
                {service.icon && (
                  <span className="text-2xl mb-5 block opacity-80">
                    {service.icon}
                  </span>
                )}
                <h3 className="font-display text-[1.1rem] font-semibold mb-3">
                  {service.title}
                </h3>
                <p className="text-[0.88rem] text-text-secondary leading-[1.7]">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
        {hasToggle ? (
          <button
            type="button"
            onClick={handleToggle}
            aria-expanded={!hasMoreServices}
            aria-controls="services-grid"
            className="mt-8 hidden max-[900px]:inline-flex items-center gap-2 bg-transparent p-0 text-[0.7rem] tracking-[0.2em] uppercase text-accent transition-opacity duration-300 hover:opacity-80"
          >
            <span>{hasMoreServices ? 'See more' : 'See less'}</span>
            <svg
              viewBox="0 0 12 12"
              aria-hidden="true"
              className={`h-3 w-3 transition-transform duration-300 ${
                hasMoreServices ? '' : 'rotate-180'
              }`}
              fill="none"
            >
              <path
                d="M2.5 4.5 6 8l3.5-3.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : null}
      </div>
    </section>
  );
}
