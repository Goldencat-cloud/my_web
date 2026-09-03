import {
  Children,
  type CSSProperties,
  type ReactElement,
  cloneElement,
  forwardRef,
  isValidElement,
  useLayoutEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react'
import { gsap } from 'gsap'
import './CardSwap.css'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string
  children?: ReactNode
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ customClass, ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      className={`card ${customClass ?? ''} ${rest.className ?? ''}`.trim()}
    />
  ),
)
Card.displayName = 'Card'

interface CardSwapProps {
  activeIndex?: number
  cardDistance?: number
  verticalDistance?: number
  onCardClick?: (idx: number) => void
  children: ReactNode
}

const CardSwap = ({
  activeIndex = 0,
  cardDistance = 24,
  verticalDistance = 6,
  onCardClick,
  children,
}: CardSwapProps) => {
  const childArr = useMemo(() => Children.toArray(children), [children])
  const refs = useRef<(HTMLDivElement | null)[]>([])
  const isFirst = useRef(true)

  const total = childArr.length
  const safeIndex = Math.max(0, Math.min(activeIndex, total - 1))

  useLayoutEffect(() => {
    if (total === 0) return
    refs.current.forEach((el, i) => {
      if (!el) return
      const distance = (i - safeIndex + total) % total
      // 深度：越靠后越暗、越偏后；纯横向扇形 + 极小上扬，避免向上溢出与上方信息卡重叠
      const props = {
        x: distance * cardDistance,
        y: -distance * verticalDistance,
        z: -distance * cardDistance * 3,
        xPercent: -50,
        yPercent: -50,
        zIndex: total - distance,
        opacity: Math.max(0.18, 1 - distance * 0.16),
        force3D: true,
        transformOrigin: 'center center',
      }
      if (isFirst.current) {
        gsap.set(el, props)
      } else {
        gsap.to(el, {
          ...props,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }
    })
    isFirst.current = false
  }, [safeIndex, total, cardDistance, verticalDistance])

  const rendered = childArr.map((child, i) => {
    if (!isValidElement(child)) return child
    const childEl = child as ReactElement<{
      style?: CSSProperties
      onClick?: () => void
    }>
    const childStyle = childEl.props.style ?? {}
    return cloneElement(childEl, {
      key: i,
      ref: (el: HTMLDivElement | null) => {
        refs.current[i] = el
      },
      style: { ...childStyle },
      onClick: () => {
        childEl.props.onClick?.()
        onCardClick?.(i)
      },
    })
  })

  return <div className="card-swap-container">{rendered}</div>
}

export default CardSwap
