// Muestra una fracción con numerador sobre denominador
export default function Fraccion({ n, d, grande }) {
  return (
    <span className={`fraccion ${grande ? 'fraccion-grande' : ''}`} aria-label={`${n} sobre ${d}`}>
      <span className="fraccion-n">{n}</span>
      <span className="fraccion-d">{d}</span>
    </span>
  );
}

// Barra dividida en partes para visualizar la fracción
export function BarraFraccion({ n, d, color = '#F2547D' }) {
  return (
    <div className="barra-fraccion" aria-hidden="true">
      {Array.from({ length: d }, (_, i) => (
        <span key={i} style={{ background: i < n ? color : 'transparent' }} />
      ))}
    </div>
  );
}
