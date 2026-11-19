import { useMemo, useState } from 'react'
import { useI18n } from '../i18n'
import { LESSONS, cardsOf } from '../lib/data'
import Cards from './Cards'

export default function Trainer() {
  const { t } = useI18n()
  const [seed, setSeed] = useState(0)
  const deck = useMemo(() => {
    const all = LESSONS.flatMap((l) => cardsOf(l).map((c) => ({ ...c, src: l.title })))
    for (let i = all.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [all[i], all[j]] = [all[j], all[i]] }
    return all.slice(0, 25)
  }, [seed])
  return (
    <div className="mx-auto max-w-[900px] px-7 pb-28 pt-8 max-md:px-4 max-md:pt-5">
      <span className="text-xs font-semibold uppercase tracking-[.14em] text-acc">{t('tr_e')}</span>
      <h1 className="mb-1.5 mt-2 text-[44px] font-bold">{t('tr_t')}</h1>
      <p className="my-4 border-s-[3px] border-acc ps-4 text-[19px] text-mute">{t('tr_p')}</p>
      <Cards key={seed} cards={deck} />
      <div className="mt-5 text-center"><button className="btn btn-ghost" onClick={() => setSeed(seed + 1)}>🔀 {t('shuffle')}</button></div>
    </div>
  )
}
