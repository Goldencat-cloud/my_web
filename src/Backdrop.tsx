import { useEffect, useRef } from 'react'

// 背景光晕：深浅、大小、错落、颜色四重变化 + 每颗独立呼吸节奏。
// 动画里 opacity 会在 0.45~1 之间呼吸，这里把基础 alpha 相应提高，
// 呼吸最弱时仍柔和可见、最亮时通透，不会整体变暗。
// driftDur 控制"漂移+缩放+呼吸"整套节奏，delay 为负让各光斑相位错开。
const BLOBS = [
  { top: '6%', left: '8%', size: 300, color: 'rgba(201,169,110,0.24)', dur: 22, delay: -3 },
  { top: '12%', left: '78%', size: 220, color: 'rgba(226,190,130,0.30)', dur: 18, delay: -11 },
  { top: '38%', left: '3%', size: 150, color: 'rgba(232,208,160,0.36)', dur: 16, delay: -7 },
  { top: '74%', left: '12%', size: 330, color: 'rgba(176,132,74,0.22)', dur: 26, delay: -15 },
  { top: '70%', left: '82%', size: 240, color: 'rgba(210,170,100,0.28)', dur: 20, delay: -5 },
  { top: '16%', left: '62%', size: 130, color: 'rgba(236,212,170,0.40)', dur: 15, delay: -12 },
  { top: '36%', left: '42%', size: 160, color: 'rgba(180,138,82,0.18)', dur: 19, delay: -2 },
  { top: '64%', left: '46%', size: 310, color: 'rgba(216,180,118,0.24)', dur: 24, delay: -9 },
  { top: '4%', left: '36%', size: 190, color: 'rgba(232,205,155,0.32)', dur: 17, delay: -14 },
  { top: '88%', left: '56%', size: 210, color: 'rgba(196,150,86,0.20)', dur: 21, delay: -6 },
]

function BlobBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {BLOBS.map((b, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            top: b.top,
            left: b.left,
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle at 35% 35%, ${b.color}, transparent 70%)`,
            filter: 'blur(30px)',
            // driftDur 漂移+缩放+明暗呼吸一体，负 delay 错开相位，视觉上此起彼伏
            animation: `blob-drift ${b.dur}s ease-in-out ${-b.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

// 背景金箔粒子：轻量 canvas 2D（非 WebGL），限帧 30fps，几乎零性能开销。
// 两种粒子混合：
//  - 金箔碎片：带高光渐变的小菱形，缓慢旋转着上浮，像金箔片反光
//  - 高光亮点：带十字光芒的星点，偶尔一闪，像碎金反光
function GoldenParticles() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = window.innerWidth
    let h = window.innerHeight

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const N = 64
    const parts = Array.from({ length: N }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      s: 1.4 + Math.random() * 3.2, // 尺寸（更大，更明显）
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.025, // 自转
      speed: 0.08 + Math.random() * 0.26, // 上浮速度
      sway: 0.5 + Math.random() * 1.2, // 水平摆动
      phase: Math.random() * Math.PI * 2,
      alpha: 0.4 + Math.random() * 0.45, // 基础透明度（更亮）
      twinkle: 0.5 + Math.random() * 1.6, // 闪烁速度
      sparkle: Math.random() < 0.3, // 30% 是十字高光亮点
    }))

    const FPS = 30
    const interval = 1000 / FPS
    let last = performance.now()
    let acc = 0
    let raf = 0

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      acc += now - last
      last = now
      if (acc < interval) return
      acc = 0

      const t = now * 0.001
      ctx.clearRect(0, 0, w, h)
      for (const p of parts) {
        p.y -= p.speed
        if (p.y < -14) {
          p.y = h + 14
          p.x = Math.random() * w
        }
        p.rot += p.rotSpeed
        const x = p.x + Math.sin(t * p.twinkle * 0.6 + p.phase) * p.sway * 9
        const a = p.alpha * (0.5 + 0.5 * Math.sin(t * p.twinkle + p.phase))

        if (p.sparkle) {
          // 高光亮点：十字光芒 + 亮芯
          ctx.save()
          ctx.translate(x, p.y)
          ctx.rotate(p.rot)
          const len = p.s * 5
          ctx.strokeStyle = `rgba(255, 220, 130, ${a * 0.8})`
          ctx.lineWidth = 0.7
          ctx.beginPath()
          ctx.moveTo(-len, 0)
          ctx.lineTo(len, 0)
          ctx.moveTo(0, -len)
          ctx.lineTo(0, len)
          ctx.stroke()
          ctx.fillStyle = `rgba(255, 235, 170, ${a})`
          ctx.beginPath()
          ctx.arc(0, 0, p.s * 0.6, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        } else {
          // 金箔碎片：菱形 + 高光渐变，自转飘浮
          ctx.save()
          ctx.translate(x, p.y)
          ctx.rotate(p.rot)
          const g = ctx.createLinearGradient(-p.s, -p.s, p.s, p.s)
          g.addColorStop(0, `rgba(255, 238, 175, ${a})`)
          g.addColorStop(0.5, `rgba(212, 175, 55, ${a * 1.15})`)
          g.addColorStop(1, `rgba(255, 215, 105, ${a * 0.9})`)
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.moveTo(0, -p.s)
          ctx.lineTo(p.s, 0)
          ctx.lineTo(0, p.s)
          ctx.lineTo(-p.s, 0)
          ctx.closePath()
          ctx.fill()
          ctx.restore()
        }
      }
    }
    tick(performance.now())

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 z-[5]"
    />
  )
}

