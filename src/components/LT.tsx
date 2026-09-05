import { useLang } from '../i18n/LanguageContext'
import type { LocalizedString } from '../data/resumeSchema'
import { RichText } from './RichText'

export function LT({
  value,
  className,
  as,
}: {
  value: LocalizedString
  className?: string
  as?: keyof JSX.IntrinsicElements
}) {
  const { tx } = useLang()
  const text = tx(value) ?? ''
  return <RichText text={text} className={className} as={as} />
}
