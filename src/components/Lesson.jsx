import { useEffect, useState } from 'react'
import { arrows, useI18n } from '../i18n'
import { LESSONS, TABS, levelOf } from '../lib/data'
import { go } from '../lib/useHash'
import { store } from '../lib/store'
import Section from './Section'

export default function Lesson({ lesson: l, done, toggle }) {
  const { t, lang } = useI18n()
  const [tab, setTab] = useState('overview')
  const lv = levelOf(l.level)
  const [prevA, nextA] = arrows(lang)
  useEffect(() => { store.set('dg-last', l.id); document.title = `${l.title} · Grammatik-Bibliothek` }, [l.id, l.title])
  const i = LESSONS.indexOf(l)
  const prev = LESSONS[i - 1], next = LESSONS[i + 1]

  return (
    <div className="mx-auto max-w-[900px] px-7 pb-28 pt-8 max-md:px-4 max-md:pt-5" style={{ '--c': lv.color }}>
      <header className="pt-2.5">
        <span className="badge">{lv.n} · {t(`lv_${lv.id}_t`)}</span>
        <h1 className="my-3.5 text-[clamp(34px,5vw,54px)] font-bold leading-[1.05] [unicode-bidi:plaintext]">{l.title}</h1>
        {l.goal && <p className="my-4 border-s-[3px] border-lv ps-4 text-[19px] text-mute [unicode-bidi:plaintext]">{l.goal}</p>}
        <div className="flex flex-wrap gap-1.5">
          {l.tags.filter((x) => x !== 'deutsch' && x !== 'grammatik').map((x) => (
            <span key={x} className="rounded-full bg-panel2 px-2.5 py-0.5 text-xs text-mute">#{x}</span>
          ))}
        </div>
      </header>

      <div role="tablist" className="sticky top-[3px] z-[15] max-md:top-[55px] -mx-2 my-[22px] flex gap-1.5 overflow-auto rounded-[18px] border border-line bg-bg/80 p-2 backdrop-blur-md">
        {TABS.map((k) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
            className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium ${tab === k ? 'bg-ink text-bg' : 'text-mute'}`}>
            {t(`tab_${k}`)}
          </button>
        ))}
      </div>

      {l.sections.filter((s) => s.g === tab).map((s) => <Section key={l.id + s.t} s={s} />)}

      <footer className="mt-9 flex flex-wrap justify-between gap-3">
        <button className={`btn ${done ? '' : 'btn-ghost'}`} onClick={toggle}>{done ? '✓ ' + t('done') : t('mark')}</button>
        <div className="flex flex-wrap gap-2.5">
          {prev && <button className="chip" onClick={() => go(prev.id)}>{prevA} {prev.title}</button>}
          {next && <button className="chip" onClick={() => go(next.id)}>{next.title} {nextA}</button>}
        </div>
      </footer>
    </div>
  )
}
