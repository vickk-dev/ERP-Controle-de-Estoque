import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import logoImg from '../imagens/logo.png'; // IMPORTANDO A LOGO

const SENHA_MINIMA = 6;

function validarCampos(credenciais, tocados) {
  const erros = {};
  if (tocados.usuario && credenciais.usuario.trim() === "") erros.usuario = "Informe o usuário";
  if (tocados.senha) {
    if (credenciais.senha === "") erros.senha = "Informe a senha";
    else if (credenciais.senha.length < SENHA_MINIMA) erros.senha = `Mínimo de ${SENHA_MINIMA} caracteres`;
  }
  return erros;
}

function Spinner() {
  return (
    <span style={{ width: 16, height: 16, border: "2px solid rgba(0,0,0,0.15)", borderTopColor: "#111", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
  );
}

function Login() {
  const [credenciais, setCredenciais] = useState({ usuario: "", senha: "" });
  const [tocados, setTocados] = useState({ usuario: false, senha: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erroLocal, setErroLocal] = useState("");
  const navigate = useNavigate();

  const erros = validarCampos(credenciais, tocados);
  const isFormValido = credenciais.usuario.trim() !== "" && credenciais.senha.trim() !== "";

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setCredenciais((prev) => ({ ...prev, [name]: value }));
    setErroLocal("");
  }, []);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTocados((prev) => ({ ...prev, [name]: true }));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setTocados({ usuario: true, senha: true });
    if (!isFormValido) return;

    setErroLocal("");
    setIsSubmitting(true);

    try {
      // Simula tempo de rede
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // REDIRECIONA PARA O MENU (Rota principal)
      navigate("/", { replace: true });
    } catch {
      setErroLocal("Erro ao tentar login.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={STYLES.fundo}>
        <div style={STYLES.card}>
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <img src={logoImg} alt="Logo O Ferramenteiro" style={{ width: 72, height: 72, objectFit: 'contain' }} />
          </div>
          <h2 style={STYLES.titulo}>O FERRAMENTEIRO</h2>
          <form onSubmit={handleSubmit}>
            <div style={STYLES.field}>
              <label htmlFor="usuario" style={STYLES.label}>Usuário</label>
              <input
                id="usuario" name="usuario" type="text"
                placeholder="Usuário" value={credenciais.usuario}
                onChange={handleChange} onBlur={handleBlur}
                disabled={isSubmitting} style={STYLES.input(!!erros.usuario)}
              />
              <span style={STYLES.fieldError}>{erros.usuario || ""}</span>
            </div>
            <div style={STYLES.field}>
              <label htmlFor="senha" style={STYLES.label}>Senha</label>
              <input
                id="senha" name="senha" type="password"
                placeholder="Senha" value={credenciais.senha}
                onChange={handleChange} onBlur={handleBlur}
                disabled={isSubmitting} style={STYLES.input(!!erros.senha)}
              />
              <span style={STYLES.fieldError}>{erros.senha || ""}</span>
            </div>
            {erroLocal && (<div style={STYLES.erroLocal}><span>⚠</span><span>{erroLocal}</span></div>)}
            <button type="submit" disabled={!isFormValido || isSubmitting} style={STYLES.botao(!isFormValido || isSubmitting)}>
              {isSubmitting && <Spinner />}
              <span>{isSubmitting ? "Aguarde..." : "Entrar"}</span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

const STYLES = {
  fundo: { minHeight: "100vh", background: "#FFD600", display: "flex", justifyContent: "center", alignItems: "center", padding: "2rem", fontFamily: "'DM Sans', sans-serif" },
  card: { background: "#fff", padding: "2.5rem 2rem 2rem", borderRadius: "20px", width: "340px", boxShadow: "0 8px 32px rgba(0,0,0,0.10)" },
  titulo: { textAlign: "center", fontSize: "20px", fontWeight: 700, color: "#1a2a5e", margin: "0 0 1.75rem", letterSpacing: "1px" },
  field: { marginBottom: "1rem" },
  label: { display: "block", fontSize: "12px", fontWeight: 500, color: "#555", marginBottom: "5px", textTransform: "uppercase" },
  input: (hasError) => ({ width: "100%", padding: "10px 12px", border: `1.5px solid ${hasError ? "#e24b4a" : "#e0e0e0"}`, borderRadius: "10px", fontSize: "15px", boxSizing: "border-box" }),
  fieldError: { display: "block", fontSize: "12px", color: "#e24b4a", marginTop: "4px", minHeight: "16px" },
  erroLocal: { background: "#fff5f5", border: "1px solid #f7c1c1", borderRadius: "8px", padding: "9px 12px", fontSize: "13px", color: "#a32d2d", marginBottom: "1rem", display: "flex", gap: "7px" },
  botao: (disabled) => ({ width: "100%", padding: "12px", background: "#1a2a5e", color: "#fff", fontSize: "15px", fontWeight: 600, border: "none", borderRadius: "10px", cursor: disabled ? "not-allowed" : "pointer", marginTop: "0.5rem", opacity: disabled ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }),
};

export default Login;