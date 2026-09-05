import SiteBackdrop from './Backdrop'
import LangToggle from './i18n/LangToggle'
import { useLang } from './i18n/LanguageContext'

interface LifePageProps {
  onBackHome: () => void
}

export default function LifePage({ onBackHome }: LifePageProps) {
  const { lang } = useLang()

  return (
    <div className="fixed inset-0 overflow-hidden">
      <SiteBackdrop />

      {/* 顶部导航栏 */}
      <header className="glass-bar fixed inset-x-0 top-0 z-50">
        <div className="flex h-16 items-center justify-between gap-4 px-5 md:px-10">
          <div className="flex shrink-0 items-center gap-3">
            <button
              onClick={onBackHome}
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-[#C9B48D] transition-colors duration-300 hover:text-[#F2E0B8]"
            >
              <span className="transition-transform duration-300 group-hover:-translate-x-0.5">
                ←
              </span>
              {lang === 'zh' ? '首页' : 'Home'}
            </button>
            <span className="hidden h-4 w-px bg-[#C9A96E]/30 sm:block" />
            <span className="hidden text-sm font-semibold tracking-wide text-[#F2E7CD] sm:block">
              Zhihan Zhang
            </span>
          </div>

          <div className="flex items-center gap-3">
            <LangToggle />
          </div>
        </div>
      </header>

      {/* 占位内容 */}
      <main className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <h1
          className="home-fade-up bg-gradient-to-br from-[#F2E0B8] via-[#E0C188] to-[#B8915A] bg-clip-text text-[clamp(32px,5vw,64px)] font-semibold leading-[1.1] text-transparent"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {lang === 'zh' ? '生活' : 'Life'}
        </h1>
        <div className="home-fade-up mt-3 h-px w-16 rounded-full bg-gradient-to-r from-transparent via-[#C9A96E]/70 to-transparent" />
        <p className="home-fade-up mt-5 max-w-md text-[15px] leading-relaxed text-[#C9B48D]">
          {lang === 'zh'
            ? '这里将记录我的生活点滴。目前还在建设中，敬请期待。'
            : 'This is where my life stories will live. Still under construction.'}
        </p>
      </main>
    </div>
  )
}
