// components/blocks/gallery/gallery-client.tsx
'use client';

import { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import * as Dialog from '@radix-ui/react-dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

import type { GalleryDesktopColumns, GalleryImageItem } from './image-gallery';

type GalleryClientProps = {
  images: GalleryImageItem[];
  desktopColumns: GalleryDesktopColumns;
};

export default function GalleryClient({
  images,
  desktopColumns,
}: GalleryClientProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const imageCount = images.length;
  const open = activeIndex !== null;

  const desktopColumnClass =
    desktopColumns === 'two' ? 'lg:columns-2' : 'lg:columns-3';
  const largeScreenSize = desktopColumns === 'two' ? '50vw' : '33vw';

  const openModalAt = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const closeModal = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const showPrevious = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) {
        return current;
      }

      return current === 0 ? imageCount - 1 : current - 1;
    });
  }, [imageCount]);

  const showNext = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) {
        return current;
      }

      return current === imageCount - 1 ? 0 : current + 1;
    });
  }, [imageCount]);

  const activeImage = useMemo(() => {
    if (activeIndex === null) {
      return undefined;
    }

    return images[activeIndex];
  }, [images, activeIndex]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!open) {
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        showPrevious();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        showNext();
      }
    },
    [open, showNext, showPrevious]
  );

  if (imageCount === 0) {
    return null;
  }

  return (
    <>
      <div
        className={`columns-1 gap-4 sm:columns-2 ${desktopColumnClass} [column-fill:_balance]`}
      >
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => openModalAt(index)}
            className="group relative mb-4 block w-full overflow-hidden rounded-xl bg-muted/40 shadow-sm transition hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label={`Open image ${index + 1} of ${imageCount}`}
          >
            <Image
              src={image.gridSrc}
              alt={image.alt}
              width={image.width}
              height={image.height}
              placeholder={image.blurDataUrl ? 'blur' : undefined}
              blurDataURL={image.blurDataUrl ?? undefined}
              sizes={`(min-width: 1280px) ${largeScreenSize}, (min-width: 768px) 50vw, 100vw`}
              className="h-full w-full object-cover"
            />
            {image.caption && (
              <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-lg bg-black/55 px-3 py-2 text-sm text-white opacity-0 transition group-hover:opacity-100">
                {image.caption}
              </div>
            )}
          </button>
        ))}
      </div>

      <Dialog.Root
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            closeModal();
          }
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
          <Dialog.Content
            className="fixed inset-0 z-50 flex items-center justify-center p-4 focus:outline-none"
            aria-label="Image gallery modal"
            onKeyDown={handleKeyDown}
          >
            <div className="relative flex w-full max-w-6xl flex-col gap-4">
              <Dialog.Title className="sr-only">Image gallery</Dialog.Title>
              <Dialog.Close
                className="absolute right-4 top-4 z-[60] inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Close gallery"
              >
                <X className="h-5 w-5" />
              </Dialog.Close>

              {imageCount > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPrevious}
                    className="absolute left-4 top-1/2 z-[60] -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label="View previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={showNext}
                    className="absolute right-4 top-1/2 z-[60] -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label="View next image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {activeImage && (
                <>
                  <div className="relative flex max-h-[82vh] items-center justify-center">
                    <Image
                      key={activeImage.id}
                      src={activeImage.modalSrc}
                      alt={activeImage.alt}
                      width={activeImage.width}
                      height={activeImage.height}
                      placeholder={activeImage.blurDataUrl ? 'blur' : undefined}
                      blurDataURL={activeImage.blurDataUrl ?? undefined}
                      className="max-h-[82vh] w-full rounded-2xl object-contain"
                      sizes="(min-width: 1280px) 65vw, 90vw"
                    />
                  </div>

                  <div className="flex flex-col items-center justify-between gap-2 text-center text-sm text-white/80 sm:flex-row sm:text-left">
                    <div className="flex flex-col gap-2">
                      {activeImage.caption && (
                        <p className="text-base text-white/90">
                          {activeImage.caption}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
