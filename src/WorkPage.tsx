import { useEffect, useRef, useState } from 'react'
import SiteBackdrop from './Backdrop'
import { NavContactLinksRich } from './ContactWidgets'
import AboutSection from './work/AboutSection'
import InternshipSection from './work/InternshipSection'
import AwardsSection from './work/AwardsSection'
import ProjectsSection from './work/ProjectsSection'
import CampusSection from './work/CampusSection'
import SectionHeader from './work/SectionHeader'
import PillNavButton from './work/PillNavButton'

export type WorkSectionId =
  | 'about'
  | 'awards'
  | 'internship'
  | 'projects'
  | 'activities'
  | 'learning'

interface WorkSection {
  id: WorkSectionId
  label: string
  title: string
  description: string
}

const SECTIONS: WorkSection[] = [
  {
    id: 'about',
    label: 'About',
    title: 'About Me',
    description:
      'A short introduction to who I am — my story, my values, and what drives me.',
  },
  {
    id: 'internship',
    label: 'Internship',
    title: 'Internship',
    description: 'Work experience and the lessons I learned on the job.',
  },
  {
    id: 'awards',
    label: 'Awards',
    title: 'Awards',
    description: 'Certificates, honors, and recognitions I have earned.',
  },
  {
    id: 'projects',
    label: 'Projects',
    title: 'Projects',
    description:
      'Things I have built — code, design, and everything in between.',
  },
  {
    id: 'activities',
    label: 'Campus',
    title: 'Campus',
    description: 'Campus life, clubs, and events I took part in.',
  },
  {
    id: 'learning',
    label: 'Learning',
    title: 'Learning',
    description: 'What I am currently studying and my learning journey.',
  },
]

interface WorkPageProps {
  onBackHome: () => void
}

