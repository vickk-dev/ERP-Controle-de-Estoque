import { useState, useCallback } from "react";
import { useAuth } from "./AuthContext";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

// Mascaras
function aplicarMascaraCPF(valor) {
  return valor.replace(/\D/g, "").slice(0, 11).replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function aplicarMascaraCNPJ(valor) {
  return valor.replace(/\D/g, "").slice(0, 14).replace(/(\d{2})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1/$2").replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

function aplicarMascaraTelefone(valor) {
  const digits = valor.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) return digits.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d{1,4})$/, "$1-$2");
  return digits.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

// Validacoes matematicas
function validarCPF(cpf) {
  const d = cpf.replace(/\D/g, "");
  if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(d[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(d[9])) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(d[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(d[10]);
}

function validarCNPJ(cnpj) {
  const d = cnpj.replace(/\D/g, "");
  if (d.length !== 14 || /^(\d)\1+$/.test(d)) return false;
  const calc = (n) => {
    let soma = 0, pos = n - 7;
    for (let i = n; i >= 1; i--) { soma += parseInt(d[n - i]) * pos--; if (pos < 2) pos = 9; }
    const r = soma % 11;
    return r < 2 ? 0 : 11 - r;
  };
  return calc(12) === parseInt(d[12]) && calc(13) === parseInt(d[13]);
}

function documentoValido(tipo, valor) {
  if (tipo === "CPF") return validarCPF(valor);
  return validarCNPJ(valor);
}

// Toast
function Toast({ mensagem, tipo }) {
  return (
    <div style={{ ...styles.toast, ...(tipo === "sucesso" ? styles.toastSucesso : styles.toastErro) }}>
      {tipo === "sucesso" ? "✓" : "✕"} {mensagem}
    </div>
  );
}

const ESTADO_INICIAL = { tipo_documento: "CPF", documento: "", nome_razao_social: "", telefone: "", endereco_completo: "" };

function CadastroCliente({ onCancelar }) {
  const [form, setForm] = useState(ESTADO_INICIAL);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const { token } = useAuth();

  const exibirToast = (mensagem, tipo = "sucesso") => {
    setToast({ mensagem, tipo });
    setTimeout(() => setToast(null), 3500);
  };

  const handleTipoDocumento = (e) => {
    setForm((prev) => ({ ...prev, tipo_documento: e.target.value, documento: "" }));
  };

  const handleDocumento = (e) => {
    const raw = e.target.value;
    const mascarado = form.tipo_documento === "CPF" ? aplicarMascaraCPF(raw) : aplicarMascaraCNPJ(raw);
    setForm((prev) => ({ ...prev, documento: mascarado }));
  };

  const handleTelefone = (e) => {
    setForm((prev) => ({ ...prev, telefone: aplicarMascaraTelefone(e.target.value) }));
  };

  const handleChange = (campo) => (e) => {
    setForm((prev) => ({ ...prev, [campo]: e.target.value }));
  };

  const formValido =
    form.nome_razao_social.trim() !== "" &&
    form.documento.trim() !== "" &&
    form.telefone.trim() !== "" &&
    form.endereco_completo.trim() !== "" &&
    documentoValido(form.tipo_documento, form.documento);

  const handleSubmit = async () => {
    if (!formValido || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/api/v1/clientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          tipo_documento: form.tipo_documento,
          documento: form.documento,
          nome_razao_social: form.nome_razao_social.trim(),
          telefone: form.telefone,
          endereco_completo: form.endereco_completo.trim(),
        }),
        signal: AbortSignal.timeout(10000),
      });

      if (response.status === 201) {
        exibirToast("Cliente cadastrado com sucesso!", "sucesso");
        setForm(ESTADO_INICIAL);
      } else if (response.status === 409) {
        exibirToast("Documento já cadastrado.", "erro");
      } else {
        exibirToast("Erro ao cadastrar. Tente novamente.", "erro");
      }
    } catch {
      exibirToast("Erro de conexão com o servidor.", "erro");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.pagina}>
      <div style={styles.container}>
        <h2 style={styles.tituloPagina}>Cadastro de Cliente</h2>
        
        {/* Card */}
        <div style={styles.card}>
          <div style={styles.tipoPessoaBar}>
            <span style={styles.tipoPessoaLabel}>Tipo de pessoa</span>
            <label style={styles.radioLabel}>
              <input type="radio" name="tipo_documento" value="CPF" checked={form.tipo_documento === "CPF"} onChange={handleTipoDocumento} style={styles.radioInput} />
              Pessoa Física
            </label>
            <label style={styles.radioLabel}>
              <input type="radio" name="tipo_documento" value="CNPJ" checked={form.tipo_documento === "CNPJ"} onChange={handleTipoDocumento} style={styles.radioInput} />
              Pessoa Jurídica
            </label>
          </div>

          <div style={styles.corpo}>
            <div style={styles.grupo}>
              <label style={styles.label}>Nome Completo</label>
              <input style={styles.input} type="text" value={form.nome_razao_social} onChange={handleChange("nome_razao_social")} placeholder={form.tipo_documento === "CPF" ? "Nome completo" : "Razão social"} disabled={isSubmitting} />
            </div>

            <div style={styles.grupo}>
              <label style={styles.label}>{form.tipo_documento === "CPF" ? "CPF" : "CNPJ"}</label>
              <input style={styles.input} type="text" value={form.documento} onChange={handleDocumento} placeholder={form.tipo_documento === "CPF" ? "000.000.000-00" : "00.000.000/0000-00"} disabled={isSubmitting} />
            </div>

            <div style={styles.linhaMetade}>
              <div style={{ ...styles.grupo, flex: 1 }}>
                <label style={styles.label}>Telefone</label>
                <input style={styles.input} type="text" value={form.telefone} onChange={handleTelefone} placeholder="(00) 00000-0000" disabled={isSubmitting} />
              </div>
              <div style={{ ...styles.grupo, flex: 1 }}>
                <label style={styles.label}>Endereço Completo</label>
                <input style={styles.input} type="text" value={form.endereco_completo} onChange={handleChange("endereco_completo")} placeholder="Rua, número, bairro, cidade" disabled={isSubmitting} />
              </div>
            </div>
          </div>

          <div style={styles.rodape}>
            <button style={styles.botaoCancelar} onClick={onCancelar} disabled={isSubmitting}>Cancelar</button>
            <button style={{ ...styles.botaoCadastrar, ...(!formValido || isSubmitting ? styles.botaoDisabled : {}) }} onClick={handleSubmit} disabled={!formValido || isSubmitting}>
              {isSubmitting ? "Aguarde..." : "Cadastrar"}
            </button>
          </div>
        </div>
      </div>
      {toast && <Toast mensagem={toast.mensagem} tipo={toast.tipo} />}
    </div>
  );
}

