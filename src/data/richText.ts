export type TextMark = 'bold' | 'gold' | 'highlight' | 'underline'

export interface RichSpan {
  text: string
  marks: TextMark[]
}

const MARKERS: Array<[TextMark, RegExp]> = [
  ['bold', /\*\*[^*]+\*\*/g],
  ['gold', /!![^!]+!!/g],
  ['highlight', /==[^=]+==/g],
  ['underline', /__[^_]+__/g],
]

export function parseRichText(input: string): RichSpan[] {
  if (!input) return []

  const tokens: Array<{ start: number; end: number; mark: TextMark }> = []

  for (const [mark, regex] of MARKERS) {
    let m
    while ((m = regex.exec(input)) !== null) {
      tokens.push({ start: m.index, end: regex.lastIndex, mark })
    }
  }

  tokens.sort((a, b) => a.start - b.start)

  const spans: RichSpan[] = []
  let cursor = 0

  for (const token of tokens) {
    if (token.start < cursor) continue

    if (token.start > cursor) {
      spans.push({ text: input.slice(cursor, token.start), marks: [] })
    }

    const raw = input.slice(token.start, token.end)
    const content = raw.slice(2, -2)
    spans.push({ text: content, marks: [token.mark] })
    cursor = token.end
  }

  if (cursor < input.length) {
    spans.push({ text: input.slice(cursor), marks: [] })
  }

  return spans
}

export function removeRichMarkers(input: string): string {
  return input.replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/!!([^!]+)!!/g, '$1')
    .replace(/==([^=]+)==/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
}
