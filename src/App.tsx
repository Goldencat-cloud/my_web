import { useRef, useState, useEffect } from 'react'
import WorkPage from './WorkPage'
import SiteBackdrop from './Backdrop'
import FlyingPet from './FlyingPet'
import { NavContactLinksRich } from './ContactWidgets'
import { EmbossDefs, VideoEffects, StarOrnaments } from './VideoEffects'

const ROUGH_FILTER_ID = 'rough-paper'

function HandwritingText({
  text,
  active,
  fontSize = '2.2cqw',
}: {
  text: string
  active: boolean
  fontSize?: number | string
}) {
  const lines = text.split('\n')
  const lineCount = lines.length
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id={ROUGH_FILTER_ID}>
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
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontFamily: '"鸿雷板书简体", "HongLeiBanShu", "STKaiti", "KaiTi", cursive',
          fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
          fill: '#E9D5A8',
          filter: active ? `url(#${ROUGH_FILTER_ID})` : 'none',
          opacity: active ? 1 : 0,
          transition: 'opacity 0.6s ease-out',
          textShadow:
            '1px 1.5px 2px rgba(0,0,0,0.65), 0 0 14px rgba(226,190,120,0.28), -0.5px -0.5px 0 rgba(255,235,190,0.35)',
        }}
      >
        {lines.map((line, i) => (
          <tspan
            key={i}
            x="50%"
            dy={`${(i - (lineCount - 1) / 2) * 1.7}em`}
          >
            {line}
          </tspan>
        ))}
      </text>
    </svg>
  )
}

type DialogStep = 0 | 1 | 2

// 两句对话牛皮纸高度都固定 75px，位置完全重合。
// 第二句只拉长宽度，文本单行，在牛皮纸内水平垂直居中。
const DIALOG_STEPS: { text: string; width: string; height: string }[] = [
  { text: 'Welcome to my website.', width: '36cqw', height: '75px' },
  { text: 'Which side of me would you like to explore?', width: '62cqw', height: '75px' },
]

function InteractiveDialog({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<DialogStep>(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1400)
    return () => clearTimeout(t)
  }, [])

  const handleClick = () => {
    if (step === 0) {
      setStep(1)
    } else if (step === 1) {
      setStep(2)
      onComplete()
    }
  }

  const current = DIALOG_STEPS[Math.min(step, DIALOG_STEPS.length - 1)]
  const show = visible && step < 2

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Continue conversation"
      className="absolute cursor-pointer"
      style={{
        top: '80%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 20,
        opacity: show ? 1 : 0,
        pointerEvents: show ? 'auto' : 'none',
        transition: 'opacity 0.5s ease-in-out',
        background: 'none',
        border: 'none',
        padding: 0,
      }}
    >
      <div
        className="relative"
        style={{
          width: current.width,
          transition: 'width 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <img
          src="/dialog.png"
          alt="Dialog bubble"
          className="w-full"
          style={{
            height: current.height,
            objectFit: 'cover',
            // 牛皮纸压暗 + 暖金调色，适配暗夜底色（降明度、保暖调与层次）
            filter:
              'sepia(0.55) brightness(0.55) saturate(1.05) contrast(1.08) drop-shadow(0 4px 10px rgba(0,0,0,0.5))',
          }}
        />
        <HandwritingText text={current.text} active fontSize="2.15cqw" />
        {/* 外层只负责定位（偏移不会被 bounce-y 动画覆盖） */}
        <span
          className="pointer-events-none absolute"
          style={{
            right: '1.6cqw',
            top: '50%',
            transform: 'translateY(calc(-50% - 0px))',
          }}
        >
          {/* 内层做上下跳动动画 */}
          <span
            className="flex items-center justify-center rounded-full"
            style={{
              width: '2.4cqw',
              height: '2.4cqw',
              minWidth: '24px',
              minHeight: '24px',
              background: 'linear-gradient(135deg, #4a3a24 0%, #37291a 100%)',
              border: '1.5px solid #C9A96E',
              boxShadow: '0 3px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
              color: '#E9D5A8',
              animation: 'bounce-y 1.1s ease-in-out infinite',
            }}
          >
            <svg
              width="58%"
              height="58%"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v12" />
              <path d="m6 13 6 6 6-6" />
            </svg>
          </span>
        </span>
      </div>
    </button>
  )
}

