import { useState, useCallback, useRef } from 'react';
import { api } from '../services/api.js';
import { useEstudiante } from '../context/EstudianteContext.jsx';

// Envía el resultado de la partida por HTTP POST (RF-05)
export default function useGuardarProgreso(actividad) {
  const { estudiante } = useEstudiante();
  const [estado, setEstado] = useState('inactivo');
  const [error, setError] = useState('');
  const ultimo = useRef(null);

  const guardar = useCallback(async (datos) => {
    const payload = datos ?? ultimo.current;
    if (!payload || !estudiante) return;
    ultimo.current = payload;
    setEstado('guardando');
    setError('');
    try {
      await api.registrarProgreso({
        estudiante_id: estudiante.id,
        actividad_id: actividad.id,
        ...payload,
      });
      setEstado('guardado');
    } catch (e) {
      setError(e.message);
      setEstado('error');
    }
  }, [estudiante, actividad]);

  const reiniciar = useCallback(() => { setEstado('inactivo'); setError(''); }, []);

  return { estado, error, guardar, reiniciar };
}
