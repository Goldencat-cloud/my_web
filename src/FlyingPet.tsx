import { useEffect, useRef, useState } from 'react'

/**
 * 会飞的小精灵 / IP 形象挂件
 * ------------------------------------------------
 * 使用你的 IP 形象：
 *   1. 把形象图片放到 public/ 目录（支持 PNG / WebP / GIF 动图，建议透明底）
 *   2. 在 App.tsx 里传 src，例如：<FlyingPet src="/pet.png" />
 *   3. 没放图时自动显示默认小精灵占位，不影响预览
 *
 * 鼠标互动：
 *  - 平时围绕视频区域做椭圆轨道漂浮（带尾巴拖影）
 *  - 鼠标静止靠近它（<360px）→ 好奇地飞过来，围着鼠标盘旋、偏头看
 *  - 鼠标快速逼近（<150px）→ 受惊躲开，随后回到轨道
 *
 * 如果 IP 形象是 3D 模型（如 butterfly.glb），需要引入 three.js 渲染，
 * 告诉我即可帮你升级。
 */

type PetMode = 'orbit' | 'curious' | 'flee'

// 默认占位形象：发光金色小精灵（未提供 IP 图时显示）
function PetSprite() {
  return (
    <svg viewBox="0 0 100 100" className="pet-sprite" aria-hidden="true">
      <defs>
        <radialGradient id="pet-halo" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="rgba(255,238,180,0.85)" />
          <stop offset="60%" stopColor="rgba(255,214,130,0.28)" />
          <stop offset="100%" stopColor="rgba(255,214,130,0)" />
        </radialGradient>
        <radialGradient id="pet-body" cx="40%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FFF6DC" />
          <stop offset="55%" stopColor="#F3D89A" />
          <stop offset="100%" stopColor="#D9A95F" />
        </radialGradient>
      </defs>

      {/* 光晕 */}
      <circle cx="50" cy="50" r="48" fill="url(#pet-halo)" />

      {/* 小翅膀 */}
      <path
        d="M18 46 Q 2 34 10 22 Q 26 26 26 40 Z"
        fill="rgba(255,240,200,0.75)"
        stroke="#E8C27E"
        strokeWidth="1.5"
      />
      <path
        d="M82 46 Q 98 34 90 22 Q 74 26 74 40 Z"
        fill="rgba(255,240,200,0.75)"
        stroke="#E8C27E"
        strokeWidth="1.5"
      />

      {/* 身体 */}
      <ellipse
        cx="50"
        cy="56"
        rx="23"
        ry="21"
        fill="url(#pet-body)"
        stroke="#E0B878"
        strokeWidth="2"
      />

      {/* 腮红 */}
      <circle cx="37" cy="61" r="4.5" fill="rgba(236,150,120,0.4)" />
      <circle cx="63" cy="61" r="4.5" fill="rgba(236,150,120,0.4)" />

      {/* 眼睛（好奇/受惊时放大，见 CSS） */}
      <g className="pet-eye">
        <circle cx="41" cy="52" r="4.6" fill="#3A2B1A" />
        <circle cx="59" cy="52" r="4.6" fill="#3A2B1A" />
        <circle cx="42.6" cy="50.4" r="1.5" fill="#FFF" />
        <circle cx="60.6" cy="50.4" r="1.5" fill="#FFF" />
      </g>

      {/* 嘴 */}
      <path
        d="M46 62 Q 50 65 54 62"
        fill="none"
        stroke="#8A6A3C"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function FlyingPet({
  src = '/pet.png',
  size = 64,
}: {
  src?: string
  size?: number
}) {
  const hostRef = useRef<HTMLDivElement>(null) // 铺满视频容器，用于测量坐标
  const spriteRef = useRef<HTMLDivElement>(null) // 真正的精灵，JS 直接改它的 transform
  const [imgFailed, setImgFailed] = useState(false)

  useEffect(() => {
    const host = hostRef.current
    const sprite = spriteRef.current
    if (!host || !sprite) return

    const s = {
      x: host.clientWidth / 2,
      y: host.clientHeight / 2,
      angle: 0,
      mx: -99999,
      my: -99999,
      lastMove: -10, // 鼠标最后一次移动的时间（秒）
      fleeUntil: 0,
      mode: 'orbit' as PetMode,
    }

    const onMove = (e: MouseEvent) => {
      const r = host.getBoundingClientRect()
      s.mx = e.clientX - r.left
      s.my = e.clientY - r.top
      s.lastMove = performance.now() / 1000
    }

    let prev = performance.now()
    let raf = 0

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min((now - prev) / 1000, 0.05)
      prev = now
      const w = host.clientWidth
      const h = host.clientHeight
      const t = now / 1000

      // 轨道：围绕视频的扁椭圆 + 轻微上下起伏
      s.angle += dt * 0.42
      const cx = w / 2
      const cy = h * 0.44
      const ox = cx + Math.cos(s.angle) * w * 0.36
      const oy = cy + Math.sin(s.angle) * h * 0.3 + Math.sin(t * 0.7) * 12

      const dm = Math.hypot(s.mx - s.x, s.my - s.y)
      const mouseStill = t - s.lastMove > 0.7

      let tx = ox
      let ty = oy
      let mode: PetMode = 'orbit'

      if (s.mode === 'flee' && t < s.fleeUntil) {
        // 继续逃离（沿远离鼠标的方向冲出去）
        mode = 'flee'
        tx = s.x + (s.x - s.mx) * 1.6
        ty = s.y + (s.y - s.my) * 1.6
      } else if (dm < 150) {
        // 鼠标逼近 → 受惊躲开
        mode = 'flee'
        s.fleeUntil = t + 1.2
        tx = s.x + (s.x - s.mx) * 2.4
        ty = s.y + (s.y - s.my) * 2.4
      } else if (mouseStill && dm < 360) {
        // 鼠标停着 → 好奇凑近，围着鼠标盘旋
        mode = 'curious'
        const a = t * 1.7
        tx = s.mx + Math.cos(a) * 72
        ty = s.my - 26 + Math.sin(a) * 44
      }
      s.mode = mode

      // 平滑插值（flee 快、curious 中、orbit 慢，动作有缓急）
      const k = mode === 'flee' ? 0.16 : mode === 'curious' ? 0.08 : 0.035
      s.x += (tx - s.x) * k
      s.y += (ty - s.y) * k

      // 朝向：好奇时看鼠标，其余朝向运动方向；叠加轻微倾摆显得活泛
      const vx = tx - s.x
      const vy = ty - s.y
      const look =
        mode === 'curious'
          ? Math.atan2(s.my - s.y, s.mx - s.x)
          : Math.atan2(vy, vx)
      const tilt = Math.sin(t * 2.4 + 1) * 5
      const rot = (look * 180) / Math.PI + tilt

      sprite.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) rotate(${rot}deg)`
      host.dataset.mode = mode
    }

    tick(performance.now())
    window.addEventListener('mousemove', onMove)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <div ref={hostRef} className="flying-pet" data-mode="orbit">
      <div
        ref={spriteRef}
        className="pet-sprite-wrap"
        style={{
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
        }}
      >
        {/* 尾巴拖影 */}
        <span className="pet-trail" />
        {src && !imgFailed ? (
          <img
            src={src}
            alt="pet"
            draggable={false}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <PetSprite />
        )}
      </div>
    </div>
  )
}
