// components/blocks/split/split-row.tsx
import { cn } from '@/lib/utils';
import SectionContainer from '@/components/ui/section-container';
import { stegaClean } from 'next-sanity';
import { PAGE_QUERYResult, ColorVariant } from '@/sanity.types';
import SplitContent from './split-content';
import SplitCardsList from './split-cards-list';
import SplitImage from './split-image';
import SplitInfoList from './split-info-list';
import SplitRichTextColumn from './rich-text-column';
import type { RichTextBlockProps } from '@/components/blocks/rich-text-block';
import SplitContactForm from './split-contact-form';
import SplitLocationMap from './split-location-map';

type Block = NonNullable<NonNullable<PAGE_QUERYResult>['blocks']>[number];
type SplitRow = Extract<Block, { _type: 'split-row' }>;
type SplitColumn = NonNullable<
  | (NonNullable<SplitRow['splitColumns']>[number])
  | RichTextBlockProps
>;
type SplitRowWithAnchor = SplitRow & { sectionId?: string | null };

const componentMap: {
  [K in SplitColumn['_type']]: React.ComponentType<
    Extract<SplitColumn, { _type: K }>
  >;
} = {
  'split-content': SplitContent,
  'split-cards-list': SplitCardsList,
  'split-image': SplitImage,
  'split-info-list': SplitInfoList,
  'rich-text-block': SplitRichTextColumn,
  'split-contact-form': SplitContactForm,
  'split-location-map': SplitLocationMap,
};

export default function SplitRow({
  padding,
  colorVariant,
  colorVariantDark,
  sectionId,
  noGap,
  splitColumns,
}: SplitRowWithAnchor) {
  const color = (stegaClean(colorVariant) || undefined) as
    | ColorVariant
    | undefined;
  const colorDark = (stegaClean(colorVariantDark) || undefined) as
    | ColorVariant
    | undefined;
  const anchorId = sectionId ? stegaClean(sectionId) : undefined;

  return (
    <SectionContainer
      color={color}
      colorDark={colorDark}
      padding={padding}
      id={anchorId}
    >
      {splitColumns && splitColumns?.length > 0 && (
        <div
          className={cn(
            'grid grid-cols-1 lg:grid-cols-2',
            noGap ? 'gap-0' : 'gap-12 lg:gap-20'
          )}
        >
          {splitColumns?.map((column) => {
            const Component = componentMap[column._type];
            if (!Component) {
              // Fallback for development/debugging of new component types
              console.warn(
                `No component implemented for split column type: ${column._type}`
              );
              return <div data-type={column._type} key={column._key} />;
            }
            return (
              <Component
                {...(column as any)}
                color={color}
                noGap={noGap}
                key={column._key}
              />
            );
          })}
        </div>
      )}
    </SectionContainer>
  );
}
