const NON_BREAKING_SPACE_PATTERN = /[\u00a0\u202f]/gu;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function normalizeBreakingSpaces(text: string): string {
  return text.replace(NON_BREAKING_SPACE_PATTERN, " ");
}

export function countNonBreakingSpaces(value: unknown): number {
  if (!Array.isArray(value)) {
    return 0;
  }

  return value.reduce((blockTotal, block) => {
    if (!isRecord(block) || !Array.isArray(block.children)) {
      return blockTotal;
    }

    return (
      blockTotal +
      block.children.reduce((spanTotal, child) => {
        if (!isRecord(child) || typeof child.text !== "string") {
          return spanTotal;
        }

        return (
          spanTotal +
          (child.text.match(NON_BREAKING_SPACE_PATTERN)?.length ?? 0)
        );
      }, 0)
    );
  }, 0);
}

export function normalizePortableTextWhitespace<T>(value: T): T {
  if (!Array.isArray(value)) {
    return value;
  }

  let valueChanged = false;
  const normalizedValue = value.map((block) => {
    if (!isRecord(block) || !Array.isArray(block.children)) {
      return block;
    }

    let blockChanged = false;
    const normalizedChildren = block.children.map((child) => {
      if (!isRecord(child) || typeof child.text !== "string") {
        return child;
      }

      const normalizedText = normalizeBreakingSpaces(child.text);

      if (normalizedText === child.text) {
        return child;
      }

      blockChanged = true;
      return {
        ...child,
        text: normalizedText,
      };
    });

    if (!blockChanged) {
      return block;
    }

    valueChanged = true;
    return {
      ...block,
      children: normalizedChildren,
    };
  });

  return (valueChanged ? normalizedValue : value) as T;
}
