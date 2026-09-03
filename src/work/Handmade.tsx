import { useId, type ReactNode, type CSSProperties } from 'react'

/* ================= 常量 ================= */
const CALLIGRAPHY =
  '"鸿雷板书简体", "HongLeiBanShu", "STKaiti", "KaiTi", "楷体", cursive'
export const HANDWRITING_FONT =
  '"Segoe Script", "Brush Script MT", "Comic Sans MS", "Bradley Hand", cursive'

/* ================= 书法体 + 粗糙纸感 ================= */
export function Handwriting({
  children,
  active = true,
  fontSize = 'clamp(18px, 2vw, 24px)',
  className = '',
  color = '#E9D5A8',
  shadow,
}: {
  children: ReactNode
  active?: boolean
  fontSize?: number | string
  className?: string
  color?: string
  shadow?: string
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const fid = `rough-${uid}`
  return (
    <span
      className={className}
      style={{
        fontFamily: CALLIGRAPHY,
        fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
        color,
        filter: active ? `url(#${fid})` : 'none',
        textShadow:
          shadow ??
          '1px 1.5px 2px rgba(0,0,0,0.65), 0 0 16px rgba(226,190,120,0.3), -0.5px -0.5px 0 rgba(255,235,190,0.35)',
        display: 'inline-block',
        lineHeight: 1.25,
      }}
    >
      <svg
        width="0"
        height="0"
        aria-hidden="true"
        focusable="false"
        style={{ position: 'absolute', overflow: 'hidden' }}
      >
        <defs>
          <filter id={fid}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="2"
              seed="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="2.5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      {children}
    </span>
  )
}

/* ================= 牛皮纸卡（轻量：渐变 + 噪点，不依赖 dialog.png） ================= */
let paperNoiseId = 0
export function PaperCard({
  children,
  active = true,
  rotate = 0,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  active?: boolean
  rotate?: number
  delay?: number
  className?: string
}) {
  const noiseId = `paper-noise-${++paperNoiseId}`
  return (
    <div className={className} style={{ transform: `rotate(${rotate}deg)` }}>
      <div
        className="section-card relative overflow-hidden rounded-[18px] border border-[#C9A96E]/45 shadow-[0_18px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)]"
        style={{ animationDelay: active ? `${delay}s` : undefined }}
      >
        {/* 暖棕渐变底 */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#4a3826] via-[#3a2c1c] to-[#241a10]" />
        {/* 噪点纸感 */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.22] mix-blend-overlay"
          aria-hidden="true"
        >
          <filter id={noiseId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              seed="5"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#${noiseId})`} />
        </svg>
        {/* 顶光微高光 */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.05] via-transparent to-transparent" />
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  )
}

/* ================= 贴纸标签 ================= */
export function StickerTag({
  text,
  rotate = '-6deg',
  className = '',
}: {
  text: string
  rotate?: string
  className?: string
}) {
  return (
    <div
      className={className}
      style={
        {
          display: 'inline-block',
          transform: `rotate(${rotate})`,
          '--float-r': rotate,
          animation: 'floaty 5s ease-in-out infinite',
          filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.4))',
        } as CSSProperties
      }
    >
      <div
        className="sticker-body transition-transform duration-300 ease-out hover:rotate-2 hover:scale-105"
        style={{
          fontFamily: CALLIGRAPHY,
        }}
      >
        {text}
      </div>
    </div>
  )
}

/* ================= 技术标签 ================= */
export function TechChip({
  label,
  className = '',
}: {
  label: string
  className?: string
}) {
  return <span className={`tech-chip ${className}`}>{label}</span>
}

/* ================= 数据徽章 ================= */
export function StatBadge({
  value,
  label,
  active = true,
  delay = 0,
}: {
  value: string
  label: string
  active?: boolean
  delay?: number
}) {
  return (
    <div
      className="stat-badge section-card"
      style={{ animationDelay: active ? `${delay}s` : undefined }}
    >
      <span className="sb-value">{value}</span>
      <span className="sb-label">{label}</span>
    </div>
  )
}

/* ================= 纸胶带 ================= */
export function WashiTape({
  rotate = '0deg',
  className = '',
}: {
  rotate?: string
  className?: string
}) {
  return (
    <span
      className={`washi-tape ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    />
  )
}

/* ================= 课程 chip：自动换行完整展示，永不截断 ================= */
export function CourseChips({
  label,
  items,
  active = true,
  delay = 0,
  className = '',
}: {
  label?: string
  items: { name: string; score: number }[]
  active?: boolean
  delay?: number
  className?: string
}) {
  return (
    <div className={className}>
      {label && (
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.34em] text-[#C9A96E]">
          {label}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {items.map((c, i) => (
          <span
            key={c.name}
            className="tech-chip section-card shrink-0"
            style={{
              animationDelay: active ? `${delay + i * 0.05}s` : undefined,
            }}
          >
            {c.name}
            <b className="ml-1.5 font-semibold text-[#F6E3B4]">{c.score}</b>
          </span>
        ))}
      </div>
    </div>
  )
}
