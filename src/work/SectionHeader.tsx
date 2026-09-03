import type { CSSProperties, ReactNode } from 'react'
import { Handwriting } from './Handmade'
import './SectionHeader.css'

/* =========================================================
   全站共享板块头（G1 / G2 / G5 的系统级落地）
   四段结构：编号 eyebrow（金线装订）→ 书法体标题 → 一行副标题 → 可选 meta
   六板块全部复用，保证「样式 / 字号 / 间距 / 表达」一致；
   「风格」差异留给各页内容区（IDE 窗口 / 勋章滚轮 / 羊皮卷轴…）。
   ========================================================= */

/** 统一书法标题字号：六个板块共用一档 */
export const SECTION_TITLE_SIZE = 'clamp(32px, 3.6vw, 48px)'

export default function SectionHeader({
  index,
  title,
  subtitle,
  meta,
  active = true,
  className = '',
  titleClassName = '',
  size = SECTION_TITLE_SIZE,
  style,
}: {
  /** 双位页码：01–06 */
  index: string
  /** 书法体板块标题；不传则只渲染编号（如 About 的签名页） */
  title?: string
  /** 一句话副标题（sentence case 手账体） */
  subtitle?: string
  /** 标题下的自定义信息行（如 Awards 的统计行） */
  meta?: ReactNode
  active?: boolean
  /** 追加到头部根节点，用于各页保留自身的入场动画/吸附类名 */
  className?: string
  /** 追加到标题节点，用于各页保留自身的墨迹动画类名 */
  titleClassName?: string
  size?: string
  /** 各页微调落位（如 About 只有编号、不需要头部下间距） */
  style?: CSSProperties
}) {
  return (
    <header className={`sec-head ${className}`.trim()} style={style}>
      {/* 编号 eyebrow：金线 + 页码 + 署名，全站同一枚「装订标记」 */}
      <div className="sec-eyebrow">
        <span className="sec-eyebrow-line" aria-hidden="true" />
        <span className="sec-eyebrow-num">{index}</span>
        <span className="sec-eyebrow-sep" aria-hidden="true" />
        <span className="sec-eyebrow-tail">Zhihan Zhang · Work</span>
        <span className="sec-eyebrow-line sec-eyebrow-line--r" aria-hidden="true" />
      </div>

      {title && (
        <h2 className={`sec-title ${titleClassName}`.trim()}>
          <Handwriting active={active} fontSize={size}>
            {title}
          </Handwriting>
        </h2>
      )}

      {subtitle && <p className="sec-subtitle">{subtitle}</p>}
      {meta && <div className="sec-meta">{meta}</div>}
    </header>
  )
}
