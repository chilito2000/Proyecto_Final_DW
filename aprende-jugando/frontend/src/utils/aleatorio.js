export const entre = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
export const elegir = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function barajar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const mcd = (a, b) => (b === 0 ? Math.abs(a) : mcd(b, a % b));

// Lee un texto en voz alta (apoyo para niños que aún no leen)
export function hablar(texto) {
  try {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = 'es-MX';
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  } catch { /* sin soporte de voz */ }
}
