import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { useEstudiante } from '../context/EstudianteContext.jsx';
import Mensaje from '../components/Mensaje.jsx';

export default function Inicio() {
  const { estudiante, seleccionar } = useEstudiante();
  const navigate = useNavigate();
  const [estudiantes, setEstudiantes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorLista, setErrorLista] = useState('');
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState(6);
  const [enviando, setEnviando] = useState(false);
  const [errorForm, setErrorForm] = useState('');
  const [buscar, setBuscar] = useState('');

  const cargar = () => {
    setCargando(true);
    setErrorLista('');
    api.listarEstudiantes()
      .then(setEstudiantes)
      .catch((e) => setErrorLista(e.message))
      .finally(() => setCargando(false));
  };
  useEffect(cargar, []);

  function entrar(e) {
    seleccionar({ id: e.id, nombre: e.nombre, edad: e.edad });
    navigate('/actividades');
  }

  async function registrar(ev) {
    ev.preventDefault();
    setErrorForm('');
    if (nombre.trim().length < 2) return setErrorForm('Escribe tu nombre (mínimo 2 letras).');
    setEnviando(true);
    try {
      const nuevo = await api.crearEstudiante(nombre.trim(), Number(edad));
      entrar(nuevo);
    } catch (e) {
      setErrorForm(e.message);
    } finally {
      setEnviando(false);
    }
  }

  const filtrados = estudiantes.filter((e) => e.nombre.toLowerCase().includes(buscar.toLowerCase()));

  return (
    <div className="inicio">
      <section className="bienvenida">
        <h1>¡Hola! Vamos a <span className="resaltado">aprender jugando</span> 🎈</h1>
        <p>Juegos para pre-primaria y primaria: formas, posiciones, memoria y matemáticas.</p>
        {estudiante && (
          <button className="boton boton-grande boton-verde" onClick={() => navigate('/actividades')}>
            ▶️ Seguir jugando como {estudiante.nombre}
          </button>
        )}
      </section>

      <div className="inicio-grid">
        <form className="tarjeta formulario" onSubmit={registrar} noValidate>
          <h2>✏️ Soy nuevo</h2>
          <label htmlFor="nombre">¿Cómo te llamas?</label>
          <input
            id="nombre"
            className="campo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Escribe tu nombre"
            maxLength={80}
            autoComplete="off"
          />
          <label id="lbl-edad">¿Cuántos años tienes?</label>
          <div className="selector-edad" role="group" aria-labelledby="lbl-edad">
            <button type="button" className="boton-circulo" onClick={() => setEdad((v) => Math.max(3, v - 1))} aria-label="Menos">−</button>
            <span className="edad-valor" aria-live="polite">{edad}</span>
            <button type="button" className="boton-circulo" onClick={() => setEdad((v) => Math.min(15, v + 1))} aria-label="Más">+</button>
          </div>
          {errorForm && <Mensaje tipo="error">{errorForm}</Mensaje>}
          <button className="boton boton-grande boton-naranja" disabled={enviando}>
            {enviando ? 'Guardando...' : '🚀 ¡Empezar!'}
          </button>
        </form>

        <section className="tarjeta">
          <h2>👋 Ya he jugado</h2>
          {estudiantes.length > 6 && (
            <input
              className="campo"
              placeholder="🔍 Buscar mi nombre"
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
            />
          )}
          {cargando && <p>Cargando...</p>}
          {errorLista && <Mensaje tipo="error" onReintentar={cargar}>{errorLista}</Mensaje>}
          {!cargando && !errorLista && !estudiantes.length && <p>Todavía no hay estudiantes. ¡Sé el primero!</p>}
          <div className="lista-estudiantes">
            {filtrados.map((e) => (
              <button key={e.id} className="boton-estudiante" onClick={() => entrar(e)}>
                <span className="avatar">{e.nombre[0].toUpperCase()}</span>
                <span>
                  <strong>{e.nombre}</strong>
                  <small>{e.edad} años · ⭐ {e.puntaje_total}</small>
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
