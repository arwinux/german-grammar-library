import { marked } from 'marked'

marked.setOptions({ breaks: true, gfm: true })

// Tables are wrapped so they can scroll horizontally on small screens.
// Flag emojis (🇩🇪 🇮🇷) are not drawn by Windows fonts (they show as the letters "DE" / "IR"),
// so they are replaced by small CSS flags that look the same on every device.
const FLAGS = [[/\u{1F1E9}\u{1F1EA}/gu, 'de', 'Deutsch'], [/\u{1F1EE}\u{1F1F7}/gu, 'ir', 'فارسی']]
export const flagify = (s) =>
  FLAGS.reduce((a, [re, code, label]) => a.replace(re, `<span class="flag flag-${code}" role="img" aria-label="${label}"></span>`), s)
export const hasFlag = (s) => FLAGS.some(([re]) => new RegExp(re.source, 'u').test(s))

export const md = (s) =>
  flagify(marked.parse(s).replace(/<table>/g, '<div class="tw"><table>').replace(/<\/table>/g, '</table></div>'))
export const inline = (s) => flagify(marked.parseInline(s))
