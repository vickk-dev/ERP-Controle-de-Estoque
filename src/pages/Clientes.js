import { useState } from "react";
import axios from "axios";

// ATENÇÃO: Garanta que a porta da API corresponde ao seu ambiente
const API_BASE = "http://localhost:8080";
// --- Máscaras ---
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

function aplicarMascaraCEP(valor) {
  return valor.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d{1,3})/, "$1-$2");
}

// --- Validações ---
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

// --- Componente Toast ---
function Toast({ mensagem, tipo }) {
  return (
    <div style={{ ...styles.toast, ...(tipo === "sucesso" ? styles.toastSucesso : styles.toastErro) }}>
      {tipo === "sucesso" ? "✓" : "✕"} {mensagem}
    </div>
  );
}

// O Estado inicial reflete a necessidade real do seu backend
const ESTADO_INICIAL = { 
  tipo_documento: "CPF", 
  documento: "", 
  nome_razao_social: "", 
  nome_fantasia: "",
  telefone: "", 
  cep: "",
  numero: "",
  endereco_completo: "" 
};

function CadastroCliente({ onCancelar }) {
  const [form, setForm] = useState(ESTADO_INICIAL);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const exibirToast = (mensagem, tipo = "sucesso") => {
    setToast({ mensagem, tipo });
    setTimeout(() => setToast(null), 3500);
  };

  const handleChange = (campo) => (e) => {
    setForm((prev) => ({ ...prev, [campo]: e.target.value }));
  };

  const handleTipoDocumento = (e) => {
    setForm((prev) => ({ ...prev, tipo_documento: e.target.value, documento: "", nome_fantasia: "" }));
  };

  const handleDocumento = (e) => {
    const raw = e.target.value;
    const mascarado = form.tipo_documento === "CPF" ? aplicarMascaraCPF(raw) : aplicarMascaraCNPJ(raw);
    setForm((prev) => ({ ...prev, documento: mascarado }));
  };

  const handleTelefone = (e) => {
    setForm((prev) => ({ ...prev, telefone: aplicarMascaraTelefone(e.target.value) }));
  };

  const handleCep = (e) => {
    setForm((prev) => ({ ...prev, cep: aplicarMascaraCEP(e.target.value) }));
  };

  const formValido =
    form.nome_razao_social.trim() !== "" &&
    form.documento.trim() !== "" &&
    form.telefone.trim() !== "" &&
    form.cep.trim() !== "" &&
    form.numero.trim() !== "" &&
    documentoValido(form.tipo_documento, form.documento);

  const handleSubmit = async () => {
    if (!formValido || isSubmitting) return;
    setIsSubmitting(true);

    // O Payload de Integração (Perfeito para o C# CadastrarClienteRequest)
    const payload = {
      tipoDocumento: form.tipo_documento,
      documento: form.documento.replace(/\D/g, ""), // Limpamos a máscara para o banco
      nomeRazaoSocial: form.nome_razao_social.trim(),
      nomeFantasia: form.nome_fantasia.trim() || null,
      telefone: form.telefone.replace(/\D/g, ""),
      cep: form.cep.replace(/\D/g, ""),
      numero: form.numero.trim(),
      enderecoCompleto: form.endereco_completo.trim() || "A preencher" 
    };

    try {
      // POST com Axios: não precisa de JSON.stringify()
      await axios.post(`${API_BASE}/api/v1/clientes`, payload, {
        headers: { 
          "Content-Type": "application/json"
        },
        timeout: 10000 // Substitui o AbortSignal.timeout do fetch
      });

      // Se chegou aqui, a requisição deu sucesso (200, 201, etc)
      exibirToast("Cliente cadastrado com sucesso!", "sucesso");
      setForm(ESTADO_INICIAL);

    } catch (error) {
      // O Axios captura todos os erros (4xx e 5xx) e joga para cá
      if (error.response) {
        // A API respondeu com um erro
        if (error.response.status === 409) {
          exibirToast("Este documento já encontra-se registado.", "erro");
        } else {
          console.error("Erro da API:", error.response.data);
          exibirToast("Erro de validação no servidor. Verifique os dados.", "erro");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.pagina}>
      <div style={styles.container}>
        <h2 style={styles.tituloPagina}>Cadastro de Cliente</h2>
        
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
              <label style={styles.label}>{form.tipo_documento === "CPF" ? "Nome Completo" : "Razão Social"}</label>
              <input style={styles.input} type="text" value={form.nome_razao_social} onChange={handleChange("nome_razao_social")} placeholder={form.tipo_documento === "CPF" ? "Digite o nome completo" : "Digite a razão social"} disabled={isSubmitting} />
            </div>

            {form.tipo_documento === "CNPJ" && (
              <div style={styles.grupo}>
                <label style={styles.label}>Nome Fantasia (Opcional)</label>
                <input style={styles.input} type="text" value={form.nome_fantasia} onChange={handleChange("nome_fantasia")} placeholder="Nome Fantasia" disabled={isSubmitting} />
              </div>
            )}

            <div style={styles.linhaMetade}>
              <div style={{ ...styles.grupo, flex: 1 }}>
                <label style={styles.label}>{form.tipo_documento === "CPF" ? "CPF" : "CNPJ"}</label>
                <input style={styles.input} type="text" value={form.documento} onChange={handleDocumento} placeholder={form.tipo_documento === "CPF" ? "000.000.000-00" : "00.000.000/0000-00"} disabled={isSubmitting} />
              </div>
              <div style={{ ...styles.grupo, flex: 1 }}>
                <label style={styles.label}>Telefone</label>
                <input style={styles.input} type="text" value={form.telefone} onChange={handleTelefone} placeholder="(00) 00000-0000" disabled={isSubmitting} />
              </div>
            </div>

            <div style={styles.linhaMetade}>
              <div style={{ ...styles.grupo, flex: 1 }}>
                <label style={styles.label}>CEP</label>
                <input style={styles.input} type="text" value={form.cep} onChange={handleCep} placeholder="00000-000" disabled={isSubmitting} />
              </div>
              <div style={{ ...styles.grupo, flex: 0.5 }}>
                <label style={styles.label}>Número</label>
                <input style={styles.input} type="text" value={form.numero} onChange={handleChange("numero")} placeholder="123" disabled={isSubmitting} />
              </div>
            </div>

            <div style={styles.grupo}>
              <label style={styles.label}>Endereço Complementar / Referência</label>
              <input style={styles.input} type="text" value={form.endereco_completo} onChange={handleChange("endereco_completo")} placeholder="Ex: Apartamento, Bloco, etc." disabled={isSubmitting} />
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