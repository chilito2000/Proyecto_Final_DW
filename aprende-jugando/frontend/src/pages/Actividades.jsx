import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { useEstudiante } from '../context/EstudianteContext.jsx';
import Mensaje from '../components/Mensaje.jsx';

const NIVELES = [
  { id: 'preprimaria', titulo: '🧸 Pre-primaria' },
  { id: 'primaria', titulo: '📘 Primaria' },
];

// Catálogo de actividades obtenido desde MySQL (RF-07)
export default function Actividades() {
  const { estudiante } = useEstudiante();
  const [nivel, setNivel] = useState(estudiante.edad <= 6 ? 'preprimaria' : 'primaria');
  const [actividades, setActividades] = useState([]);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  const cargar = () => {
    setCargando(true);
    setError('');
    api.listarActividades()
      .then(setActividades)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  };
  useEffect(cargar, []);

  const visibles = actividades.filter((a) => a.nivel === nivel);

  return (
    <div>
      <h1 className="titulo-pagina">¿A qué jugamos hoy, {estudiante.nombre.split(' ')[0]}?</h1>

      <div className="pestanas" role="tablist">
        {NIVELES.map((n) => (
          <button
            key={n.id}
            role="tab"
            aria-selected={nivel === n.id}
            className={`pestana ${nivel === n.id ? 'activa' : ''}`}
            onClick={() => setNivel(n.id)}
          >
            {n.titulo}
          </button>
        ))}
      </div>

      {cargando && <p>Cargando juegos...</p>}
      {error && <Mensaje tipo="error" onReintentar={cargar}>{error}</Mensaje>}

      <div className="catalogo">
        {visibles.map((a) => (
          <Link key={a.id} to={`/juego/${a.codigo}`} className="actividad" style={{ '--color': a.color }}>
            <span className="actividad-icono">{a.icono}</span>
            <span className="actividad-area">{a.area}</span>
            <strong className="actividad-nombre">{a.nombre}</strong>
            <span className="actividad-desc">{a.descripcion}</span>
            <span className="actividad-jugar">Jugar ▶</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
