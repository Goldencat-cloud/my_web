import { useEffect, useState } from 'react'
import { Handwriting, StatBadge } from './Handmade'
import SectionHeader from './SectionHeader'
import { useLang } from '../i18n/LanguageContext'
import { useResumeData } from '../data/useResumeData'
import { LT } from '../components/LT'
import { RichText } from '../components/RichText'
import './InternshipSection.css'

export default function InternshipSection({ active }: { active: boolean }) {
  const { tx } = useLang()
  const data = useResumeData()
  const intern = data.internship
  const acts = intern.acts

  const [activeIdx, setActiveIdx] = useState(0)
  const [typed, setTyped] = useState('')

  const lastIdx = acts.length - 1
  const current = acts[activeIdx]

  useEffect(() => {
    setTyped('')
    const full = current.file
    if (!active) return
    let i = 0
    const timer = setInterval(() => {
      i += 1
      setTyped(full.slice(0, i))
      if (i >= full.length) clearInterval(timer)
    }, 55)
    return () => clearInterval(timer)
  }, [active, activeIdx, current.file])

  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      if (e.key === 'ArrowRight') setActiveIdx((p) => Math.min(p + 1, lastIdx))
      else if (e.key === 'ArrowLeft') setActiveIdx((p) => Math.max(p - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, lastIdx])

  useEffect(() => {
    if (!active || activeIdx >= lastIdx) return
    const onWheel = (e: WheelEvent) => {
      const root = document.querySelector('.internship-window') as HTMLElement | null
      if (!root) return
      const rect = root.getBoundingClientRect()
      const vh = window.innerHeight
      const centerDist = Math.abs((rect.top + rect.bottom) / 2 - vh / 2)
      if (centerDist > vh * 0.4) return
      if (Math.abs(e.deltaY) < 8) return
      e.preventDefault()
      if (e.deltaY > 0) setActiveIdx((p) => Math.min(p + 1, lastIdx))
      else if (e.deltaY < 0) setActiveIdx((p) => Math.max(p - 1, 0))
    }
    document.addEventListener('wheel', onWheel, { passive: false })
    return () => document.removeEventListener('wheel', onWheel)
  }, [active, activeIdx, lastIdx])

  const bodyText = tx(current.body) ?? ''

  return (
    <div className="internship-stage">
      <SectionHeader
        className="internship-head"
        index="02"
        title={intern.header.title}
        subtitle={intern.header.subtitle}
        active={active}
      />

      <div className={`internship-window ${active ? 'is-active' : ''}`}>
        <div className="iw-company">
          <span className="co-name">
            <Handwriting active={active} fontSize="clamp(21px, 1.5vw, 26px)" color="#e9d5a8" shadow="0 1px 2px rgba(0,0,0,0.6), 0 0 14px rgba(226,190,120,0.3)">
              {tx(intern.company)}
            </Handwriting>
          </span>
          <span className="co-sep" aria-hidden>
            <svg viewBox="0 0 8 8" width="7" height="7" fill="none">
              <circle cx="4" cy="4" r="2.1" fill="#d8b26a" />
            </svg>
          </span>
          <span className="co-item">
            <LT value={intern.department} />
          </span>
          <span className="co-sep co-sep-dot" aria-hidden />
          <span className="co-item co-role">
            <LT value={intern.role} />
          </span>
          <span className="co-sep co-sep-dot" aria-hidden />
          <span className="co-item co-date">
            <LT value={intern.period} />
          </span>
        </div>

        <header className="win-bar">
          <div className="win-dots" aria-hidden>
            <span className="dot dot-1" />
            <span className="dot dot-2" />
            <span className="dot dot-3" />
          </div>
          <div className="win-path">
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M2 4.5C2 3.4 2.9 2.5 4 2.5h5.6c.4 0 .8.2 1.1.5L13 5.3c.3.3.5.7.5 1.1V12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V4.5z" stroke="currentColor" strokeWidth="1.1" fill="none" />
              <path d="M10.5 2.7V5.5h2.7" stroke="currentColor" strokeWidth="1.1" fill="none" />
            </svg>
            <span className="win-path-folder">my_web</span>
            <span className="win-path-slash">/</span>
            <span className="win-path-folder">internship_log</span>
            <span className="win-path-slash">/</span>
            <span className="win-path-file">{current.file}</span>
          </div>
          <button className="win-close" type="button" aria-label="Close window" title="Close">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div className="win-body">
          <nav className="win-activity" aria-label="Activity bar">
            <button className="act-btn is-active" aria-label="Explorer" title="Explorer (⌘⇧E)">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M3 6.5C3 5.4 3.9 4.5 5 4.5h4l2 2h8c1.1 0 2 .9 2 2V18c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V6.5z" stroke="currentColor" strokeWidth="1.3" fill="none" />
              </svg>
            </button>
            <button className="act-btn" aria-label="Search" title="Search (⌘⇧F)">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="10.5" cy="10.5" r="6" stroke="currentColor" strokeWidth="1.5" />
                <path d="m20 20-4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <button className="act-btn" aria-label="Source Control" title="Source Control (⌘⇧G)">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 4v6c0 2.2 1.8 4 4 4h4c2.2 0 4 1.8 4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="6" cy="4" r="1.5" fill="currentColor" />
                <circle cx="18" cy="20" r="1.5" fill="currentColor" />
                <path d="M6 10v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="act-badge" aria-hidden>{acts.length}</span>
            </button>
            <button className="act-btn" aria-label="Run and Debug" title="Run and Debug (⌘⇧D)">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 5l14 7-14 7V5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
              </svg>
            </button>
            <button className="act-btn" aria-label="Extensions" title="Extensions (⌘⇧X)">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="3" y="9" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <rect x="13" y="3" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <rect x="13" y="15" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <path d="M19 3v6M3 9h6" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </nav>

          <aside className="win-files" aria-label="Log files">
            <div className="files-section">
              <div className="files-section-head" aria-hidden>
                <span className="files-chevron">
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                    <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </span>
                <span className="files-section-title">BYTEDANCE</span>
                <span className="files-section-actions">
                  <span className="files-section-dot" />
                  <span className="files-section-dot" />
                  <span className="files-section-dot" />
                </span>
              </div>
              <div className="files-section-folder" aria-hidden>
                <span className="files-chevron files-chevron-down">
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                    <path d="M2 3.5L5 7l3-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </span>
                <span className="files-folder-name">internship_log</span>
              </div>
              {acts.map((act, i) => (
                <button
                  key={act.no}
                  className={`file-row ${activeIdx === i ? 'is-active' : ''}`}
                  onClick={() => setActiveIdx(i)}
                  aria-current={activeIdx === i ? 'true' : undefined}
                  aria-label={`Log ${act.no} · ${act.file}`}
                >
                  <span className="file-row-indent" aria-hidden>
                    <span className="indent-line" />
                  </span>
                  <span className="file-row-icon" aria-hidden>
                    <svg width="11" height="13" viewBox="0 0 11 13" fill="none" aria-hidden>
                      <path d="M1 1h6l3 3v8H1z" stroke="currentColor" strokeWidth="1.2" fill={i % 2 === 0 ? 'rgba(255,255,255,0.18)' : 'none'} />
                    </svg>
                  </span>
                  <span className="file-row-name">{act.file}</span>
                  {activeIdx === i && <span className="file-row-close" aria-hidden>×</span>}
                </button>
              ))}
            </div>
          </aside>

          <section className="win-content">
            <article key={activeIdx} className="win-editor">
              <div className="editor-body">
                <div className="editor-gutter" aria-hidden>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <span key={i} className="gutter-line">{i + 1}</span>
                  ))}
                </div>
                <div className="editor-content">
                  <div className="editor-title">
                    <span className="editor-no">{current.no}</span>
                    <Handwriting active={active} fontSize="clamp(24px, 2.3vw, 32px)" color="#e9d5a8" shadow="0 1px 2px rgba(0,0,0,0.6), 0 0 12px rgba(216,178,106,0.28)">
                      {tx(current.title)}
                    </Handwriting>
                  </div>

                  <div className="editor-divider editor-divider-short" aria-hidden />

                  <div className="editor-stats">
                    {current.stats.map((s, si) => (
                      <StatBadge
                        key={s.label.en}
                        value={s.value}
                        label={tx(s.label) ?? ''}
                        active={active}
                        delay={0.1 + si * 0.06}
                      />
                    ))}
                  </div>

                  <p className="editor-text">
                    <RichText text={bodyText} />
                  </p>
                </div>
              </div>
            </article>

            <div className="editor-terminal" aria-hidden>
              <div className="term-tabs">
                <div className="term-tab is-active">
                  <span className="term-header-icon" aria-hidden>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path d="M1 3.5L6 8L1 12.5M7 13H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="term-header-title">TERMINAL</span>
                  <span className="term-header-close" aria-hidden>×</span>
                </div>
                <div className="term-tab term-tab-inactive">
                  <span className="term-header-icon" aria-hidden>
                    <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" fill="none" />
                      <path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span className="term-header-title">PROBLEMS</span>
                  <span className="term-tab-count">0</span>
                </div>
                <div className="term-tab term-tab-inactive">
                  <span className="term-header-icon" aria-hidden>
                    <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                      <rect x="2" y="3" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.4" fill="none" />
                      <path d="M5 6h6M5 9h6M5 12h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span className="term-header-title">OUTPUT</span>
                </div>
                <div className="term-tab term-tab-inactive">
                  <span className="term-header-icon" aria-hidden>
                    <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                      <path d="M3 2l4 6-4 6M8 12h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </span>
                  <span className="term-header-title">DEBUG CONSOLE</span>
                </div>
                <div className="term-tabs-spacer" />
                <span className="term-tabs-action" title="Split terminal">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <rect x="1" y="3" width="10" height="6" rx="1" stroke="currentColor" strokeWidth="1" fill="none" />
                    <path d="M6 3v6" stroke="currentColor" strokeWidth="1" />
                  </svg>
                </span>
                <span className="term-tabs-action" title="Kill terminal">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <rect x="2" y="2" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none" />
                  </svg>
                </span>
                <span className="term-tabs-action" title="More">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <circle cx="2" cy="6" r="0.9" fill="currentColor" />
                    <circle cx="6" cy="6" r="0.9" fill="currentColor" />
                    <circle cx="10" cy="6" r="0.9" fill="currentColor" />
                  </svg>
                </span>
              </div>
              <div className="term-line">
                <span className="term-prompt">❯</span>
                <span className="term-cmd">
                  <span className="term-cmd-static">python&nbsp;</span>
                  <span className="term-cmd-file">{typed}<i className="term-cursor" /></span>
                </span>
                <span className="term-status">
                  <span className="term-dot" />
                  RUNNING
                </span>
              </div>
            </div>
          </section>
        </div>

        <footer className="win-foot">
          <div className="win-foot-left">
            <span className="foot-seg foot-branch" title="Current branch">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M3 1v6.5a2 2 0 0 0 2 2h2a2 2 0 0 1 2 2V12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                <circle cx="3" cy="1" r="1" fill="currentColor" />
                <circle cx="3" cy="8" r="1" fill="currentColor" />
                <circle cx="9" cy="12" r="1" fill="currentColor" />
              </svg>
              main
            </span>
            <span className="foot-sep" />
            <span className="foot-seg foot-sync" title="Synchronized">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
                <circle cx="3" cy="6" r="1.5" fill="currentColor" />
                <circle cx="9" cy="6" r="1.5" fill="currentColor" />
                <path d="M4.5 6h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              0↓ 0↑
            </span>
            <span className="foot-seg foot-err" title="No errors">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" fill="none" />
                <path d="M6 3.5v3M6 8v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              0
            </span>
            <span className="foot-seg foot-warn" title="No warnings">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M6 1.5L11 10H1L6 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" fill="none" />
                <path d="M6 5v2.5M6 8.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              0
            </span>
          </div>
          <div className="win-foot-mid">
            <span className="foot-marker">
              {acts.map((act, i) => (
                <span key={act.no} className={`foot-marker-dot ${activeIdx === i ? 'is-active' : ''}`} aria-hidden />
              ))}
            </span>
            <span className="foot-hint">
              <kbd>←</kbd>
              <kbd>→</kbd>
              to switch
            </span>
          </div>
          <div className="win-foot-right">
            <span className="foot-seg foot-pos" title="Cursor position">Ln {activeIdx + 1}, Col 1</span>
            <span className="foot-sep" />
            <span className="foot-seg foot-indent" title="Spaces: 4">Spaces: 4</span>
            <span className="foot-sep" />
            <span className="foot-seg foot-enc">UTF-8</span>
            <span className="foot-sep" />
            <span className="foot-seg foot-eol">LF</span>
            <span className="foot-sep" />
            <span className="foot-seg foot-lang" title="Language">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M4 2L1 6l3 4M8 2l3 4-3 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
              Python
            </span>
            <span className="foot-sep" />
            <span className="foot-seg foot-bell" title="No notifications">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M3 8c-.6 0-1-.4-1-1 0-1.7 1.3-3 3-3s3 1.3 3 3c0 .6-.4 1-1 1H3zM5 9.5v.5a1 1 0 0 0 2 0V10" stroke="currentColor" strokeWidth="1.1" fill="none" />
              </svg>
            </span>
          </div>
        </footer>
      </div>
    </div>
  )
}
