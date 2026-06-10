import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // <-- Importamos o useNavigate aqui

import logoImg from '../imagens/logo.png';
import imgAluguel from '../imagens/aluguel.png';
import imgCliente from '../imagens/cliente.png';
import imgEstoque from '../imagens/estoque.png';
import imgPedidos from '../imagens/pedidos.png';
import imgRelatorios from '../imagens/relatorios.png';

function Topbar() {
  const [aberto, setAberto] = useState(false);
  const navigate = useNavigate(); 

  const toggleMenu = () => setAberto((prev) => !prev);

  function handleLogout() {

    localStorage.removeItem("@ERP_Ferramentas:token");
    
    navigate("/", { replace: true });
  }

  return (
    <div style={styles.topbar}>

      {/* CONTAINER DA LOGO: Agora o clique nela leva pro "/menu" */}
      <Link to="/menu" style={styles.logoContainer}>
        <img 
          src={logoImg} 
          alt="Logo O Ferramenteiro" 
          style={{ height: '45px', width: 'auto', objectFit: 'contain' }} 
        />
        <span style={styles.logoTexto}></span>
      </Link>

      <div style={styles.direita}>
        
        {/* BOTÃO DA PORTINHA COM A FUNÇÃO DE LOGOUT */}
        <button
          style={styles.logoutBtn}
          title="Sair"
          aria-label="Encerrar sessão"
          onClick={handleLogout} // <-- Adicionamos o evento de clique aqui
        >
          <LogoutIcon />
        </button>

        <div style={styles.hamburger} onClick={toggleMenu} aria-label="Menu">
          ☰
        </div>
      </div>

      {aberto && (
        <div style={styles.menu}>
          {/* MENU COM IMAGENS - Tamanho fixado em 24x24 */}
          <Link to="/aluguel" style={styles.link} onClick={() => setAberto(false)}>
            <img src={imgAluguel} alt="Aluguel" style={styles.menuIcon} /> Aluguel
          </Link>
          <Link to="/clientes" style={styles.link} onClick={() => setAberto(false)}>
            <img src={imgCliente} alt="Clientes" style={styles.menuIcon} /> Clientes
          </Link>
          <Link to="/estoque" style={styles.link} onClick={() => setAberto(false)}>
            <img src={imgEstoque} alt="Estoque" style={styles.menuIcon} /> Estoque
          </Link>
          <Link to="/pedidos" style={styles.link} onClick={() => setAberto(false)}>
            <img src={imgPedidos} alt="Pedidos" style={styles.menuIcon} /> Pedidos
          </Link>
          <Link to="/relatorio" style={styles.link} onClick={() => setAberto(false)}>
            <img src={imgRelatorios} alt="Relatórios" style={styles.menuIcon} /> Relatórios
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
    height: "80px", 
    backgroundColor: "#FFD600",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    boxSizing: "border-box",
    zIndex: 1000,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)", 
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    textDecoration: "none",
  },
  logoTexto: {
    fontWeight: "800",
    fontSize: "20px", 
    color: "#1a2a5e", 
    letterSpacing: "0.5px",
  },
  direita: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
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
    userSelect: "none", 
    color: "#1a2a5e",
  },
  menu: {
    position: "absolute",
    top: "85px",
    right: "20px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0px 8px 24px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    padding: "10px 0", 
    minWidth: "180px",
  },
  link: {
    padding: "12px 20px",
    textDecoration: "none",
    color: "#333",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontWeight: "600",
    fontSize: "15px",
    transition: "background-color 0.2s",
  },
  menuIcon: {
    width: "24px",
    height: "24px",
    objectFit: "contain",
    flexShrink: 0, 
    filter: "brightness(0) invert(0.15)",
  }
};

export default Topbar;