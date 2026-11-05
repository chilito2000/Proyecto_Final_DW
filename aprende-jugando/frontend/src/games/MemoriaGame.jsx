import { useState, useRef, useEffect } from 'react';
import Resultado from '../components/Resultado.jsx';
import { Marcador } from '../components/QuizGame.jsx';
import useGuardarProgreso from '../hooks/useGuardarProgreso.js';
import { barajar, elegir } from '../utils/aleatorio.js';

const TEMAS = {
  Animales: ['🐶', '🐱', '🐰', '🐸', '🐵', '🦁', '🐼', '🐷', '🐮', '🐔'],
  Frutas: ['🍎', '🍌', '🍇', '🍓', '🍉', '🍍', '🍊', '🍐', '🥭', '🍒'],
  Transportes: ['🚗', '🚌', '🚲', '✈️', '🚀', '🚂', '⛵', '🚁', '🚜', '🛵'],
};
const PARES = 6;
const PUNTOS_PAR = 10;

function nuevoTablero(tema) {
  const simbolos = barajar(TEMAS[tema]).slice(0, PARES);
  return barajar([...simbolos, ...simbolos]).map((s, i) => ({ id: i, s, encontrada: false }));
}

export default function MemoriaGame({ actividad }) {
  const [tema, setTema] = useState(() => elegir(Object.keys(TEMAS)));
  const [cartas, setCartas] = useState(() => nuevoTablero(tema));
  const [abiertas, setAbiertas] = useState([]);
  const [pares, setPares] = useState(0);
  const [intentos, setIntentos] = useState(0);
  const [puntaje, setPuntaje] = useState(0);
  const [mensaje, setMensaje] = useState('');
  const [terminado, setTerminado] = useState(false);
  const bloqueado = useRef(false);
  const inicio = useRef(Date.now());
  const temporizador = useRef(null);
  const { estado, error, guardar, reiniciar } = useGuardarProgreso(actividad);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  function voltear(carta) {
    if (bloqueado.current || carta.encontrada || abiertas.includes(carta.id)) return;
    const nuevas = [...abiertas, carta.id];
    setAbiertas(nuevas);
    if (nuevas.length < 2) return;

    bloqueado.current = true;
    const [a, b] = nuevas.map((id) => cartas[id]);
    const totalIntentos = intentos + 1;
    setIntentos(totalIntentos);

    if (a.s === b.s) {
      const totalPares = pares + 1;
      const nuevoPuntaje = puntaje + PUNTOS_PAR;
      setMensaje('🎉 ¡Encontraste un par! +10');
      setCartas((cs) => cs.map((c) => (c.s === a.s ? { ...c, encontrada: true } : c)));
      setPares(totalPares);
      setPuntaje(nuevoPuntaje);
      setAbiertas([]);
      bloqueado.current = false;

      if (totalPares === PARES) {
        const errores = totalIntentos - PARES;
        const bono = Math.max(0, 40 - errores * 5);
        const final = nuevoPuntaje + bono;
        setPuntaje(final);
        temporizador.current = setTimeout(() => {
          setTerminado(true);
          guardar({
            puntaje: final,
            aciertos: PARES,
            total_preguntas: totalIntentos,
            duracion_segundos: Math.round((Date.now() - inicio.current) / 1000),
          });
        }, 900);
      }
    } else {
      setMensaje('🙈 No son iguales, ¡recuerda dónde están!');
      temporizador.current = setTimeout(() => {
        setAbiertas([]);
        bloqueado.current = false;
      }, 1000);
    }
  }

  function jugarOtraVez() {
    const t = elegir(Object.keys(TEMAS));
    setTema(t);
    setCartas(nuevoTablero(t));
    setAbiertas([]);
    setPares(0);
    setIntentos(0);
    setPuntaje(0);
    setMensaje('');
    setTerminado(false);
    reiniciar();
    bloqueado.current = false;
    inicio.current = Date.now();
  }

  if (terminado) {
    return (
      <Resultado
        puntaje={puntaje}
        aciertos={PARES}
        total={intentos}
        estado={estado}
        error={error}
        onReintentarGuardar={() => guardar()}
        onJugarOtraVez={jugarOtraVez}
      />
    );
  }

  return (
    <div className="juego">
      <Marcador
        puntaje={puntaje}
        racha={0}
        extra={<div className="memoria-info">🧩 Pares: {pares}/{PARES} · 👆 Intentos: {intentos}</div>}
      />
      <div className="tarjeta">
        <div className="pregunta-titulo">
          <h2>Encuentra los pares · {tema}</h2>
        </div>
        <div className="memoria-tablero">
          {cartas.map((c) => {
            const visible = c.encontrada || abiertas.includes(c.id);
            return (
              <button
                key={c.id}
                className={`carta ${visible ? 'carta-visible' : ''} ${c.encontrada ? 'carta-encontrada' : ''}`}
                onClick={() => voltear(c)}
                aria-label={visible ? c.s : 'Carta boca abajo'}
              >
                <span className="carta-interior">
                  <span className="carta-frente">❓</span>
                  <span className="carta-reverso">{c.s}</span>
                </span>
              </button>
            );
          })}
        </div>
        <p className="memoria-mensaje" aria-live="polite">{mensaje || 'Toca dos cartas para voltearlas.'}</p>
      </div>
    </div>
  );
}
