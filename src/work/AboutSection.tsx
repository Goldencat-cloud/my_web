import { useEffect, useRef, useState } from 'react'
import { HANDWRITING_FONT, Handwriting, StickerTag, WashiTape } from './Handmade'
import SectionHeader from './SectionHeader'
import { useLang } from '../i18n/LanguageContext'
import { useResumeData } from '../data/useResumeData'

function GpaBadge({
  value,
  active,
  delay,
}: {
  value: number
  active: boolean
  delay: number
}) {
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!active) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVal(value)
      return
    }
    let raf = 0
    const timer = window.setTimeout(() => {
      const start = performance.now()
      const tick = (now: number) => {
        const p = Math.min((now - start) / 1000, 1)
        setVal(value * (1 - Math.pow(1 - p, 3)))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, delay * 1000)
    return () => {
      window.clearTimeout(timer)
      cancelAnimationFrame(raf)
    }
  }, [active, value, delay])

  return (
    <span
      className="gpa-badge section-card shrink-0"
      style={{ animationDelay: active ? `${delay}s` : undefined }}
    >
      GPA <b>{val.toFixed(2)}</b>
    </span>
  )
}

function scoreColor(score: number): string {
  if (score >= 95) return '#F6E3B4'
  if (score >= 92) return '#D4B57A'
  return '#B7A581'
}

