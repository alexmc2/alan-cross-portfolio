// components/blocks/menu/menu-lottie.tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import type { AnimationConfigWithData } from "lottie-web";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const LottiePlayer = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => null,
});

type RendererSettings = NonNullable<
  AnimationConfigWithData["rendererSettings"]
>;

interface MenuLottieProps {
  src: string;
  srcDark?: string;
  className?: string;
  ariaLabel?: string;
  style?: CSSProperties;
  preserveAspectRatio?: RendererSettings["preserveAspectRatio"];
}

type AnimationData = Record<string, unknown> | null;

export default function MenuLottie({
  src,
  srcDark,
  className,
  ariaLabel,
  style,
  preserveAspectRatio,
}: MenuLottieProps) {
  const [animationData, setAnimationData] = useState<AnimationData>(null);
  const { resolvedTheme } = useTheme();

  const activeSrc = useMemo(() => {
    if (resolvedTheme === "dark" && srcDark) {
      return srcDark;
    }

    return src;
  }, [resolvedTheme, src, srcDark]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    if (!activeSrc) {
      setAnimationData(null);
      return () => {
        isMounted = false;
        controller.abort();
      };
    }

    setAnimationData(null);

    const fetchAnimation = async () => {
      try {
        const response = await fetch(activeSrc, { signal: controller.signal });
        if (!response.ok) {
          return;
        }
        const data = (await response.json()) as AnimationData;
        if (isMounted) {
          setAnimationData(data);
        }
      } catch (error) {
        if (isMounted) {
          setAnimationData(null);
        }
      }
    };

    fetchAnimation();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [activeSrc]);

  if (!animationData) {
    return null;
  }

  const hasAccessibleLabel = Boolean(ariaLabel?.trim());
  const rendererSettings: RendererSettings | undefined = preserveAspectRatio
    ? { preserveAspectRatio }
    : undefined;

  return (
    <LottiePlayer
      animationData={animationData}
      loop
      autoplay
      className={cn("pointer-events-none", className)}
      role={hasAccessibleLabel ? "img" : undefined}
      aria-label={hasAccessibleLabel ? ariaLabel : undefined}
      aria-hidden={hasAccessibleLabel ? undefined : true}
      style={style}
      rendererSettings={rendererSettings}
    />
  );
}
