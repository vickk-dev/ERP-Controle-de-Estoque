export function ModalDevolucao({ contrato, onConfirmar, onCancelar, carregando }) {
  if (!contrato) return null;

  return (
    <div style={S.overlay} role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
      <div style={S.modal}>
        <div style={S.header}>
          <h2 id="modal-titulo" style={S.headerTitulo}>Confirmar Devolução</h2>
        </div>
        <div style={S.corpo}>
          <p style={S.texto}>
            Deseja confirmar o retorno da ferramenta deste contrato para o estoque?
          </p>

          <div style={S.info}>
            <span style={S.infoLabel}>Contrato</span>
            <span style={S.infoValor}>#{contrato.id_contrato}</span>
            <span style={S.infoLabel}>Cliente</span>
            <span style={S.infoValor}>{contrato.cliente}</span>
            <span style={S.infoLabel}>Ferramenta</span>
            <span style={S.infoValor}>{contrato.ferramentas}</span>
          </div>

          <div style={S.acoes}>
            <button onClick={onCancelar} disabled={carregando} style={S.btnCancelar}>
              Cancelar
            </button>
            <button
              onClick={onConfirmar}
              disabled={carregando}
              style={S.btnConfirmar(carregando)}
              aria-busy={carregando}
            >
              {carregando ? "Registrando..." : "Confirmar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    padding: "16px",
    fontFamily: "'Trebuchet MS', sans-serif",
  },
  modal: {
    background: "#d6d0c4",
    borderRadius: "4px",
    border: "2px solid #a09880",
    padding: "0",
    width: "100%",
    maxWidth: "400px",
    overflow: "hidden",
  },
  header: {
    background: "#1a3a6b",
    padding: "12px 20px",
    textAlign: "center",
  },
  headerTitulo: {
    color: "#fff",
    fontSize: "16px",
    fontWeight: 700,
    margin: 0,
    letterSpacing: "0.03em",
  },
  corpo: {
    padding: "20px",
  },
  texto: {
    fontSize: "14px",
    color: "#333",
    marginBottom: "16px",
    textAlign: "center",
    lineHeight: 1.5,
  },
  info: {
    background: "#c8c2b4",
    border: "1px solid #a09880",
    borderRadius: "3px",
    padding: "10px 14px",
    marginBottom: "20px",
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gap: "5px 12px",
  },
  infoLabel: {
    fontSize: "12px",
    color: "#555",
    fontWeight: 700,
    textTransform: "uppercase",
  },
  infoValor: {
    fontSize: "12px",
    color: "#222",
    fontWeight: 400,
  },
  acoes: {
    display: "flex",
    gap: "10px",
  },
  btnCancelar: {
    flex: 1,
    padding: "9px",
    background: "#8a8070",
    border: "none",
    borderRadius: "4px",
    fontSize: "13px",
    fontWeight: 700,
    color: "#fff",
    cursor: "pointer",
    fontFamily: "inherit",
    letterSpacing: "0.03em",
  },
  btnConfirmar: (carregando) => ({
    flex: 1,
    padding: "9px",
    background: carregando ? "#8aaa88" : "#1a3a6b",
    border: "none",
    borderRadius: "4px",
    fontSize: "13px",
    fontWeight: 700,
    color: "#fff",
    cursor: carregando ? "not-allowed" : "pointer",
    fontFamily: "inherit",
    letterSpacing: "0.03em",
    transition: "background 0.15s",
  }),
};