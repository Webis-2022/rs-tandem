export function buildModalParagraphsHtml(
  paragraphs: readonly string[]
): string {
  return paragraphs
    .map((paragraph: string) => paragraph.trim())
    .map((paragraph: string) =>
      paragraph.length > 0 ? `<p>${paragraph}</p>` : '<br>'
    )
    .join('');
}
