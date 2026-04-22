export function StatusDevolucao({ status, diasAtraso }) {
  const atrasado = diasAtraso > 0 || status === "ATRASADO";
  const pendente = status === "PENDENTE" || (!atrasado && status !== "NO_PRAZO");

  let label = "No prazo";
  let bg = "#4a7c3f";

  if (atrasado) { label = `Atrasado${diasAtraso > 0 ? ` (${diasAtraso}d)` : ""}`; bg = "#c0392b"; }
  else if (pendente) { label = "Pendente"; bg = "#c0392b"; }

  return (
    <span style={{
      display: "inline-block",
      padding: "3px 12px",
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: 700,
      color: "#fff",
      background: bg,
      fontFamily: "'Trebuchet MS', sans-serif",
      letterSpacing: "0.02em",
    }}>
      {label}
    </span>
  );
}