export function speak(text) {
  try {
    const u = new SpeechSynthesisUtterance(text.replace(/[*_]/g, ''))
    u.lang = 'de-DE'; u.rate = 0.9
    speechSynthesis.cancel(); speechSynthesis.speak(u)
  } catch { /* speech not supported */ }
}
