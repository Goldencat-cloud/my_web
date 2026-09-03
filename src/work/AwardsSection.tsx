import { useEffect, useRef } from 'react'
import { Handwriting } from './Handmade'
import SectionHeader from './SectionHeader'
import './AwardsSection.css'

/* ================= 奖学金 / 证书 / 语言（固定顶部） ================= */
const SCHOLARSHIPS = ['National Endeavor Scholarship', 'University Third-Class Scholarship']
const SKILL_CERTS = [
  'Software Copyright · First Author',
  'Datawhale Teaching Assistant',
  'Inspur Big Data Training',
  'Gaotu Dream Mentor',
]
const LANG_CERTS = ['CET-6 · 529', 'Mandarin Proficiency (2A)']

/* ================= 荣誉奖项：两行（名称 / 荣誉+角色+职责） ================= */
interface AwardItem {
  name: string
  tier: string
  role?: string
  duty: string
}
const AWARDS: AwardItem[] = [
  {
    name: 'National Artificial Intelligence Application Innovation Competition',
    tier: 'National Grand Prize',
    role: 'Team Lead',
    duty: 'Core data analysis; built AI agents (workflows & knowledge base).',
  },
  {
    name: "National College E-commerce 'Innovation, Creativity & Entrepreneurship' Challenge",
    tier: 'National First Prize',
    role: 'Team Lead',
    duty: 'Business Big-Data Track · end-to-end delivery: problem modeling & implementation.',
  },
  {
    name: 'College Students Innovation & Entrepreneurship Training Program · Entrepreneurship',
    tier: 'National Project',
    duty: 'Financial analysis module.',
  },
  {
    name: 'Contemporary Undergraduate Mathematical Contest in Modeling (CUMCM)',
    tier: 'Provincial Second Prize',
    role: 'Team Lead',
    duty: 'Lead programmer — mathematical modeling & implementation.',
  },
  {
    name: 'College Students Innovation & Entrepreneurship Training Program · Innovation',
    tier: 'Provincial Project',
    role: 'Team Lead',
    duty: 'Data analysis module; authored the core of the academic paper.',
  },
  {
    name: '"Challenge Cup" China College Students\' Entrepreneurship Competition',
    tier: 'Provincial Silver',
    role: 'Core Member',
    duty: 'Market analysis (forecasting, competitor & marketing research) and final defense.',
  },
  {
    name: 'The Chinese Mathematics Competitions for College Students (CMC)',
    tier: 'Provincial Third Prize',
    duty: 'Individual competition.',
  },
]

/* 循环滚轮：渲染五份完整列表，滚动时靠周期性跳变实现无缝循环。
   中间那份（第 3 份）为「稳态区」，初始即定位到它，因此不存在首尾空白。
   五份可让稳态区足够宽，快速滚动时也不会露出轨道首尾边界。 */
const LOOP_COUNT = 5
const LOOPED = Array.from({ length: LOOP_COUNT }, () => AWARDS).flat()
const CENTER = AWARDS.length * 2 /* 中间那份的起始索引 */
const STEADY_MIN = 2 /* 稳态区下界（单位：份） */
const STEADY_MAX = 3 /* 稳态区上界（单位：份） */

/* ================= 单条荣誉：两行（序号+名称 / 荣誉+角色+职责） ================= */
function AwardRow({ item, no }: { item: AwardItem; no: number }) {
  const isNational = item.tier.startsWith('National')
  return (
    <li className="award-snap">
      <article className={`award-card ${isNational ? 'card-nat' : 'card-prov'}`}>
        {/* 行1：序号 + 比赛名称 */}
        <h4 className="ac-name">
          <span className="ac-no">{String(no).padStart(2, '0')}</span>
          <span className="ac-name-text">{item.name}</span>
        </h4>
        {/* 行2：荣誉胶囊 + 角色胶囊 + 职责一句话 */}
        <div className="ac-meta">
          <span className={`ac-tier ${isNational ? 'tier-gold' : 'tier-silver'}`}>{item.tier}</span>
          {item.role && <span className="ac-role">{item.role}</span>}
          <span className="ac-duty">{item.duty}</span>
        </div>
      </article>
    </li>
  )
}

