import QuizGame from '../components/QuizGame.jsx';
import { elegir, barajar, entre } from '../utils/aleatorio.js';

const COLORES = ['#FF8A3D', '#2EB872', '#2D9CDB', '#F2547D', '#8E6CEF', '#E5B700'];
const FIGURAS = {
  circulo:    { nombre: 'Círculo',    articulo: 'el círculo' },
  cuadrado:   { nombre: 'Cuadrado',   articulo: 'el cuadrado' },
  triangulo:  { nombre: 'Triángulo',  articulo: 'el triángulo' },
  rectangulo: { nombre: 'Rectángulo', articulo: 'el rectángulo' },
};
const CLAVES = Object.keys(FIGURAS);

export function Figura({ tipo, color, tam = 120, giro = 0 }) {
  const c = 60;
  let forma;
  if (tipo === 'circulo') forma = <circle cx={c} cy={c} r="48" />;
  if (tipo === 'cuadrado') forma = <rect x="14" y="14" width="92" height="92" rx="4" />;
  if (tipo === 'rectangulo') forma = <rect x="4" y="32" width="112" height="56" rx="4" />;
  if (tipo === 'triangulo') forma = <polygon points="60,10 112,104 8,104" transform={`rotate(${giro} 60 60)`} />;
  return (
    <svg width={tam} height={tam} viewBox="0 0 120 120" aria-label={FIGURAS[tipo].nombre} role="img">
      <g fill={color} stroke="#2B2D42" strokeWidth="4" strokeLinejoin="round">{forma}</g>
    </svg>
  );
}

// Tipo 1: ver la figura y elegir su nombre
function queFiguraEs() {
  const tipo = elegir(CLAVES);
  const color = elegir(COLORES);
  return {
    clave: `n-${tipo}-${color}`,
    enunciado: '¿Qué figura es esta?',
    visual: <Figura tipo={tipo} color={color} tam={170} giro={elegir([0, 0, 180])} />,
    opciones: barajar(CLAVES).map((k) => ({ valor: k, contenido: FIGURAS[k].nombre })),
    correcta: tipo,
    explicacion: `Es un ${FIGURAS[tipo].nombre.toLowerCase()}.`,
  };
}

// Tipo 2: buscar la figura indicada entre varias
function buscaLaFigura() {
  const tipo = elegir(CLAVES);
  const colores = barajar(COLORES);
  return {
    clave: `b-${tipo}-${entre(0, 3)}`,
    enunciado: `Toca ${FIGURAS[tipo].articulo}`,
    opciones: barajar(CLAVES).map((k, i) => ({
      valor: k,
      contenido: <Figura tipo={k} color={colores[i]} tam={96} />,
    })),
    correcta: tipo,
    explicacion: `${FIGURAS[tipo].articulo[0].toUpperCase() + FIGURAS[tipo].articulo.slice(1)} es la figura marcada en verde.`,
  };
}

const generar = () => (Math.random() < 0.5 ? queFiguraEs() : buscaLaFigura());

export default function FigurasGame({ actividad }) {
  return <QuizGame actividad={actividad} generar={generar} total={10} />;
}
