// components/blocks/split/rich-text-column.tsx
import { RichTextContent, type RichTextBlockProps } from "@/components/blocks/rich-text-block";

type SplitRichTextColumnProps = RichTextBlockProps & {
  color?: unknown;
  noGap?: boolean;
};

export default function SplitRichTextColumn({
  color: _color,
  noGap: _noGap,
  ...props
}: SplitRichTextColumnProps) {
  return (
    <RichTextContent
      body={props.body}
      contentWidth={props.contentWidth}
      textAlign={props.textAlign}
      fontFamily={props.fontFamily}
      fontSize={props.fontSize}
      textColorVariant={props.textColorVariant}
      spacing={props.spacing}
      padding={props.padding}
      context="inline"
    />
  );
}
