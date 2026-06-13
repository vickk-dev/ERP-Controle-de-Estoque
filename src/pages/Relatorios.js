import { useState } from "react";

const API_BASE = process.env.REACT_APP_API_URL || "https://localhost:7131";

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
        setErro(err.message || "Erro de conexão com o servidor.");
      }
      setContratos(null);
    } finally {
      setLoading(false);
    }
  };

  const totalFaturado = (contratos || []).reduce((acc, c) => acc + Number(c.valor_total || 0), 0);

  return (
    <div style={s.pagina}>
      <div style={s.conteudo}>
        
        <h2 style={s.tituloPagina}>Relatório de Faturamento</h2>

        <div style={s.cardFiltro}>
          <div style={s.cardHeader}>
            <span style={s.cardHeaderTexto}>Consultar por Período</span>
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
            <span style={s.estadoTexto}>Nenhum contrato encontrado no período informado.</span>
          </div>
        )}

        {!loading && !erro && contratos !== null && contratos.length > 0 && (
          <div style={s.cardTabela}>
            <div style={s.tabelaHeader}>
              <span style={{ ...s.thCol, flex: 1 }}>Nº Contrato</span>
              <span style={{ ...s.thCol, flex: 2 }}>Cliente</span>
              <span style={{ ...s.thCol, flex: 2 }}>Ferramenta</span>
              <span style={{ ...s.thCol, flex: 1 }}>Data Início</span>
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
            <span style={s.estadoTexto}>Selecione o período e clique em Buscar.</span>
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
  pagina: { backgroundColor: "#f4f4f9", minHeight: "100vh" },
  conteudo: { padding: "0 14px 20px", maxWidth: 960, margin: "80px auto 20px", display: "flex", flexDirection: "column", gap: 14 },
  tituloPagina: { fontSize: "24px", fontWeight: "700", color: "#1a2a5e", marginBottom: "10px" },
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