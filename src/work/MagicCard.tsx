import { useRef, useEffect, useCallback, useState, type ReactNode, type CSSProperties } from 'react'
import { gsap } from 'gsap'
import './MagicCard.css'

const DEFAULT_GLOW_COLOR = '226, 190, 120' // 金色系 #E2BE78

interface MagicCardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  /** 粒子星光：hover 时卡内飞散金色粒子 */
  enableStars?: boolean
  /** 边框辉光：金色描边跟随鼠标 */
  enableBorderGlow?: boolean
  /** 3D 倾斜：鼠标移动时卡片立体倾斜 */
  enableTilt?: boolean
  /** 磁性吸附：卡片轻微被光标吸引 */
  enableMagnetism?: boolean
  /** 点击涟漪 */
  clickEffect?: boolean
  /** 关闭全部动效（移动端自动） */
  disableAnimations?: boolean
  /** 粒子数量 */
  particleCount?: number
  /** 辉光 RGB（不含 rgba 包裹） */
  glowColor?: string
}

const MOBILE_BREAKPOINT = 768

/**
 * 单卡片「魔法卡」包裹器：提取自 React Bits 的 MagicBento 单卡效果，
 * 提供粒子星光、边框辉光、3D 倾斜、磁性吸附、点击涟漪。
 */
export default function MagicCard({
  children,
  className = '',
  style,
  enableStars = true,
  enableBorderGlow = true,
  enableTilt = true,
  enableMagnetism = true,
  clickEffect = true,
  disableAnimations = false,
  particleCount = 8,
  glowColor = DEFAULT_GLOW_COLOR,
}: MagicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLElement[]>([])
  const timeoutsRef = useRef<number[]>([])
  const isHoveredRef = useRef(false)
  const memoizedParticles = useRef<HTMLElement[]>([])
  const particlesInitialized = useRef(false)
  const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null)
  const [isMobile] = useStateMobile()

  const shouldDisable = disableAnimations || isMobile

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return
    const { width, height } = cardRef.current.getBoundingClientRect()
    memoizedParticles.current = Array.from({ length: particleCount }, () => {
      const el = document.createElement('span')
      el.className = 'magic-particle'
      el.style.cssText = `width:4px;height:4px;background:rgba(${glowColor},1);box-shadow:0 0 6px rgba(${glowColor},0.6);left:${Math.random() * width}px;top:${Math.random() * height}px;`
      return el
    })
    particlesInitialized.current = true
  }, [particleCount, glowColor])

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
    magnetismAnimationRef.current?.kill()
    particlesRef.current.forEach((particle) => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
        onComplete: () => particle.parentNode?.removeChild(particle),
      })
    })
    particlesRef.current = []
  }, [])

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return
    if (!particlesInitialized.current) initializeParticles()

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = window.setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return
        const clone = particle.cloneNode(true) as HTMLElement
        cardRef.current.appendChild(clone)
        particlesRef.current.push(clone)

        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' })
        gsap.to(clone, {
          x: (Math.random() - 0.5) * 90,
          y: (Math.random() - 0.5) * 90,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: 'none',
          repeat: -1,
          yoyo: true,
        })
        gsap.to(clone, {
          opacity: 0.3,
          duration: 1.5,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true,
        })
      }, index * 90)
      timeoutsRef.current.push(timeoutId)
    })
  }, [initializeParticles])

  useEffect(() => {
    if (shouldDisable || !cardRef.current) return
    const element = cardRef.current

    const handleMouseEnter = () => {
      isHoveredRef.current = true
      if (enableStars) animateParticles()
      if (enableTilt) {
        gsap.to(element, { rotateX: 5, rotateY: 5, duration: 0.3, ease: 'power2.out', transformPerspective: 1000 })
      }
    }

    const handleMouseLeave = () => {
      isHoveredRef.current = false
      clearAllParticles()
      if (enableTilt) {
        gsap.to(element, { rotateX: 0, rotateY: 0, duration: 0.3, ease: 'power2.out' })
      }
      if (enableMagnetism) {
        gsap.to(element, { x: 0, y: 0, duration: 0.3, ease: 'power2.out' })
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      if (enableBorderGlow) {
        element.style.setProperty('--glow-x', `${(x / rect.width) * 100}%`)
        element.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`)
      }
      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -6
        const rotateY = ((x - centerX) / centerX) * 6
        gsap.to(element, { rotateX, rotateY, duration: 0.1, ease: 'power2.out', transformPerspective: 1000 })
      }
      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.04
        const magnetY = (y - centerY) * 0.04
        magnetismAnimationRef.current = gsap.to(element, { x: magnetX, y: magnetY, duration: 0.3, ease: 'power2.out' })
      }
    }

    const handleClick = (e: MouseEvent) => {
      if (!clickEffect) return
      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height),
      )
      const ripple = document.createElement('span')
      ripple.className = 'magic-ripple'
      ripple.style.width = `${maxDistance * 2}px`
      ripple.style.height = `${maxDistance * 2}px`
      ripple.style.left = `${x - maxDistance}px`
      ripple.style.top = `${y - maxDistance}px`
      element.appendChild(ripple)
      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        { scale: 1, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => ripple.remove() },
      )
    }

    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)
    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('click', handleClick)
    return () => {
      isHoveredRef.current = false
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('click', handleClick)
      clearAllParticles()
    }
  }, [shouldDisable, enableStars, enableTilt, enableMagnetism, enableBorderGlow, clickEffect, animateParticles, clearAllParticles])

  const cls = [
    className,
    'magic-card',
    enableBorderGlow ? 'magic-card--border-glow' : '',
    'magic-card--hover-lift',
  ].join(' ')

  return (
    <div
      ref={cardRef}
      className={cls}
      style={{ ...style, ['--magic-glow-color' as string]: glowColor }}
    >
      {children}
    </div>
  )
}

function useStateMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return [isMobile, setIsMobile] as const
}
