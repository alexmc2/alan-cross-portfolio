// components/ui/section-container.tsx
import { cn } from "@/lib/utils";
import { SectionPadding, ColorVariant } from "@/sanity.types";

const DEFAULT_BACKGROUND_CLASSES = {
  base: "bg-background",
  dark: "dark:bg-background",
} as const;

const BACKGROUND_CLASS_MAP: Partial<
  Record<ColorVariant, { base: string; dark: string }>
> = {
  background: DEFAULT_BACKGROUND_CLASSES,
  foreground: { base: "bg-foreground", dark: "dark:bg-foreground" },
  primary: { base: "bg-primary", dark: "dark:bg-primary" },
  "primary-foreground": {
    base: "bg-primary-foreground",
    dark: "dark:bg-primary-foreground",
  },
  secondary: { base: "bg-secondary", dark: "dark:bg-secondary" },
  "secondary-foreground": {
    base: "bg-secondary-foreground",
    dark: "dark:bg-secondary-foreground",
  },
  card: { base: "bg-card", dark: "dark:bg-card" },
  "card-foreground": {
    base: "bg-card-foreground",
    dark: "dark:bg-card-foreground",
  },
  popover: { base: "bg-popover", dark: "dark:bg-popover" },
  "popover-foreground": {
    base: "bg-popover-foreground",
    dark: "dark:bg-popover-foreground",
  },
  accent: { base: "bg-accent", dark: "dark:bg-accent" },
  "accent-foreground": {
    base: "bg-accent-foreground",
    dark: "dark:bg-accent-foreground",
  },
  destructive: { base: "bg-destructive", dark: "dark:bg-destructive" },
  "destructive-foreground": {
    base: "bg-destructive-foreground",
    dark: "dark:bg-destructive-foreground",
  },
  muted: { base: "bg-muted", dark: "dark:bg-muted" },
  "muted-foreground": {
    base: "bg-muted-foreground",
    dark: "dark:bg-muted-foreground",
  },
  white: { base: "bg-white", dark: "dark:bg-white" },
  "white-foreground": {
    base: "bg-white-foreground",
    dark: "dark:bg-white-foreground",
  },
  black: { base: "bg-black", dark: "dark:bg-black" },
  "black-foreground": {
    base: "bg-black-foreground",
    dark: "dark:bg-black-foreground",
  },
  "light-gray": { base: "bg-light-gray", dark: "dark:bg-light-gray" },
  "light-gray-foreground": {
    base: "bg-light-gray-foreground",
    dark: "dark:bg-light-gray-foreground",
  },
  "cool-gray": { base: "bg-cool-gray", dark: "dark:bg-cool-gray" },
  "cool-gray-foreground": {
    base: "bg-cool-gray-foreground",
    dark: "dark:bg-cool-gray-foreground",
  },
  "soft-blue": { base: "bg-soft-blue", dark: "dark:bg-soft-blue" },
  "soft-blue-foreground": {
    base: "bg-soft-blue-foreground",
    dark: "dark:bg-soft-blue-foreground",
  },
  "sky-blue": { base: "bg-sky-blue", dark: "dark:bg-sky-blue" },
  "sky-blue-foreground": {
    base: "bg-sky-blue-foreground",
    dark: "dark:bg-sky-blue-foreground",
  },
  mint: { base: "bg-mint", dark: "dark:bg-mint" },
  "mint-foreground": {
    base: "bg-mint-foreground",
    dark: "dark:bg-mint-foreground",
  },
  sand: { base: "bg-sand", dark: "dark:bg-sand" },
  "sand-foreground": {
    base: "bg-sand-foreground",
    dark: "dark:bg-sand-foreground",
  },
  peach: { base: "bg-peach", dark: "dark:bg-peach" },
  "peach-foreground": {
    base: "bg-peach-foreground",
    dark: "dark:bg-peach-foreground",
  },
  slate: { base: "bg-slate", dark: "dark:bg-slate" },
  "slate-foreground": {
    base: "bg-slate-foreground",
    dark: "dark:bg-slate-foreground",
  },
  navy: { base: "bg-navy", dark: "dark:bg-navy" },
  "navy-foreground": {
    base: "bg-navy-foreground",
    dark: "dark:bg-navy-foreground",
  },
  charcoal: { base: "bg-charcoal", dark: "dark:bg-charcoal" },
  "charcoal-foreground": {
    base: "bg-charcoal-foreground",
    dark: "dark:bg-charcoal-foreground",
  },
};

interface SectionContainerProps {
  color?: ColorVariant | null;
  colorDark?: ColorVariant | null;
  padding?: SectionPadding | null;
  children: React.ReactNode;
  className?: string;
  id?: string | null;
  style?: React.CSSProperties;
}

export default function SectionContainer({
  color = "background",
  colorDark,
  padding,
  children,
  className,
  id,
  style,
}: SectionContainerProps) {
  const resolveBackgroundClasses = (variant?: ColorVariant | null) => {
    if (!variant) {
      return DEFAULT_BACKGROUND_CLASSES;
    }

    return BACKGROUND_CLASS_MAP[variant] ?? DEFAULT_BACKGROUND_CLASSES;
  };

  const { base: backgroundClass, dark: fallbackDarkClass } =
    resolveBackgroundClasses(color);

  const overrideDarkClass = colorDark
    ? resolveBackgroundClasses(colorDark).dark
    : undefined;

  const backgroundClassDark = overrideDarkClass ?? fallbackDarkClass;

  return (
    <div
      id={id ?? undefined}
      className={cn(
        "relative",
        id ? "scroll-mt-24 lg:scroll-mt-32" : undefined,
        backgroundClass,
        backgroundClassDark,
        padding?.top ? "pt-16 xl:pt-20" : undefined,
        padding?.bottom ? "pb-16 xl:pb-20" : undefined,
        className
      )}
      style={style}
    >
      <div className="container">{children}</div>
    </div>
  );
}
