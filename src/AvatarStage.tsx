/* 分层立绘舞台：按 PSD 原始画布坐标（2048×2048）逐层绝对定位叠加。
   每层是独立 <img>，可单独配置滤镜 / 透明度 / 动画，互不影响；
   整体用 drop-shadow 贴轮廓投影（透明底不会出现方形边缘）。 */

const CANVAS = 2048

interface AvatarLayer {
  file: string
  name: string
  left: number
  top: number
  width: number
  height: number
  /** 每层独立的视觉滤镜（暖金复古统一基调，可逐层微调） */
  filter?: string
  opacity?: number
  animate?: string
}

const AVATAR_LAYERS: AvatarLayer[] = [
  {
    file: '01_round_base.png',
    name: '圆形展示底座',
    left: 629,
    top: 1805,
    width: 779,
    height: 209,
    // 底座靠近地面，压暗一点更有"托举"感
    filter:
      'sepia(0.22) saturate(1.22) brightness(0.9) contrast(1.05) drop-shadow(0 2px 10px rgba(0,0,0,0.3))',
  },
  {
    file: '02_diamond_icon.png',
    name: '钻石科技图标',
    left: 766,
    top: 1070,
    width: 75,
    height: 106,
    filter: 'sepia(0.16) saturate(1.3) brightness(0.96) contrast(1.08)',
  },
  {
    file: '03_shield_heart.png',
    name: '盾牌爱心科技图标',
    left: 1260,
    top: 1268,
    width: 84,
    height: 98,
    filter: 'sepia(0.16) saturate(1.3) brightness(0.96) contrast(1.08)',
  },
  {
    file: '04_card_top_left.png',
    name: '顶部左上科技卡片',
    left: 1213,
    top: 282,
    width: 155,
    height: 174,
    filter: 'sepia(0.18) saturate(1.18) brightness(0.94) contrast(1.04)',
  },
  {
    file: '05_card_avatar.png',
    name: '带头像科技卡片',
    left: 1234,
    top: 554,
    width: 170,
    height: 178,
    filter: 'sepia(0.18) saturate(1.18) brightness(0.94) contrast(1.04)',
  },
  {
    file: '06_card_chart.png',
    name: '数据图表科技卡片',
    left: 1337,
    top: 1053,
    width: 168,
    height: 187,
    filter: 'sepia(0.18) saturate(1.18) brightness(0.94) contrast(1.04)',
  },
  {
    file: '07_person.png',
    name: '人物主体',
    left: 748,
    top: 278,
    width: 589,
    height: 1632,
    // 人物保持自然肤色，轻微暖化融入暗金氛围
    filter: 'sepia(0.12) saturate(1.12) brightness(0.99) contrast(1.02)',
  },
  {
    file: '08_card_small_top.png',
    name: '顶部小科技卡片',
    left: 1317,
    top: 413,
    width: 87,
    height: 101,
    filter: 'sepia(0.18) saturate(1.18) brightness(0.94) contrast(1.04)',
  },
  {
    file: '09_laptop.png',
    name: '带标识笔记本电脑',
    left: 993,
    top: 716,
    width: 495,
    height: 270,
    filter: 'sepia(0.14) saturate(1.16) brightness(0.97) contrast(1.03)',
  },
  {
    file: '10_badge.png',
    name: '工牌',
    left: 1026,
    top: 1030,
    width: 92,
    height: 148,
    filter: 'sepia(0.16) saturate(1.25) brightness(0.98) contrast(1.05)',
  },
]

interface AvatarStageProps {
  className?: string
}

export default function AvatarStage({ className }: AvatarStageProps) {
  return (
    <div
      className={`relative ${className ?? ''}`}
      style={{ aspectRatio: `${CANVAS} / ${CANVAS}` }}
    >
      {/* 整体贴轮廓柔影：跟随各层 alpha 合成轮廓，无方形边缘 */}
      <div
        className="absolute inset-0"
        style={{
          filter:
            'drop-shadow(0 8px 12px rgba(0,0,0,0.4)) drop-shadow(0 24px 36px rgba(0,0,0,0.26)) drop-shadow(0 0 42px rgba(233,213,168,0.16))',
        }}
      >
        {AVATAR_LAYERS.map((l) => (
          <div
            key={l.file}
            className="absolute"
            style={{
              left: `${(l.left / CANVAS) * 100}%`,
              top: `${(l.top / CANVAS) * 100}%`,
              width: `${(l.width / CANVAS) * 100}%`,
              height: `${(l.height / CANVAS) * 100}%`,
              opacity: l.opacity ?? 1,
            }}
          >
            <img
              src={`/avatar-layers/${l.file}`}
              alt={l.name}
              draggable={false}
              className="h-full w-full"
              style={{ filter: l.filter, animation: l.animate }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
