import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api.js';
import Mensaje from '../components/Mensaje.jsx';
import EspacialGame from '../games/EspacialGame.jsx';
import FigurasGame from '../games/FigurasGame.jsx';
import MemoriaGame from '../games/MemoriaGame.jsx';
import TablasGame from '../games/TablasGame.jsx';
import QuebradosGame from '../games/QuebradosGame.jsx';
import DecimalesGame from '../games/DecimalesGame.jsx';

// Relación entre el código de la actividad (BD) y su componente
const JUEGOS = {
  espacial: EspacialGame,
  figuras: FigurasGame,
  memoria: MemoriaGame,
  tablas: TablasGame,
  quebrados: QuebradosGame,
  decimales: DecimalesGame,
};

export default function Juego() {
  const { codigo } = useParams();
  const [actividad, setActividad] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setActividad(null);
    setError('');
    api.obtenerActividad(codigo).then(setActividad).catch((e) => setError(e.message));
  }, [codigo]);

  const Componente = JUEGOS[codigo];

  if (error || !Componente) {
    return (
      <div>
        <Mensaje tipo="error">{error || 'Este juego no existe.'}</Mensaje>
        <Link to="/actividades" className="boton">← Volver</Link>
      </div>
    );
  }
  if (!actividad) return <p>Cargando juego...</p>;

  return (
    <div className="pagina-juego" style={{ '--color': actividad.color }}>
      <div className="juego-cabecera">
        <Link to="/actividades" className="boton-texto">← Juegos</Link>
        <h1><span aria-hidden="true">{actividad.icono}</span> {actividad.nombre}</h1>
      </div>
      <Componente actividad={actividad} />
    </div>
  );
}
