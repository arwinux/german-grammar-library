import { useI18n } from '../i18n'
import { AUTHOR } from '../lib/author'
import { ICONS } from '../lib/icons'

// Slim credit bar: copyright on one side, icon links on the other.
// Each icon expands into a small pill with the link text on hover or keyboard focus.
export default function Footer() {
  const { t } = useI18n()
  return (
    <footer className="mx-auto max-w-[900px] px-7 pb-8 max-md:px-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <p className="m-0 text-xs text-mute">
          {t('made_by')} <span dir="ltr" className="font-semibold text-ink" style={{ unicodeBidi: 'isolate' }}>{AUTHOR.handle}</span> · MIT License
        </p>
        <ul className="m-0 flex list-none gap-1.5 p-0">
          {AUTHOR.links.map((l) => (
            <li key={l.id}>
              <a href={l.href} target="_blank" rel="noopener noreferrer" aria-label={`${l.label}: ${l.text}`} title={l.label}
                className="group flex h-8 items-center overflow-hidden rounded-full border border-line bg-panel text-mute no-underline transition-colors hover:border-acc hover:text-acc focus-visible:border-acc focus-visible:text-acc">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="m-[7px] size-[18px] flex-none fill-current"><path d={ICONS[l.id]} /></svg>
                <span dir="ltr" className="max-w-0 whitespace-nowrap pe-0 text-xs font-medium opacity-0 transition-all duration-300 group-hover:max-w-[200px] group-hover:pe-3 group-hover:opacity-100 group-focus-visible:max-w-[200px] group-focus-visible:pe-3 group-focus-visible:opacity-100">
                  {l.text}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
