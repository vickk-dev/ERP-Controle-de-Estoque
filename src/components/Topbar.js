import { useState } from "react";
import { Link } from "react-router-dom";
// IMPORT DESATIVADO TEMPORARIAMENTE PARA EVITAR ECRÃ BRANCO
// import { Logout } from "./Logout";

function Topbar() {
  const [aberto, setAberto] = useState(false);
  
  // FUNÇÃO DESATIVADA TEMPORARIAMENTE
  // const { logout } = Logout();

  const toggleMenu = () => setAberto((prev) => !prev);

  return (
    <div style={styles.topbar}>

      {/* NOVO CONTAINER DA LOGO: Vetor SVG idêntico ao do Login + Texto */}
      <Link to="/" style={styles.logoContainer}>
        <div style={styles.logoIcon}>
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: 32, height: 32 }}
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
      </Link>

      <div style={styles.direita}>
        <button
          // onClick={logout} <-- DESATIVADO TEMPORARIAMENTE
          style={styles.logoutBtn}
          title="Sair"
          aria-label="Encerrar sessão"
        >
          <LogoutIcon />
        </button>

        <div style={styles.hamburger} onClick={toggleMenu} aria-label="Menu">
          ☰
        </div>
      </div>

      {aberto && (
        <div style={styles.menu}>
          {/* MENU COM ÍCONES PADRONIZADOS */}
          <Link to="/aluguel" style={styles.link} onClick={() => setAberto(false)}>
            <span style={styles.menuIcon}>📅</span> Aluguel
          </Link>
          <Link to="/clientes" style={styles.link} onClick={() => setAberto(false)}>
            <span style={styles.menuIcon}>👥</span> Clientes
          </Link>
          <Link to="/estoque" style={styles.link} onClick={() => setAberto(false)}>
            <span style={styles.menuIcon}>🔧</span> Estoque
          </Link>
          <Link to="/pedidos" style={styles.link} onClick={() => setAberto(false)}>
            <span style={styles.menuIcon}>💲</span> Pedidos
          </Link>
          <Link to="/relatorio" style={styles.link} onClick={() => setAberto(false)}>
            <span style={styles.menuIcon}>📊</span> Relatórios
          </Link>
        </div>
      )}
    </div>
  );
}

function LogoutIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

const styles = {
  topbar: {
    position: "fixed",
    top: 0,
    width: "100%",
    height: "60px",
    backgroundColor: "#FFD600",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    boxSizing: "border-box",
    zIndex: 1000,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)", // Adicionado um sombreado sutil
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none", // Remove o sublinhado do link
  },
  logoIcon: { 
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
  },
  logoTexto: {
    fontWeight: "800",
    fontSize: "18px",
    color: "#1a1a1a",
    letterSpacing: "0.5px",
  },
  direita: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoutBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#333",
    display: "flex",
    alignItems: "center",
    padding: "6px",
    borderRadius: "6px",
    transition: "background 0.15s",
  },
  hamburger: {
    fontSize: "24px",
    cursor: "pointer",
    userSelect: "none", // Evita que o texto seja selecionado ao clicar
  },
  menu: {
    position: "absolute",
    top: "70px",
    right: "20px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0px 8px 24px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    padding: "8px 0", // Espaçamento vertical no menu
    minWidth: "160px",
  },
  link: {
    padding: "12px 20px",
    textDecoration: "none",
    color: "#333",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontWeight: "500",
    fontSize: "15px",
    transition: "background-color 0.2s",
  },
  menuIcon: {
    fontSize: "18px",
  }
};

export default Topbar;