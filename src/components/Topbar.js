import { useState } from "react";
  import { Link } from "react-router-dom";
  import { Logout } from "./Logout";

  function Topbar() {
    const [aberto, setAberto] = useState(false);
    const { logout } = Logout();

    const toggleMenu = () => setAberto((prev) => !prev);

    return (
      <div style={styles.topbar}>

        <Link to="/">
          <img src="/imagens/logo.png" alt="Logo" style={styles.logo} />
        </Link>

        <div style={styles.direita}>
          <button
            onClick={logout}
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
            <Link to="/aluguel" style={styles.link} onClick={() => setAberto(false)}>Aluguel</Link>
            <Link to="/clientes" style={styles.link} onClick={() => setAberto(false)}>Clientes</Link>
            <Link to="/estoque" style={styles.link} onClick={() => setAberto(false)}>Estoque</Link>
            <Link to="/pedidos" style={styles.link} onClick={() => setAberto(false)}>Pedidos</Link>
            <Link to="/relatorio" style={styles.link} onClick={() => setAberto(false)}>Relatório</Link>
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
    },
    logo: {
      height: "40px",
      objectFit: "contain",
    },
    direita: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
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
      fontSize: "28px",
      cursor: "pointer",
    },
    menu: {
      position: "absolute",
      top: "60px",
      right: "10px",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
      display: "flex",
      flexDirection: "column",
      padding: "10px",
    },
    link: {
      padding: "10px",
      textDecoration: "none",
      color: "#333",
    },
  };

  export default Topbar;