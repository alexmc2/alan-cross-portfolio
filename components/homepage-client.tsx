"use client";

import { useReveal } from "./use-reveal";

export default function HomepageClient({
  children,
}: {
  children: React.ReactNode;
}) {
  useReveal();
  return <>{children}</>;
}
