import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  type MouseEvent as ReactMouseEvent,
  type WheelEvent as ReactWheelEvent,
} from 'react'
import { TechChip } from '../work/Handmade'
import '../work/ProjectsSection.css'

/* 数字着色：所有数字同色；gold=true 的成果类额外发光 */
const hi = (s: string, gold = false): ReactNode => (
  <span className={gold ? 'num-ach' : 'num-data'}>{s}</span>
)

type Stage = { key: string; label: string; en: ReactNode }
type Project = {
  id: string
  year: string
  no: string
  tab: string
  title: string
  honor: string
  time: string
  role: string
  tech: string[]
  stages: Stage[]
}

/* 文案与数字全部来自 MEMORY/personal_info.md · 03 Projects
   顺序按时间倒序（No.01 最新 → No.03 最早） */
const PROJECTS: Project[] = [
  {
    id: 'p1',
    year: '2026',
    no: '01',
    tab: 'LLM Fine-Tuning',
    title: 'Chinese Stock-Comment Sentiment Recognition with Qwen-4B & LoRA',
    honor: 'Outstanding Graduation Project',
    time: '2026.03 – 2026.04',
    role: 'Project Lead',
    tech: ['Qwen-4B', 'LoRA', 'Text Mining', 'PCA'],
    stages: [
      {
        key: 'problem',
        label: 'Problem',
        en: (
          <>
            Social-media stock comments suffer from short texts, implicit expressions,
            and mixed jargon, severely limiting sentiment recognition and creating a
            &ldquo;breakpoint&rdquo; from text to signal that struggles to serve
            quantitative investing.
          </>
        ),
      },
      {
        key: 'data',
        label: 'Data',
        en: (
          <>
            Integrated Tianchi labeled data, East Money Guba scraped data (~
            {hi('218K')} comments), and SSE 50 historical market data.
          </>
        ),
      },
      {
        key: 'solution',
        label: 'Solution',
        en: (
          <>
            Built a six-stage progressive comparison framework from traditional to
            pretrained to Qwen-4B LLMs, using Macro-F1 as the core metric to
            systematically evaluate cross-generation performance; applied LoRA
            fine-tuning for targeted optimization. The best model reached Macro-F1{' '}
            {hi('0.86', true)}, {hi('+11.7%', true)} over BERT ({hi('0.77')}), and{' '}
            {hi('0.81', true)} even zero-shot — validating efficiency and
            generalizability.
          </>
        ),
      },
      {
        key: 'validation',
        label: 'Quant Validation',
        en: (
          <>
            Using the best model to predict SSE 50 comment sentiment for 2024–2025,
            constructed {hi('20+')} proxy variables (sentiment intensity, divergence,
            etc.) and synthesized a sentiment factor via PCA. Finding: sentiment
            volatility correlates with ATR_pct at {hi('-0.89', true)}, and the put/call
            ratio leads volatility by {hi('2')} months (r={hi('0.81', true)}) —
            confirming the strong correlation and lead relationship between sentiment
            signals and market volatility.
          </>
        ),
      },
    ],
  },
  {
    id: 'p2',
    year: '2025',
    no: '02',
    tab: 'AI Agent Design',
    title: 'Hangzhou Traffic Optimization AI Agent',
    honor: 'National Grand Prize',
    time: '2025.04 – 2025.05',
    role: 'Project Lead',
    tech: ['GIS Analysis', 'LDA', 'AI Agent', 'Visualization'],
    stages: [
      {
        key: 'problem',
        label: 'Problem',
        en: (
          <>
            As a pioneer in digital governance, Hangzhou has built a traffic platform,
            yet weekday rush-hour congestion index often exceeds {hi('2.5')}, parking gap
            reaches {hi('35%')}, and public transit faces &gt;{hi('120%')} peak load and
            unreasonable intervals — traditional management is trapped in being
            &ldquo;data-rich but insight-poor.&rdquo;
          </>
        ),
      },
      {
        key: 'data',
        label: 'Data',
        en: (
          <>
            Collected {hi('326K+')} records of Hangzhou traffic congestion, accidents,
            and flow; scraped Zhihu and surveyed {hi('2,000+')} citizen-feedback entries;
            collected Hangzhou POI geo-data.
          </>
        ),
      },
      {
        key: 'solution',
        label: 'Solution',
        en: (
          <>
            Used GIS spatial analysis to identify congestion/accident hotspots and
            extract spatiotemporal features; LDA to identify citizens&rsquo; core needs;
            sentiment analysis to extract emotional features from citizen text. Wrote
            LLM prompts to convert findings into {hi('100+')} dialogue-flow datasets,
            built a status-assessment knowledge base and workflow, optimized component
            config, and tuned model performance from feedback.
          </>
        ),
      },
      {
        key: 'result',
        label: 'Result',
        en: (
          <>
            From historical traffic and complaint-text analysis, the AI agent identified{' '}
            {hi('3')} typical congestion patterns via spatiotemporal extraction; the plan
            projects {hi('+22.3%', true)} morning-peak efficiency and quantifies
            citizens&rsquo; core demands via LDA. Drew {hi('15+')} charts to visualize
            conclusions (congestion geo-heatmap, congestion-index-over-time trends,
            etc.).
          </>
        ),
      },
    ],
  },
  {
    id: 'p3',
    year: '2024',
    no: '03',
    tab: 'Predictive Modeling',
    title: 'AutoPrice · Used-Car Price Prediction',
    honor: 'National First Prize',
    time: '2024.11 – 2025.07',
    role: 'Project Lead',
    tech: ['LightGBM', 'Optuna', 'Feature Engineering', 'Regression'],
    stages: [
      {
        key: 'problem',
        label: 'Problem',
        en: (
          <>
            Traditional manual used-car appraisal averages {hi('12%')} error —{' '}
            {hi('67%')} of dealers lose &gt;¥80K/month from mispricing, and
            buyers&rsquo; decision time stretches from {hi('7')} to {hi('21')} days. A
            data-driven precise pricing model is urgently needed.
          </>
        ),
      },
      {
        key: 'data',
        label: 'Data & Features',
        en: (
          <>
            Collected {hi('150K+')} used-car records; mode imputation for categorical
            missing values, truncation for outliers, Z-score standardization and log
            transform on target to improve quality. Built {hi('28')} new features via{' '}
            {hi('5')} methods (time deltas, binning, cross features) to capture trends,
            nonlinearity, categorical info; then variance filtering, correlation
            analysis, Lasso (linear dim reduction) and Random Forest (nonlinear
            contribution) kept {hi('14')} key features.
          </>
        ),
      },
      {
        key: 'exploration',
        label: 'Exploration',
        en: (
          <>
            Drew {hi('6')} charts analyzing price drivers, brand retention, and regional
            traits; parsed how base attributes relate to price and how brand/region/age
            affect value.
          </>
        ),
      },
      {
        key: 'solution',
        label: 'Solution',
        en: (
          <>
            Compared Linear Regression, DNN, ExtraTrees, and LightGBM; used Optuna
            Bayesian optimization + cross-validation for best params; deeper analysis on
            predictive performance, generalization, and key factors.
          </>
        ),
      },
      {
        key: 'deployment',
        label: 'Deployment',
        en: (
          <>
            Designed {hi('6')} mini-program UI pages, built a working used-car pricing
            mini-program prototype, interviewed {hi('1')} used-car company, and signed{' '}
            {hi('2')} long-term LOIs with {hi('2')} Xi&rsquo;an used-car companies.
          </>
        ),
      },
      {
        key: 'result',
        label: 'Result',
        en: (
          <>
            Delivered a {hi('30K+')}-word report; LightGBM excelled — test MSE{' '}
            {hi('0.0551')}, RMSE {hi('0.2347')}, MAE {hi('0.1233')}, MAPE{' '}
            {hi('1.65%', true)}, R² {hi('0.963', true)}; MAPE shows {hi('3–6×', true)}{' '}
            better pricing accuracy vs industry average, with train/test error
            converging by {hi('1,000')} epochs and a stable learning curve (no overfit),
            proving robustness.
          </>
        ),
      },
    ],
  },
]

