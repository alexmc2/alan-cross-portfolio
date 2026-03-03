// components/blocks/section-header.tsx
import { cn } from '@/lib/utils';
import SectionContainer from '@/components/ui/section-container';
import { stegaClean } from 'next-sanity';

import { FadeIn } from '@/components/ui/fade.in';
import { PAGE_QUERYResult } from '@/sanity.types';

type SectionHeaderProps = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>['blocks']>[number],
  { _type: 'section-header' }
>;

export default function SectionHeader({
  padding,
  colorVariant,
  sectionWidth = 'default',
  stackAlign = 'left',
  tagLine,
  title,
  description,
}: SectionHeaderProps) {
  const isNarrow = stegaClean(sectionWidth) === 'narrow';
  const align = stegaClean(stackAlign);
  const color = stegaClean(colorVariant);

  const showDescription = Boolean(description);
  const showTagLine = Boolean(tagLine);

  return (
    <SectionContainer color={color} padding={padding}>
      <div
        className={cn(
          align === 'center' ? 'max-w-[48rem] text-center mx-auto' : undefined,
          isNarrow ? 'max-w-[48rem] mx-auto' : undefined,
          'flex flex-col gap-4',
          color === 'primary' ? 'text-background' : undefined
        )}
      >
        {showTagLine ? (
          <FadeIn as="h1" delay={100} className="mt-0 mb-0 leading-[0]">
            <span className="text-base font-semibold">{tagLine}</span>
          </FadeIn>
        ) : null}
        {title ? (
          <FadeIn
            as="h2"
            delay={200}
            className="mt-0 mb-0 text-3xl md:text-5xl"
          >
            {title}
          </FadeIn>
        ) : null}
        {showDescription ? (
          <FadeIn as="p" delay={300} className="text-base">
            {description}
          </FadeIn>
        ) : null}
      </div>
    </SectionContainer>
  );
}
