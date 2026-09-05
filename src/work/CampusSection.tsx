import { TechChip } from './Handmade'
import SectionHeader from './SectionHeader'
import { useLang } from '../i18n/LanguageContext'
import { useResumeData } from '../data/useResumeData'
import { RichText } from '../components/RichText'
import './CampusSection.css'

export default function CampusSection({ active = false }: { active?: boolean }) {
  const { tx } = useLang()
  const data = useResumeData()
  const campus = data.campus

  return (
    <section className={`cs-root${active ? ' cs-on' : ''}`} aria-label="Campus roles">
      <div className="cs-threads" aria-hidden="true">
        <span className="cs-thread cs-thread--top" />
        <span className="cs-thread cs-thread--bottom" />
        <span className="cs-thread cs-thread--under" />
      </div>
      <div className="cs-aura" aria-hidden="true" />
      <div className="cs-scroll">
        <div className="cs-paper" aria-hidden="true" />
        <div className="cs-shimmer" aria-hidden="true" />
        <div className="cs-silk" aria-hidden="true" />
        <span className="cs-rod cs-rod--top" aria-hidden="true" />
        <span className="cs-rod cs-rod--bottom" aria-hidden="true" />

        <div className="cs-ribbon" aria-hidden="true">
          <span className="cs-ribbon-band" />
          <span className="cs-ribbon-btn" />
        </div>

        <div className="cs-viewport">
          <div className="cs-body">
            <SectionHeader
              className="cs-head"
              titleClassName="cs-title"
              index="05"
              title={campus.header.title}
              subtitle={campus.header.subtitle}
              active={active}
            />

            {campus.roles.map((seg) => (
              <article className="cs-segment" key={seg.idx}>
                <div className="cs-seg-head">
                  <span className="cs-seg-idx">{seg.idx}</span>
                  <h3 className="cs-role-name">{tx(seg.title)}</h3>
                </div>
                <div className="cs-org-time">
                  <span className="cs-org">{tx(seg.org)}</span>
                  <span className="cs-time">{tx(seg.time)}</span>
                </div>
                <div className="cs-duties">
                  {seg.duties.map((d, k) => (
                    <p className="cs-duty" key={k}>
                      <RichText text={tx(d) ?? ''} />
                    </p>
                  ))}
                </div>
                <div className="cs-tech">
                  {seg.chips.map((c) => (
                    <TechChip key={tx(c)} label={tx(c)} />
                  ))}
                </div>
              </article>
            ))}

            <div className="cs-seal" aria-hidden="true">
              <span className="cs-seal-line" />
              <span className="cs-seal-node" />
              <span className="cs-seal-line" />
            </div>

            <div className="cs-signet">
              <div className="cs-signet-frame">
                <div className="cs-signet-value">
                  {campus.volunteer.value}
                  <span className="cs-signet-unit">{tx(campus.volunteer.unit)}</span>
                </div>
                <div className="cs-signet-label">{tx(campus.volunteer.label)}</div>
              </div>
            </div>

            <div className="cs-stamp">
              <img
                className="cs-stamp-mark"
                src={campus.stamp.emblem}
                alt="Shaanxi Normal University emblem"
                draggable={false}
              />
              <div className="cs-stamp-org">{campus.stamp.org}</div>
              <div className="cs-stamp-year">{campus.stamp.year}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
