import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  isValidElement,
  type ReactNode,
} from 'react'
import type { Bi, Lang, Localized } from './types'

const STORAGE_KEY = 'site-lang'

/** 读取本地语言偏好；隐私模式下 localStorage 会抛错，静默回退默认语言 */
function readStoredLang(): Lang {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY)
    if (v === 'en' || v === 'zh') return v
  } catch {
    /* 忽略：隐私模式 / 禁用存储 */
  }
  return 'en'
}

/**
 * 按当前语言取值。
 * 对 `string` / `number` / React 元素 / 数组一律原样返回；
 * 只有形如 `{ en, zh }` 的普通对象才被当作双语值解析。
 *
 * 注意：React 元素本身也是对象，必须先 `isValidElement` 排除，
 * 否则 `<b>pandas</b>` 这类内联节点会被误判成双语值。
 */
export function tx<T>(v: Localized<T>, lang: Lang): T
export function tx<T>(v: Localized<T> | undefined, lang: Lang): T | undefined
export function tx<T>(v: Localized<T> | undefined, lang: Lang): T | undefined {
  if (v === null || v === undefined) return v
  if (
    typeof v === 'object' &&
    !isValidElement(v) &&
    !Array.isArray(v) &&
    'en' in (v as Record<string, unknown>)
  ) {
    const bi = v as Bi<T>
    if (lang === 'zh' && bi.zh !== undefined) return bi.zh
    return bi.en
  }
  return v as T
}

export interface LangApi {
  /** 当前语言 */
  lang: Lang
  /** 直接设置语言 */
  setLang: (next: Lang) => void
  /** 在 EN / 中 之间来回切换 */
  toggleLang: () => void
  /** 已绑定当前语言的取值函数：tx(v) */
  tx: <T>(v: Localized<T>) => T
}

const LangContext = createContext<LangApi | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(readStoredLang)

  /* 同步 <html lang>（无障碍 + 浏览器断行/字体策略）并持久化选择 */
  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* 忽略：写入失败不影响渲染 */
    }
  }, [lang])

  const value = useMemo<LangApi>(
    () => ({
      lang,
      setLang,
      toggleLang: () => setLang((prev) => (prev === 'en' ? 'zh' : 'en')),
      tx: <T,>(v: Localized<T>) => tx(v, lang),
    }),
    [lang],
  )

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang(): LangApi {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang() 必须在 <LanguageProvider> 内部使用')
  return ctx
}
