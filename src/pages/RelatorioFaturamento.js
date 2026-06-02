import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

function toISOUTC(dataStr, fim = false) {
  const sufixo = fim ? "T23:59:59.999Z" : "T00:00:00.000Z";
  return dataStr + sufixo;
}

function formatarData(isoStr) {
  if (!isoStr) return "-";
  const d = new Date(isoStr);
  return d.toLocaleDateString("pt-BR");
}

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function RelatorioFaturamento({ onVoltar }) {
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [contratos, setContratos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [menuAberto, setMenuAberto] = useState(false);
  const { token } = useAuth();

  const dataFinalMenor = dataFinal && dataInicial && dataFinal < dataInicial;
  const podeConsultar = dataInicial && dataFinal && !dataFinalMenor && !loading;

  const handleBuscar = async () => {
    if (!podeConsultar) return;
    setLoading(true);
    setErro("");
    setContratos(null);

    try {
      const inicio = toISOUTC(dataInicial, false);
      const fim = toISOUTC(dataFinal, true);
      const url = `${API_BASE}/api/v1/contratos/relatorio?inicio=${encodeURIComponent(inicio)}&fim=${encodeURIComponent(fim)}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: Falha ao consultar o servidor.`);
      }

      const dados = await response.json();
      setContratos(Array.isArray(dados) ? dados : dados.contratos || []);
    } catch (err) {
      if (err.name === "TimeoutError" || err.name === "AbortError") {
        setErro("Tempo de resposta excedido. Tente novamente.");
      } else {
        setErro(err.message || "Erro de conexao com o servidor.");
      }
      setContratos(null);
    } finally {
      setLoading(false);
    }
  };

  const totalFaturado = (contratos || []).reduce((acc, c) => acc + Number(c.valor_total || 0), 0);

  return (
    <div style={s.pagina}>
      <div style={s.topbar}>
        <div style={s.topbarEsq}>
          <svg viewBox="0 0 40 40" fill="none" style={{ width: 32, height: 32, flexShrink: 0 }}>
            <circle cx="20" cy="20" r="20" fill="#1a2a5e" />
            <path d="M12 20 C12 15,16 11,20 11 C24 11,28 15,28 20 C28 25,24 29,20 29 C16 29,12 25,12 20Z"
              fill="none" stroke="white" strokeWidth="2.5" />
            <path d="M20 11 L20 8 M20 29 L20 32 M11 20 L8 20 M29 20 L32 20"
              stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="20" cy="20" r="3" fill="white" />
          </svg>
          <span style={s.topbarNome}>O FERRAMENTEIRO</span>
        </div>
        <span style={s.topbarTitulo}>Relatorio de Faturamento</span>
        <div style={s.hamburger} onClick={() => setMenuAberto(!menuAberto)}>
          <span style={s.hambLine} />
          <span style={s.hambLine} />
          <span style={s.hambLine} />
        </div>
        {menuAberto && (
          <div style={s.dropMenu}>
            <button style={s.dropItem} onClick={onVoltar}>Voltar</button>
          </div>
        )}
      </div>

      <div style={s.conteudo}>

        <div style={s.cardFiltro}>
          <div style={s.cardHeader}>
            <span style={s.cardHeaderTexto}>Consultar por Periodo</span>
          </div>
          <div style={s.filtroCorpo}>
            <div style={s.filtroLinha}>
              <div style={s.grupoFiltro}>
                <label style={s.label}>Data Inicial</label>
                <input type="date" style={s.inputData} value={dataInicial}
                  onChange={(e) => { setDataInicial(e.target.value); setContratos(null); setErro(""); }}
                  disabled={loading} />
              </div>
              <div style={s.grupoFiltro}>
                <label style={s.label}>Data Final</label>
                <input type="date"
                  style={{ ...s.inputData, ...(dataFinalMenor ? s.inputErro : {}) }}
                  value={dataFinal}
                  onChange={(e) => { setDataFinal(e.target.value); setContratos(null); setErro(""); }}
                  disabled={loading} />
                {dataFinalMenor && (
                  <span style={s.erroInline}>Data final menor que data inicial.</span>
                )}
              </div>
              <div style={s.grupoBotao}>
                <button
                  style={{ ...s.btnBuscar, ...(!podeConsultar ? s.btnDisabled : {}) }}
                  onClick={handleBuscar}
                  disabled={!podeConsultar}
                >
                  {loading ? "Buscando..." : "Buscar"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div style={s.estadoCentro}>
            <div style={s.spinner} />
            <span style={s.estadoTexto}>Carregando contratos...</span>
          </div>
        )}

        {!loading && erro && (
          <div style={s.erroBox}>
            <span style={s.erroIcone}>✕</span> {erro}
          </div>
        )}

        {!loading && !erro && contratos !== null && contratos.length === 0 && (
          <div style={s.estadoCentro}>
            <span style={s.estadoIcone}>📋</span>
            <span style={s.estadoTexto}>Nenhum contrato encontrado no periodo informado.</span>
          </div>
        )}

        {!loading && !erro && contratos !== null && contratos.length > 0 && (
          <div style={s.cardTabela}>
            <div style={s.tabelaHeader}>
              <span style={{ ...s.thCol, flex: 1 }}>Nº Contrato</span>
              <span style={{ ...s.thCol, flex: 2 }}>Cliente</span>
              <span style={{ ...s.thCol, flex: 2 }}>Ferramenta</span>
              <span style={{ ...s.thCol, flex: 1 }}>Data Inicio</span>
              <span style={{ ...s.thCol, flex: 1 }}>Data Fim</span>
              <span style={{ ...s.thCol, flex: 1, textAlign: "right" }}>Valor</span>
            </div>

            {contratos.map((c, i) => (
              <div key={c.id || i} style={{ ...s.tabelaLinha, backgroundColor: i % 2 === 0 ? "#c8c8a8" : "#d2d2b0" }}>
                <span style={{ ...s.tdCol, flex: 1 }}>{c.numero || c.id || "-"}</span>
                <span style={{ ...s.tdCol, flex: 2 }}>{c.cliente || c.nome_cliente || "-"}</span>
                <span style={{ ...s.tdCol, flex: 2 }}>{c.ferramenta || c.nome_modelo || "-"}</span>
                <span style={{ ...s.tdCol, flex: 1 }}>{formatarData(c.data_inicio)}</span>
                <span style={{ ...s.tdCol, flex: 1 }}>{formatarData(c.data_fim)}</span>
                <span style={{ ...s.tdCol, flex: 1, textAlign: "right", fontWeight: 600, color: "#1a2a5e" }}>
                  {formatarMoeda(c.valor_total)}
                </span>
              </div>
            ))}

            <div style={s.linhaTotalFaturado}>
              <span style={{ flex: 1 }} /><span style={{ flex: 2 }} />
              <span style={{ flex: 2 }} /><span style={{ flex: 1 }} />
              <span style={{ ...s.totalLabel, flex: 1 }}>Total:</span>
              <span style={{ ...s.totalValor, flex: 1 }}>{formatarMoeda(totalFaturado)}</span>
            </div>
          </div>
        )}

        {!loading && !erro && contratos === null && (
          <div style={s.estadoCentro}>
            <span style={s.estadoIcone}>🔍</span>
            <span style={s.estadoTexto}>Selecione o periodo e clique em Buscar.</span>
          </div>
        )}

      </div>

      <style>{`
        @keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}

const s = {
  pagina: { minHeight: "100vh", backgroundColor: "#d4d4b8", fontFamily: "'Segoe UI','Roboto',sans-serif" },
  topbar: { position: "relative", backgroundColor: "#FFD600", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" },
  topbarEsq: { display: "flex", alignItems: "center", gap: 8 },
  topbarNome: { fontWeight: "700", fontSize: 13, color: "#1a1a1a" },
  topbarTitulo: { fontWeight: "600", fontSize: 15, color: "#1a1a1a" },
  hamburger: { display: "flex", flexDirection: "column", gap: 5, cursor: "pointer", padding: 4 },
  hambLine: { display: "block", width: 24, height: 3, backgroundColor: "#1a2a5e", borderRadius: 2 },
  dropMenu: { position: "absolute", top: 52, right: 0, backgroundColor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", borderRadius: "0 0 6px 6px", zIndex: 100, minWidth: 140 },
  dropItem: { display: "block", width: "100%", padding: "10px 16px", background: "none", border: "none", textAlign: "left", cursor: "pointer", fontSize: 14, color: "#333" },
  conteudo: { padding: "16px 14px", maxWidth: 960, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 },
  cardFiltro: { backgroundColor: "#c8c8a8", borderRadius: 6, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.1)" },
  cardHeader: { backgroundColor: "#1a2a5e", padding: "8px 16px", textAlign: "center" },
  cardHeaderTexto: { color: "#FFD600", fontWeight: "700", fontSize: 14 },
  filtroCorpo: { padding: "14px 16px" },
  filtroLinha: { display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap" },
  grupoFiltro: { display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: 160 },
  grupoBotao: { display: "flex", alignItems: "flex-end" },
  label: { fontSize: 12, color: "#444", fontWeight: "600" },
  inputData: { backgroundColor: "#e8e8cc", border: "none", borderRadius: 3, padding: "7px 10px", fontSize: 13, color: "#1a1a1a", outline: "none", width: "100%", boxSizing: "border-box" },
  inputErro: { border: "1.5px solid #c0392b" },
  erroInline: { fontSize: 11, color: "#c0392b", marginTop: 2 },
  btnBuscar: { backgroundColor: "#1a2a5e", color: "#FFD600", border: "none", borderRadius: 4, padding: "8px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  btnDisabled: { opacity: 0.45, cursor: "not-allowed" },
  erroBox: { backgroundColor: "#fde8e8", border: "1px solid #e0a0a0", borderRadius: 6, padding: "12px 16px", color: "#c0392b", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 },
  erroIcone: { fontWeight: 700, fontSize: 15 },
  estadoCentro: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 0", gap: 12 },
  estadoIcone: { fontSize: 40 },
  estadoTexto: { fontSize: 14, color: "#666", textAlign: "center" },
  spinner: { width: 32, height: 32, border: "3px solid rgba(26,42,94,0.2)", borderTopColor: "#1a2a5e", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  cardTabela: { backgroundColor: "#c8c8a8", borderRadius: 6, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.1)" },
  tabelaHeader: { backgroundColor: "#1a2a5e", display: "flex", padding: "9px 16px" },
  thCol: { flex: 1, color: "#FFD600", fontWeight: 700, fontSize: 12, textAlign: "left" },
  tabelaLinha: { display: "flex", padding: "9px 16px", borderBottom: "1px solid #b8b898" },
  tdCol: { flex: 1, fontSize: 13, color: "#1a1a1a" },
  linhaTotalFaturado: { display: "flex", padding: "10px 16px", backgroundColor: "#1a2a5e", alignItems: "center" },
  totalLabel: { color: "#FFD600", fontWeight: 700, fontSize: 13, textAlign: "right" },
  totalValor: { color: "#FFD600", fontWeight: 700, fontSize: 14, textAlign: "right" },
};

export default RelatorioFaturamento;