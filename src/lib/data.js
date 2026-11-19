import raw from '../data/lessons.json'

export const LESSONS = raw.lessons
export const LEVELS = [
  { id: 'a1', n: 'A1', color: 'var(--a1)' },
  { id: 'a2', n: 'A2', color: 'var(--a2)' },
  { id: 'b1', n: 'B1', color: 'var(--b1)' },
  { id: 'b2', n: 'B2', color: 'var(--b2)' },
]
export const levelOf = (id) => LEVELS.find((l) => l.id === id)
export const TABS = ['overview', 'rules', 'examples', 'practice', 'review']

// Search index is built once: title/tags/goal weigh more than body text.
export const INDEX = LESSONS.map((l) => ({
  l,
  s: (l.title + ' ' + l.tags.join(' ') + ' ' + l.goal).toLowerCase(),
  c: l.sections.map((s) => s.md || '').join(' ').toLowerCase(),
}))
export const cardsOf = (l) => (l.sections.find((s) => s.type === 'cards') || { cards: [] }).cards
export const CARD_COUNT = LESSONS.reduce((a, l) => a + cardsOf(l).length, 0)