// 流星：错落的几道金色流星，按不同位置、方向、亮度、节奏不时划过背景。
// 角度使用屏幕坐标（0°=向右、90°=向下），dx/dy 由 JS 预先用 cos/sin 算好，
// 动画沿角度方向斜着滑出——之前只做水平位移、只旋转条本身，导致流星"往上飞"。
const METEORS = [
  { top: '6%',  left: '56%', angle: 42,  dist: 520, len: 180, dur: 11, delay: -2.5, bright: 0.95 },
  { top: '18%', left: '24%', angle: 38,  dist: 500, len: 150, dur: 14, delay: -8,  bright: 0.75 },
  { top: '38%', left: '86%', angle: 128, dist: 480, len: 160, dur: 10, delay: -5,  bright: 0.9 },
  { top: '72%', left: '55%', angle: 124, dist: 440, len: 130, dur: 13, delay: -11, bright: 0.6 },
]

function MeteorShower() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[6] overflow-hidden">
      {METEORS.map((m, i) => {
        const rad = (m.angle * Math.PI) / 180
        const dx = Math.round(Math.cos(rad) * m.dist)
        const dy = Math.round(Math.sin(rad) * m.dist)
        return (
          <span
            key={i}
            className="meteor"
            style={{
              top: m.top,
              left: m.left,
              width: m.len,
              height: 2,
              '--m-angle': `${m.angle}deg`,
              '--m-dx': `${dx}px`,
              '--m-dy': `${dy}px`,
              '--m-bright': m.bright,
              '--m-dur': `${m.dur}s`,
              '--m-delay': `${m.delay}s`,
            } as React.CSSProperties}
          />
        )
      })}
    </div>
  )
}

// ===== 全站统一背景 =====
// 首页与 Work 页使用完全相同的背景层（暗夜鎏金 + 顶部蓝紫点缀 + 圆点 + 光晕 + 金箔粒子 + 流星）。
// 必须放在滚动容器之外渲染，避免被页面动画的 transform 捕获导致滚动后背景消失。
export default function SiteBackdrop() {
  return (
    <div className="app-bg pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* 清晰层（中间区域） */}
      <div className="app-bg-depth">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(rgba(201,169,110,0.5) 1px, transparent 1px), radial-gradient(rgba(201,169,110,0.5) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
            backgroundPosition: '0 0, 11px 11px',
            opacity: 0.14,
          }}
        />
        <BlobBackdrop />
      </div>

      {/* 上下模糊纵深层（仅上/下边缘显示虚化背景，中间透出清晰层） */}
      <div className="app-bg-depth-blur">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(rgba(201,169,110,0.5) 1px, transparent 1px), radial-gradient(rgba(201,169,110,0.5) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
            backgroundPosition: '0 0, 11px 11px',
            opacity: 0.12,
          }}
        />
        <BlobBackdrop />
      </div>

      {/* 中央焦点光晕 */}
      <div className="app-bg-glow" />

      {/* 背景微弱金色粒子（浮于光晕之上、内容之下） */}
      <GoldenParticles />

      {/* 流星（错落划过，浮于粒子之上、内容之下） */}
      <MeteorShower />
    </div>
  )
}
