// app/(main)/layout.tsx
import Header from '@/components/header';
import Footer from '@/components/footer';
import { DisableDraftMode } from '@/components/disable-draft-mode';
import { VisualEditing } from 'next-sanity/visual-editing';
import { draftMode } from 'next/headers';
import { SanityLive } from '@/sanity/lib/live';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled: isDraftMode } = await draftMode();
  return (
    <>
      <Header />
      <main>{children}</main>
      {/* Always render SanityLive so production receives LCAPI events
         and revalidates cached content automatically. */}
      <SanityLive />
      {isDraftMode && (
        <>
          <DisableDraftMode />
          <VisualEditing />
        </>
      )}
      <Footer />
    </>
  );
}
