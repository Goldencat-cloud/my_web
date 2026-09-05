import { useLang } from '../i18n/LanguageContext'
import type { Lang } from '../i18n/types'
import { MailIcon, PhoneIcon, CheckIcon, useCopyText, EMAIL, PHONE } from '../ContactWidgets'

/** 下载简历（PDF）图标 */
function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

/** 语言地球图标 */
function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 4 9 15 15 0 0 1-4 9 15 15 0 0 1-4-9 15 15 0 0 1 4-9z" />
    </svg>
  )
}

/**
 * Work 页导航栏右侧功能区（居右，图标 + hover 提示）：
 * 下载简历 / 复制邮箱 / 复制电话 / 中英切换。全站公开。
 */
export default function NavMenu() {
  const { lang, setLang } = useLang()
  const email = useCopyText(EMAIL)
  const phone = useCopyText(PHONE)

  // 简历页公开，下载直接指向公开静态文件
  const base = import.meta.env.BASE_URL || '/'
  const pdfUrl = `${base}resume.pdf`
  const nextLang: Lang = lang === 'zh' ? 'en' : 'zh'

  const iconCls =
    'flex h-9 w-9 items-center justify-center rounded-full border border-[#C9A96E]/50 bg-[#241A10]/70 text-[#E9D5A8] transition-all duration-300 hover:border-[#C9A96E] hover:bg-[#C9A96E]/15 hover:shadow-[0_0_14px_rgba(201,169,110,0.35)]'

  const title = {
    download: lang === 'zh' ? '下载简历 PDF' : 'Download resume (PDF)',
    email: email.copied ? (lang === 'zh' ? '邮箱已复制' : 'Email copied') : (lang === 'zh' ? '复制邮箱' : 'Copy email'),
    phone: phone.copied ? (lang === 'zh' ? '电话已复制' : 'Phone copied') : (lang === 'zh' ? '复制电话' : 'Copy phone'),
    lang: lang === 'zh' ? 'Switch to English' : '切换为中文',
  }

  return (
    <div className="flex items-center gap-2">
      {/* 下载简历（PDF） */}
      <a href={pdfUrl} download title={title.download} aria-label={title.download} className={iconCls}>
        <DownloadIcon />
      </a>

      {/* 复制邮箱 */}
      <button
        type="button"
        onClick={email.copy}
        title={title.email}
        aria-label={title.email}
        className={iconCls}
        style={email.copied ? { color: '#7fe0a0', borderColor: 'rgba(126,214,152,0.6)' } : undefined}
      >
        {email.copied ? <CheckIcon /> : <MailIcon />}
      </button>

      {/* 复制电话 */}
      <button
        type="button"
        onClick={phone.copy}
        title={title.phone}
        aria-label={title.phone}
        className={iconCls}
        style={phone.copied ? { color: '#7fe0a0', borderColor: 'rgba(126,214,152,0.6)' } : undefined}
      >
        {phone.copied ? <CheckIcon /> : <PhoneIcon />}
      </button>

      {/* 中英切换 */}
      <button
        type="button"
        onClick={() => setLang(nextLang)}
        title={title.lang}
        aria-label={title.lang}
        className={iconCls}
      >
        <GlobeIcon />
      </button>
    </div>
  )
}
