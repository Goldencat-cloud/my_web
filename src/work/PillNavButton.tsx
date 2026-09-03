import { useRef, type MouseEvent, type ReactNode } from 'react'
import './PillNavButton.css'

interface PillNavButtonProps {
  active?: boolean
  onClick?: () => void
  children: ReactNode
  className?: string
}

export default function PillNavButton({
  active = false,
  onClick,
  children,
  className = '',
}: PillNavButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)

  const setOrigin = (e: MouseEvent<HTMLButtonElement>) => {
    const btn = ref.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    btn.style.setProperty('--x', `${e.clientX - rect.left}px`)
    btn.style.setProperty('--y', `${e.clientY - rect.top}px`)
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      onMouseEnter={setOrigin}
      onMouseMove={setOrigin}
      data-active={active ? 'true' : undefined}
      className={`pill-nav-btn relative isolate overflow-hidden rounded-full whitespace-nowrap px-3 py-2 text-[13px] font-medium transition-colors duration-300 md:text-[13.5px] ${
        active
          ? 'text-[#F2E0B8]'
          : 'text-[#C9B48D]/60 hover:text-[#F2E0B8]'
      } ${className}`}
    >
      <span className="pill-nav-wave" aria-hidden="true" />
      <span className="pill-nav-fill" aria-hidden="true" />
      <span className="relative z-10">{children}</span>
    </button>
  )
}
