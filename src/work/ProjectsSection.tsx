import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from 'react'
import { TechChip } from '../work/Handmade'
import SectionHeader from '../work/SectionHeader'
import { useLang } from '../i18n/LanguageContext'
import { useResumeData } from '../data/useResumeData'
import { RichText } from '../components/RichText'
import '../work/ProjectsSection.css'

import type { Project } from '../data/resumeSchema'

type UiStage = { key: string; label: string; body: React.ReactNode }
type UiProject = {
  id: string
  year: string
  no: string
  tab: string
  title: string
  honor: string
  time: string
  role: string
  tech: string[]
  stages: UiStage[]
}

function ArchiveCard({ p }: { p: UiProject }) {
  const bodyRef = useRef<HTMLDivElement>(null)
  const [atBottom, setAtBottom] = useState(false)

  const onScroll = () => {
    const el = bodyRef.current
    if (!el) return
    setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 6)
  }

  useEffect(() => {
    const el = bodyRef.current
    if (!el) return
    el.scrollTop = 0
    setAtBottom(el.scrollHeight <= el.clientHeight + 6)
  }, [p.id, p.stages.length])

  return (
    <div className="archive-card">
      <div className="archive-tab">{p.tab}</div>

      <div className="archive-punch" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="archive-binding" aria-hidden="true" />

      <div className="archive-index" aria-hidden="true">
        <span className="idx-year">{p.year}</span>
        <span className="idx-no">No.{p.no}</span>
      </div>

      <h3 className="archive-title">{p.title}</h3>
      <div className="archive-meta-row">
        <p className="archive-meta">
          {p.time} · {p.role}
        </p>
      </div>

      <div className="archive-bookmark" aria-hidden="true">
        <span className="archive-bookmark-text">{p.honor}</span>
      </div>

      <div className="archive-body" ref={bodyRef} onScroll={onScroll}>
        <ul className="dl-track">
          {p.stages.map((s) => (
            <li className="dl-node" key={s.key}>
              <span className="dl-dot" />
              <div className="dl-text">
                <span className="dl-label">{s.label}</span>
                <p className="bd-en">{s.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className={`archive-scroll-hint${atBottom ? ' is-hidden' : ''}`} aria-hidden="true" />

      <div className="archive-tech">
        {p.tech.map((t) => (
          <TechChip key={t} label={t} />
        ))}
      </div>
    </div>
  )
}

export default function ProjectsSection({ active }: { active: boolean }) {
  const { tx } = useLang()
  const data = useResumeData()

  const projects: UiProject[] = data.projects.map((p: Project) => ({
    id: p.id,
    year: p.year,
    no: p.no,
    tab: tx(p.tab) ?? '',
    title: tx(p.title) ?? '',
    honor: p.honor ? (tx(p.honor) ?? '') : (p.subtitle ? (tx(p.subtitle) ?? '') : ''),
    time: tx(p.time) ?? '',
    role: tx(p.role) ?? '',
    tech: p.tech.map((t) => tx(t) ?? ''),
    stages: p.stages.map((s) => ({
      key: s.key,
      label: tx(s.label) ?? '',
      body: <RichText text={tx(s.body) ?? ''} />,
    })),
  }))

  const [index, setIndex] = useState(0)
  const total = projects.length
  const drag = useRef({ x: 0, on: false })
  const wheelAcc = useRef(0)
  const wheelLock = useRef(false)

  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + total) % total),
    [total],
  )

  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, go])

  const onDown = (e: ReactPointerEvent) => {
    drag.current = { x: e.clientX, on: true }
  }
  const onUp = (e: ReactPointerEvent) => {
    if (!drag.current.on) return
    const dx = e.clientX - drag.current.x
    drag.current.on = false
    if (dx < -60) go(1)
    else if (dx > 60) go(-1)
  }

  const onTrackClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    setIndex(Math.max(0, Math.min(total - 1, Math.floor(ratio * total))))
  }

  const onTrackWheel = (e: ReactWheelEvent<HTMLDivElement>) => {
    const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY)
    if (!horizontal && !e.shiftKey) return
    const d = horizontal ? e.deltaX : e.deltaY
    e.preventDefault()
    if (wheelLock.current) return
    wheelAcc.current += d
    if (Math.abs(wheelAcc.current) > 60) {
      go(wheelAcc.current > 0 ? 1 : -1)
      wheelAcc.current = 0
      wheelLock.current = true
      window.setTimeout(() => {
        wheelLock.current = false
      }, 420)
    }
  }

  return (
    <div className="ps-root">
      <SectionHeader
        className="ps-head"
        index="04"
        title={{ en: 'Projects', zh: '项目经历' }}
        subtitle={{ en: 'Things I have built — code, design, and everything in between.', zh: '我做过的一些项目：代码、设计，以及中间的一切。' }}
        active={active}
      />
      <div
        className="ps-stage"
        onPointerDown={onDown}
        onPointerUp={onUp}
        style={{ touchAction: 'pan-y' }}
      >
        {projects.map((p, i) => {
          const rel = (i - index + total) % total
          const pos = rel === 0 ? 0 : rel === 1 ? 1 : -1
          return (
            <div
              key={p.id}
              className="ps-slot"
              style={{ ['--pos' as string]: pos, ['--ap' as string]: Math.abs(pos) }}
            >
              <ArchiveCard p={p} />
            </div>
          )
        })}

        <button className="ps-arrow ps-prev" onClick={() => go(-1)} aria-label="Previous project">
          ‹
        </button>
        <button className="ps-arrow ps-next" onClick={() => go(1)} aria-label="Next project">
          ›
        </button>
      </div>

      <div
        className="ps-scroll"
        style={{ ['--idx' as string]: index, ['--total' as string]: total }}
      >
        <div
          className="ps-track"
          onClick={onTrackClick}
          onWheel={onTrackWheel}
          role="presentation"
          aria-label="Switch project"
        >
          <span className="ps-thumb" />
        </div>
        <div className="ps-years">
          {projects.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className={`ps-year${i === index ? ' is-on' : ''}`}
              onClick={() => setIndex(i)}
            >
              {p.year}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
