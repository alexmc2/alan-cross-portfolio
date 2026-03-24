// components/post-date.tsx
"use client";
import { formatDate } from "@/lib/utils";

export default function PostDate({ date }: { date: string }) {
  const postDate = date ? formatDate(date) : "";

  return <div>{postDate}</div>;
}
