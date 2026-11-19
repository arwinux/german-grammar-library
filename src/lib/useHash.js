import { useEffect, useState } from 'react'

const read = () => location.hash.slice(1)
export const go = (h) => { location.hash = h }
// Hash routing keeps the app deployable on any static host without rewrite rules.
export function useHash() {
  const [h, setH] = useState(read())
  useEffect(() => {
    const f = () => setH(read())
    addEventListener('hashchange', f)
    return () => removeEventListener('hashchange', f)
  }, [])
  return h
}
