import { createContext, useContext, useState, useCallback } from 'react';

const Ctx = createContext(null);
const KEY = 'aj_estudiante';

function leer() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || null;
  } catch {
    return null;
  }
}

export function EstudianteProvider({ children }) {
  const [estudiante, setEstudiante] = useState(leer);

  const seleccionar = useCallback((e) => {
    setEstudiante(e);
    try {
      if (e) localStorage.setItem(KEY, JSON.stringify(e));
      else localStorage.removeItem(KEY);
    } catch { /* almacenamiento no disponible */ }
  }, []);

  return <Ctx.Provider value={{ estudiante, seleccionar }}>{children}</Ctx.Provider>;
}

export const useEstudiante = () => useContext(Ctx);