function PaperButton({
  text,
  onClick,
  delay,
  fontSize = '2.15cqw',
}: {
  text: string
  onClick: () => void
  delay: number
  fontSize?: number | string
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <button
      onClick={onClick}
      className="relative transition-all duration-500 ease-out hover:scale-105 active:scale-95"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        width: '13.5cqw',
        height: 'calc(13.5cqw / 3.15 + 1.8cqw)',
      }}
    >
      <img
        src="/dialog.png"
        alt={text}
        className="w-full h-full object-cover"
        style={{
          objectPosition: 'center 58%',
          filter:
            'sepia(0.55) brightness(0.55) saturate(1.05) contrast(1.08) drop-shadow(0 4px 10px rgba(0,0,0,0.5))',
        }}
      />
      <span
        className="absolute inset-0 flex items-center justify-center"
        style={{
          fontFamily: '"鸿雷板书简体", "HongLeiBanShu", "STKaiti", "KaiTi", cursive',
          fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
          color: '#F2E0B8',
          textShadow: '1px 1px 2px rgba(0,0,0,0.7), 0 0 10px rgba(226,190,120,0.25)',
          transform: 'translate(1px, -2px)',
        }}
      >
        {text}
      </span>
    </button>
  )
}

function FloatingTag({
  text,
  position,
  rotate = '-8deg',
}: {
  text: string
  position: 'top-right' | 'left-bottom' | 'right-bottom'
  rotate?: string
}) {
  const placements: Record<typeof position, React.CSSProperties> = {
    'top-right': { top: '12%', right: '4%' },
    'left-bottom': { left: '5%', bottom: '20%' },
    'right-bottom': { right: '4%', bottom: '24%' },
  }
  return (
    <div
      className="pointer-events-none absolute hidden select-none lg:block"
      style={{
        ...placements[position],
        zIndex: 5,
        animation: 'floaty 5s ease-in-out infinite',
      }}
    >
      <div
        style={{
          fontFamily: '"鸿雷板书简体", "HongLeiBanShu", "STKaiti", "KaiTi", cursive',
          color: '#E9D5A8',
          background: 'linear-gradient(135deg, rgba(58,44,26,0.92), rgba(40,30,18,0.92))',
          border: '1.5px solid rgba(201,169,110,0.55)',
          boxShadow: '0 6px 18px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.08)',
          padding: '0.35em 0.9em',
          fontSize: '13px',
          letterSpacing: '0.06em',
          whiteSpace: 'nowrap',
          transform: `rotate(${rotate})`,
        }}
      >
        {text}
      </div>
    </div>
  )
}

/**
 * 弹力绳吊牌：吊牌位置固定，绳子可随拖拽拉长/缩短（有最大拉长限度），
 * 松手后绳子弹性回弹到原长。静止时吊牌随绳子自然摆动。
 */
