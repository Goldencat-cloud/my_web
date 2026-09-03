import { useEffect, useRef, useState } from 'react'

const EMAIL = '15029026223@139.com'
const PHONE = '15029026223'

export function MailIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

export function PhoneIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

/** 复制任意文本到剪贴板（含旧浏览器 fallback），返回 copied 状态供按钮反馈 */
function useCopyText(text: string) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (timer.current !== null) clearTimeout(timer.current)
    },
    [],
  )

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    if (timer.current !== null) clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 1800)
  }

  return { copied, copy }
}

/**
 * 首页导航用的紧凑入口：邮箱 / 电话图标点击复制，成功后变对勾。
 */
export function NavContactLinks() {
  const email = useCopyText(EMAIL)
  const phone = useCopyText(PHONE)
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={email.copy}
        aria-label={email.copied ? 'Email copied' : `Copy email ${EMAIL}`}
        title={email.copied ? 'Copied!' : EMAIL}
        className={`nav-contact-btn ${email.copied ? 'nav-contact-btn-copied' : ''}`}
      >
        {email.copied ? <CheckIcon /> : <MailIcon />}
      </button>
      <button
        onClick={phone.copy}
        aria-label={phone.copied ? 'Phone copied' : `Copy phone ${PHONE}`}
        title={phone.copied ? 'Copied!' : PHONE}
        className={`nav-contact-btn ${phone.copied ? 'nav-contact-btn-copied' : ''}`}
      >
        {phone.copied ? <CheckIcon /> : <PhoneIcon />}
      </button>
    </div>
  )
}

/**
 * Work 页导航用的丰富胶囊入口：金色描边 + 渐变底 + 内嵌图标圆，醒目可点。
 * 邮箱 / 电话点击均为复制，带 "Copied" 绿色反馈。
 */
export function NavContactLinksRich() {
  const email = useCopyText(EMAIL)
  const phone = useCopyText(PHONE)
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={email.copy}
        title={email.copied ? 'Copied!' : `Copy email: ${EMAIL}`}
        className={`nav-contact-chip ${email.copied ? 'nav-contact-chip-copied' : ''}`}
      >
        <span className="nav-chip-icon">{email.copied ? <CheckIcon /> : <MailIcon />}</span>
        <span className="nav-chip-label">{email.copied ? 'Copied' : 'Email'}</span>
      </button>
      <button
        onClick={phone.copy}
        title={phone.copied ? 'Copied!' : `Copy phone: ${PHONE}`}
        className={`nav-contact-chip ${phone.copied ? 'nav-contact-chip-copied' : ''}`}
      >
        <span className="nav-chip-icon">{phone.copied ? <CheckIcon /> : <PhoneIcon />}</span>
        <span className="nav-chip-label">{phone.copied ? 'Copied' : 'Phone'}</span>
      </button>
    </div>
  )
}