const styles = {
  pagina: { minHeight: "100vh", backgroundColor: "#f4f4f9", paddingBottom: "40px" },
  container: { paddingTop: "80px", display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 20px 20px" },
  tituloPagina: { fontSize: "24px", fontWeight: "700", color: "#1a2a5e", marginBottom: "20px", textAlign: "left", width: "100%", maxWidth: "680px" },
  card: { backgroundColor: "#d6d6c8", width: "100%", maxWidth: "680px", borderRadius: "6px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.12)" },
  tipoPessoaBar: { backgroundColor: "#1a2a5e", display: "flex", alignItems: "center", gap: "24px", padding: "10px 20px" },
  tipoPessoaLabel: { color: "#FFD600", fontWeight: "700", fontSize: "15px", marginRight: "8px" },
  radioLabel: { color: "#ffffff", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" },
  radioInput: { accentColor: "#FFD600", width: "14px", height: "14px", cursor: "pointer" },
  corpo: { padding: "20px 20px 8px", display: "flex", flexDirection: "column", gap: "4px" },
  grupo: { display: "flex", flexDirection: "column", marginBottom: "10px" },
  label: { fontSize: "13px", color: "#333", fontWeight: "500", marginBottom: "4px" },
  input: { backgroundColor: "#e8e8d8", border: "none", borderRadius: "3px", padding: "7px 10px", fontSize: "14px", color: "#1a1a1a", outline: "none", width: "100%", boxSizing: "border-box" },
  linhaMetade: { display: "flex", gap: "16px" },
  rodape: { display: "flex", justifyContent: "flex-end", gap: "12px", padding: "12px 20px 20px" },
  botaoCancelar: { backgroundColor: "#1a2a5e", color: "#ffffff", border: "none", borderRadius: "4px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer" },
  botaoCadastrar: { backgroundColor: "#1a2a5e", color: "#ffffff", border: "none", borderRadius: "4px", padding: "9px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", transition: "opacity 0.2s" },
  botaoDisabled: { opacity: 0.45, cursor: "not-allowed" },
  toast: { position: "fixed", bottom: "28px", left: "50%", transform: "translateX(-50%)", padding: "12px 28px", borderRadius: "6px", fontSize: "14px", fontWeight: "600", color: "#fff", boxShadow: "0 4px 16px rgba(0,0,0,0.2)", zIndex: 9999, whiteSpace: "nowrap" },
  toastSucesso: { backgroundColor: "#27ae60" },
  toastErro: { backgroundColor: "#c0392b" },
};

export default CadastroCliente;