function DraggableBadge() {
  const dragging = useRef(false)
  const grabOffset = useRef({ x: 0, y: 0 })
  // 吊牌相对锚点（容器顶部中心）的位移：x/y 支持任意方向斜拉
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [grabbing, setGrabbing] = useState(false)
  // 回弹动画进行中：逐帧更新 offset，绳长/角度与吊牌位移由同一 offset 派生，天然同步
  const [animating, setAnimating] = useState(false)
  const animRef = useRef<number | null>(null)
  const MAX = 150 // 最大拉长限度（px）
  // 静止绳长：吊牌左上角相对锚点（容器顶部中心）的下沉量（锚点落在视频顶边）
  const REST = 72

  useEffect(
    () => () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current)
    },
    [],
  )

  // 回弹缓动：轻微过冲（easeOutBack），让绳子带一点弹性再停稳
  const springEase = (t: number) => {
    const c1 = 1.2
    const c3 = c1 + 1
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
  }

  const animateBack = (from: { x: number; y: number }) => {
    if (animRef.current !== null) cancelAnimationFrame(animRef.current)
    setAnimating(true)
    const start = performance.now()
    const dur = 550
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1)
      const k = springEase(t)
      // k 从 0→1 并轻微越过 1 再回落，位移相应轻微过冲后归零
      setOffset({ x: from.x * (1 - k), y: from.y * (1 - k) })
      if (t < 1) {
        animRef.current = requestAnimationFrame(tick)
      } else {
        animRef.current = null
        setAnimating(false)
      }
    }
    animRef.current = requestAnimationFrame(tick)
  }

  const handleDown = (e: React.PointerEvent) => {
    dragging.current = true
    setGrabbing(true)
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    // 记录抓取起点，位移从该点起算
    grabOffset.current = { x: e.clientX, y: e.clientY }
  }

  const handleMove = (e: React.PointerEvent) => {
    if (!dragging.current) return
    // 任意方向斜拉：拉长量 = 鼠标相对按下点的位移长度（封顶 MAX），方向 = 鼠标方向
    const dx = e.clientX - grabOffset.current.x
    const dy = e.clientY - grabOffset.current.y
    const len = Math.hypot(dx, dy)
    if (len < 0.5) {
      setOffset({ x: 0, y: 0 })
      return
    }
    const clamped = Math.min(len, MAX)
    setOffset({ x: (dx / len) * clamped, y: (dy / len) * clamped })
  }

  const handleUp = () => {
    if (!dragging.current) return
    dragging.current = false
    setGrabbing(false)
    // 由 JS 逐帧回弹：绳长/角度与吊牌位移同步推进，不会出现绳端脱离吊牌
    animateBack(offset)
  }

  // 绳子总长 = 锚点（容器顶部中心）到吊牌中心的距离，保证绳端始终精确接在吊牌中心。
  // 角度：屏幕坐标 y 向下、CSS rotate 正值为顺时针，垂直向下的绳子顺时针转反而左偏，
  // 因此取 atan2 的负值，让绳子朝拉拽方向倾斜（与吊牌位移方向一致）。
  const ropeLen = Math.hypot(offset.x, REST + offset.y)
  const ropeAngle = (-Math.atan2(offset.x, REST + offset.y) * 180) / Math.PI

  return (
    <div
      className="draggable-badge absolute select-none"
      style={{
        top: 0,
        // 吊牌挂在视频顶部左缘，主体向左探出视频左边框约一半，
        // 探出部分在视频容器外可见（吊牌挂在 .video-frame 之外，不受 overflow 裁剪）
        // +24px 让吊牌整体稍微往右靠一点（探出量略减）
        left: 'calc(-1 * min(90px, 14vw) + 24px)',
        zIndex: 10,
        cursor: grabbing ? 'grabbing' : 'grab',
        touchAction: 'none',
      }}
    >
      {/* 绳子：顶端固定在容器顶部中心，斜拉时沿拉拽方向旋转倾斜，顶端始终不动 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          width: '0.5%',
          minWidth: '3px',
          height: ropeLen,
          transform: `translateX(-50%) rotate(${ropeAngle}deg)`,
          transformOrigin: 'top center',
          background:
            'linear-gradient(to bottom, #6b5130, #544024 60%, #6b5130)',
          boxShadow: '1px 0 2px rgba(0,0,0,0.55)',
          borderRadius: '2px',
        }}
      />

      {/* 拖拽层：吊牌保持 in-flow（容器宽度 = 吊牌宽度，锚点 = 视频顶边左缘），
          斜移时吊牌相对锚点位移，绳子顶端不动 */}
      <div
        style={{
          transform: `translate(${offset.x}px, ${REST + offset.y}px)`,
          willChange: 'transform',
        }}
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
      >
        {/* 吊牌主体：3D 立体（静止时随绳摆动） */}
        <div
          className="relative"
          style={{
            filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.6))',
            transformOrigin: 'top center',
            animation:
              grabbing || animating
                ? 'none'
                : 'badge-swing 3.2s ease-in-out infinite',
          }}
        >
          {/* 顶部厚度 */}
          <div className="badge-top" />
          {/* 底面厚度 */}
          <div className="badge-bottom" />
          {/* 正面 */}
          <div
            style={{
              position: 'relative',
              background:
                'linear-gradient(165deg, #3c2e1c 0%, #2f2415 45%, #271d11 100%)',
              border: '2px solid rgba(201,169,110,0.6)',
              padding: '3% 4.5%',
              boxShadow:
                'inset 0 2px 3px rgba(255,255,255,0.08), inset 0 -5px 10px rgba(0,0,0,0.55), 0 4px 8px rgba(0,0,0,0.45)',
            }}
          >
            {/* 圆环 */}
            <div
              className="badge-ring"
              style={{
                position: 'absolute',
                top: '-13px',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            />
            <div
              style={{
                fontFamily:
                  '"鸿雷板书简体", "HongLeiBanShu", "STKaiti", "KaiTi", cursive',
                fontSize: 'clamp(16px, 2vw, 30px)',
                color: '#F2E0B8',
                letterSpacing: '0.08em',
                lineHeight: '1.1',
                whiteSpace: 'nowrap',
                textShadow: '1px 1px 2px rgba(0,0,0,0.65), 0 0 12px rgba(226,190,120,0.22)',
              }}
            >
              Zhihan Zhang
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SideLettering() {
  return (
    <div
      className="pointer-events-none absolute hidden select-none md:block"
      style={{ right: '3%', top: '50%', transform: 'translateY(-50%)', zIndex: 4 }}
    >
      <p
        style={{
          writingMode: 'vertical-rl',
          fontFamily: '"鸿雷板书简体", "HongLeiBanShu", "STKaiti", "KaiTi", cursive',
          fontSize: 'clamp(16px, 1.6vw, 24px)',
          color: '#C9A96E',
          opacity: 0.45,
          letterSpacing: '0.4em',
          whiteSpace: 'nowrap',
          textShadow: '0 0 12px rgba(226,190,120,0.25)',
        }}
      >
        Work · Life · Growth
      </p>
    </div>
  )
}

function HeroTitle() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 z-30 flex flex-col items-center text-center"
      style={{
        top: 'clamp(64px, 8%, 104px)',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <h1
        className="home-fade-up whitespace-nowrap bg-gradient-to-br from-[#F2E0B8] via-[#E0C188] to-[#B8915A] bg-clip-text text-[clamp(28px,4.8vw,58px)] font-semibold leading-[1.05] text-transparent"
        style={{ animationDelay: '0.35s' }}
      >
        Hi, I'm Zhihan
      </h1>
      <div
        className="home-fade-up mt-1.5 h-px w-14 rounded-full"
        style={{
          animationDelay: '0.6s',
          background: 'linear-gradient(90deg, transparent, rgba(226,193,130,0.85), transparent)',
        }}
      />
      <p
        className="home-fade-up mt-2 whitespace-nowrap text-[15px] text-[#C9B48D]"
        style={{ animationDelay: '0.7s' }}
      >
        A curious soul collecting stories across work, life and growth.
      </p>
    </div>
  )
}

// 门帘转场：多段金黑渐变竖帘。进入新页面时各段从底部逐条涌上覆盖，
// 返回时各段从顶部逐条反向收走（stagger 顺序由 open 方向决定）。
const CURTAIN_STRIPS = 6
function CurtainOverlay({ open }: { open: boolean }) {
  return (
    <div className={`curtain ${open ? 'curtain-open' : 'curtain-idle'}`}>
      {Array.from({ length: CURTAIN_STRIPS }, (_, i) => {
        // 覆盖方向：自下而上逐条涌上（delay 递增）；揭开方向：自上而下逐条收走（delay 反向）
        const delay = open
          ? i * 0.035
          : (CURTAIN_STRIPS - 1 - i) * 0.035
        return (
          <div
            key={i}
            className="curtain-strip"
            style={{ transitionDelay: `${delay}s` }}
          />
        )
      })}
    </div>
  )
}

function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  // 视频自动恢复：浏览器会在切后台/省电模式、解码缓冲、StrictMode 双挂载等情况下
  // 让背景视频停播或卡住，这里监听相关事件并自动恢复播放，保证视频持续运转
  useEffect(() => {
    const v = videoRef.current
    if (!v) return

    let stallTimer: number | null = null
    let retries = 0

    const clearStall = () => {
      if (stallTimer !== null) {
        window.clearTimeout(stallTimer)
        stallTimer = null
      }
    }
    const resume = () => {
      if (v.paused && !v.ended) {
        v.play().catch(() => {})
      }
    }
    // 缓冲/解码卡住时：先做轻量续播，避免 v.load() 清空画面造成黑白闪烁。
    // 仅当确实"卡死"（2s 内时间无进展、且缓冲数据不足）才整段重载。
    const onStall = () => {
      if (stallTimer !== null) return
      const t0 = v.currentTime
      stallTimer = window.setTimeout(() => {
        stallTimer = null
        retries += 1
        if (retries > 6) return
        const stuck = v.currentTime === t0 && v.readyState < 3 && v.paused
        if (stuck) {
          v.load()
          v.play().catch(() => {})
        } else {
          // 仅续播，不重载：画面保持，不会闪黑
          v.play().catch(() => {})
        }
      }, 2000)
    }
    const onPlaying = () => {
      clearStall()
      retries = 0
    }
    // 加载失败自动重试（退避递增，最多 6 次）
    const onError = () => {
      retries += 1
      if (retries > 6) return
      window.setTimeout(() => {
        v.load()
        v.play().catch(() => {})
      }, 300 * retries)
    }
    // 从后台/其他标签页切回时恢复播放
    const onVisible = () => {
      if (!document.hidden) resume()
    }

    v.addEventListener('waiting', onStall)
    v.addEventListener('stalled', onStall)
    v.addEventListener('playing', onPlaying)
    v.addEventListener('error', onError)
    document.addEventListener('visibilitychange', onVisible)

    // 兜底：挂载后确保开始播放（处理 StrictMode 双挂载/自动播放被拦截）
    const boot = window.setTimeout(resume, 120)

    return () => {
      clearStall()
      window.clearTimeout(boot)
      v.removeEventListener('waiting', onStall)
      v.removeEventListener('stalled', onStall)
      v.removeEventListener('playing', onPlaying)
      v.removeEventListener('error', onError)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  const [showButtons, setShowButtons] = useState(false)
  const [view, setView] = useState<'home' | 'work'>('home')
  // 每次回到首页时 +1，作为交互对话的 key 强制重建，清除残留的对话框与按钮
  const [homeVisit, setHomeVisit] = useState(0)
  // 门帘转场：多段金黑渐变竖帘逐条覆盖（最长 delay 0.175s + 段位移 0.28s ≈ 0.46s）
  const [curtainOpen, setCurtainOpen] = useState(false)
  const curtainTimer = useRef<number | null>(null)

  const navigate = (to: 'home' | 'work') => {
    if (to === view || curtainOpen) return
    setCurtainOpen(true)
    // 等竖帘全部覆盖到位后再切换视图
    window.setTimeout(() => {
      setView(to)
    }, 460)
    // 新页面短暂亮相后，竖帘逐条收走揭开
    curtainTimer.current = window.setTimeout(() => {
      setCurtainOpen(false)
    }, 600)
  }

  const goWork = () => navigate('work')

  const goHome = () => {
    setShowButtons(false)
    setHomeVisit((v) => v + 1)
    navigate('home')
  }

  if (view === 'work') {
    return (
      <>
        <CurtainOverlay open={curtainOpen} />
        <WorkPage onBackHome={goHome} />
      </>
    )
  }

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ touchAction: 'none' }}
    >
      <CurtainOverlay open={curtainOpen} />
      {/* 全站统一背景（暗夜鎏金 + 光晕 + 金箔粒子） */}
      <SiteBackdrop />
      {/* SVG 浮雕滤镜定义（作用于视频） */}
      <EmbossDefs />

      {/* 顶部品牌导航条：深色毛玻璃，与主体明显分层 */}
      <header
        className="glass-bar absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-4 md:px-10"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <div className="flex items-baseline gap-2">
          <span className="text-base font-semibold text-[#F2E7CD]">
            Zhihan Zhang
          </span>
          <span className="hidden text-[11px] uppercase tracking-[0.22em] text-[#C9B48D] sm:inline">
            Personal Website
          </span>
        </div>
        {/* 居中欢迎语：收进导航栏，释放正文空间 */}
        <span
          className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 text-[11px] uppercase tracking-[0.32em] text-[#C9B48D]/85 lg:block"
        >
          Welcome to my corner of the internet
        </span>
        <div className="flex items-center gap-2.5">
          {/* 常驻联系入口：与 Work 页一致的胶囊按钮，点击复制 */}
          <NavContactLinksRich />
          <span
            className="rounded-full border border-[#C9A96E]/40 bg-[#241a10]/70 px-4 py-1.5 text-xs font-medium tracking-wide text-[#E9D5A8] backdrop-blur-md"
          >
            Home
          </span>
        </div>
      </header>

      {/* 主标题 */}
      <HeroTitle />

      {/* 中央视频卡片（悬浮立体） */}
      <div
        className="video-wrap absolute"
        style={{
          zIndex: 10,
          left: '50%',
          top: 'calc(min(54%, 560px) - 20px)',
          transform: 'translate(-50%, -50%)',
          width: 'min(70vw, 1120px)',
          height: 'min(56vh, 620px)',
          containerType: 'inline-size',
        }}
      >
        {/* 离地椭圆投影 */}
        <div className="video-shadow" />

        {/* 底部立体星星挂饰（帧外，与视频悬浮联动） */}
        <StarOrnaments />

        {/* 会飞的小精灵 / IP 形象（围绕视频飞行，可与鼠标互动） */}
        {/* 换上你的形象：把图片放到 public/ 后改 src，例如 src="/my-pet.png" */}
        <FlyingPet src="/pet.png" size={64} />

        <div
          className="video-frame absolute inset-0"
          style={{
            borderRadius: '24px',
            overflow: 'hidden',
            background: '#000',
            animation: 'video-card-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) backwards',
            animationDelay: '0.35s',
          }}
        >
        <video
          ref={videoRef}
          src="/home_video.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: 'url(#video-emboss) contrast(1.03) saturate(1.08) brightness(0.98)',
          }}
        />

        {/* 顶部/底部细描边氛围条 */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent" />

        {/* 质感层：柔光 → 星空 → 划痕 → 胶片颗粒 */}
        <VideoEffects />

        {/* 点击驱动的交互对话（key 变化时重建，回到初始状态） */}
        {/* 按钮出现后对话框直接卸载，保证与两个牛皮纸按钮严格互斥，不会同时出现三个 */}
        {!showButtons && (
          <InteractiveDialog key={homeVisit} onComplete={() => setShowButtons(true)} />
        )}

        {/* 牛皮纸按钮：生活 / 工作 */}
        {showButtons && (
          <div
            className="absolute flex"
            style={{
              top: '80%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 20,
              gap: '7.4cqw',
            }}
          >
            <PaperButton text="Life" onClick={() => {}} delay={0} fontSize="2.15cqw" />
            <PaperButton text="Work" onClick={goWork} delay={200} fontSize="2.15cqw" />
          </div>
        )}
        </div>

        {/* 吊牌 - 挂在视频顶边左缘，像星星一样在视频容器外可见（不受 overflow 裁剪），可任意方向拉伸 */}
        <DraggableBadge />
      </div>

      {/* 装饰：竖排文字 / 贴纸 */}
      <FloatingTag text="Handcrafted" position="top-right" rotate="-6deg" />
      <FloatingTag text="Personal Portfolio" position="left-bottom" rotate="4deg" />
      <FloatingTag text="Est. 2024" position="right-bottom" rotate="-5deg" />
      <SideLettering />

      {/* 底部页脚 */}
      <footer
        className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-center gap-2 pb-5 pt-2 text-[11px] uppercase tracking-[0.18em] text-[#8F7E63]"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <span className="home-fade-up h-px w-10 bg-gradient-to-r from-transparent to-[#C9A96E]/40" style={{ animationDelay: '1s' }} />
        <span className="home-fade-up" style={{ animationDelay: '1s' }}>
          Scroll into my world
        </span>
        <span className="home-fade-up h-px w-10 bg-gradient-to-l from-transparent to-[#C9A96E]/40" style={{ animationDelay: '1s' }} />
      </footer>
    </div>
  )
}

export default App
