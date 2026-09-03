import { useEffect, useRef } from 'react'

// ===== 1. SVG 浮雕滤镜 =====
// 基于 feSpecularLighting（左上主光产生暖色高光）+ feDiffuseLighting（右下副光压出暗部），
// 对视频每一帧做真实的光照计算：画面高对比边缘呈现雕刻凸起/凹陷感，随画面内容自然变化。
// 最后用 feColorMatrix 强制 alpha=1，保证视频始终不透明、不露底。
export function EmbossDefs() {
  return (
    <svg
      width="0"
      height="0"
      className="absolute"
      style={{ position: 'absolute' }}
      aria-hidden
      focusable="false"
    >
      <defs>
        <filter id="video-emboss" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.1" result="soft" />
          {/* 左上暖光 → 雕刻高光 */}
          <feSpecularLighting
            in="soft"
            surfaceScale="2.4"
            specularConstant="0.55"
            specularExponent="15"
            lighting-color="#ffe9b8"
            result="spec"
          >
            <fePointLight x="-260" y="-170" z="260" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceAlpha" operator="in" result="specm" />
          {/* 右下深色副光 → 凹陷暗部 */}
          <feDiffuseLighting
            in="soft"
            surfaceScale="1.4"
            diffuseConstant="0.55"
            lighting-color="#0d0804"
            result="diff"
          >
            <fePointLight x="300" y="220" z="240" />
          </feDiffuseLighting>
          <feComposite in="diff" in2="SourceAlpha" operator="in" result="diffm" />
          {/* 原画 + 40% 高光 - 18% 阴影 */}
          <feComposite
            in="SourceGraphic"
            in2="specm"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="0.4"
            k4="0"
            result="lit"
          />
          <feComposite
            in="lit"
            in2="diffm"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="-0.18"
            k4="0"
            result="relief"
          />
          {/* 强制 alpha = 1 */}
          <feColorMatrix
            in="relief"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0 1"
            result="final"
          />
        </filter>
      </defs>
    </svg>
  )
}

// ===== 2. 星空层：稀疏、随机、大小不均匀、明暗柔和、多层光点 + 微闪 =====
// 覆盖在视频上方，mix-blend: screen 只提亮不压暗，向星空质感靠拢。
function StarfieldLayer() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const parent = canvas.parentElement
    let w = 0
    let h = 0
    let stars: {
      x: number
      y: number
      s: number
      base: number
      tw: number
      ph: number
      halo: boolean
    }[] = []

    const make = () => {
      const N = Math.max(52, Math.round((w * h) / 8800))
      stars = Array.from({ length: N }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        // 不均匀分布：多数是细小微点，少数较大亮点
        s: 0.5 + Math.pow(Math.random(), 2.4) * 2.1,
        base: 0.1 + Math.random() * 0.32,
        tw: 0.35 + Math.random() * 1.7,
        ph: Math.random() * Math.PI * 2,
        halo: Math.random() < 0.22, // 少量带柔和光晕，增加层次
      }))
    }

    const resize = () => {
      const r = parent?.getBoundingClientRect()
      w = r?.width ?? window.innerWidth
      h = r?.height ?? window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      make()
    }
    resize()

    const FPS = 30
    let raf = 0
    let last = performance.now()
    let acc = 0
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      acc += now - last
      last = now
      if (acc < 1000 / FPS) return
      acc = 0
      const t = now * 0.001
      ctx.clearRect(0, 0, w, h)
      for (const st of stars) {
        // 柔和闪烁：明暗过渡平滑，无硬闪
        const a = st.base * (0.5 + 0.5 * Math.sin(t * st.tw + st.ph))
        if (st.halo) {
          const g = ctx.createRadialGradient(st.x, st.y, 0, st.x, st.y, st.s * 8)
          g.addColorStop(0, `rgba(255, 244, 214, ${a * 0.5})`)
          g.addColorStop(1, 'rgba(255, 244, 214, 0)')
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(st.x, st.y, st.s * 8, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.fillStyle = `rgba(255, 238, 205, ${a})`
        ctx.beginPath()
        ctx.arc(st.x, st.y, st.s, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    tick(performance.now())
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 h-full w-full mix-blend-screen"
    />
  )
}

// ===== 3. 胶片颗粒：动态细密噪点，low-alpha，overlay 混合，随帧更新 =====
function FilmGrain() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const S = 320
    canvas.width = S
    canvas.height = S
    const img = ctx.createImageData(S, S)
    const buf = img.data

    const gen = () => {
      for (let i = 0; i < buf.length; i += 4) {
        const v = 128 + (Math.random() - 0.5) * 56
        buf[i] = buf[i + 1] = buf[i + 2] = v
        buf[i + 3] = 14 + Math.random() * 36 // 低透明度细颗粒
      }
      ctx.putImageData(img, 0, 0)
    }

    const FPS = 15
    let raf = 0
    let last = performance.now()
    let acc = 0
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      acc += now - last
      last = now
      if (acc < 1000 / FPS) return
      acc = 0
      gen()
    }
    gen()
    tick(performance.now())
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.16] mix-blend-overlay"
    />
  )
}

