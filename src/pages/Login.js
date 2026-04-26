import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

async function fazerLogin(login, senha) {
  const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login, senha }),
    signal: AbortSignal.timeout(10000),
  });

  if (response.status === 401) {
    throw { tipo: "credenciais", mensagem: "Usuario ou senha incorretos" };
  }

  if (!response.ok) {
    throw { tipo: "servidor", mensagem: "Erro de conexao com o servidor. Tente novamente." };
  }

  return response.json();
}

function Login() {
  const [credenciais, setCredenciais] = useState({ usuario: "", senha: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erroLocal, setErroLocal] = useState("");

  const senhaRef = useRef(null);
  const navigate = useNavigate();
  const { salvarSessao } = useAuth();

  const camposValidos =
    credenciais.usuario.trim() !== "" && credenciais.senha.trim() !== "";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredenciais((prev) => ({ ...prev, [name]: value }));
    if (erroLocal) setErroLocal("");
  };

  const handleSubmit = async () => {
    if (!camposValidos || isSubmitting) return;

    setIsSubmitting(true);
    setErroLocal("");

    try {
      const dados = await fazerLogin(
        credenciais.usuario.trim(),
        credenciais.senha
      );

      salvarSessao(dados.token, dados.usuario || null);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err.tipo === "credenciais") {
        setErroLocal(err.mensagem);
        setCredenciais((prev) => ({ ...prev, senha: "" }));
        setTimeout(() => senhaRef.current?.focus(), 0);
      } else if (
        err.name === "TimeoutError" ||
        err.name === "AbortError" ||
        err instanceof TypeError
      ) {
        setErroLocal("Erro de conexao com o servidor. Tente novamente.");
      } else {
        setErroLocal(
          err.mensagem || "Erro de conexao com o servidor. Tente novamente."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div style={styles.fundo}>
      <div style={styles.card}>

        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>
            <svg
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: 40, height: 40 }}
            >
              <circle cx="20" cy="20" r="20" fill="#1a2a5e" />
              <path
                d="M12 20 C12 15, 16 11, 20 11 C24 11, 28 15, 28 20 C28 25, 24 29, 20 29 C16 29, 12 25, 12 20Z"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
              />
              <path
                d="M20 11 L20 8 M20 29 L20 32 M11 20 L8 20 M29 20 L32 20"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="20" cy="20" r="3" fill="white" />
            </svg>
          </div>
          <span style={styles.logoTexto}>O FERRAMENTEIRO</span>
        </div>

        <h2 style={styles.titulo}>LOGIN</h2>

        <div style={styles.campoContainer}>
          <label style={styles.label} htmlFor="usuario">
            Usuario
          </label>
          <input
            id="usuario"
            name="usuario"
            type="text"
            value={credenciais.usuario}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={isSubmitting}
            style={{
              ...styles.input,
              ...(isSubmitting ? styles.inputDisabled : {}),
            }}
            autoComplete="username"
            autoFocus
          />
        </div>

        <div style={styles.campoContainer}>
          <label style={styles.label} htmlFor="senha">
            Senha
          </label>
          <input
            id="senha"
            name="senha"
            type="password"
            ref={senhaRef}
            value={credenciais.senha}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={isSubmitting}
            style={{
              ...styles.input,
              ...(isSubmitting ? styles.inputDisabled : {}),
            }}
            autoComplete="current-password"
          />
        </div>

        {erroLocal && <p style={styles.erro}>{erroLocal}</p>}

        <button
          onClick={handleSubmit}
          disabled={!camposValidos || isSubmitting}
          style={{
            ...styles.botao,
            ...(!camposValidos || isSubmitting ? styles.botaoDisabled : {}),
          }}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <span style={styles.spinnerContainer}>
              <span style={styles.spinner} /> Aguarde...
            </span>
          ) : (
            "Entrar"
          )}
        </button>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  fundo: {
    minHeight: "100vh",
    backgroundColor: "#FFD600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', 'Roboto', sans-serif",
  },
  card: {
    backgroundColor: "#e8e8e8",
    borderRadius: "10px",
    padding: "36px 40px 40px",
    width: "100%",
    maxWidth: "340px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "18px",
  },
  logoIcon: { flexShrink: 0 },
  logoTexto: {
    fontWeight: "700",
    fontSize: "16px",
    color: "#1a1a1a",
    letterSpacing: "0.5px",
  },
  titulo: {
    margin: "0 0 22px 0",
    fontSize: "20px",
    fontWeight: "700",
    color: "#1a1a1a",
    letterSpacing: "2px",
  },
  campoContainer: { width: "100%", marginBottom: "16px" },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "5px",
  },
  input: {
    width: "100%",
    padding: "8px 10px",
    fontSize: "14px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#ffffff",
    outline: "none",
    boxSizing: "border-box",
    transition: "box-shadow 0.2s",
  },
  inputDisabled: { opacity: 0.6, cursor: "not-allowed" },
  erro: {
    width: "100%",
    color: "#c0392b",
    backgroundColor: "#fde8e8",
    border: "1px solid #e0a0a0",
    borderRadius: "4px",
    padding: "8px 10px",
    fontSize: "13px",
    marginBottom: "12px",
    textAlign: "center",
    boxSizing: "border-box",
  },
  botao: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#1a2a5e",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "700",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "6px",
    letterSpacing: "1px",
    transition: "background-color 0.2s, opacity 0.2s",
  },
  botaoDisabled: { opacity: 0.5, cursor: "not-allowed" },
  spinnerContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  spinner: {
    display: "inline-block",
    width: "14px",
    height: "14px",
    border: "2px solid rgba(255,255,255,0.4)",
    borderTopColor: "#ffffff",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
};

export default Login;