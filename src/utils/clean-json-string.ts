export function cleanJsonString(input: string): string {
  return input
    .trim()
    .replace(/^```json\s*/, '')
    .replace(/\s*```$/, '');
}

export type CodeBlockState = {
  insideCodeBlock: boolean;
};

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
