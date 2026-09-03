import type { ReactNode } from 'react'
import { TechChip } from './Handmade'
import SectionHeader from './SectionHeader'
import './CampusSection.css'

const hi = (s: string): ReactNode => <span className="num-data">{s}</span>

type Role = {
  idx: string
  title: string
  org: string
  time: string
  duties: ReactNode[]
  chips: string[]
}

const roles: Role[] = [
  {
    idx: '01',
    title: 'Research Assistant',
    org: 'International Business School, Shaanxi Normal University',
    time: '2024.11 – 2025.02',
    duties: [
      <>
        Sourced literature and compiled research data for an international trade study,
        building a clean dataset for cross-country comparison.
      </>,
      <>
        Used <b>pandas</b>/<b>numpy</b> aggregation and <b>matplotlib</b> visualization to surface
        patterns in trade flow and present results to the lab.
      </>,
    ],
    chips: ['pandas', 'numpy', 'matplotlib'],
  },
  {
    idx: '02',
    title: 'Core Member',
    org: 'Innovation & Entrepreneurship Association Office',
    time: '2022.09 – 2024.06',
    duties: [
      <>
        Produced posters and edited videos for association events, shaping a consistent visual
        identity across campus promotions.
      </>,
      <>
        As a core member prepared the university-level &ldquo;Maker Cup,&rdquo; coordinating
        logistics from call-for-entries to the final pitch.
      </>,
      <>
        Coordinated cross-department staff and managed on-site operations, attracting{' '}
        {hi('30+')} participating teams.
      </>,
    ],
    chips: ['Poster Design', 'Video Editing', 'Event Planning', 'Team Coordination'],
  },
]

export default function CampusSection({ active = false }: { active?: boolean }) {
  return (
    <section className={`cs-root${active ? ' cs-on' : ''}`} aria-label="Campus roles">
      <div className="cs-threads" aria-hidden="true">
        <span className="cs-thread cs-thread--top" />
        <span className="cs-thread cs-thread--bottom" />
        <span className="cs-thread cs-thread--under" />
      </div>
      <div className="cs-aura" aria-hidden="true" />
      <div className="cs-scroll">
        {/* 半透羊皮纸：独立无 transform 层，承载 backdrop-filter 与撕边 mask（方案 A + B） */}
        <div className="cs-paper" aria-hidden="true" />
        {/* iridescent paper sheen + silk thread (decorative, fixed, do not scroll) */}
        <div className="cs-shimmer" aria-hidden="true" />
        <div className="cs-silk" aria-hidden="true" />
        {/* 卷轴上下木轴，制造破形卷边 */}
        <span className="cs-rod cs-rod--top" aria-hidden="true" />
        <span className="cs-rod cs-rod--bottom" aria-hidden="true" />

        {/* 顶部鎏金缎带封口 */}
        <div className="cs-ribbon" aria-hidden="true">
          <span className="cs-ribbon-band" />
          <span className="cs-ribbon-btn" />
        </div>

        {/* 卷体内容区：框内 scroll-snap 逐段吸附翻页（标题→角色1→角色2→落款） */}
        <div className="cs-viewport">
          <div className="cs-body">
            {/* 标题区（吸附锚点 start）：留在卷轴内部，但与全站共享同一套头部规格 */}
            <SectionHeader
              className="cs-head"
              titleClassName="cs-title"
              index="05"
              title="Campus"
              subtitle="Roles, research, and on-campus service"
              active={active}
            />

            {/* 角色卷段（吸附锚点 start） */}
            {roles.map((seg) => (
              <article className="cs-segment" key={seg.idx}>
                <div className="cs-seg-head">
                  <span className="cs-seg-idx">{seg.idx}</span>
                  <h3 className="cs-role-name">{seg.title}</h3>
                </div>
                <div className="cs-org-time">
                  <span className="cs-org">{seg.org}</span>
                  <span className="cs-time">{seg.time}</span>
                </div>
                <div className="cs-duties">
                  {seg.duties.map((d, k) => (
                    <p className="cs-duty" key={k}>
                      {d}
                    </p>
                  ))}
                </div>
                <div className="cs-tech">
                  {seg.chips.map((c) => (
                    <TechChip key={c} label={c} />
                  ))}
                </div>
              </article>
            ))}

            {/* 段间蜡封金线（破形分隔，随内容流动，非独立吸附点） */}
            <div className="cs-seal" aria-hidden="true">
              <span className="cs-seal-line" />
              <span className="cs-seal-node" />
              <span className="cs-seal-line" />
            </div>

            {/* 卷尾落款印章（吸附锚点 end，停稳在卷底）：回退上一版，250h+ 金箔数字 */}
            <div className="cs-signet">
              <div className="cs-signet-frame">
                <div className="cs-signet-value">
                  250<span className="cs-signet-unit">h+</span>
                </div>
                <div className="cs-signet-label">On-Campus Volunteer Service</div>
              </div>
            </div>

            {/* 卷末右下角落款：SNNU IBS / 2026，校徽（空心版）像学校盖的章一样压在字上 */}
            <div className="cs-stamp">
              <img
                className="cs-stamp-mark"
                src="/snnu-8.png"
                alt="Shaanxi Normal University emblem"
                draggable={false}
              />
              <div className="cs-stamp-org">SNNU IBS</div>
              <div className="cs-stamp-year">2026</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
