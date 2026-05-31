import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

const FORMAS_PAGAMENTO = ["Pix", "Cartao", "Dinheiro", "Cheque"];

function parseMoeda(valor) {
  const num = parseFloat(String(valor).replace(/\./g, "").replace(",", "."));
  return isNaN(num) ? 0 : num;
}

function formatarMoeda(valor) {
  if (!valor) return "";
  const raw = String(valor).replace(/\D/g, "");
  if (!raw) return "";
  const num = (parseInt(raw, 10) / 100).toFixed(2);
  return num.replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
}

function Toast({ mensagem, tipo }) {
  return (
    <div style={{
      position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
      padding: "12px 28px", borderRadius: 6, fontSize: 14, fontWeight: 600,
      color: "#fff", boxShadow: "0 4px 16px rgba(0,0,0,0.2)", zIndex: 9999, whiteSpace: "nowrap",
      backgroundColor: tipo === "sucesso" ? "#27ae60" : "#c0392b",
    }}>
      {tipo === "sucesso" ? "✓" : "✕"} {mensagem}
    </div>
  );
}

const ITEM_INICIAL = { marca: "", dias: "", quantidade: "", preco_dia: "" };

function CadastroEstoque({ onCancelar }) {
  const [itemForm, setItemForm] = useState(ITEM_INICIAL);
  const [itens, setItens] = useState([]);
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);
  const { token } = useAuth();

  const exibirToast = (mensagem, tipo = "sucesso") => {
    setToast({ mensagem, tipo });
    setTimeout(() => setToast(null), 3500);
  };

  const handleItemChange = (campo) => (e) => {
    const value = e.target.value;
    if (campo === "preco_dia") {
      const raw = value.replace(/\D/g, "");
      setItemForm((prev) => ({ ...prev, preco_dia: raw ? formatarMoeda(raw) : "" }));
    } else if (campo === "dias" || campo === "quantidade") {
      setItemForm((prev) => ({ ...prev, [campo]: value.replace(/\D/g, "") }));
    } else {
      setItemForm((prev) => ({ ...prev, [campo]: value }));
    }
  };

  const adicionarItem = () => {
    const { marca, dias, quantidade, preco_dia } = itemForm;
    if (!marca.trim() || !dias || !quantidade || !preco_dia) {
      exibirToast("Preencha todos os campos do item.", "erro");
      return;
    }
    setItens((prev) => [...prev, {
      id: Date.now(),
      marca: marca.trim(),
      dias: parseInt(dias, 10),
      quantidade: parseInt(quantidade, 10),
      preco_dia: parseMoeda(preco_dia),
    }]);
    setItemForm(ITEM_INICIAL);
  };

  const removerItem = (id) => setItens((prev) => prev.filter((p) => p.id !== id));

  const subtotal = itens.reduce((acc, item) => acc + item.preco_dia * item.quantidade, 0);
  const formValido = itens.length > 0 && pagamentoSelecionado !== "";

  const handleSubmit = async () => {
    if (!formValido || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const payload = {
        forma_pagamento: pagamentoSelecionado,
        items: itens.map(({ marca, dias, quantidade, preco_dia }) => ({
          nome_modelo: marca,
          dias,
          quantidade,
          preco_dia,
        })),
      };

      const response = await fetch(`${API_BASE}/api/v1/estoque/catalogo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000),
      });

      if (response.status === 201 || response.ok) {
        exibirToast("Cadastro realizado com sucesso!", "sucesso");
        setItens([]);
        setItemForm(ITEM_INICIAL);
        setPagamentoSelecionado("");
      } else {
        exibirToast("Erro ao cadastrar. Tente novamente.", "erro");
      }
    } catch {
      exibirToast("Erro de conexao com o servidor.", "erro");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <div style={s.hamburger} onClick={() => setMenuAberto(!menuAberto)}>
          <span style={s.hambLine} />
          <span style={s.hambLine} />
          <span style={s.hambLine} />
        </div>
        {menuAberto && (
          <div style={s.dropMenu}>
            <button style={s.dropItem} onClick={onCancelar}>Voltar</button>
          </div>
        )}
      </div>

      <div style={s.conteudo}>
        <div style={s.colunaEsq}>
          <div style={s.card}>
            <div style={s.cardHeader}>
              <span style={s.cardHeaderTexto}>Cadastro de Aluguel</span>
            </div>
            <div style={s.cardBody}>
              <div style={s.linhaMetade}>
                <div style={s.grupo}>
                  <label style={s.label}>Marca</label>
                  <input style={s.input} type="text"
                    value={itemForm.marca} onChange={handleItemChange("marca")}
                    disabled={isSubmitting} />
                </div>
                <div style={s.grupoDir}>
                  <label style={s.label}>Quantidade</label>
                  <input style={s.input} type="text" inputMode="numeric"
                    value={itemForm.quantidade} onChange={handleItemChange("quantidade")}
                    disabled={isSubmitting} />
                </div>
              </div>

              <div style={s.linhaMetade}>
                <div style={s.grupo}>
                  <label style={s.label}>Dias</label>
                  <input style={s.input} type="text" inputMode="numeric"
                    value={itemForm.dias} onChange={handleItemChange("dias")}
                    disabled={isSubmitting} />
                </div>
                <div style={s.grupoDir}>
                  <label style={s.label}>Valor R$</label>
                  <input style={s.input} type="text" inputMode="numeric"
                    value={itemForm.preco_dia} onChange={handleItemChange("preco_dia")}
                    placeholder="0,00" disabled={isSubmitting} />
                </div>
              </div>

              <button style={s.botaoAdicionar} onClick={adicionarItem} disabled={isSubmitting}>
                + Adicionar item
              </button>
            </div>
          </div>

          <div style={s.card}>
            <div style={s.tabelaHeader}>
              <span style={{ ...s.tabelaCol, flex: 2, textAlign: "left" }}>Ferramentas</span>
              <span style={s.tabelaCol}>Dias</span>
              <span style={s.tabelaCol}>Quantidade</span>
            </div>
            {itens.length === 0 ? (
              <p style={s.semItens}>Nenhum item adicionado ainda.</p>
            ) : (
              itens.map((item) => (
                <div key={item.id} style={s.tabelaLinha}>
                  <span style={{ ...s.tabelaCell, flex: 2, textAlign: "left" }}>{item.marca}</span>
                  <span style={s.tabelaCell}>{item.dias}</span>
                  <span style={{ ...s.tabelaCell, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    {item.quantidade}
                    <button style={s.btnRemover} onClick={() => removerItem(item.id)}>×</button>
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={s.colunaDireita}>
          <div style={s.painelLateral}>
            <p style={s.painelLabel}>Forma de Pagamento</p>

            {FORMAS_PAGAMENTO.map((forma) => (
              <button
                key={forma}
                style={{
                  ...s.btnPagamento,
                  ...(pagamentoSelecionado === forma ? s.btnPagamentoAtivo : {}),
                }}
                onClick={() => setPagamentoSelecionado(forma)}
              >
                {forma}
              </button>
            ))}

            <div style={s.separador} />
            <p style={s.painelLabel}>Subtotal</p>
            <p style={s.subtotalValor}>
              R$ {subtotal.toFixed(2).replace(".", ",")}
            </p>
            <div style={s.separador} />
            <button
              style={{ ...s.btnCadastro, ...(!formValido || isSubmitting ? s.botaoDisabled : {}) }}
              onClick={handleSubmit}
              disabled={!formValido || isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Cadastro de aluguel"}
            </button>
          </div>
        </div>
      </div>

      {toast && <Toast mensagem={toast.mensagem} tipo={toast.tipo} />}
    </div>
  );
}

const s = {
  pagina: { minHeight: "100vh", backgroundColor: "#d4d4b8", fontFamily: "'Segoe UI','Roboto',sans-serif" },
  topbar: { position: "relative", backgroundColor: "#FFD600", height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" },
  topbarEsq: { display: "flex", alignItems: "center", gap: 8 },
  topbarNome: { fontWeight: "700", fontSize: "13px", color: "#1a1a1a" },
  hamburger: { display: "flex", flexDirection: "column", gap: 5, cursor: "pointer", padding: "4px" },
  hambLine: { display: "block", width: 24, height: 3, backgroundColor: "#1a2a5e", borderRadius: 2 },
  dropMenu: { position: "absolute", top: 52, right: 0, backgroundColor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", borderRadius: "0 0 6px 6px", zIndex: 100, minWidth: 140 },
  dropItem: { display: "block", width: "100%", padding: "10px 16px", background: "none", border: "none", textAlign: "left", cursor: "pointer", fontSize: 14, color: "#333" },
  conteudo: { display: "flex", gap: 12, padding: "14px 12px", maxWidth: 860, margin: "0 auto" },
  colunaEsq: { flex: 1, display: "flex", flexDirection: "column", gap: 12 },
  colunaDireita: { width: 160, flexShrink: 0 },
  card: { backgroundColor: "#c8c8a8", borderRadius: 6, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.1)" },
  cardHeader: { backgroundColor: "#1a2a5e", padding: "8px 14px", textAlign: "center" },
  cardHeaderTexto: { color: "#FFD600", fontWeight: "700", fontSize: 14 },
  cardBody: { padding: "12px 14px" },
  linhaMetade: { display: "flex", gap: 12, marginBottom: 6 },
  grupo: { display: "flex", flexDirection: "column", flex: 2 },
  grupoDir: { display: "flex", flexDirection: "column", flex: 1 },
  label: { fontSize: 11, color: "#444", fontWeight: "500", marginBottom: 3 },
  input: { backgroundColor: "#e8e8cc", border: "none", borderRadius: 3, padding: "6px 9px", fontSize: 13, color: "#1a1a1a", outline: "none", width: "100%", boxSizing: "border-box" },
  botaoAdicionar: { marginTop: 8, backgroundColor: "#1a2a5e", color: "#FFD600", border: "none", borderRadius: 4, padding: "7px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "block", marginLeft: "auto" },
  tabelaHeader: { backgroundColor: "#1a2a5e", display: "flex", padding: "7px 14px" },
  tabelaCol: { flex: 1, color: "#FFD600", fontWeight: 700, fontSize: 13, textAlign: "center" },
  tabelaLinha: { display: "flex", padding: "8px 14px", borderBottom: "1px solid #b8b898", backgroundColor: "#c8c8a8" },
  tabelaCell: { flex: 1, fontSize: 13, color: "#1a1a1a", textAlign: "center" },
  semItens: { padding: "12px 14px", color: "#888", fontSize: 12, fontStyle: "italic", margin: 0, textAlign: "center" },
  btnRemover: { background: "none", border: "none", color: "#c0392b", cursor: "pointer", fontSize: 16, fontWeight: 700, lineHeight: 1, padding: 0 },
  painelLateral: { backgroundColor: "#c8c8a8", borderRadius: 6, padding: "14px 12px", boxShadow: "0 1px 6px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, position: "sticky", top: 14 },
  painelLabel: { fontSize: 12, color: "#555", fontWeight: 600, margin: 0, textAlign: "center" },
  btnPagamento: { backgroundColor: "#1a2a5e", color: "#fff", border: "2px solid transparent", borderRadius: 4, padding: "7px 0", width: "100%", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.15s" },
  btnPagamentoAtivo: { backgroundColor: "#FFD600", color: "#1a2a5e", border: "2px solid #1a2a5e" },
  separador: { height: 1, width: "100%", backgroundColor: "#b0b090", margin: "2px 0" },
  subtotalValor: { fontSize: 15, fontWeight: 700, color: "#1a2a5e", margin: 0, textAlign: "center" },
  btnCadastro: { backgroundColor: "#1a2a5e", color: "#FFD600", border: "none", borderRadius: 4, padding: "8px 6px", width: "100%", fontSize: 11, fontWeight: 700, cursor: "pointer", textAlign: "center", lineHeight: 1.3, transition: "opacity 0.2s" },
  botaoDisabled: { opacity: 0.45, cursor: "not-allowed" },
};

export default CadastroEstoque;