// ===== 4. 细微划痕：几条极淡的白色细线，缓慢漂移，营造胶片岁月感 =====
function ScratchOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.06]">
      <span className="scratch" style={{ top: '16%', transform: 'rotate(-7deg)' }} />
      <span className="scratch" style={{ top: '47%', transform: 'rotate(5deg)' }} />
      <span className="scratch" style={{ top: '73%', transform: 'rotate(-11deg)' }} />
      <span className="scratch" style={{ top: '89%', transform: 'rotate(9deg)' }} />
    </div>
  )
}

// ===== 5. 柔光层：中心暖光 + 斜射高光，提升氛围与层次 =====
function SoftGlowLayer() {
  return (
    <>
      <div className="video-softglow" />
      <div className="video-hi" />
    </>
  )
}

// ===== 6. 底部立体星星挂饰：金线垂挂于视频边缘，错落有致 =====
// 星星在形状（五角星/四角钻石/六尖星/细星芒/圆珠）、大小、角度、吊线长度与弯曲方向、
// 位置密度上均有差异：左右角聚成两簇、中段稀疏离群、最侧缘贴边。
// 星星内部自发光（screen 混合），光从星体内部渗出而非外放光晕；
// 吊线为弯曲的金丝线，星星层整体跟随视频卡片的悬浮动画一同运动。
type StarShape = 'five' | 'four' | 'six' | 'spark' | 'orb'

interface StarSpec {
  left: string
  hang: number
  size: number
  rot: number
  delay: number
  dur: number
  glow: number
  /** 吊线弯曲量：正数向右弯，负数向左弯 */
  curve: number
  /** 左右摆动的幅度偏移（px），让每颗星相位/幅度不同 */
  sway: number
  shape: StarShape
}

const STARS: StarSpec[] = [
  // —— 左角簇：密集、长短参差，吊线整体向左弯 ——
  { left: '2.5%', hang: 30, size: 26, rot: -18, delay: 0.1, dur: 4.2, glow: 0.42, curve: -2.4, sway: -4, shape: 'spark' },
  { left: '8%',   hang: 64, size: 52, rot: 7,   delay: 0.8, dur: 5.4, glow: 0.72, curve: -1.3, sway: 3,  shape: 'five' },
  { left: '14%',  hang: 22, size: 24, rot: -6,  delay: 1.5, dur: 3.7, glow: 0.4,  curve: -0.7, sway: -2, shape: 'orb' },
  { left: '19%',  hang: 40, size: 32, rot: 16,  delay: 0.4, dur: 4.6, glow: 0.55, curve: -1.8, sway: 5,  shape: 'six' },
  // —— 中段：稀疏离群、垂得最深 ——
  { left: '36%',  hang: 78, size: 38, rot: 12,  delay: 1.9, dur: 5.7, glow: 0.62, curve: 0.9,  sway: 2,  shape: 'four' },
  { left: '54%',  hang: 26, size: 18, rot: -24, delay: 0.6, dur: 3.9, glow: 0.34, curve: -2.8, sway: -5, shape: 'spark' },
  // —— 右角簇：密集、高低错落，吊线整体向右弯 ——
  { left: '66%',  hang: 52, size: 44, rot: 5,   delay: 1.2, dur: 5.1, glow: 0.72, curve: 1.5,  sway: 4,  shape: 'six' },
  { left: '74%',  hang: 24, size: 22, rot: -14, delay: 1.7, dur: 4.1, glow: 0.44, curve: 0.6,  sway: -3, shape: 'orb' },
  { left: '82%',  hang: 68, size: 40, rot: 9,   delay: 0.3, dur: 4.8, glow: 0.68, curve: 1.1,  sway: 3,  shape: 'five' },
  { left: '90%',  hang: 34, size: 28, rot: -20, delay: 2.0, dur: 4.4, glow: 0.5,  curve: 2.2,  sway: -4, shape: 'four' },
  // —— 最侧缘贴边：极短吊线 ——
  { left: '96%',  hang: 12, size: 20, rot: 22,  delay: 2.4, dur: 3.5, glow: 0.4,  curve: 1.9,  sway: -2, shape: 'spark' },
]

