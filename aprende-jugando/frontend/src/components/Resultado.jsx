import { Link } from 'react-router-dom';

export default function Resultado({ puntaje, aciertos, total, estado, error, onReintentarGuardar, onJugarOtraVez }) {
  const porcentaje = total ? aciertos / total : 0;
  const estrellas = porcentaje >= 0.9 ? 3 : porcentaje >= 0.6 ? 2 : porcentaje > 0 ? 1 : 0;
  const titulo = estrellas === 3 ? '¡Excelente!' : estrellas === 2 ? '¡Muy bien!' : '¡Buen intento!';

  return (
    <div className="resultado tarjeta">
      <div className="estrellas" aria-label={`${estrellas} de 3 estrellas`}>
        {[1, 2, 3].map((i) => (
          <span key={i} className={i <= estrellas ? 'estrella activa' : 'estrella'}>★</span>
        ))}
      </div>
      <h2>{titulo}</h2>
      <p className="resultado-puntos">{puntaje} puntos</p>
      <p>Respuestas correctas: <strong>{aciertos} de {total}</strong></p>

      <p className="resultado-guardado">
        {estado === 'guardando' && '💾 Guardando tu progreso...'}
        {estado === 'guardado' && '✅ ¡Progreso guardado!'}
        {estado === 'error' && (
          <>
            ⚠️ {error}{' '}
            <button className="boton boton-pequeno" onClick={onReintentarGuardar}>Reintentar</button>
          </>
        )}
      </p>

      <div className="acciones">
        <button className="boton boton-grande boton-verde" onClick={onJugarOtraVez}>🔁 Jugar otra vez</button>
        <Link className="boton boton-grande" to="/actividades">🏠 Otros juegos</Link>
      </div>
    </div>
  );
}