export default function WorkPage({ onBackHome }: WorkPageProps) {
  const [activeId, setActiveId] = useState<WorkSectionId>('about')
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Record<WorkSectionId, HTMLElement | null>>({
    about: null,
    awards: null,
    internship: null,
    projects: null,
    activities: null,
    learning: null,
  })
  const year = new Date().getFullYear()

  /* 滚动到哪个板块，导航就高亮哪个 */
  useEffect(() => {
    const root = scrollRef.current
    if (!root) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset
              .section as WorkSectionId
            setActiveId(id)
          }
        }
      },
      { root, rootMargin: '-42% 0px -42% 0px', threshold: 0 },
    )
    SECTIONS.forEach((s) => {
      const el = sectionRefs.current[s.id]
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: WorkSectionId) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const scrollToNext = () => {
    const idx = SECTIONS.findIndex((s) => s.id === activeId)
    const next = SECTIONS[Math.min(idx + 1, SECTIONS.length - 1)]
    scrollToSection(next.id)
  }

  const isLastActive = activeId === SECTIONS[SECTIONS.length - 1].id

  return (
    <>
      {/* 全站统一背景：与首页完全一致；放在滚动容器外，滚动到任何板块背景都全局可见 */}
      <SiteBackdrop />

      {/* Work 页专属背景元素：暖金星球 + 星环，与首页拉开差异，悬浮于背景层 */}
      <div className="pointer-events-none fixed inset-0 z-[4] overflow-hidden" aria-hidden="true">
        <div className="planet-orb absolute -right-16 top-[12%] hidden md:block">
          <span className="planet-ring" />
          <span className="planet-body" />
          <span className="planet-glow" />
        </div>
        {/* 左侧星球：毛玻璃质感星球 + 与右侧星环呈对角线方向倾斜的星环。
            表面纹理层可水平移动，模拟星球向右侧转动露出大部分再回摆 */}
        <div className="planet-orb planet-orb-teal absolute -left-24 bottom-[6%] hidden md:block">
          <span className="planet-ring planet-ring-teal" />
          <span className="planet-body planet-body-teal">
            <span className="planet-surface" />
          </span>
          <span className="planet-glow" />
        </div>
      </div>

      {/* 顶部导航栏：固定在滚动容器外，页面滚动时始终在顶部保持可见 */}
      <header className="glass-bar fixed inset-x-0 top-0 z-50">
        <div className="flex h-16 items-center justify-between gap-4 px-5 md:px-10">
          {/* 左侧：Home + 品牌名 */}
          <div className="flex shrink-0 items-center gap-3">
            <button
              onClick={onBackHome}
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-[#C9B48D] transition-colors duration-300 hover:text-[#F2E0B8]"
            >
              <span className="transition-transform duration-300 group-hover:-translate-x-0.5">
                ←
              </span>
              Home
            </button>
            <span className="hidden h-4 w-px bg-[#C9A96E]/30 sm:block" />
            <span className="hidden text-sm font-semibold tracking-wide text-[#F2E7CD] sm:block">
              Zhihan Zhang
            </span>
          </div>

          {/* 中间：6 个模块导航，绝对定位于视口正中央；最大宽度按左右两侧实际占用预留空间，永不重叠 */}
          <nav className="no-scrollbar absolute left-1/2 top-0 flex h-16 max-w-[calc(100%-24rem)] -translate-x-1/2 items-center justify-center gap-0.5 overflow-x-auto md:gap-1 lg:max-w-[calc(100%-38rem)]">
            {SECTIONS.map((s) => (
              <PillNavButton
                key={s.id}
                active={s.id === activeId}
                onClick={() => scrollToSection(s.id)}
              >
                {s.label}
              </PillNavButton>
            ))}
          </nav>

          {/* 右侧：常驻联系入口（胶囊 + 一句真诚邀请），flex 流内右端对齐 */}
          <div className="flex shrink-0 items-center gap-3">
            <NavContactLinksRich />
            {/* 一句克制的小字，真诚邀请联系 */}
            <span className="hidden items-center gap-2.5 lg:flex">
              <span className="h-3.5 w-px bg-[#C9A96E]/35" />
              <span className="text-[13px] tracking-wide text-[#B7A581] md:text-[13.5px]">
                Open to opportunities.
              </span>
            </span>
          </div>
        </div>
      </header>

      {/* 右侧圆点导航：固定于视口右侧，滚动时始终可见 */}
      <div className="fixed right-4 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-center gap-3.5 lg:flex">
        {SECTIONS.map((s, i) => {
          const isActive = s.id === activeId
          return (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              aria-label={s.label}
              className="group relative flex h-7 w-7 items-center justify-center"
            >
              <span
                className={`absolute right-full mr-3 whitespace-nowrap rounded-full border border-[#C9A96E]/35 bg-[#241a10]/85 px-2.5 py-1 text-[11px] font-medium text-[#E9D5A8] shadow-md backdrop-blur-md transition-opacity duration-300 ${
                  isActive
                    ? 'opacity-100'
                    : 'opacity-0 group-hover:opacity-100'
                }`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className={`rounded-full transition-all duration-300 ${
                  isActive
                    ? 'h-3 w-3 bg-[#E9D5A8] shadow-[0_0_8px_rgba(233,213,168,0.8)]'
                    : 'h-2 w-2 bg-[#C9A96E]/40 group-hover:bg-[#C9A96E]/70'
                }`}
              />
            </button>
          )
        })}
      </div>

      <div
        ref={scrollRef}
        className="fixed inset-0 snap-y snap-mandatory scroll-smooth overflow-y-auto overflow-x-hidden overscroll-contain bg-transparent [perspective:1600px]"
        style={{ animation: 'work-screen-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) backwards' }}
      >
      {/* 板块内容区：整页滚动 + 吸附切换 */}
      {SECTIONS.map((s, i) => {
        const isActive = s.id === activeId
        const isLast = i === SECTIONS.length - 1
        const isAbout = s.id === 'about'
        const isInternship = s.id === 'internship'
        const isAwards = s.id === 'awards'
        const isProjects = s.id === 'projects'
        const isActivities = s.id === 'activities'
        const padTop = isAbout ? 'pt-[max(15vh,8rem)]' : 'pt-[max(9vh,4.5rem)]'
        // 上下留白对称 + 内容垂直居中（safe center：内容超高时自动退回顶部对齐，不会被裁），
        // 保证每屏的视觉重心落在画面中心，标题只作"重心之上的引子"而不抢戏。
        const padBottom = isAbout ? 'pb-16' : 'pb-[max(9vh,4.5rem)]'
        const sectionSizing = `min-h-screen snap-start ${padTop} ${padBottom}`
        return (
          <section
            key={s.id}
            ref={(el) => {
              sectionRefs.current[s.id] = el
            }}
            data-section={s.id}
            className={`relative z-10 flex origin-top flex-col items-center justify-start px-6 ${sectionSizing} transition-[opacity,transform] duration-700 ease-out md:px-10 ${
              isActive
                ? 'translate-y-0 rotate-x-0 scale-100 opacity-100'
                : 'translate-y-[7vh] rotate-x-5 scale-[0.96] opacity-0'
            }`}
          >
            <div className="flex w-full max-w-5xl flex-1 flex-col [justify-content:safe_center]">
              {!isAbout && !isInternship && !isAwards && !isProjects && !isActivities && (
                <SectionHeader
                  className="w-full"
                  index={String(i + 1).padStart(2, '0')}
                  title={s.title}
                  subtitle={s.description}
                  active={isActive}
                  /* 无正文板块：标题固定在重心之上，下方留白由 auto 吸收，
                     与各页「标题在上、主体居中」的节奏保持一致 */
                  style={{ marginBottom: 'auto' }}
                />
              )}

              {isAbout && (
                <div className="min-h-0 w-full flex-1">
                  <AboutSection active={isActive} />
                </div>
              )}

              {isAwards && (
                <div className="flex min-h-0 w-full flex-1 flex-col items-center [justify-content:safe_center]">
                  <AwardsSection active={isActive} />
                </div>
              )}

              {isInternship && (
                <div className="flex min-h-0 w-full flex-1 flex-col items-center [justify-content:safe_center]">
                  <div className="w-[min(60vw,1080px)] max-w-full">
                    <InternshipSection active={isActive} />
                  </div>
                </div>
              )}

              {isProjects && (
                <div className="flex min-h-0 w-full flex-1 flex-col items-center [justify-content:safe_center]">
                  <ProjectsSection active={isActive} />
                </div>
              )}

              {isActivities && (
                <div className="flex min-h-0 w-full flex-1 flex-col items-center [justify-content:safe_center]">
                  <CampusSection active={isActive} />
                </div>
              )}

              {isLast && (
                <p className="section-enter mt-10 text-center text-xs text-[#8F7E63]" style={{ animationDelay: '0.24s' }}>
                  © {year} Zhihan Zhang · Made with care
                </p>
              )}
            </div>
          </section>
        )
      })}

      </div>

      {/* 底部滚动提示：固定于视口底部，滚动时始终可见 */}
      <button
        onClick={scrollToNext}
        aria-label="Scroll to next section"
        className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-500 ${
          isLastActive ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      >
        <span className="flex flex-col items-center gap-1 text-[10px] uppercase tracking-[0.26em] text-[#B7A581]/80">
          Scroll
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-[bounce-y_1.6s_ease-in-out_infinite]"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>
    </>
  )
}
