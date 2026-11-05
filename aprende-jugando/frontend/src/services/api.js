// Cliente HTTP para la API REST del backend (Express)
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/$/, '');

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. ¿Está encendida la API?');
  }
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data;
}

export const api = {
  // Estudiantes (RF-01)
  listarEstudiantes: () => request('/estudiantes'),
  crearEstudiante: (nombre, edad) =>
    request('/estudiantes', { method: 'POST', body: JSON.stringify({ nombre, edad }) }),

  // Actividades (RF-07)
  listarActividades: (nivel) => request(`/actividades${nivel ? `?nivel=${nivel}` : ''}`),
  obtenerActividad: (codigo) => request(`/actividades/${encodeURIComponent(codigo)}`),

  // Progresos (RF-05, RF-06, RF-08)
  registrarProgreso: (datos) => request('/progresos', { method: 'POST', body: JSON.stringify(datos) }),
  listarProgresos: ({ estudiante_id, actividad } = {}) => {
    const q = new URLSearchParams();
    if (estudiante_id) q.set('estudiante_id', estudiante_id);
    if (actividad) q.set('actividad', actividad);
    const s = q.toString();
    return request(`/progresos${s ? `?${s}` : ''}`);
  },
  resumenProgresos: (estudiante_id) =>
    request(`/progresos/resumen${estudiante_id ? `?estudiante_id=${estudiante_id}` : ''}`),
};
