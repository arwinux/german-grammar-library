import { useI18n } from '../i18n'
import { LESSONS, levelOf } from '../lib/data'
import { go } from '../lib/useHash'

export default function Level({ id, done }) {
  const { t } = useI18n()
  const v = levelOf(id)
  return (
    <div className="mx-auto max-w-[900px] px-7 pb-28 pt-8 max-md:px-4 max-md:pt-5" style={{ '--c': v.color }}>
      <span className="badge">{v.n}</span>
      <h1 className="mb-1 mt-3 text-[46px] font-bold">{t(`lv_${id}_t`)}</h1>
      <p className="my-4 border-s-[3px] border-lv ps-4 text-[19px] text-mute">{t(`lv_${id}_d`)}</p>
      <div className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
        {LESSONS.filter((l) => l.level === id).map((l, j) => (
          <button key={l.id} className="card" style={{ '--c': v.color }} onClick={() => go(l.id)}>
            <span className="badge">{String(j + 1).padStart(2, '0')}{done.includes(l.id) ? ' ✓' : ''}</span>
            <h3 className="mb-1.5 mt-2.5 text-xl font-bold [unicode-bidi:plaintext]">{l.title}</h3>
            <div className="text-sm text-mute">{l.goal.slice(0, 110)}{l.goal.length > 110 ? '…' : ''}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
