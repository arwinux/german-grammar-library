// Reads content/German-Grammar-Library/**/*.md and writes src/data/lessons.json
import fs from 'node:fs'
import path from 'node:path'

const ROOT = 'content/German-Grammar-Library'
const GROUPS = [
  ['overview', ['Idee', 'Goldene', 'Mini-Regelkarte', 'Visuelle', 'Merksatz']],
  ['rules', ['Regeln', 'Zusätzliche', 'Nicht verwechseln', 'Typische Fehler', 'Satz-Labor']],
  ['examples', ['Beispiele', 'Mini-Dialog']],
  ['practice', ['Mini-Test', 'Sprechen', 'Schreib', 'Karteikarten']],
  ['review', ['30-Sekunden', 'Spaced']],
]
const KEYS = [['Idee','idee'],['Goldene','formel'],['Mini-Regelkarte','regelkarte'],['Visuelle','merkhilfe'],['Merksatz','merksatz'],['Zusätzliche','uebersichten'],['Nicht verwechseln','verwechseln'],['Typische','fehler'],['Satz-Labor','labor'],['Regeln','regeln'],['Alltag','alltag'],['Mini-Dialog','dialog'],['Beispiele','beispiele'],['Mini-Test','test'],['Sprechen','sprechen'],['Schreib','schreiben'],['Karteikarten','karten'],['30-Sekunden','wiederholung'],['Spaced','plan']]
const CLS = [['formel','Goldene'],['fehler','Typische'],['verw','verwechseln'],['merk','Merksatz']]

const group = (h) => (GROUPS.find(([, ks]) => ks.some((k) => h.includes(k))) || ['rules'])[0]
const keyOf = (h) => (KEYS.find(([k]) => h.includes(k)) || ['', ''])[1]
const clsOf = (h) => (CLS.find(([, k]) => h.includes(k)) || ['x'])[0]

function pairs(body) {
  const out = []
  for (const block of body.trim().split(/\n\s*\n/)) {
    let de, fa = '', ic = '🇩🇪'
    for (const line of block.split('\n')) {
      if (line.includes('🇩🇪')) { const [a, b] = line.split('🇩🇪'); ic = a.trim() || '🇩🇪'; de = b.trim() }
      else if (line.includes('🇮🇷')) fa = line.split('🇮🇷')[1].trim()
    }
    if (de) out.push({ ic, de, fa })
  }
  return out
}

const lessons = []
for (const dir of fs.readdirSync(ROOT).filter((d) => /^0\d/.test(d)).sort()) {
  for (const file of fs.readdirSync(path.join(ROOT, dir)).filter((f) => f.endsWith('.md')).sort()) {
    let text = fs.readFileSync(path.join(ROOT, dir, file), 'utf8')
    const fm = text.match(/^---\n([\s\S]*?)\n---\n/)
    const meta = fm[1]; text = text.slice(fm[0].length)
    const title = meta.match(/title:\s*"(.*?)"/)[1]
    const level = meta.match(/level:\s*"(.*?)"/)[1].toLowerCase()
    const tags = [...meta.matchAll(/^\s+-\s+(.+)$/gm)].map((m) => m[1])
    const goal = (text.match(/\*\*Lernziel:\*\*\s*(.+)/) || [0, ''])[1].trim()
    const sections = text.split(/^## /m).slice(1).map((p) => {
      const i = p.indexOf('\n'); const head = p.slice(0, i).trim(); const body = p.slice(i + 1)
      const s = { t: head, g: group(head), cls: clsOf(head), k: keyOf(head) }
      if (head.startsWith('Beispiele') || head.includes('Beispiele im Alltag') || head.includes('Mini-Dialog')) {
        const pr = pairs(body); if (pr.length) Object.assign(s, { type: 'ex', pairs: pr })
      }
      if (head.includes('Karteikarten')) {
        const cards = [...body.matchAll(/\*\*Frage:\*\*\s*([\s\S]*?)\n\s*\*\*Antwort:\*\*\s*([\s\S]*?)(?=\n- \*\*Frage|$)/g)].map((m) => ({ q: m[1].trim(), a: m[2].trim() }))
        if (cards.length) Object.assign(s, { type: 'cards', cards })
      }
      if (!s.type) Object.assign(s, { type: 'md', md: body.trim() })
      return s
    })
    lessons.push({ id: `${level}-${file.slice(0, 2)}`, level, title, goal, tags, sections })
  }
}
fs.mkdirSync('src/data', { recursive: true })
fs.writeFileSync('src/data/lessons.json', JSON.stringify({ lessons }))
console.log(`${lessons.length} lessons written to src/data/lessons.json`)
