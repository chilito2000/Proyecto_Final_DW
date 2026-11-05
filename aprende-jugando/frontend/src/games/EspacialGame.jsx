import QuizGame from '../components/QuizGame.jsx';
import { elegir, barajar } from '../utils/aleatorio.js';

// Conocimientos espaciales: Adentro/Afuera, Arriba/Abajo, Cerca/Lejos, Encima/Debajo
const OBJETOS = [
  { emoji: '⚽', nombre: 'la pelota' },
  { emoji: '🐱', nombre: 'el gato' },
  { emoji: '🧸', nombre: 'el osito' },
  { emoji: '🍎', nombre: 'la manzana' },
  { emoji: '🐶', nombre: 'el perro' },
  { emoji: '🐰', nombre: 'el conejo' },
];

const Emoji = ({ x, y, s = 44, children }) => (
  <text x={x} y={y} fontSize={s} textAnchor="middle" dominantBaseline="central">{children}</text>
);

function Escena({ children, etiqueta }) {
  return (
    <svg className="escena" viewBox="0 0 320 220" role="img" aria-label={etiqueta}>
      <rect x="0" y="0" width="320" height="220" rx="18" fill="#EAF6FF" />
      <rect x="0" y="180" width="320" height="40" fill="#BDE7A6" />
      {children}
    </svg>
  );
}

function adentroAfuera() {
  const obj = elegir(OBJETOS);
  const respuesta = elegir(['adentro', 'afuera']);
  const visual = (
    <Escena etiqueta={`${obj.nombre} y la caja`}>
      {/* caja abierta */}
      <rect x="100" y="95" width="120" height="85" fill="#C98B4B" stroke="#8A5A2B" strokeWidth="4" />
      <polygon points="100,95 80,70 140,70 160,95" fill="#DDA76A" stroke="#8A5A2B" strokeWidth="3" />
      <polygon points="220,95 240,70 180,70 160,95" fill="#DDA76A" stroke="#8A5A2B" strokeWidth="3" />
      {respuesta === 'adentro' ? (
        <>
          <Emoji x={160} y={128}>{obj.emoji}</Emoji>
          <rect x="100" y="150" width="120" height="30" fill="#C98B4B" />
        </>
      ) : (
        <Emoji x={elegir([45, 275])} y={155}>{obj.emoji}</Emoji>
      )}
    </Escena>
  );
  return {
    clave: `aa-${obj.emoji}-${respuesta}`,
    enunciado: `¿Dónde está ${obj.nombre}?`,
    voz: `¿${obj.nombre} está adentro o afuera de la caja?`,
    visual,
    opciones: [
      { valor: 'adentro', contenido: <>📦 Adentro de la caja</> },
      { valor: 'afuera', contenido: <>🚪 Afuera de la caja</> },
    ],
    correcta: respuesta,
    explicacion: `${obj.nombre} está ${respuesta} de la caja.`,
  };
}

function arribaAbajo() {
  const obj = elegir(OBJETOS);
  const respuesta = elegir(['arriba', 'abajo']);
  const y = respuesta === 'arriba' ? 62 : 137;
  const visual = (
    <Escena etiqueta={`${obj.nombre} en un estante`}>
      {/* estante de dos niveles */}
      <rect x="70" y="20" width="180" height="160" fill="#F5D9B0" stroke="#8A5A2B" strokeWidth="5" rx="6" />
      <rect x="70" y="97" width="180" height="8" fill="#8A5A2B" />
      <text x="58" y="62" fontSize="22" textAnchor="middle">⬆️</text>
      <text x="58" y="140" fontSize="22" textAnchor="middle">⬇️</text>
      <Emoji x={160} y={y}>{obj.emoji}</Emoji>
      <Emoji x={215} y={respuesta === 'arriba' ? 140 : 62} s={30}>📚</Emoji>
    </Escena>
  );
  return {
    clave: `ab-${obj.emoji}-${respuesta}`,
    enunciado: `¿En qué parte del estante está ${obj.nombre}?`,
    voz: `¿${obj.nombre} está arriba o abajo?`,
    visual,
    opciones: [
      { valor: 'arriba', contenido: <>⬆️ Arriba</> },
      { valor: 'abajo', contenido: <>⬇️ Abajo</> },
    ],
    correcta: respuesta,
    explicacion: `${obj.nombre} está en la parte de ${respuesta}.`,
  };
}

function cercaLejos() {
  const obj = elegir(OBJETOS);
  const respuesta = elegir(['cerca', 'lejos']);
  const visual = (
    <Escena etiqueta={`${obj.nombre} y la casa`}>
      <Emoji x={60} y={140} s={80}>🏠</Emoji>
      <Emoji x={60} y={45} s={30}>☀️</Emoji>
      {respuesta === 'cerca'
        ? <Emoji x={128} y={160} s={44}>{obj.emoji}</Emoji>
        : <Emoji x={290} y={165} s={28}>{obj.emoji}</Emoji>}
      <Emoji x={215} y={40} s={26}>☁️</Emoji>
    </Escena>
  );
  return {
    clave: `cl-${obj.emoji}-${respuesta}`,
    enunciado: `¿${obj.nombre[0].toUpperCase() + obj.nombre.slice(1)} está cerca o lejos de la casa?`,
    visual,
    opciones: [
      { valor: 'cerca', contenido: <>🤏 Cerca</> },
      { valor: 'lejos', contenido: <>🔭 Lejos</> },
    ],
    correcta: respuesta,
    explicacion: `${obj.nombre} está ${respuesta} de la casa.`,
  };
}

function encimaDebajo() {
  const obj = elegir(OBJETOS);
  const respuesta = elegir(['encima', 'debajo']);
  const visual = (
    <Escena etiqueta={`${obj.nombre} y la mesa`}>
      {/* mesa */}
      <rect x="80" y="100" width="160" height="14" rx="4" fill="#A0672F" />
      <rect x="92" y="114" width="12" height="66" fill="#8A5A2B" />
      <rect x="216" y="114" width="12" height="66" fill="#8A5A2B" />
      {respuesta === 'encima'
        ? <Emoji x={160} y={76}>{obj.emoji}</Emoji>
        : <Emoji x={160} y={154}>{obj.emoji}</Emoji>}
    </Escena>
  );
  return {
    clave: `ed-${obj.emoji}-${respuesta}`,
    enunciado: `¿Dónde está ${obj.nombre}?`,
    voz: `¿${obj.nombre} está encima o debajo de la mesa?`,
    visual,
    opciones: [
      { valor: 'encima', contenido: <>🔝 Encima de la mesa</> },
      { valor: 'debajo', contenido: <>🔽 Debajo de la mesa</> },
    ],
    correcta: respuesta,
    explicacion: `${obj.nombre} está ${respuesta} de la mesa.`,
  };
}

const TIPOS = [adentroAfuera, arribaAbajo, cercaLejos, encimaDebajo];
let cola = [];

// Reparte los 4 conceptos de forma equilibrada
function generar() {
  if (!cola.length) cola = barajar(TIPOS);
  return cola.pop()();
}

export default function EspacialGame({ actividad }) {
  return <QuizGame actividad={actividad} generar={generar} total={12} />;
}
