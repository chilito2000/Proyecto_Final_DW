import { useState, useMemo } from 'react';
import QuizGame from '../components/QuizGame.jsx';
import { entre, barajar } from '../utils/aleatorio.js';

function crearGenerador(tabla) {
  return () => {
    const a = tabla === 'todas' ? entre(2, 10) : tabla;
    const b = entre(1, 10);
    const r = a * b;
    const distractores = new Set();
    const candidatos = barajar([a * (b + 1), a * (b - 1), (a + 1) * b, (a - 1) * b, r + 1, r - 1, r + 2, r + 10, r - 10]);
    for (const c of candidatos) {
      if (c > 0 && c !== r) distractores.add(c);
      if (distractores.size === 3) break;
    }
    return {
      clave: `${a}x${b}`,
      enunciado: `¿Cuánto es ${a} × ${b}?`,
      voz: `¿Cuánto es ${a} por ${b}?`,
      visual: <div className="operacion">{a} × {b} = <span className="incognita">?</span></div>,
      opciones: barajar([r, ...distractores]).map((v) => ({ valor: v, contenido: v })),
      correcta: r,
      explicacion: <>{a} × {b} = <strong>{r}</strong></>,
    };
  };
}

export default function TablasGame({ actividad }) {
  const [tabla, setTabla] = useState(null);
  const generar = useMemo(() => (tabla ? crearGenerador(tabla) : null), [tabla]);

  if (!tabla) {
    return (
      <div className="tarjeta selector">
        <h2>¿Qué tabla quieres practicar?</h2>
        <div className="selector-grid">
          {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <button key={n} className="boton boton-grande" onClick={() => setTabla(n)}>Tabla del {n}</button>
          ))}
          <button className="boton boton-grande boton-verde" onClick={() => setTabla('todas')}>🎲 Todas</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <button className="boton-texto volver-selector" onClick={() => setTabla(null)}>← Cambiar tabla</button>
      <QuizGame key={tabla} actividad={actividad} generar={generar} total={10} />
    </>
  );
}