// 不同星形的轮廓 / 内层亮部 / 受光高光 / 底部暗部路径
const SHAPE_PATHS: Record<
  StarShape,
  { outer: string; inner?: string; hilite?: string; shade?: string }
> = {
  five: {
    outer: 'M12 0.9 L15.1 7.1 L22 8.2 L17 13.1 L18.2 20 L12 16.6 L5.8 20 L7 13.1 L2 8.2 L8.9 7.1 Z',
    inner: 'M12 5.4 L13.9 9.3 L18.1 10 L15 13.1 L15.8 17.3 L12 15.2 L8.2 17.3 L9 13.1 L5.9 10 L10.1 9.3 Z',
    hilite: 'M12 0.9 L15.1 7.1 L12 9.2 L8.9 7.1 Z',
    shade: 'M12 16.6 L15.8 17.3 L12 19.6 L8.2 17.3 Z',
  },
  four: {
    outer: 'M12 0.8 L15.2 8.8 L23.2 12 L15.2 15.2 L12 23.2 L8.8 15.2 L0.8 12 L8.8 8.8 Z',
    inner: 'M12 4.6 L13.8 10.2 L19.4 12 L13.8 13.8 L12 19.4 L10.2 13.8 L4.6 12 L10.2 10.2 Z',
    hilite: 'M12 0.8 L15.2 8.8 L12 9.8 L8.8 8.8 Z',
    shade: 'M12 19.4 L13.8 13.8 L12 21.6 L10.2 13.8 Z',
  },
  six: {
    outer: 'M12 1 L14.7 7.3 L21.5 6.5 L17.4 12 L21.5 17.5 L14.7 16.7 L12 23 L9.3 16.7 L2.5 17.5 L6.6 12 L2.5 6.5 L9.3 7.3 Z',
    inner: 'M12 4.6 L13.5 8.6 L17.5 8.1 L14.8 11.1 L17.5 14.1 L13.5 13.6 L12 17.6 L10.5 13.6 L6.5 14.1 L9.2 11.1 L6.5 8.1 L10.5 8.6 Z',
    hilite: 'M12 1 L14.7 7.3 L12 8.4 L9.3 7.3 Z',
    shade: 'M12 17.6 L13.5 13.6 L12 21 L10.5 13.6 Z',
  },
  spark: {
    outer: 'M12 0.4 L14.6 9.4 L23.6 12 L14.6 14.6 L12 23.6 L9.4 14.6 L0.4 12 L9.4 9.4 Z',
    inner: 'M12 3.6 L13.8 10.2 L20.4 12 L13.8 13.8 L12 20.4 L10.2 13.8 L3.6 12 L10.2 10.2 Z',
    hilite: 'M12 0.4 L14.6 9.4 L12 10.4 L9.4 9.4 Z',
  },
  orb: {
    outer: 'M12 1.5 A10.5 10.5 0 1 0 12 22.5 A10.5 10.5 0 1 0 12 1.5 Z',
  },
}

