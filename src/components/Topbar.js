import { useState } from "react";
import { Link } from "react-router-dom";

function Topbar() {
  const [aberto, setAberto] = useState(false);

  const toggleMenu = () => {
    setAberto(!aberto);
  };

  return (
    <div style={styles.topbar}>
  
      <img src="/imagens/logo.png" alt="Logo" style={styles.logo} />

      <div style={styles.hamburger} onClick={toggleMenu}>
        ☰
      </div>

      {aberto && (
        <div style={styles.menu}>
          <Link to="/aluguel" style={styles.link}>Aluguel</Link>
          <Link to="/clientes" style={styles.link}>Clientes</Link>
          <Link to="/estoque" style={styles.link}>Estoque</Link>
          <Link to="/pedidos" style={styles.link}>Pedidos</Link>
          <Link to="/relatorio" style={styles.link}>Relatório</Link>
        </div>
      )}
    </div>
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