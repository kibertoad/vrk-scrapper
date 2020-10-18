export function findAllUrls(text: string): readonly string[] {
  const result = text.match(/\?srcUrl(.*)\.html/gi) ?? []
  return result
}