export function StarOrnaments() {
  return (
    <div className="star-ornaments pointer-events-none absolute inset-0 z-[6]">
      {/* 金线（星链）：沿视频底部边缘自然延展，星星垂挂其上 */}
      <svg
        className="star-chain"
        viewBox="0 0 100 14"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="star-chain-g" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a9793a" stopOpacity="0" />
            <stop offset="12%" stopColor="#e0ab55" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#f5d189" stopOpacity="0.95" />
            <stop offset="68%" stopColor="#e0ab55" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#a9793a" stopOpacity="0" />
          </linearGradient>
          {/* 金丝吊线的纵向渐变：贴近视频边缘处稍暗，向下渐亮 */}
          <linearGradient id="star-thread-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c9974a" stopOpacity="0.65" />
            <stop offset="55%" stopColor="#f2ce85" />
            <stop offset="100%" stopColor="#ffe6a8" />
          </linearGradient>
        </defs>
        <path
          d="M-1 5 C 5 9, 11 6, 17 8 C 25 10, 29 5, 35 7 C 43 10, 47 6, 53 7 C 59 9, 63 5, 69 7 C 76 9, 80 6, 86 7 C 92 9, 96 6, 101 5"
          stroke="url(#star-chain-g)"
          strokeWidth="1.1"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      {STARS.map((st, i) => {
        const sp = SHAPE_PATHS[st.shape]
        return (
          <span
            key={i}
            className="star-ornament"
            style={{
              left: st.left,
              bottom: `-${st.hang + st.size}px`,
              width: st.size,
              height: st.size,
              animationDelay: `${st.delay}s`,
              animationDuration: `${st.dur}s`,
              '--rot': `${st.rot}deg`,
              '--hang': `${st.hang}px`,
              '--sway': `${st.sway}px`,
            } as React.CSSProperties}
          >
            {/* 弯曲的金丝吊线：从视频底边垂下，带自然弧度 */}
            <svg
              className="star-thread"
              viewBox="0 0 12 100"
              preserveAspectRatio="none"
              aria-hidden
            >
              <path
                d={`M6 0 C ${6 + st.curve * 1.4} 32, ${6 + st.curve * 0.7} 68, 6 100`}
                fill="none"
                stroke="url(#star-thread-g)"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
            <span className="star-halo" style={{ opacity: st.glow }} />
            <svg className="star-body" viewBox="0 0 24 24" aria-hidden>
              <defs>
                {/* 星体主渐变：中心亮白、向外渐暗，营造内部透光感 */}
                <radialGradient
                  id={`star-g-${i}`}
                  cx="42%"
                  cy="32%"
                  r="80%"
                >
                  <stop offset="0%" stopColor="#fffbe8" />
                  <stop offset="32%" stopColor="#fbe6a6" />
                  <stop offset="60%" stopColor="#e9b860" />
                  <stop offset="100%" stopColor="#9a6722" />
                </radialGradient>
                {/* 内部发光层：screen 混合，光从星体内部渗出 */}
                <radialGradient
                  id={`star-glow-${i}`}
                  cx="50%"
                  cy="44%"
                  r="52%"
                >
                  <stop offset="0%" stopColor="rgba(255,246,215,0.9)" />
                  <stop offset="45%" stopColor="rgba(255,228,160,0.32)" />
                  <stop offset="100%" stopColor="rgba(255,210,120,0)" />
                </radialGradient>
              </defs>
              {st.shape === 'orb' ? (
                <>
                  {/* 金色圆珠吊坠 */}
                  <circle
                    cx="12"
                    cy="12"
                    r="10.4"
                    fill={`url(#star-g-${i})`}
                    stroke="rgba(96,62,18,0.85)"
                    strokeWidth="0.7"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="10.4"
                    fill={`url(#star-glow-${i})`}
                    className="star-glow-core"
                    style={{ mixBlendMode: 'screen' }}
                  />
                  <circle cx="9.4" cy="9.2" r="4" fill="#fffbe6" opacity="0.85" />
                  <circle cx="8.3" cy="8.1" r="1.5" fill="#ffffff" opacity="0.92" />
                </>
              ) : (
                <>
                  {/* 星体轮廓：暗金描边，立体清晰 */}
                  <path
                    d={sp.outer}
                    fill={`url(#star-g-${i})`}
                    stroke="rgba(96,62,18,0.9)"
                    strokeWidth="0.7"
                    strokeLinejoin="round"
                  />
                  {/* 左上受光面：亮白高光，强化金属浮雕感 */}
                  {sp.hilite && (
                    <path d={sp.hilite} fill="#fffbe6" opacity="0.85" />
                  )}
                  {/* 内层亮部：浅金，增强层次 */}
                  {sp.inner && <path d={sp.inner} fill="#fff7dd" opacity="0.4" />}
                  {/* 底部暗部：立体凹陷 */}
                  {sp.shade && <path d={sp.shade} fill="#7a4c17" opacity="0.5" />}
                  {/* 内部发光层：光从星体内部渗出，而非外放光晕 */}
                  <path
                    d={sp.outer}
                    fill={`url(#star-glow-${i})`}
                    className="star-glow-core"
                    style={{ mixBlendMode: 'screen' }}
                  />
                  {/* 高光点 */}
                  <circle cx="11.2" cy="7" r="1.3" fill="#fffdf4" opacity="0.95" />
                  <circle cx="13.4" cy="8.6" r="0.55" fill="#fffdf4" opacity="0.55" />
                </>
              )}
            </svg>
          </span>
        )
      })}
    </div>
  )
}

// ===== 视频质感层汇总（顺序：柔光 → 星空 → 划痕 → 颗粒） =====
export function VideoEffects() {
  return (
    <>
      <SoftGlowLayer />
      <StarfieldLayer />
      <ScratchOverlay />
      <FilmGrain />
    </>
  )
}