function ScoreNum({
  score,
  active,
  delay,
}: {
  score: number
  active: boolean
  delay: number
}) {
  const [val, setVal] = useState<number | null>(null)

  useEffect(() => {
    if (!active) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVal(score)
      return
    }
    let raf = 0
    const timer = window.setTimeout(() => {
      const start = performance.now()
      const dur = 550
      const tick = (now: number) => {
        const p = Math.min((now - start) / dur, 1)
        setVal(Math.round(score * (1 - Math.pow(1 - p, 3))))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, delay * 1000)
    return () => {
      window.clearTimeout(timer)
      cancelAnimationFrame(raf)
    }
  }, [active, score, delay])

  return <>{val === null ? '··' : val}</>
}

function CourseRow({
  items,
  active,
  delay,
}: {
  items: { name: string; score: number }[]
  active: boolean
  delay: number
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)
  const posRef = useRef(0)
  const dirRef = useRef(1)

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    let raf = 0
    const speed = 0.55
    const tick = () => {
      const max = el.scrollWidth - el.clientWidth
      if (max <= 0) return
      if (!pausedRef.current) {
        posRef.current += speed * dirRef.current
        if (posRef.current >= max) {
          posRef.current = max
          dirRef.current = -1
        } else if (posRef.current <= 0) {
          posRef.current = 0
          dirRef.current = 1
        }
        el.scrollLeft = posRef.current
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active])

  return (
    <div
      ref={scrollerRef}
      className="course-scroller w-full"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <div className="course-track flex flex-nowrap items-stretch gap-2.5">
        {items.map((c, i) => (
          <div
            key={c.name}
            className="tech-chip course-chip flex shrink-0 items-center justify-center px-2.5 text-[11.5px]"
          >
            <span className="whitespace-nowrap">{c.name}</span>
            <b
              className="score-num ml-1.5 shrink-0 font-semibold"
              style={{ color: scoreColor(c.score) }}
            >
              <ScoreNum score={c.score} active={active} delay={delay + i * 0.06 + 0.5} />
            </b>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AboutSection({ active }: { active: boolean }) {
  const { tx } = useLang()
  const data = useResumeData()
  const about = data.about

  const avatarVideoRef = useRef<HTMLVideoElement>(null)
  const startAvatarVideo = () => {
    const v = avatarVideoRef.current
    if (!v) return
    try {
      v.pause()
      v.currentTime = 0.12
      const resume = () => {
        v.play().catch(() => {})
        v.removeEventListener('seeked', resume)
      }
      v.addEventListener('seeked', resume)
    } catch {
      v.play().catch(() => {})
    }
  }

  return (
    <div className="relative -mt-[35px] grid min-h-full w-full grid-rows-[auto_1fr_auto] justify-items-center px-4 pb-6 pt-[max(calc(7vh-22px),calc(4rem-22px))] lg:px-6">
      <span className={`about-watermark ${active ? 'is-active' : ''}`} aria-hidden="true">
        ABOUT ME
      </span>

      <div
        key={active ? 'play' : 'idle'}
        className="row-start-1 flex w-full max-w-[800px] flex-col items-center"
      >
        <div className="flex w-full flex-col items-center">
          <SectionHeader
            className="about-head"
            index="01"
            active={active}
            style={{ marginBottom: 0 }}
          />

          <div
            className="section-card"
            style={{
              marginTop: '6px',
              animationDelay: active ? '0s' : undefined,
            }}
          >
            <div className="sig-paper relative inline-flex items-center gap-3">
              <span
                className={`sig-star absolute -left-2 -top-2 select-none text-[14px] ${active ? 'is-active' : ''}`}
                aria-hidden="true"
              >
                ✦
              </span>
              <span
                className={`sig-star absolute -right-2 -top-2 select-none text-[14px] ${active ? 'is-active' : ''}`}
                aria-hidden="true"
              >
                ✦
              </span>
              <div style={active ? { animation: 'ink-drop 0.8s ease-out 0.12s both' } : undefined}>
                <span className="resume-brush">
                  <Handwriting
                    active={active}
                    fontSize="clamp(38px, 5.6vw, 64px)"
                    className="block"
                  >
                    {tx(about.header.title)}
                  </Handwriting>
                </span>
              </div>
            </div>
          </div>

          <p
            className={`mt-3 text-[10px] uppercase tracking-[0.55em] text-[#B7A581] ${active ? 'section-enter' : ''}`}
            style={{ animationDelay: active ? '0.55s' : undefined }}
          >
            {tx(about.header.atmosphere)}
          </p>

          <span
            className="mt-3 h-px w-16 bg-gradient-to-r from-transparent via-[#C9A96E]/45 to-transparent"
            aria-hidden="true"
          />

          <div
            className={`mt-3 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2 ${active ? 'section-enter' : ''}`}
            style={{ animationDelay: active ? '0.7s' : undefined }}
          >
            <StickerTag text={about.mbti} rotate="-4deg" className="entp-sticker" />
            <p
              className="text-[13px] tracking-[0.02em] text-[#B7A581] lg:text-[13.5px]"
              style={{ fontFamily: HANDWRITING_FONT }}
            >
              {tx(about.personalityTags)}
            </p>
          </div>
        </div>
      </div>

      <div
        key={`body-${active ? 'play' : 'idle'}`}
        className="about-body-card row-start-2 mt-[2.5vh] flex w-full max-w-[800px] flex-col items-stretch self-start lg:mt-[3.5vh]"
      >
        <span className="about-paper-grain" aria-hidden="true" />
        <div className="relative flex w-full translate-y-[8px] items-start gap-5">
          <div className="about-frame hidden w-[120px] shrink-0 lg:block" style={{ marginTop: '-16px' }}>
            <video
              src={about.avatar.src}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="block h-auto w-full"
              ref={avatarVideoRef}
              onLoadedMetadata={startAvatarVideo}
            />
          </div>
          <WashiTape
            rotate="-42"
            className="absolute -left-9 -top-6 z-10 hidden !h-[30px] !w-[132px] opacity-90 lg:block"
          />
          <WashiTape
            rotate="42"
            className="absolute -right-9 -top-6 z-10 hidden !h-[30px] !w-[132px] opacity-90 lg:block"
          />
          <p
            className={`about-bio min-w-0 flex-1 text-justify text-[15px] font-normal leading-[1.85] tracking-[0.005em] text-[#F2E7CD]/92 lg:text-[15.5px] ${active ? 'section-enter' : ''}`}
            style={{ animationDelay: active ? '1.1s' : undefined }}
          >
            {tx(about.bio)}
          </p>
        </div>

        <div className="relative mt-2 -mx-14 w-[calc(100%+112px)] space-y-3 lg:mt-3">
          {about.education.map((e, i) => (
            <div
              key={i}
              className={`edu-row section-card flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 ${i === 0 ? 'edu-row-odd' : 'edu-row-even'}`}
              style={{ animationDelay: active ? `${1.25 + i * 0.12}s` : undefined }}
            >
              <span className="edu-time shrink-0 whitespace-nowrap font-mono text-[13.5px] font-semibold tracking-tight text-[#F6E3B4] lg:text-[14px]">
                {tx(e.time)}
              </span>
              <span className="edu-school flex-1 whitespace-nowrap px-1 text-[13.5px] leading-[1.5] tracking-[0.01em] text-[#EDE1C4] lg:text-[14px]">
                {tx(e.school)}
              </span>
              <span className="flex shrink-0 items-center gap-x-3">
                <span className="edu-degree whitespace-nowrap text-[14px] font-semibold tracking-[0.02em] text-[#E9D5A8]">
                  {tx(e.degree)}
                </span>
                {e.gpa !== undefined && (
                  <GpaBadge value={e.gpa} active={active} delay={1.4} />
                )}
              </span>
              <span className="edu-fringe" aria-hidden="true" />
              <span className="edu-nib" aria-hidden="true">
                <svg viewBox="0 0 60 40" fill="none">
                  <path
                    d="M2 20 C 10 12, 20 7, 30 6 H56 C58 6 59 7 59 9 V31 C59 33 58 34 56 34 H30 C20 33 10 28 2 20 Z"
                    fill="currentColor"
                    stroke="#00000045"
                    strokeWidth="1.3"
                  />
                  <path d="M4 18 C 10 12, 20 8, 30 7 H56 C 50 12, 40 15, 4 18 Z" fill="#ffffff" opacity="0.45" />
                  <path d="M4 20 C 8 15, 12 12, 18 10" fill="none" stroke="#ffffff" strokeWidth="0.9" opacity="0.5" strokeLinecap="round" />
                  <path d="M4 22 C 12 27, 22 32, 32 33 H56 C 46 33, 24 27, 4 22 Z" fill="#000000" opacity="0.18" />
                  <line x1="4" y1="20" x2="30" y2="20" stroke="#00000060" strokeWidth="1.2" />
                  <circle cx="33" cy="20" r="2.3" fill="#00000030" stroke="#00000055" strokeWidth="0.8" />
                  <circle cx="32.4" cy="19.4" r="0.9" fill="#ffffff" opacity="0.5" />
                  <path d="M4 20 L 8 15 M 4 20 L 8 25" stroke="#ffffff" strokeWidth="0.7" opacity="0.35" strokeLinecap="round" />
                  <g clipPath="url(#nibClip)" opacity="0.4">
                    <line x1="14" y1="0" x2="14" y2="40" stroke="#000000" strokeWidth="0.8" />
                    <line x1="20" y1="0" x2="20" y2="40" stroke="#000000" strokeWidth="0.8" />
                    <line x1="26" y1="0" x2="26" y2="40" stroke="#000000" strokeWidth="0.8" />
                    <line x1="32" y1="0" x2="32" y2="40" stroke="#000000" strokeWidth="0.8" />
                    <line x1="38" y1="0" x2="38" y2="40" stroke="#000000" strokeWidth="0.8" />
                    <line x1="44" y1="0" x2="44" y2="40" stroke="#000000" strokeWidth="0.8" />
                    <line x1="50" y1="0" x2="50" y2="40" stroke="#000000" strokeWidth="0.8" />
                  </g>
                  <clipPath id="nibClip">
                    <path d="M2 20 C 10 12, 20 7, 30 6 H56 C58 6 59 7 59 9 V31 C59 33 58 34 56 34 H30 C20 33 10 28 2 20 Z" />
                  </clipPath>
                </svg>
              </span>
            </div>
          ))}
          <span className="edu-heart" aria-hidden="true">
            <svg viewBox="0 0 40 40" fill="none">
              <path
                d="M20 32 C 16 30, 7 25, 7 17 C 7 12, 11 8, 15 9 C 18 10, 19 12, 20 15 C 21 12, 22 10, 25 9 C 29 8, 33 12, 33 17 C 33 25, 24 30, 20 32"
                fill="none"
                stroke="#7186c9"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20 32 C 21 33, 24 31, 27 28 C 30 25, 33 22, 33 17 C 33 13, 30 9, 27 9.5 C 25 10, 22.5 12, 21 14"
                fill="none"
                stroke="#d9b45f"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        <div className="mt-3 w-full lg:mt-4">
          <p
            className={`courses-heading mb-3.5 text-[11px] font-medium uppercase tracking-[0.38em] text-[#C9A96E] ${active ? 'section-enter' : ''}`}
            style={{ animationDelay: active ? '1.5s' : undefined }}
          >
            {tx(about.courses.title)}
          </p>
          <CourseRow
            items={about.courses.items.map((c) => ({ name: tx(c.name), score: c.score }))}
            active={active}
            delay={1.55}
          />
        </div>
      </div>
    </div>
  )
}
