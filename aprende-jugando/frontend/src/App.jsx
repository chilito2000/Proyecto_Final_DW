import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import Inicio from './pages/Inicio.jsx';
import Actividades from './pages/Actividades.jsx';
import Juego from './pages/Juego.jsx';
import PanelDocente from './pages/PanelDocente.jsx';
import { useEstudiante } from './context/EstudianteContext.jsx';

function RequiereEstudiante({ children }) {
  const { estudiante } = useEstudiante();
  return estudiante ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <>
      <Header />
      <main className="contenedor">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/actividades" element={<RequiereEstudiante><Actividades /></RequiereEstudiante>} />
          <Route path="/juego/:codigo" element={<RequiereEstudiante><Juego /></RequiereEstudiante>} />
          <Route path="/docentes" element={<PanelDocente />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="pie">Aprende Jugando · React + Express + MySQL</footer>
    </>
  );
}
