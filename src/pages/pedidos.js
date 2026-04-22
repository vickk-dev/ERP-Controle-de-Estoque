import { useState, useEffect, useCallback } from "react";
import { StatusDevolucao } from "./Pedidos/StatusDevolucao";
import { ModalDevolucao } from "./Pedidos/ModalDevolucao";
import { fetchContratosAtivos, patchDevolucao } from "./Pedidos/PedidoApi";

const ITENS_POR_PAGINA = 7;

function formatarData(dataISO) {
  if (!dataISO) return "—";
  return new Date(dataISO).toLocaleDateString("pt-BR");
}

function Pedidos() {

  const [contratos, setContratos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroTela, setErroTela] = useState("");
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);
  const [contratoSelecionado, setContratoSelecionado] = useState(null);
  const [devolvendo, setDevolvendo] = useState(false);
  const [erroDevolucao, setErroDevolucao] = useState("");

  const carregarContratos = useCallback(async () => {
    setCarregando(true);
    setErroTela("");
    try {
      const data = await fetchContratosAtivos();
      setContratos(data);
    } catch (err) {
      setErroTela(err.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarContratos();
  }, [carregarContratos]);

  async function handleConfirmarDevolucao() {
    if (!contratoSelecionado) return;
    setDevolvendo(true);
    setErroDevolucao("");
    try {
      await patchDevolucao(contratoSelecionado.id_contrato);
      setContratoSelecionado(null);
      await carregarContratos();
    } catch (err) {
      setErroDevolucao(err.message);
    } finally {
      setDevolvendo(false);
    }
  }

  const contratosFiltrados = contratos.filter((c) => {
    const q = busca.toLowerCase();
    return (
      String(c.id_contrato).includes(q) ||
      c.cliente?.toLowerCase().includes(q) ||
      c.ferramentas?.toLowerCase().includes(q)
    );
  });

  const totalPaginas = Math.max(1, Math.ceil(contratosFiltrados.length / ITENS_POR_PAGINA));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const contratosPagina = contratosFiltrados.slice(inicio, inicio + ITENS_POR_PAGINA);

  function handleBusca(e) {
    setBusca(e.target.value);
    setPagina(1);
  }

  return (
    <div style={S.pagina}>
      <div style={S.topBar}>
        <div style={S.inputWrap}>
          <input
            type="text"
            placeholder="Pesquisar"
            value={busca}
            onChange={handleBusca}
            style={S.input}
          />
          <span style={S.inputIcone}>🔍</span>
        </div>
        <button style={S.btnFiltro}>Filtro</button>
      </div>

      {/* Header azul */}
      <div style={S.header}>
        <span style={S.headerTitulo}>Aluguel</span>
      </div>

      {/* Erros */}
      {erroTela && (
        <div style={S.erroBox} role="alert">
          <span>⚠ {erroTela}</span>
          <button onClick={carregarContratos} style={S.btnRetry}>Tentar novamente</button>
        </div>
      )}
      {erroDevolucao && (
        <div style={S.erroBox} role="alert">⚠ {erroDevolucao}</div>
      )}

      {/* Tabela */}
      {carregando ? (
        <div style={S.estadoVazio}>Carregando contratos...</div>
      ) : contratosFiltrados.length === 0 && !erroTela ? (
        <div style={S.estadoVazio}>Nenhum contrato encontrado.</div>
      ) : (
        <div style={S.tabelaWrap}>
          {contratosPagina.map((c) => (
            <div key={c.id_contrato} style={S.linha}>
              <span style={S.celulaId}>{c.id_contrato}</span>
              <span style={S.celulaCliente}>{c.cliente}</span>
              <span style={S.celulaData}>{formatarData(c.data_prevista)}</span>
              <span style={S.celulaFerramenta}>{c.ferramentas}</span>
              <span style={S.celulaBadge}>
                <StatusDevolucao status={c.status} diasAtraso={c.dias_atraso ?? 0} />
              </span>
              <span style={S.celulaAcao}>
                <button
                  style={S.btnDevolver}
                  onClick={() => { setErroDevolucao(""); setContratoSelecionado(c); }}
                  aria-label={`Devolver contrato ${c.id_contrato}`}
                >
                  Devolver
                </button>
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Paginação */}
      {!carregando && totalPaginas > 1 && (
        <div style={S.paginacao}>
          <span style={S.paginacaoLabel}>Página:</span>
          <button
            style={S.paginaBtnNav}
            onClick={() => setPagina((p) => Math.max(1, p - 1))}
            disabled={paginaAtual === 1}
          >
            {"<"}
          </button>
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              style={S.paginaBtn(n === paginaAtual)}
              onClick={() => setPagina(n)}
            >
              {n}
            </button>
          ))}
          <button
            style={S.paginaBtnNav}
            onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
            disabled={paginaAtual === totalPaginas}
          >
            {">"}
          </button>
        </div>
      )}

      <ModalDevolucao
        contrato={contratoSelecionado}
        onConfirmar={handleConfirmarDevolucao}
        onCancelar={() => { setContratoSelecionado(null); setErroDevolucao(""); }}
        carregando={devolvendo}
      />
    </div>
  );
}

const FONT = "'Trebuchet MS', 'Segoe UI', sans-serif";
const BEGE = "#d6d0c4";
const AZUL = "#1a3a6b";
const BORDA = "#a09880";

const S = {
  pagina: {
    background: "#e8e2d6",
    minHeight: "100vh",
    padding: "70px 16px 40px",
    fontFamily: FONT,
    boxSizing: "border-box",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    gap: "10px",
  },
  inputWrap: {
    position: "relative",
    flex: 1,
    maxWidth: "280px",
  },
  input: {
    width: "100%",
    padding: "8px 36px 8px 14px",
    border: `2px solid ${BORDA}`,
    borderRadius: "20px",
    fontSize: "14px",
    fontFamily: FONT,
    background: "#f0ece4",
    color: "#333",
    outline: "none",
    boxSizing: "border-box",
  },
  inputIcone: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "14px",
    pointerEvents: "none",
  },
  btnFiltro: {
    background: AZUL,
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "8px 24px",
    fontSize: "14px",
    fontWeight: 700,
    fontFamily: FONT,
    cursor: "pointer",
    letterSpacing: "0.03em",
  },
  header: {
    background: AZUL,
    borderRadius: "4px 4px 0 0",
    padding: "10px 20px",
    textAlign: "center",
    marginBottom: "0",
  },
  headerTitulo: {
    color: "#fff",
    fontSize: "16px",
    fontWeight: 700,
    letterSpacing: "0.05em",
  },
  tabelaWrap: {
    border: `1px solid ${BORDA}`,
    borderTop: "none",
  },
  linha: {
    display: "flex",
    alignItems: "center",
    background: BEGE,
    borderBottom: `1px solid ${BORDA}`,
    minHeight: "40px",
  },
  celulaId: {
    width: "60px",
    padding: "8px 12px",
    fontSize: "13px",
    fontWeight: 700,
    color: "#333",
    borderRight: `1px solid ${BORDA}`,
    flexShrink: 0,
    textAlign: "center",
  },
  celulaCliente: {
    flex: 2,
    padding: "8px 14px",
    fontSize: "13px",
    color: "#222",
    borderRight: `1px solid ${BORDA}`,
  },
  celulaData: {
    flex: 1,
    padding: "8px 14px",
    fontSize: "13px",
    color: "#444",
    borderRight: `1px solid ${BORDA}`,
  },
  celulaFerramenta: {
    flex: 2,
    padding: "8px 14px",
    fontSize: "13px",
    color: "#222",
    borderRight: `1px solid ${BORDA}`,
    textAlign: "center",
  },
  celulaBadge: {
    width: "110px",
    padding: "8px 10px",
    borderRight: `1px solid ${BORDA}`,
    display: "flex",
    justifyContent: "center",
    flexShrink: 0,
  },
  celulaAcao: {
    width: "90px",
    padding: "8px 10px",
    display: "flex",
    justifyContent: "center",
    flexShrink: 0,
  },
  btnDevolver: {
    background: "#2e7d32",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    padding: "4px 12px",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: FONT,
  },
  erroBox: {
    background: "#fff0f0",
    border: "1px solid #e8a0a0",
    borderRadius: "4px",
    padding: "10px 16px",
    fontSize: "13px",
    color: "#a32d2d",
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    fontFamily: FONT,
  },
  btnRetry: {
    background: "none",
    border: "1px solid #c0392b",
    borderRadius: "4px",
    padding: "3px 10px",
    fontSize: "12px",
    color: "#c0392b",
    cursor: "pointer",
    fontFamily: FONT,
  },
  estadoVazio: {
    textAlign: "center",
    padding: "40px 0",
    color: "#888",
    fontSize: "14px",
    fontFamily: FONT,
    background: BEGE,
    border: `1px solid ${BORDA}`,
    borderTop: "none",
  },
  paginacao: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "4px",
    marginTop: "16px",
    fontFamily: FONT,
    fontSize: "14px",
    color: "#333",
  },
  paginacaoLabel: {
    marginRight: "4px",
    color: "#444",
    fontWeight: 500,
  },
  paginaBtn: (ativo) => ({
    minWidth: "28px",
    height: "28px",
    padding: "0 6px",
    border: ativo ? `2px solid ${AZUL}` : "2px solid transparent",
    borderRadius: "4px",
    background: "none",
    color: ativo ? AZUL : "#444",
    fontWeight: ativo ? 700 : 400,
    fontSize: "14px",
    cursor: "pointer",
    fontFamily: FONT,
  }),
  paginaBtnNav: {
    minWidth: "28px",
    height: "28px",
    padding: "0 6px",
    border: "none",
    background: "none",
    color: "#444",
    fontSize: "14px",
    cursor: "pointer",
    fontFamily: FONT,
  },
};

export default Pedidos;