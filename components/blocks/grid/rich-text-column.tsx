// components/blocks/grid/rich-text-column.tsx
import { RichTextContent, type RichTextBlockProps } from "@/components/blocks/rich-text-block";

type RichTextGridColumnProps = RichTextBlockProps & { color?: unknown };

export default function RichTextGridColumn({ color: _color, ...props }: RichTextGridColumnProps) {
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
