import QuizGame from '../components/QuizGame.jsx';
import { entre, barajar } from '../utils/aleatorio.js';

// Se trabaja con enteros + cantidad de decimales para evitar errores de punto flotante
const formatear = (entero, dec) => {
  if (dec === 0) return String(entero);
  const s = String(Math.abs(entero)).padStart(dec + 1, '0');
  let r = `${s.slice(0, -dec)}.${s.slice(-dec)}`.replace(/\.?0+$/, '');
  return (entero < 0 ? '-' : '') + r;
};

function numeroDecimal(maxEntero) {
  const dec = Math.random() < 0.7 ? 1 : 2;
  const v = entre(1, maxEntero * 10 ** dec);
  return { v, dec };
}

function generar() {
  const tipo = entre(1, 3);
  let x, y;
  if (tipo === 1) { x = numeroDecimal(9); y = { v: entre(2, 9), dec: 0 }; }       // decimal × entero
  else if (tipo === 2) { x = { v: entre(11, 99), dec: 1 }; y = { v: entre(2, 9), dec: 1 }; } // decimal × decimal
  else { x = { v: entre(2, 20), dec: 0 }; y = numeroDecimal(5); }               // entero × decimal

  // Evitar factores que terminen en 0 (p. ej. 2.0)
  if (x.dec && x.v % 10 === 0) x.v += 1;
  if (y.dec && y.v % 10 === 0) y.v += 1;

  const prod = x.v * y.v;
  const dec = x.dec + y.dec;
  const correcta = formatear(prod, dec);

  const candidatos = barajar([
    formatear(prod, dec + 1),           // punto corrido a la izquierda
    formatear(prod, Math.max(0, dec - 1)), // punto corrido a la derecha
    formatear(prod + 10 ** Math.max(0, dec - 1), dec),
    formatear(prod - 10 ** Math.max(0, dec - 1), dec),
    formatear(prod + 1, dec),
    formatear(x.v + y.v, Math.max(x.dec, y.dec)), // sumó en lugar de multiplicar
  ]);
  const opciones = new Set([correcta]);
  for (const c of candidatos) {
    if (!c.startsWith('-') && Number(c) > 0) opciones.add(c);
    if (opciones.size === 4) break;
  }

  const a = formatear(x.v, x.dec);
  const b = formatear(y.v, y.dec);
  return {
    clave: `${a}x${b}`,
    enunciado: `¿Cuánto es ${a} × ${b}?`,
    voz: `¿Cuánto es ${a.replace('.', ' punto ')} por ${b.replace('.', ' punto ')}?`,
    visual: <div className="operacion">{a} × {b} = <span className="incognita">?</span></div>,
    opciones: barajar([...opciones]).map((v) => ({ valor: v, contenido: v })),
    correcta,
    explicacion: (
      <>Multiplica sin el punto: {x.v} × {y.v} = {prod}. Luego cuenta {dec} {dec === 1 ? 'decimal' : 'decimales'}: <strong>{correcta}</strong></>
    ),
  };
}

export default function DecimalesGame({ actividad }) {
  return <QuizGame actividad={actividad} generar={generar} total={10} />;
}
