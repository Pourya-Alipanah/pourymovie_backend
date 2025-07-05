export function cleanJsonString(input: string): string {
  return input
    .trim()
    .replace(/^```json\s*/, '')
    .replace(/\s*```$/, '');
}
