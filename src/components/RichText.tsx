import type { LocalizedString } from '../data/resumeSchema'
import { parseRichText, removeRichMarkers, type TextMark } from '../data/richText'

function markClass(mark: TextMark): string {
  switch (mark) {
    case 'bold':
      return 'font-semibold text-[#E9D5A8]'
    case 'gold':
      return 'bg-gradient-to-b from-[#E9D5A8] to-[#C9A96E] bg-clip-text text-transparent font-bold'
    case 'highlight':
      return 'bg-[#C9A96E]/25 px-1 rounded'
    case 'underline':
      return 'border-b border-dashed border-[#E9D5A8]'
    default:
      return ''
  }
}

export function RichText({
  text,
  className = '',
  as: Component = 'span',
}: {
  text: string
  className?: string
  as?: keyof JSX.IntrinsicElements
}) {
  const spans = parseRichText(text)

  return (
    <Component className={className}>
      {spans.map((span, i) => {
        const cls = span.marks.map(markClass).join(' ')
        return (
          <span key={i} className={cls}>
            {span.text}
          </span>
        )
      })}
    </Component>
  )
}

export function LocalizedRichText({
  value,
  lang,
  className,
  as,
}: {
  value: LocalizedString
  lang: 'zh' | 'en'
  className?: string
  as?: keyof JSX.IntrinsicElements
}) {
  const text = value[lang] ?? value.en ?? ''
  return <RichText text={text} className={className} as={as} />
}

export function plainText(value: LocalizedString, lang: 'zh' | 'en'): string {
  const raw = value[lang] ?? value.en ?? ''
  return removeRichMarkers(raw)
}
