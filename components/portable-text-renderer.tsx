// components/portable-text-renderer.tsx
import { PortableText, PortableTextProps } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { YouTubeEmbed } from "@next/third-parties/google";
import { Highlight, themes } from "prism-react-renderer";
import { CopyButton } from "@/components/ui/copy-button";

type PortableTextSpacing = "default" | "none";

const getSpacingValue = (spacing: PortableTextSpacing) =>
  spacing === "none" ? "0" : "1rem";

const createPortableTextComponents = (
  spacing: PortableTextSpacing
): PortableTextProps["components"] => {
  const blockSpacing = getSpacingValue(spacing);

  return {
    types: {
      image: ({ value }) => {
        const { url, metadata } = value.asset;
        const { lqip, dimensions } = metadata;
        return (
          <Image
            src={url}
            alt={value.alt || "Image"}
            width={dimensions.width}
            height={dimensions.height}
            placeholder={lqip ? "blur" : undefined}
            blurDataURL={lqip || undefined}
            style={{
              borderRadius: "1rem",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: spacing === "none" ? "0" : "1.5rem",
            }}
          />
        );
      },
      youtube: ({ value }) => {
        const { videoId } = value;
        return (
          <div className="aspect-video max-w-[45rem] rounded-xl overflow-hidden mb-4">
            <YouTubeEmbed videoid={videoId} params="rel=0" />
          </div>
        );
      },
      code: ({ value }) => {
        return (
          <div className="grid my-4 overflow-x-auto rounded-lg border border-border text-xs lg:text-sm bg-primary/80 dark:bg-muted/80">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-primary/80 dark:bg-muted">
              <div className="text-muted-foreground font-mono">
                {value.filename || ""}
              </div>
              <CopyButton code={value.code} />
            </div>
            <Highlight
              theme={themes.vsDark}
              code={value.code}
              language={value.language || "typescript"}
            >
              {({ style, tokens, getLineProps, getTokenProps }) => (
                <pre
                  style={{
                    ...style,
                    padding: "1.5rem",
                    margin: 0,
                    overflow: "auto",
                    backgroundColor: "transparent",
                  }}
                >
                  {tokens.map((line, i) => (
                    <div key={i} {...getLineProps({ line })}>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          </div>
        );
      },
    },
    block: {
      normal: ({ children }) => (
        <p style={{ marginTop: "0", marginBottom: blockSpacing }}>{children}</p>
      ),
      h1: ({ children }) => (
        <h1 style={{ marginTop: blockSpacing, marginBottom: blockSpacing }}>
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2 style={{ marginTop: blockSpacing, marginBottom: blockSpacing }}>
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 style={{ marginTop: blockSpacing, marginBottom: blockSpacing }}>
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4 style={{ marginTop: blockSpacing, marginBottom: blockSpacing }}>
          {children}
        </h4>
      ),
      h5: ({ children }) => (
        <h5 style={{ marginTop: blockSpacing, marginBottom: blockSpacing }}>
          {children}
        </h5>
      ),
    },
    marks: {
      link: ({ value, children }) => {
        const isExternal =
          (value?.href || "").startsWith("http") ||
          (value?.href || "").startsWith("https") ||
          (value?.href || "").startsWith("mailto");
        const target = isExternal ? "_blank" : undefined;
        return (
          <Link
            href={value?.href || "#"}
            target={target}
            rel={target ? "noopener" : undefined}
            style={{ textDecoration: "underline" }}
          >
            {children}
          </Link>
        );
      },
    },
    list: {
      bullet: ({ children }) => (
        <ul
          style={{
            paddingLeft: "1.5rem",
            marginBottom: blockSpacing,
            listStyleType: "disc",
            listStylePosition: "inside",
          }}
        >
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol
          style={{
            paddingLeft: "1.5rem",
            marginBottom: blockSpacing,
            listStyleType: "decimal",
            listStylePosition: "inside",
          }}
        >
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => (
        <li
          style={{ marginBottom: spacing === "none" ? "0" : "0.5rem" }}
        >
          {children}
        </li>
      ),
      number: ({ children }) => (
        <li
          style={{ marginBottom: spacing === "none" ? "0" : "0.5rem" }}
        >
          {children}
        </li>
      ),
    },
  };
};

export default function PortableTextRenderer({
  value,
  spacing = "default",
}: {
  value: PortableTextProps["value"];
  spacing?: PortableTextSpacing;
}) {
  return (
    <PortableText
      value={value}
      components={createPortableTextComponents(spacing)}
    />
  );
}
