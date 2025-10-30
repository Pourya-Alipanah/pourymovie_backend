
/**
 * Cleans a JSON string by removing unnecessary whitespace and code block markers.
 */
export function cleanJsonString(input: string): string {
  return input
    .trim()
    .replace(/^```json\s*/, '')
    .replace(/\s*```$/, '');
}

/**
 * Represents the state of whether the parser is currently inside a code block.
 * This is used to track when to ignore code block markers while processing input.
 */
export type CodeBlockState = {
  insideCodeBlock: boolean;
};

/**
 * Removes code block markers from a string while streaming.
 * This function processes the input character by character, maintaining the state of whether
 * it is currently inside a code block or not.
 *
 * @param chunk - The input string chunk to process.
 * @param state - The current state of code block detection.
 * @returns The cleaned string without code block markers, or null if the result is empty.
 */
export function removeCodeBlockStreaming(
  chunk: string,
  state: CodeBlockState,
): string | null {
  let result = '';
  let i = 0;

  while (i < chunk.length) {
    if (!state.insideCodeBlock) {
      if (chunk.startsWith('```', i) || chunk.startsWith('{', i)) {
        state.insideCodeBlock = true;
        i += 3;
        continue;
      }
      result += chunk[i];
      i++;
    } else {
      if (chunk.startsWith('```', i) || chunk.startsWith('}``', i)) {
        state.insideCodeBlock = false;
        i += 3;
        continue;
      }
      i++;
    }
  }

  return result.trim() || null;
}
