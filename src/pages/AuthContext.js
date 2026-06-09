import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

const TOKEN_KEY = "@ERP_Ferramentas:token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [usuario, setUsuario] = useState(null);

  const salvarSessao = useCallback((novoToken, dadosUsuario) => {
    localStorage.setItem(TOKEN_KEY, novoToken);
    setToken(novoToken);
    setUsuario(dadosUsuario || null);
  }, []);

  const encerrarSessao = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUsuario(null);
  }, []);

  const estaAutenticado = Boolean(token);

  return (
    <AuthContext.Provider
      value={{ token, usuario, estaAutenticado, salvarSessao, encerrarSessao }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}