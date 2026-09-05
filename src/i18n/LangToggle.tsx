import { useLang } from './LanguageContext'
import type { Lang } from './types'
import './LangToggle.css'

const OPTIONS: { value: Lang; label: string; hint: string }[] = [
  { value: 'en', label: 'EN', hint: 'Switch to English' },
  { value: 'zh', label: '中', hint: '切换为中文' },
]

/**
 * EN / 中 两段式切换器（暗夜鎏金胶囊）。
 * 滑动指示条由 --i 位移驱动，与站点 nav-contact-chip 同一套金色语言。
 */
export default function LangToggle({ className = '' }: { className?: string }) {
  const { lang, setLang } = useLang()
  const activeIndex = OPTIONS.findIndex((o) => o.value === lang)

  return (
    <div
      className={`lang-toggle ${className}`.trim()}
      role="group"
      aria-label="Language / 语言"
      style={{ ['--i' as string]: activeIndex }}
    >
      <span className="lang-toggle-thumb" aria-hidden="true" />
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          className={`lang-toggle-btn${lang === o.value ? ' is-on' : ''}`}
          aria-pressed={lang === o.value}
          title={o.hint}
          onClick={() => setLang(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