/* ================= 顶部概览：菱形标签列 + 圆点分隔的轻盈文字编排 ================= */
function Overview() {
  return (
    <div className="overview">
      <div className="ov-row">
        <span className="ov-label l-gold">Scholarships</span>
        <div className="ov-list">
          {SCHOLARSHIPS.map((s) => (
            <span key={s} className="ov-item">{s}</span>
          ))}
        </div>
      </div>
      <div className="ov-row">
        <span className="ov-label l-champ">Certificates</span>
        <div className="ov-list">
          {SKILL_CERTS.map((s) => (
            <span key={s} className="ov-item">{s}</span>
          ))}
        </div>
      </div>
      <div className="ov-row">
        <span className="ov-label l-teal">Languages</span>
        <div className="ov-list">
          {LANG_CERTS.map((s) => (
            <span key={s} className="ov-item">{s}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ================= 主组件 ================= */
export default function AwardsSection({ active }: { active: boolean }) {
  const wheelRef = useRef<HTMLDivElement>(null)
  const initedRef = useRef(false)

  useEffect(() => {
    const el = wheelRef.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0

    /* 测量步长（一条卡片 + 间距） */
    const measureStep = () => {
      const rows = el.querySelectorAll<HTMLElement>('.award-snap')
      if (rows.length < 2) return 0
      return rows[1].getBoundingClientRect().top - rows[0].getBoundingClientRect().top
    }

    const render = () => {
      raf = 0
      const rows = Array.from(el.querySelectorAll<HTMLElement>('.award-snap'))
      if (rows.length < 2) return
      const step = measureStep()
      if (step <= 0) return

      /* 3D 纵深：按各条目离面板中心的距离施加变换 */
      const elRect = el.getBoundingClientRect()
      const mid = elRect.top + elRect.height / 2
      rows.forEach((row) => {
        const card = row.querySelector<HTMLElement>('.award-card')
        if (!card) return
        if (reduce) {
          card.style.transform = ''
          card.style.opacity = ''
          return
        }
        const r = row.getBoundingClientRect()
        const d = (r.top + r.height / 2 - mid) / step
        const abs = Math.abs(d)
        const clamped = Math.max(-2.5, Math.min(2.5, d))
        const angle = -clamped * 16
        const z = -Math.min(abs, 3) * 80
        const scale = 1 - Math.min(abs, 1.6) * 0.09
        const opacity = Math.max(1 - Math.min(abs, 2.3) * 0.4, 0.04)
        card.style.transform = `rotateX(${angle.toFixed(2)}deg) translateZ(${z.toFixed(1)}px) scale(${scale.toFixed(3)})`
        card.style.opacity = opacity.toFixed(3)
        /* --near：0 = 焦点，1 = 完全远离；除以 1.6 让初始可见的三条都保持清晰 */
        card.style.setProperty('--near', Math.min(abs / 1.6, 1).toFixed(3))
        row.classList.toggle('is-center', abs < 0.5)
      })
    }

    /* 无缝循环：把 scrollTop 收回到中间那份列表（稳态区）。
       必须与 render 分离、且只在滚动停止后执行 ——
       若在滚动过程中改写 scrollTop，会打断惯性并引发抖动。
       跳变量恰为一整份列表（N 个条目），因列表周期性重复，
       跳变后画面完全一致，且仍落在合法吸附点上，不会被 snap 二次纠正。 */
    const rebalance = () => {
      const step = measureStep()
      if (step <= 0) return
      const listH = AWARDS.length * step
      if (el.scrollTop < listH * STEADY_MIN) {
        el.scrollTop += listH
      } else if (el.scrollTop >= listH * STEADY_MAX) {
        el.scrollTop -= listH
      }
      render()
    }

    let settleTimer = 0
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(render)
      /* 滚动停止后再回绕，避免打断滚动过程 */
      clearTimeout(settleTimer)
      settleTimer = window.setTimeout(rebalance, 160)
    }

    /* 首次定位：让「第 01 条」（中间那份列表的首项）正好停在滚轮正中心。
       计算方式 = 该条中心在内容流中的坐标 − 面板可视区的一半高度。
       之后不再重置，保留用户滚动位置 */
    if (!initedRef.current) {
      const step = measureStep()
      const first = el.querySelector<HTMLElement>('.award-snap')
      if (step > 0 && first) {
        /* 第 0 条（DOM 首项）中心在内容流中的坐标 */
        const firstTop = first.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop
        const firstCenter = firstTop + first.offsetHeight / 2
        /* 目标：第 CENTER 条（即 01）的中心 → 减去面板半高即为该条居中时的 scrollTop */
        el.scrollTop = firstCenter + CENTER * step - el.clientHeight / 2
        initedRef.current = true
      }
    }
    render()
    el.addEventListener('scroll', onScroll, { passive: true })
    const ro = new ResizeObserver(onScroll)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', onScroll)
      ro.disconnect()
      clearTimeout(settleTimer)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [active])

  return (
    <div className={`awards-root ${active ? 'awards-on' : ''}`}>
      {/* 标题：书法体 Awards + 获奖统计（校级聚合，不逐条罗列）
          复用全站共享板块头，统计行走 meta 插槽 */}
      <SectionHeader
        className="awards-head"
        index="03"
        title="Awards"
        active={active}
        meta={
          <p className="awards-stats">
            <b>4</b> National <i>·</i> <b>4</b> Provincial <i>·</i> Multiple University-Level
            Honors
          </p>
        }
      />

      {/* 顶部概览：奖学金 / 证书 / 语言 */}
      <Overview />

      {/* 循环 3D 荣誉滚轮：无缝循环，初始即展示前三条 */}
      <div className="wheel" ref={wheelRef}>
        <ol className="wheel-track">
          {LOOPED.map((item, i) => {
            /* 序号映射回真实列表的 1..7（克隆项也显示正确序号） */
            const realIdx = (((i - CENTER) % AWARDS.length) + AWARDS.length) % AWARDS.length
            return <AwardRow key={i} item={item} no={realIdx + 1} />
          })}
        </ol>
      </div>
    </div>
  )
}