/* 档案卡 */
function ArchiveCard({ p }: { p: Project }) {
  const bodyRef = useRef<HTMLDivElement>(null)
  const [atBottom, setAtBottom] = useState(false)
  const onScroll = () => {
    const el = bodyRef.current
    if (!el) return
    setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 6)
  }
  // 内容变化/切卡时主动检测：不可滚动或已到底则隐藏标识（否则短卡会一直亮着）
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

      {/* 标题独占一行（尽量不换行） */}
      <h3 className="archive-title">{p.title}</h3>
      <div className="archive-meta-row">
        <p className="archive-meta">
          {p.time} · {p.role}
        </p>
      </div>
      {/* 荣誉书签：锚定在卡片右边缘的侧边书签（不漂浮） */}
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
                <p className="bd-en">{s.en}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 滚动到底部标识：内容可下滑时显示渐隐 + 跳动箭头，滚到底自动隐藏 */}
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
  const [index, setIndex] = useState(0)
  const total = PROJECTS.length
  const drag = useRef({ x: 0, on: false })
  const stageRef = useRef<HTMLDivElement>(null)
  const wheelAcc = useRef(0)
  const wheelLock = useRef(false)

  /* 循环切换 */
  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + total) % total),
    [total],
  )

  // 键盘左右切换
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

  // 滚轮切卡：仅作用在底部轨道（确定性热区），卡片内滚动只滚内容，绝不切页
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
      <div
        ref={stageRef}
        className="ps-stage"
        onPointerDown={onDown}
        onPointerUp={onUp}
        style={{ touchAction: 'pan-y' }}
      >
        {PROJECTS.map((p, i) => {
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

        {/* 箭头：卡片两侧，贴住卡槽外缘不压卡片 */}
        <button
          className="ps-arrow ps-prev"
          onClick={() => go(-1)}
          aria-label="Previous project"
        >
          ‹
        </button>
        <button className="ps-arrow ps-next" onClick={() => go(1)} aria-label="Next project">
          ›
        </button>
      </div>

      {/* 底部切换：精致轨道 + 年份标签（可点击定位） */}
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
          <span className="ps-fill" />
          <span className="ps-thumb" />
        </div>
        <div className="ps-years">
          {PROJECTS.map((p, i) => (
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
