import { useEffect, useState } from 'react'
import { arrows, useI18n } from '../i18n'
import { inline } from '../lib/markdown'

const face = 'absolute inset-0 grid place-items-center rounded-[22px] p-6 text-center font-display text-[21px] font-medium leading-snug [backface-visibility:hidden]'
const label = 'absolute start-[18px] top-3.5 text-[11px] font-semibold tracking-widest opacity-60'

export default function Cards({ cards }) {
  const { t, lang } = useI18n()
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [rated, setRated] = useState({})
  const [prev, next] = arrows(lang)
  const move = (d) => { setFlipped(false); setI((x) => (x + d + cards.length) % cards.length) }

  useEffect(() => {
    // Arrow keys browse the deck (mirrored in right-to-left). Space/Enter are handled on the card itself,
    // so Space still scrolls the page and still activates buttons.
    const onKey = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName) || e.altKey || e.ctrlKey || e.metaKey) return
      const forward = lang === 'fa' ? 'ArrowLeft' : 'ArrowRight'
      const back = lang === 'fa' ? 'ArrowRight' : 'ArrowLeft'
      if (e.key === forward) move(1)
      if (e.key === back) move(-1)
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [cards, lang])

  const c = cards[i]
  if (!c) return null
  const rate = (v) => { setRated({ ...rated, [c.q]: v }); move(1) }

  return (
    <div>
      <div className="mb-3.5 mt-1.5 h-60 [perspective:1200px]">
        <div
          role="button" tabIndex={0} aria-label={t('flip')}
          onClick={() => setFlipped(!flipped)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlipped(!flipped) } }}
          className={`relative h-full cursor-pointer transition-transform duration-[550ms] ease-[cubic-bezier(.2,.8,.2,1)] [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}
        >
          <div className={`${face} border border-line bg-panel`}>
            <small className={label}>{t('q')} {i + 1}/{cards.length}</small>
            <span dangerouslySetInnerHTML={{ __html: inline(c.q) }} />
            {c.src && <small className="absolute bottom-3.5 start-[18px] max-w-[90%] truncate font-sans text-xs text-mute">{c.src}</small>}
          </div>
          <div className={`${face} bg-linear-to-br from-acc to-[#e9a23b] text-white [transform:rotateY(180deg)]`}>
            <small className={label}>{t('a')}</small>
            <span dangerouslySetInnerHTML={{ __html: inline(c.a) }} />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <button className="chip" onClick={() => move(-1)}>{prev} {t('back')}</button>
        <div className="flex gap-2.5">
          <button className={`chip ${rated[c.q] === 1 ? 'chip-on' : ''}`} onClick={() => rate(1)}>✓ {t('known')}</button>
          <button className={`chip ${rated[c.q] === 2 ? 'chip-on' : ''}`} onClick={() => rate(2)}>↻ {t('again')}</button>
        </div>
        <button className="chip" onClick={() => move(1)}>{t('next')} {next}</button>
      </div>
      <p className="text-center text-[13px] text-mute">
        {t('help')} · {Object.values(rated).filter((v) => v === 1).length} {t('known_l')}
      </p>
    </div>
  )
}
