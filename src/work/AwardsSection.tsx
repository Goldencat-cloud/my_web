import { useEffect, useRef } from 'react'
import { useLang } from '../i18n/LanguageContext'
import { useResumeData } from '../data/useResumeData'
import { LT } from '../components/LT'
import SectionHeader from './SectionHeader'
import './AwardsSection.css'

const LOOP_COUNT = 5
const STEADY_MIN = 2
const STEADY_MAX = 3

interface AwardRowProps {
  name: { en: string; zh?: string }
  tier: { en: string; zh?: string }
  role?: { en: string; zh?: string }
  duty: { en: string; zh?: string }
  level: string
  no: number
}

function AwardRow({ name, tier, role, duty, level, no }: AwardRowProps) {
  const isNational = level === 'national'
  return (
    <li className="award-snap">
      <article className={`award-card ${isNational ? 'card-nat' : 'card-prov'}`}>
        <h4 className="ac-name">
          <span className="ac-no">{String(no).padStart(2, '0')}</span>
          <span className="ac-name-text">
            <LT value={name} as="span" />
          </span>
        </h4>
        <div className="ac-meta">
          <span className={`ac-tier ${isNational ? 'tier-gold' : 'tier-silver'}`}>
            <LT value={tier} as="span" />
          </span>
          {role && (
            <span className="ac-role">
              <LT value={role} as="span" />
            </span>
          )}
          <span className="ac-duty">
            <LT value={duty} as="span" />
          </span>
        </div>
      </article>
    </li>
  )
}

function Overview() {
  const { tx } = useLang()
  const data = useResumeData()
  const awards = data.awards

  const toItems = (pills: typeof awards.scholarships) =>
    pills.map((p, idx) => ({
      key: idx,
      label: tx(p.label) ?? '',
      full: p.full ? tx(p.full) : undefined,
    }))

  return (
    <div className="overview">
      <div className="ov-row">
        <span className="ov-label l-gold">{tx({ en: 'Scholarships', zh: '奖学金' })}</span>
        <div className="ov-list">
          {toItems(awards.scholarships).map((s) => (
            <span key={s.key} className="ov-item" title={s.full ?? s.label}>
              {s.label}
            </span>
          ))}
        </div>
      </div>
      <div className="ov-row">
        <span className="ov-label l-champ">{tx({ en: 'Certificates', zh: '证书' })}</span>
        <div className="ov-list">
          {toItems(awards.certificates).map((s) => (
            <span key={s.key} className="ov-item" title={s.full ?? s.label}>
              {s.label}
            </span>
          ))}
        </div>
      </div>
      <div className="ov-row">
        <span className="ov-label l-teal">{tx({ en: 'Languages', zh: '语言' })}</span>
        <div className="ov-list">
          {toItems(awards.languages).map((s) => (
            <span key={s.key} className="ov-item" title={s.full ?? s.label}>
              {s.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function AwardsSection({ active }: { active: boolean }) {
  const { tx } = useLang()
  const data = useResumeData()
  const awards = data.awards
  const items = awards.items

  const looped = Array.from({ length: LOOP_COUNT }, () => items).flat()
  const center = items.length * 2

  const wheelRef = useRef<HTMLDivElement>(null)
  const initedRef = useRef(false)

  useEffect(() => {
    const el = wheelRef.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0

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
        card.style.setProperty('--near', Math.min(abs / 1.6, 1).toFixed(3))
        row.classList.toggle('is-center', abs < 0.5)
      })
    }

    const rebalance = () => {
      const step = measureStep()
      if (step <= 0) return
      const listH = items.length * step
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
      clearTimeout(settleTimer)
      settleTimer = window.setTimeout(rebalance, 160)
    }

    if (!initedRef.current) {
      const step = measureStep()
      const first = el.querySelector<HTMLElement>('.award-snap')
      if (step > 0 && first) {
        const firstTop = first.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop
        const firstCenter = firstTop + first.offsetHeight / 2
        el.scrollTop = firstCenter + center * step - el.clientHeight / 2
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
  }, [active, items.length])

  const stats = awards.header.stats
  const statText = {
    en: `${stats[0].value} National · ${stats[1].value} Provincial · ${tx(stats[2].label) ?? ''}`,
    zh: `${stats[0].value} 项国家级 · ${stats[1].value} 项省级 · ${tx(stats[2].label) ?? ''}`,
  }

  return (
    <div className={`awards-root ${active ? 'awards-on' : ''}`}>
      <SectionHeader
        className="awards-head"
        index="03"
        title={{ en: 'Awards', zh: '荣誉奖项' }}
        active={active}
        meta={
          <p className="awards-stats">
            <LT value={statText} as="span" />
          </p>
        }
      />

      <Overview />

      <div className="wheel" ref={wheelRef}>
        <ol className="wheel-track">
          {looped.map((item, i) => {
            const realIdx = (((i - center) % items.length) + items.length) % items.length
            return (
              <AwardRow
                key={i}
                name={item.name}
                tier={item.tier}
                role={item.role}
                duty={item.duty}
                level={item.level}
                no={realIdx + 1}
              />
            )
          })}
        </ol>
      </div>
    </div>
  )
}
