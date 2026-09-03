const CALLIGRAPHY =
  '"鸿雷板书简体", "HongLeiBanShu", "STKaiti", "KaiTi", "楷体", cursive'

/* 金色图钉 */
function Pin({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${className}`}
      style={{
        background:
          'radial-gradient(circle at 32% 28%, #f6e3b4, #a98350 55%, #6b4e2e)',
        boxShadow:
          '0 1px 2px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.5)',
      }}
    />
  )
}

/* 背景水印与两侧装饰：填补负空间，不增加信息密度 */
export function FileWatermark() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* 超大书法水印字 */}
      <span
        className="absolute -right-[4vw] top-[8%] select-none text-[clamp(110px,20vw,300px)] leading-none text-[#C9A96E]"
        style={{ fontFamily: CALLIGRAPHY, opacity: 0.05, transform: 'rotate(-7deg)' }}
      >
        FILE
      </span>
      {/* 左侧竖排小字 */}
      <span
        className="absolute left-[2.6%] top-[26%] hidden origin-left select-none text-[10px] uppercase tracking-[0.5em] text-[#C9A96E] opacity-40 lg:block"
        style={{ transform: 'rotate(-90deg)' }}
      >
        Personal Dossier · 2026
      </span>
      {/* 左侧图钉 */}
      <span className="absolute left-[6.5%] top-[15%] hidden lg:block">
        <Pin />
      </span>
      {/* 右上虚线框 */}
      <span
        className="absolute right-[6.5%] top-[16%] hidden h-16 w-24 rounded border border-dashed border-[#C9A96E]/30 lg:block"
        style={{ transform: 'rotate(6deg)' }}
      />
      {/* 日期圆印章 */}
      <span
        className="absolute right-[9%] top-[44%] hidden h-[76px] w-[76px] flex-col items-center justify-center rounded-full border-[3px] border-double border-[#C9A96E]/25 lg:flex"
        style={{ transform: 'rotate(-14deg)' }}
      >
        <span className="text-center text-[9px] uppercase leading-relaxed tracking-[0.16em] text-[#C9A96E]/50">
          Est.
          <br />
          2026
          <br />
          SNNU
        </span>
      </span>
    </div>
  )
}

/* 牛皮纸档案盒：盒身 + 盒盖 + 半露纸边 + 盒底投影 */
export default function FileBox({ active }: { active: boolean }) {
  const hidden = !active
  return (
    <div
      className="relative mt-8 w-full max-w-lg"
      style={
        hidden
          ? {
              perspective: '900px',
              opacity: 0,
              transform: 'translateY(120%) scale(0.92)',
            }
          : {
              perspective: '900px',
              animation: 'file-box-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0s both',
            }
      }
    >
      {/* 盒口半露纸边：暗示盒里还有档案 */}
      <div
        className="absolute left-1/2 top-[-10px] z-10 h-[26px] w-[84%] rounded-t-[8px] border border-[#C9A96E]/25 bg-gradient-to-b from-[#efe6d0] to-[#cbbd9a] shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
        style={
          hidden
            ? { transform: 'translateX(-50%)' }
            : { animation: 'file-edge-peek 2.4s ease-in-out 1.5s infinite' }
        }
      >
        <div className="mx-auto mt-2 h-px w-[88%] bg-[#8F7E63]/30" />
        <div className="mx-auto mt-1 h-px w-[70%] bg-[#8F7E63]/25" />
      </div>

      {/* 盒盖：掀开 */}
      <div
        className="absolute inset-x-4 top-[-14px] z-20 h-[18px] origin-bottom rounded-md border border-[#7a5c38]/80 bg-gradient-to-b from-[#8a6a44] to-[#5f4529] shadow-[0_2px_6px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.14)]"
        style={
          hidden
            ? { transform: 'rotateX(0deg)' }
            : {
                animation: 'file-lid-open 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.34s both',
              }
        }
      >
        <div className="absolute inset-x-2 top-[3px] h-[2px] rounded-full bg-[#c9a96e]/40" />
      </div>

      {/* 盒身 */}
      <div className="relative z-0 rounded-[14px] border-2 border-[#6b4e2e]/85 bg-gradient-to-b from-[#6f5133] via-[#59402a] to-[#42301e] px-5 py-4 shadow-[0_18px_44px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)]">
        {/* 盒口内缝 */}
        <div className="absolute inset-x-3 top-0 h-[6px] rounded-b-full bg-[#241a10]/85 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]" />
        {/* 标签行 */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="relative inline-flex h-4 w-4 items-center justify-center">
              <span className="absolute h-full w-full rounded-full bg-[#C9A96E]/30 blur-[2px]" />
              <Pin />
            </span>
            <span className="text-[12px] font-semibold uppercase tracking-[0.32em] text-[#E9D5A8]">
              Personal File
            </span>
          </div>
          <span className="rounded border border-[#C9A96E]/35 bg-[#241a10]/60 px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] text-[#B7A581]">
            No. 001 · SNNU
          </span>
        </div>
        {/* 分隔线 */}
        <div className="mt-3 flex items-center gap-3">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C9A96E]/35" />
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#8F7E63]">
            Est. 2026
          </span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C9A96E]/35" />
        </div>
      </div>

      {/* 盒底投影 */}
      <div
        className="absolute inset-x-8 -bottom-5 z-0 h-5 rounded-[50%] bg-black/55 blur-lg"
        style={
          hidden
            ? undefined
            : { animation: 'file-shadow-breathe 2.6s ease-in-out infinite' }
        }
      />
    </div>
  )
}
