import { useI18n } from '../i18n'
import { LEVELS, LESSONS } from '../lib/data'
import { AUTHOR } from '../lib/author'
import { go } from '../lib/useHash'

const LANGS = [['de', 'DE'], ['en', 'EN'], ['fa', 'فارسی']]

export default function Sidebar({ open, hash, current, done, lang, setLang, showFa, toggleFa, dark, toggleTheme, openSearch }) {
  const { t } = useI18n()
  return (
    <aside className={`fixed inset-y-0 start-0 z-40 flex min-h-0 w-[min(86vw,320px)] flex-col border-e border-line bg-panel pt-[env(safe-area-inset-top,0px)] transition-transform duration-300 md:static md:w-auto md:pt-0 ${open ? 'max-md:shadow-2xl' : 'max-md:-translate-x-[102%] max-md:rtl:translate-x-[102%]'}`}>
      <div className="flex cursor-pointer items-center gap-3 px-[22px] pb-3.5 pt-[22px]" onClick={() => go('')}>
        <div className="grid size-10 place-items-center rounded-xl bg-linear-to-br from-acc to-[#e9a23b] font-display text-xl font-bold text-white shadow-lg">ä</div>
        <div><b className="block font-display text-[17px] leading-tight">Grammatik-Bibliothek</b><small className="text-xs text-mute">{t('brand_s')}</small></div>
      </div>
      <button onClick={openSearch} className="mx-4 mb-2.5 mt-1.5 flex w-[calc(100%-32px)] items-center gap-2.5 rounded-xl border border-line bg-bg px-3 py-2.5 text-sm text-mute">
        🔍 {t('search')}<kbd className="ms-auto rounded-md border border-line px-1.5 text-[11px]">/</kbd>
      </button>
      <nav className="flex-1 overflow-auto px-2.5 pb-5 pt-1">
        {LEVELS.map((v) => {
          const ls = LESSONS.filter((l) => l.level === v.id)
          const expanded = current?.level === v.id || hash === v.id
          return (
            <div key={v.id} className="my-2" style={{ '--c': v.color }}>
              <button className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-start font-semibold hover:bg-panel2" onClick={() => go(v.id)}>
                <span className="size-2.5 rounded-full bg-lv" />{v.n} · {t(`lv_${v.id}_t`)}
                <span className="ms-auto text-xs font-medium text-mute">{ls.filter((l) => done.includes(l.id)).length}/{ls.length}</span>
              </button>
              {expanded && ls.map((l) => (
                <button key={l.id} onClick={() => go(l.id)}
                  className={`flex w-full items-start gap-2.5 rounded-[10px] py-[7px] pe-3 ps-8 text-start text-sm hover:bg-panel2 ${hash === l.id ? 'bg-accsoft font-medium text-ink' : 'text-mute'}`}>
                  <i className="w-3.5 flex-none not-italic text-lv">{done.includes(l.id) ? '✓' : '·'}</i><span className="[unicode-bidi:plaintext]">{l.title}</span>
                </button>
              ))}
            </div>
          )
        })}
        <button className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-start font-semibold hover:bg-panel2" onClick={() => go('trainer')}>🃏 {t('trainer')}</button>
      </nav>
      <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3">
        <div role="group" aria-label="Language" className="flex w-full overflow-hidden rounded-xl border border-line bg-bg">
          {LANGS.map(([c, n]) => (
            <button key={c} onClick={() => setLang(c)} className={`flex-1 px-1 py-[7px] text-[13px] font-semibold ${lang === c ? 'bg-ink text-bg' : 'text-mute'}`}>{n}</button>
          ))}
        </div>
        <button className={`chip ${showFa ? 'chip-on' : ''}`} onClick={toggleFa}>{t('trt')}</button>
        <button className="chip" onClick={toggleTheme}>{dark ? '☀️ ' + t('light') : '🌙 ' + t('dark')}</button>
        <a href={AUTHOR.links[0].href} target="_blank" rel="noopener noreferrer" className="mt-1 w-full text-center text-xs text-mute no-underline hover:text-acc">
          {t('made_by')} <span dir="ltr" style={{ unicodeBidi: 'isolate' }}>{AUTHOR.handle}</span>
        </a>
      </div>
    </aside>
  )
}
