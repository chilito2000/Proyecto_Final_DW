import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';
import Mensaje from '../components/Mensaje.jsx';

const fmtFecha = (f) =>
  new Date(f).toLocaleString('es-GT', { dateStyle: 'short', timeStyle: 'short' });
const fmtTiempo = (s) => (s >= 60 ? `${Math.floor(s / 60)} min ${s % 60} s` : `${s} s`);

const COLUMNAS = [
  { k: 'fecha', t: 'Fecha' },
  { k: 'estudiante', t: 'Estudiante' },
  { k: 'actividad', t: 'Actividad' },
  { k: 'nivel', t: 'Nivel' },
  { k: 'puntaje', t: 'Puntaje' },
  { k: 'porcentaje', t: 'Aciertos' },
  { k: 'duracion_segundos', t: 'Tiempo' },
];

// Tablero de seguimiento para docentes (RF-06, RF-08)
export default function PanelDocente() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [estudianteId, setEstudianteId] = useState('');
  const [actividad, setActividad] = useState('');
  const [progresos, setProgresos] = useState([]);
  const [resumen, setResumen] = useState([]);
  const [orden, setOrden] = useState({ k: 'fecha', asc: false });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const [ms, setMs] = useState(null);

  useEffect(() => {
    Promise.all([api.listarEstudiantes(), api.listarActividades()])
      .then(([e, a]) => { setEstudiantes(e); setActividades(a); })
      .catch((e) => setError(e.message));
  }, []);

  const cargar = () => {
    setCargando(true);
    setError('');
    const t0 = performance.now();
    Promise.all([
      api.listarProgresos({ estudiante_id: estudianteId, actividad }),
      api.resumenProgresos(estudianteId),
    ])
      .then(([p, r]) => { setProgresos(p); setResumen(r); setMs(Math.round(performance.now() - t0)); })
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  };
  useEffect(cargar, [estudianteId, actividad]); // eslint-disable-line react-hooks/exhaustive-deps

  const filas = useMemo(() => {
    const conPct = progresos.map((p) => ({
      ...p,
      porcentaje: p.total_preguntas ? Math.round((100 * p.aciertos) / p.total_preguntas) : 0,
    }));
    const { k, asc } = orden;
    return conPct.sort((a, b) => {
      const va = k === 'fecha' ? new Date(a.fecha).getTime() : a[k];
      const vb = k === 'fecha' ? new Date(b.fecha).getTime() : b[k];
      const r = typeof va === 'string' ? va.localeCompare(vb) : va - vb;
      return asc ? r : -r;
    });
  }, [progresos, orden]);

  const totales = useMemo(() => {
    if (!filas.length) return null;
    const puntos = filas.reduce((s, f) => s + f.puntaje, 0);
    const pct = filas.reduce((s, f) => s + f.porcentaje, 0) / filas.length;
    return { partidas: filas.length, promedio: Math.round(puntos / filas.length), pct: Math.round(pct) };
  }, [filas]);

  const sel = estudiantes.find((e) => String(e.id) === String(estudianteId));

  return (
    <div className="panel">
      <h1 className="titulo-pagina">📊 Panel de docentes y tutores</h1>

      <div className="tarjeta filtros">
        <label>
          Estudiante
          <select className="campo" value={estudianteId} onChange={(e) => setEstudianteId(e.target.value)}>
            <option value="">Todos los estudiantes</option>
            {estudiantes.map((e) => (
              <option key={e.id} value={e.id}>{e.nombre} ({e.edad} años)</option>
            ))}
          </select>
        </label>
        <label>
          Actividad
          <select className="campo" value={actividad} onChange={(e) => setActividad(e.target.value)}>
            <option value="">Todas las actividades</option>
            {actividades.map((a) => (
              <option key={a.id} value={a.codigo}>{a.icono} {a.nombre}</option>
            ))}
          </select>
        </label>
        <button className="boton" onClick={cargar}>🔄 Actualizar</button>
      </div>

      {error && <Mensaje tipo="error" onReintentar={cargar}>{error}</Mensaje>}

      {totales && (
        <div className="kpis">
          <div className="kpi"><span>{totales.partidas}</span>partidas</div>
          <div className="kpi"><span>{totales.promedio}</span>puntaje promedio</div>
          <div className="kpi"><span>{totales.pct}%</span>aciertos promedio</div>
          {sel && <div className="kpi"><span>{sel.puntaje_total}</span>puntos acumulados de {sel.nombre.split(' ')[0]}</div>}
        </div>
      )}

      {resumen.length > 0 && (
        <div className="resumen-grid">
          {resumen.map((r) => (
            <div key={r.codigo} className="tarjeta resumen-item">
              <div className="resumen-titulo">{r.icono} {r.actividad}</div>
              <div className="barra"><div style={{ width: `${Math.min(100, r.porcentaje_aciertos ?? 0)}%` }} /></div>
              <small>{r.partidas} partidas · mejor {r.mejor} · {r.porcentaje_aciertos ?? 0}% aciertos</small>
            </div>
          ))}
        </div>
      )}

      <div className="tarjeta tabla-contenedor">
        <div className="tabla-cabecera">
          <h2>Historial de progreso {sel ? `de ${sel.nombre}` : ''}</h2>
          {ms !== null && <small className="tiempo-api">Consulta API: {ms} ms</small>}
        </div>
        {cargando ? <p>Cargando...</p> : !filas.length ? <p>No hay partidas registradas con estos filtros.</p> : (
          <div className="tabla-scroll">
            <table className="tabla">
              <thead>
                <tr>
                  {COLUMNAS.map((c) => (
                    <th key={c.k}>
                      <button
                        className="th-boton"
                        onClick={() => setOrden((o) => ({ k: c.k, asc: o.k === c.k ? !o.asc : c.k !== 'fecha' }))}
                      >
                        {c.t} {orden.k === c.k ? (orden.asc ? '▲' : '▼') : ''}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filas.map((p) => (
                  <tr key={p.id}>
                    <td>{fmtFecha(p.fecha)}</td>
                    <td>
                      <button className="enlace" onClick={() => setEstudianteId(String(p.estudiante_id))}>
                        {p.estudiante}
                      </button>
                    </td>
                    <td>{p.icono} {p.actividad}</td>
                    <td><span className={`etiqueta etiqueta-${p.nivel}`}>{p.nivel === 'preprimaria' ? 'Pre-primaria' : 'Primaria'}</span></td>
                    <td><strong>{p.puntaje}</strong></td>
                    <td>{p.aciertos}/{p.total_preguntas} ({p.porcentaje}%)</td>
                    <td>{fmtTiempo(p.duracion_segundos)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
