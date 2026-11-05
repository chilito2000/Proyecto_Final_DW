import QuizGame from '../components/QuizGame.jsx';
import Fraccion, { BarraFraccion } from '../components/Fraccion.jsx';
import { entre, elegir, barajar, mcd } from '../utils/aleatorio.js';

const simplificar = (n, d) => { const g = mcd(n, d); return [n / g, d / g]; };
const clave = ([n, d]) => { const [a, b] = simplificar(n, d); return `${a}/${b}`; };

function generar() {
  const mismoDen = Math.random() < 0.5;
  let a, b, c, d;
  if (mismoDen) {
    d = b = entre(3, 10);
    a = entre(1, b - 1);
    c = entre(1, d - 1);
  } else {
    b = elegir([2, 3, 4, 5, 6]);
    do { d = elegir([2, 3, 4, 5, 6, 8]); } while (d === b);
    a = entre(1, b - 1);
    c = entre(1, d - 1);
  }
  // Resultado: a/b + c/d = (a·d + c·b) / (b·d), simplificado
  const correcta = simplificar(a * d + c * b, b * d);

  // Distractores basados en errores comunes
  const candidatos = [
    [a + c, b + d],                     // sumar numeradores y denominadores
    [a + c, Math.max(b, d)],            // sumar solo numeradores
    [a * c, b * d],                     // multiplicar en vez de sumar
    [correcta[0] + 1, correcta[1]],
    [Math.max(1, correcta[0] - 1), correcta[1]],
    [correcta[0], correcta[1] + 1],
  ];
  const opciones = [correcta];
  const vistas = new Set([clave(correcta)]);
  for (const f of barajar(candidatos)) {
    const s = simplificar(...f);
    if (!vistas.has(clave(s))) { vistas.add(clave(s)); opciones.push(s); }
    if (opciones.length === 4) break;
  }

  const explicacion = mismoDen ? (
    <>Mismo denominador: se suman los numeradores ({a} + {c} = {a + c}):{' '}
      <Fraccion n={a + c} d={b} />{correcta[1] !== b && <> = <Fraccion n={correcta[0]} d={correcta[1]} /></>}</>
  ) : (
    <>Denominador común {b}×{d} = {b * d}: <Fraccion n={a * d} d={b * d} /> + <Fraccion n={c * b} d={b * d} /> = <Fraccion n={a * d + c * b} d={b * d} /> = <Fraccion n={correcta[0]} d={correcta[1]} /></>
  );

  return {
    clave: `${a}/${b}+${c}/${d}`,
    enunciado: 'Resuelve la suma de quebrados',
    voz: `¿Cuánto es ${a} sobre ${b} más ${c} sobre ${d}?`,
    visual: (
      <div className="suma-fracciones">
        <div className="sumando"><Fraccion n={a} d={b} grande /><BarraFraccion n={a} d={b} color="#F2547D" /></div>
        <span className="signo">+</span>
        <div className="sumando"><Fraccion n={c} d={d} grande /><BarraFraccion n={c} d={d} color="#2D9CDB" /></div>
        <span className="signo">=</span>
        <span className="incognita">?</span>
      </div>
    ),
    opciones: barajar(opciones).map(([n, dd]) => ({ valor: `${n}/${dd}`, contenido: <Fraccion n={n} d={dd} /> })),
    correcta: `${correcta[0]}/${correcta[1]}`,
    explicacion,
  };
}

export default function QuebradosGame({ actividad }) {
  return <QuizGame actividad={actividad} generar={generar} total={10} />;
}
