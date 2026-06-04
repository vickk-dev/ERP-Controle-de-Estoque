import { useState, useCallback } from "react";

const SENHA_MINIMA = 6;

function validarCampos(credenciais, tocados) {
  const erros = {};
  if (tocados.usuario && credenciais.usuario.trim() === "") {
    erros.usuario = "Informe o usuário";
  }
  if (tocados.senha) {
    if (credenciais.senha === "") {
      erros.senha = "Informe a senha";
    } else if (credenciais.senha.length < SENHA_MINIMA) {
      erros.senha = `Mínimo de ${SENHA_MINIMA} caracteres`;
    }
  }
  return erros;
}

function Spinner() {
  return (
    <span
      style={{
        width: 16,
        height: 16,
        border: "2px solid rgba(0,0,0,0.15)",
        borderTopColor: "#111",
        borderRadius: "50%",
        display: "inline-block",
        animation: "spin 0.7s linear infinite",
      }}
      aria-hidden="true"
    />
  );
}

function Login({ onSuccess }) {
  const [credenciais, setCredenciais] = useState({ usuario: "", senha: "" });
  const [tocados, setTocados] = useState({ usuario: false, senha: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erroLocal, setErroLocal] = useState("");

  const erros = validarCampos(credenciais, tocados);
  const isFormValido =
    credenciais.usuario.trim() !== "" &&
    credenciais.senha.trim() !== "";

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
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Login enviado:", credenciais);
      onSuccess?.();
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
        <div style={STYLES.card} role="main">
          <img
            src="./imagens/logo.png"
            alt="Logo"
            style={STYLES.logo}
          />
          <h2 style={STYLES.titulo}>Login</h2>

          <form onSubmit={handleSubmit}>
            <div style={STYLES.field}>
              <label htmlFor="usuario" style={STYLES.label}>Usuário</label>
              <input
                id="usuario"
                type="text"
                name="usuario"
                placeholder="Usuário"
                value={credenciais.usuario}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="username"
                autoCapitalize="none"
                disabled={isSubmitting}
                aria-invalid={!!erros.usuario}
                aria-describedby="usuarioError"
                style={STYLES.input(!!erros.usuario)}
              />
              <span id="usuarioError" style={STYLES.fieldError} role="alert">
                {erros.usuario || ""}
              </span>
            </div>

            <div style={STYLES.field}>
              <label htmlFor="senha" style={STYLES.label}>Senha</label>
              <input
                id="senha"
                type="password"
                name="senha"
                placeholder="Senha"
                value={credenciais.senha}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="current-password"
                disabled={isSubmitting}
                aria-invalid={!!erros.senha}
                aria-describedby="senhaError"
                style={STYLES.input(!!erros.senha)}
              />
              <span id="senhaError" style={STYLES.fieldError} role="alert">
                {erros.senha || ""}
              </span>
            </div>

            {erroLocal && (
              <div style={STYLES.erroLocal} role="alert">
                <span aria-hidden="true">⚠</span>
                <span>{erroLocal}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!isFormValido || isSubmitting}
              style={STYLES.botao(!isFormValido || isSubmitting)}
              aria-busy={isSubmitting}
            >
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
  fundo: {
    minHeight: "100vh",
    background: "#FFD600",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  card: {
    background: "#fff",
    padding: "2.5rem 2rem 2rem",
    borderRadius: "20px",
    width: "340px",
    boxShadow: "0 2px 0 0 rgba(0,0,0,0.12), 0 8px 32px rgba(0,0,0,0.10)",
  },
  logo: {
    width: "140px",
    display: "block",
    margin: "0 auto 1.25rem",
  },
  titulo: {
    textAlign: "center",
    fontSize: "20px",
    fontWeight: 600,
    color: "#111",
    margin: "0 0 1.75rem",
  },
  field: {
    marginBottom: "1rem",
  },
  label: {
    display: "block",
    fontSize: "12px",
    fontWeight: 500,
    color: "#555",
    marginBottom: "5px",
    letterSpacing: "0.03em",
    textTransform: "uppercase",
  },
  input: (hasError) => ({
    width: "100%",
    padding: "10px 12px",
    border: `1.5px solid ${hasError ? "#e24b4a" : "#e0e0e0"}`,
    borderRadius: "10px",
    fontSize: "15px",
    fontFamily: "inherit",
    color: "#111",
    background: "#fafafa",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s, box-shadow 0.15s",
  }),
  fieldError: {
    display: "block",
    fontSize: "12px",
    color: "#e24b4a",
    marginTop: "4px",
    minHeight: "16px",
  },
  erroLocal: {
    background: "#fff5f5",
    border: "1px solid #f7c1c1",
    borderRadius: "8px",
    padding: "9px 12px",
    fontSize: "13px",
    color: "#a32d2d",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "7px",
  },
  botao: (disabled) => ({
    width: "100%",
    padding: "12px",
    background: "#FFD600",
    color: "#111",
    fontFamily: "inherit",
    fontSize: "15px",
    fontWeight: 600,
    border: "none",
    borderRadius: "10px",
    cursor: disabled ? "not-allowed" : "pointer",
    marginTop: "0.5rem",
    opacity: disabled ? 0.55 : 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    letterSpacing: "0.01em",
    transition: "opacity 0.15s, transform 0.1s",
  }),
};

export default Login;