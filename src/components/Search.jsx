import { useMemo, useState } from 'react'
import { useI18n } from '../i18n'
import { INDEX, levelOf } from '../lib/data'
import { go } from '../lib/useHash'

export default function Search({ close }) {
  const { t } = useI18n()
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const results = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean)
    if (!words.length) return INDEX.slice(0, 8).map((x) => ({ l: x.l }))
    return INDEX.map((x) => {
      let score = 0
      for (const w of words) { if (x.s.includes(w)) score += 10; else if (x.c.includes(w)) score += 1; else return null }
      return { l: x.l, score, inText: !words.every((w) => x.s.includes(w)) }
    }).filter(Boolean).sort((a, b) => b.score - a.score).slice(0, 12)
  }, [q])
  const pick = (r) => { if (r) go(r.l.id); close() }
  const onKey = (e) => {
    if (e.key === 'Escape') close()
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(Math.min(active + 1, results.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive(Math.max(active - 1, 0)) }
    if (e.key === 'Enter') pick(results[active])
  }
  return (
    <div className="fixed inset-0 z-50 grid place-items-start justify-items-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm" onClick={close}>
      <div className="w-[min(640px,100%)] overflow-hidden rounded-[20px] border border-line bg-panel shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <input autoFocus value={q} placeholder={t('search_ph')} onChange={(e) => { setQ(e.target.value); setActive(0) }} onKeyDown={onKey}
          className="w-full border-0 border-b border-line bg-transparent px-[22px] py-[18px] text-lg font-medium text-ink outline-none" />
        <div className="max-h-[50vh] overflow-auto p-2">
          {results.map((r, j) => (
            <button key={r.l.id} onMouseEnter={() => setActive(j)} onClick={() => pick(r)}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-start ${j === active ? 'bg-accsoft' : ''}`}>
              <span className="badge" style={{ '--c': levelOf(r.l.level).color }}>{levelOf(r.l.level).n}</span>
              <span className="flex-1 [unicode-bidi:plaintext]">{r.l.title}</span>
              {r.inText && <small className="text-mute">{t('search_in')}</small>}
            </button>
          ))}
          {!results.length && <p className="p-5 text-mute">{t('search_none')}</p>}
        </div>
      </div>
    </div>
  )
}
