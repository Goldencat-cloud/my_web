import { useCallback, useEffect, useRef } from 'react'
import './LineSidebar.css'

const FALLOFF_CURVES = {
  linear: (p: number) => p,
  smooth: (p: number) => p * p * (3 - 2 * p),
  sharp: (p: number) => p * p * p,
}

const DEFAULT_ITEMS = [
  'Overview',
  'Components',
  'Animations',
  'Backgrounds',
  'Showcase',
]

interface LineSidebarProps {
  items?: string[]
  accentColor?: string
  textColor?: string
  markerColor?: string
  showIndex?: boolean
  showMarker?: boolean
  proximityRadius?: number
  falloff?: 'linear' | 'smooth' | 'sharp'
  markerLength?: number
  markerGap?: number
  itemGap?: number
  fontSize?: number
  smoothing?: number
  activeIndex?: number | null
  onActiveChange?: (index: number) => void
  className?: string
}

const LineSidebar = ({
  items = DEFAULT_ITEMS,
  accentColor = '#C9A96E',
  textColor = '#b7a581',
  markerColor = '#6b5d44',
  showIndex = true,
  showMarker = true,
  proximityRadius = 120,
  falloff = 'smooth',
  markerLength = 48,
  markerGap = 10,
  itemGap = 24,
  fontSize = 1,
  smoothing = 140,
  activeIndex = null,
  onActiveChange,
  className = '',
}: LineSidebarProps) => {
  const listRef = useRef<HTMLUListElement>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const targetsRef = useRef<number[]>([])
  const currentRef = useRef<number[]>([])
  const rafRef = useRef<number | null>(null)
  const lastRef = useRef(0)
  const smoothingRef = useRef(smoothing)
  const activeIndexRef = useRef(activeIndex)

  smoothingRef.current = smoothing
  activeIndexRef.current = activeIndex

  /* 一个 rAF 循环：把每个条目的 --effect 用帧率无关的指数平滑逼向 target。
     颜色、辉光、marker 全部从同一个连续值派生，避免 CSS transition 错峰。 */
  const runFrame = useCallback((now: number) => {
    const dt = Math.min((now - lastRef.current) / 1000, 0.05)
    lastRef.current = now
    const tau = Math.max(smoothingRef.current, 1) / 1000
    const k = 1 - Math.exp(-dt / tau)

    let moving = false
    const els = itemRefs.current
    for (let i = 0; i < els.length; i++) {
      const el = els[i]
      if (!el) continue
      const proximity = targetsRef.current[i] || 0
      const isActive = activeIndexRef.current === i ? 1 : 0
      const target = Math.max(proximity, isActive)
      const cur = currentRef.current[i] || 0
      const next = cur + (target - cur) * k
      const settled = Math.abs(target - next) < 0.0015
      const value = settled ? target : next
      currentRef.current[i] = value
      el.style.setProperty('--effect', value.toFixed(4))
      if (!settled) moving = true
    }

    rafRef.current = moving ? requestAnimationFrame(runFrame) : null
  }, [])

  const startLoop = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    lastRef.current = performance.now()
    rafRef.current = requestAnimationFrame(runFrame)
  }, [runFrame])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const list = listRef.current
      if (!list) return
      const rect = list.getBoundingClientRect()
      const pointerY = e.clientY - rect.top
      const ease = FALLOFF_CURVES[falloff] ?? FALLOFF_CURVES.smooth
      const els = itemRefs.current
      for (let i = 0; i < els.length; i++) {
        const el = els[i]
        if (!el) continue
        const center = el.offsetTop + el.offsetHeight / 2
        const distance = Math.abs(pointerY - center)
        targetsRef.current[i] = ease(
          Math.max(0, 1 - distance / proximityRadius),
        )
      }
      startLoop()
    },
    [falloff, proximityRadius, startLoop],
  )

  const handlePointerLeave = useCallback(() => {
    targetsRef.current = targetsRef.current.map(() => 0)
    startLoop()
  }, [startLoop])

  const handleItemEnter = useCallback(
    (index: number) => {
      onActiveChange?.(index)
    },
    [onActiveChange],
  )

  useEffect(() => {
    startLoop()
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [startLoop])

  return (
    <nav
      className={`line-sidebar${showMarker ? ' line-sidebar--markers' : ''}${
        className ? ` ${className}` : ''
      }`}
      style={
        {
          '--accent-color': accentColor,
          '--text-color': textColor,
          '--marker-color': markerColor,
          '--marker-length': `${markerLength}px`,
          '--marker-gap': `${markerGap}px`,
          '--item-gap': `${itemGap}px`,
          '--font-size': `${fontSize}rem`,
        } as React.CSSProperties
      }
    >
      <ul
        ref={listRef}
        className="line-sidebar__list"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {items.map((label, index) => (
          <li
            key={`${label}-${index}`}
            ref={(el) => {
              itemRefs.current[index] = el
            }}
            className="line-sidebar__item"
            aria-current={activeIndex === index ? 'true' : undefined}
            onMouseEnter={() => handleItemEnter(index)}
            onFocus={() => handleItemEnter(index)}
            onClick={() => handleItemEnter(index)}
            tabIndex={0}
          >
            {showMarker && (
              <span className="line-sidebar__marker" aria-hidden="true" />
            )}
            <span className="line-sidebar__label">
              {showIndex && (
                <span className="line-sidebar__index">
                  {String(index + 1).padStart(2, '0')}
                </span>
              )}
              <span className="line-sidebar__text">{label}</span>
            </span>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default LineSidebar
