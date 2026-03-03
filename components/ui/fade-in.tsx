// components/ui/fade-in.tsx
'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);

    return () => {
      mediaQuery.removeEventListener('change', updatePreference);
    };
  }, []);

  return reducedMotion;
}

type FadeInStyle = CSSProperties & {
  '--fade-in-offset'?: string;
  '--fade-in-duration'?: string;
  '--fade-in-easing'?: string;
};

export type FadeInProps = {
  as?: ElementType;
  asChild?: boolean;
  children: ReactNode;
  delay?: number;
  duration?: number;
  offset?: number;
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
} & Omit<HTMLAttributes<HTMLElement>, 'children'>;

export function FadeIn({
  as,
  asChild,
  children,
  className,
  style,
  delay = 0,
  duration = 1200,
  offset = 12,
  once = true,
  threshold = 0.15,
  rootMargin = '0px 0px -10% 0px',
  ...rest
}: FadeInProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isVisible, setIsVisible] = useState(prefersReducedMotion);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const node = elementRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [once, prefersReducedMotion, threshold, rootMargin]);

  const setRefs = useCallback((node: HTMLElement | null) => {
    elementRef.current = node;
  }, []);

  const Component = (asChild ? Slot : (as ?? 'div')) as ElementType;

  const styleWithMotion: FadeInStyle = { ...(style as FadeInStyle) };

  if (styleWithMotion.transitionDelay === undefined) {
    styleWithMotion.transitionDelay = `${delay}ms`;
  }

  if (styleWithMotion.transitionDuration === undefined) {
    styleWithMotion.transitionDuration = `${duration}ms`;
  }

  styleWithMotion['--fade-in-offset'] =
    styleWithMotion['--fade-in-offset'] ?? `${offset}px`;
  styleWithMotion['--fade-in-duration'] =
    styleWithMotion['--fade-in-duration'] ?? `${duration}ms`;
  styleWithMotion['--fade-in-easing'] =
    styleWithMotion['--fade-in-easing'] ?? 'cubic-bezier(0.16, 1, 0.3, 1)';

  return (
    <Component
      ref={setRefs}
      data-visible={isVisible ? 'true' : 'false'}
      className={cn('fade-in-element', className)}
      style={styleWithMotion}
      {...rest}
    >
      {children}
    </Component>
  );
}
