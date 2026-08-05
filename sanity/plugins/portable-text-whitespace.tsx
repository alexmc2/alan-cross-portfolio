"use client";

import { defineBehavior, execute } from "@portabletext/editor/behaviors";
import { BehaviorPlugin } from "@portabletext/editor/plugins";
import type { PortableTextPluginsProps } from "sanity";
import {
  normalizeBreakingSpaces,
  normalizePortableTextWhitespace,
} from "@/lib/portable-text-whitespace";

const normalizeInsertedTextBehavior = defineBehavior({
  on: "insert.text",
  guard: ({ event }) => {
    const normalizedText = normalizeBreakingSpaces(event.text);

    return normalizedText === event.text ? false : { normalizedText };
  },
  actions: [
    ({ event }, { normalizedText }) => [
      execute({
        ...event,
        text: normalizedText,
      }),
    ],
  ],
});

const normalizeInsertedBlocksBehavior = defineBehavior({
  on: "insert.blocks",
  guard: ({ event }) => {
    const normalizedBlocks = normalizePortableTextWhitespace(event.blocks);

    return normalizedBlocks === event.blocks ? false : { normalizedBlocks };
  },
  actions: [
    ({ event }, { normalizedBlocks }) => [
      execute({
        ...event,
        blocks: normalizedBlocks,
      }),
    ],
  ],
});

const whitespaceBehaviors = [
  normalizeInsertedTextBehavior,
  normalizeInsertedBlocksBehavior,
];

export function PortableTextWhitespacePlugins(
  props: PortableTextPluginsProps
) {
  return (
    <>
      {props.renderDefault(props)}
      <BehaviorPlugin behaviors={whitespaceBehaviors} />
    </>
  );
}
