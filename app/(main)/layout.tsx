import { SanityLive } from "@/sanity/lib/live";
import { DisableDraftMode } from "@/components/disable-draft-mode";
import { VisualEditing } from "next-sanity/visual-editing";
import { draftMode } from "next/headers";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled: isDraftMode } = await draftMode();
  return (
    <>
      {children}
      <SanityLive />
      {isDraftMode && (
        <>
          <DisableDraftMode />
          <VisualEditing />
        </>
      )}
    </>
  );
}
