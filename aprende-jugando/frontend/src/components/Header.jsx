import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEstudiante } from '../context/EstudianteContext.jsx';

export default function Header() {
  const { estudiante, seleccionar } = useEstudiante();
  const navigate = useNavigate();

  return (
    <header className="cabecera">
      <Link to={estudiante ? '/actividades' : '/'} className="logo">
        <span className="logo-icono">🎈</span> Aprende Jugando
      </Link>
      <nav className="nav">
        {estudiante && (
          <>
            <NavLink to="/actividades" className="nav-link">🎮 Juegos</NavLink>
            <span className="chip-estudiante" title="Estudiante activo">
              👦 {estudiante.nombre}
            </span>
            <button
              className="nav-link boton-texto"
              onClick={() => { seleccionar(null); navigate('/'); }}
            >
              Cambiar
            </button>
          </>
        )}
        <NavLink to="/docentes" className="nav-link">📊 Docentes</NavLink>
      </nav>
    </header>
  );
}
