export default function Mensaje({ tipo = 'info', children, onReintentar }) {
  return (
    <div className={`mensaje mensaje-${tipo}`} role={tipo === 'error' ? 'alert' : 'status'}>
      <span>{children}</span>
      {onReintentar && <button className="boton boton-pequeno" onClick={onReintentar}>Reintentar</button>}
    </div>
  );
}
