import { useState, useRef, useCallback, useEffect } from 'react';
import Resultado from './Resultado.jsx';
import useGuardarProgreso from '../hooks/useGuardarProgreso.js';
import { hablar } from '../utils/aleatorio.js';

const PUNTOS_POR_ACIERTO = 10;

/**
 * Motor genérico de juegos de preguntas (RF-02, RF-03, RF-04, RF-05).
 * `generar()` devuelve: { clave, enunciado, voz?, visual?, opciones:[{valor, contenido}], correcta, explicacion? }
 */
export default function QuizGame({ actividad, generar, total = 10, columnas = 2 }) {
  const { estado, error, guardar, reiniciar } = useGuardarProgreso(actividad);
  const usadas = useRef(new Set());

  const nueva = useCallback(() => {
    let p;
    for (let i = 0; i < 15; i++) {
      p = generar();
      if (!usadas.current.has(p.clave)) break;
    }
    usadas.current.add(p.clave);
    return p;
  }, [generar]);

  const [indice, setIndice] = useState(0);
  const [pregunta, setPregunta] = useState(nueva);
  const [seleccion, setSeleccion] = useState(null);
  const [puntaje, setPuntaje] = useState(0);
  const [aciertos, setAciertos] = useState(0);
  const [racha, setRacha] = useState(0);
  const [terminado, setTerminado] = useState(false);
  const inicio = useRef(Date.now());

  const esCorrecta = seleccion !== null && seleccion === pregunta.correcta;

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  function responder(valor) {
    if (seleccion !== null) return;
    setSeleccion(valor);
    if (valor === pregunta.correcta) {
      setPuntaje((p) => p + PUNTOS_POR_ACIERTO);
      setAciertos((a) => a + 1);
      setRacha((r) => r + 1);
    } else {
      setRacha(0);
    }
  }

  function siguiente() {
    if (indice + 1 >= total) {
      setTerminado(true);
      guardar({
        puntaje,
        aciertos,
        total_preguntas: total,
        duracion_segundos: Math.round((Date.now() - inicio.current) / 1000),
      });
      return;
    }
    setIndice((i) => i + 1);
    setPregunta(nueva());
    setSeleccion(null);
  }

  function jugarOtraVez() {
    usadas.current = new Set();
    setIndice(0);
    setPregunta(nueva());
    setSeleccion(null);
    setPuntaje(0);
    setAciertos(0);
    setRacha(0);
    setTerminado(false);
    reiniciar();
    inicio.current = Date.now();
  }

  if (terminado) {
    return (
      <Resultado
        puntaje={puntaje}
        aciertos={aciertos}
        total={total}
        estado={estado}
        error={error}
        onReintentarGuardar={() => guardar()}
        onJugarOtraVez={jugarOtraVez}
      />
    );
  }

  return (
    <div className="juego">
      <Marcador indice={indice} total={total} puntaje={puntaje} racha={racha} />

      <div className="tarjeta pregunta">
        <div className="pregunta-titulo">
          <h2>{pregunta.enunciado}</h2>
          <button
            className="boton-voz"
            onClick={() => hablar(pregunta.voz || pregunta.enunciado)}
            aria-label="Escuchar la pregunta"
            title="Escuchar"
          >🔊</button>
        </div>

        {pregunta.visual && <div className="pregunta-visual">{pregunta.visual}</div>}

        <div className={`opciones opciones-${columnas}`}>
          {pregunta.opciones.map((op) => {
            let clase = 'opcion';
            if (seleccion !== null) {
              if (op.valor === pregunta.correcta) clase += ' opcion-correcta';
              else if (op.valor === seleccion) clase += ' opcion-incorrecta';
              else clase += ' opcion-apagada';
            }
            return (
              <button
                key={String(op.valor)}
                className={clase}
                onClick={() => responder(op.valor)}
                disabled={seleccion !== null}
              >
                {op.contenido}
              </button>
            );
          })}
        </div>
      </div>

      {seleccion !== null && (
        <div className={`retro ${esCorrecta ? 'retro-bien' : 'retro-mal'}`} role="status" aria-live="polite">
          <div className="retro-texto">
            <span className="retro-icono">{esCorrecta ? '🎉' : '💪'}</span>
            <div>
              <strong>{esCorrecta ? '¡Correcto! +10 puntos' : '¡Casi! Sigue intentando'}</strong>
              {!esCorrecta && pregunta.explicacion && <div className="retro-detalle">{pregunta.explicacion}</div>}
            </div>
          </div>
          <button className="boton boton-grande" onClick={siguiente} autoFocus>
            {indice + 1 >= total ? 'Ver resultado 🏁' : 'Siguiente ➡️'}
          </button>
        </div>
      )}
    </div>
  );
}

export function Marcador({ indice, total, puntaje, racha, extra }) {
  return (
    <div className="marcador">
      {total ? (
        <div className="progreso" aria-label={`Pregunta ${indice + 1} de ${total}`}>
          <div className="progreso-relleno" style={{ width: `${(indice / total) * 100}%` }} />
          <span className="progreso-texto">{indice + 1} / {total}</span>
        </div>
      ) : extra}
      <div className="puntos" aria-live="polite">⭐ {puntaje}</div>
      {racha >= 3 && <div className="racha">🔥 {racha}</div>}
    </div>
  );
}
