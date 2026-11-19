import { arrows, useI18n } from '../i18n'
import { CARD_COUNT, LEVELS, LESSONS } from '../lib/data'
import { go } from '../lib/useHash'
import { store } from '../lib/store'

export default function Home({ done }) {
  const { t, lang } = useI18n()
  const next = arrows(lang)[1]
  const last = LESSONS.find((l) => l.id === store.get('dg-last', null)) || LESSONS[0]
  return (
    <div className="mx-auto max-w-225 px-7 pb-28 pt-8 max-md:px-4 max-md:pt-5">
      <div className="relative overflow-hidden rounded-[28px] border border-line bg-panel px-11 py-14 shadow-card max-md:rounded-[22px] max-md:px-5.5 max-md:py-9"
        style={{ backgroundImage: 'radial-gradient(60% 80% at 85% 0,var(--glow),transparent),radial-gradient(50% 70% at 0 100%,var(--accsoft),transparent)' }}>
        <span className="text-xs font-semibold uppercase tracking-[.14em] text-acc">{t('eyebrow')}</span>
        <h1 className="my-3 mb-4 text-[clamp(36px,6vw,64px)] font-bold leading-[1.02]">
          {t('h1a')} <em className="text-acc">{t('h1b')}</em> {t('h1c')}
        </h1>
        <p className="mb-6 max-w-130 text-lg text-mute">{LESSONS.length} {t('hero_p')}</p>
        <div className="flex flex-wrap gap-2.5">
          <button className="btn" onClick={() => go(last.id)}>{done.length ? `${t('cont')}: ${last.title}` : t('start')} {next}</button>
          <button className="btn btn-ghost" onClick={() => go('trainer')}>🃏 {t('trainer')}</button>
        </div>
        <div className="mt-8 flex flex-wrap gap-7">
          {[[LESSONS.length, 'st_l'], [CARD_COUNT, 'st_c'], [done.length, 'st_d']].map(([n, k]) => (
            <div key={k}><b className="block font-display text-3xl font-bold">{n}</b><span className="text-[13px] text-mute">{t(k)}</span></div>
          ))}
        </div>
      </div>

      <h2 className="mb-0 mt-11 text-[26px] font-bold">{t('path')}</h2>
      <div className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
        {LEVELS.map((v) => {
          const ls = LESSONS.filter((l) => l.level === v.id)
          const d = ls.filter((l) => done.includes(l.id)).length
          return (
            <button key={v.id} className="card border-t-4 border-t-lv" style={{ '--c': v.color }} onClick={() => go(v.id)}>
              <span className="badge">{ls.length} {t('lessons')}</span>
              <h3 className="mb-0.5 mt-1.5 text-[28px] font-bold">{v.n} {t(`lv_${v.id}_t`)}</h3>
              <p className="mb-3.5 text-sm text-mute">{t(`lv_${v.id}_d`)}</p>
              <div className="h-1.5 overflow-hidden rounded-full bg-panel2"><div className="h-full rounded-full bg-lv transition-[width] duration-500" style={{ width: `${(d / ls.length) * 100}%` }} /></div>
              <small className="text-mute">{d} / {ls.length} {t('known_l')}</small>
            </button>
          )
        })}
      </div>
    </div>
  )
}
