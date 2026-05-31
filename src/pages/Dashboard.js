import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const navigate = useNavigate();
  const { encerrarSessao, usuario } = useAuth();

  const handleLogout = () => {
    encerrarSessao();
    navigate("/login", { replace: true });
  };

  const menus = [
    { label: "Clientes", sub: "Cadastrar cliente", rota: "/clientes/cadastro", icon: "👤" },
    { label: "Estoque", sub: "Cadastrar item", rota: "/estoque/cadastro", icon: "🔧" },
  ];

  return (
    <div style={s.pagina}>
      <div style={s.topbar}>
        <div style={s.topbarLogo}>
          <svg viewBox="0 0 40 40" fill="none" style={{ width: 34, height: 34 }}>
            <circle cx="20" cy="20" r="20" fill="#1a2a5e" />
            <path d="M12 20 C12 15,16 11,20 11 C24 11,28 15,28 20 C28 25,24 29,20 29 C16 29,12 25,12 20Z"
              fill="none" stroke="white" strokeWidth="2.5" />
            <path d="M20 11 L20 8 M20 29 L20 32 M11 20 L8 20 M29 20 L32 20"
              stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="20" cy="20" r="3" fill="white" />
          </svg>
          <span style={s.topbarNome}>O FERRAMENTEIRO</span>
        </div>
        <span style={s.topbarBemVindo}>
          Ola, {usuario?.nome || "Admin"}
        </span>
        <button style={s.botaoSair} onClick={handleLogout}>Sair</button>
      </div>

      <div style={s.conteudo}>
        <h2 style={s.titulo}>Menu Principal</h2>
        <div style={s.grid}>
          {menus.map((m) => (
            <div key={m.rota} style={s.card} onClick={() => navigate(m.rota)}>
              <span style={s.cardIcon}>{m.icon}</span>
              <span style={s.cardLabel}>{m.label}</span>
              <span style={s.cardSub}>{m.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const s = {
  pagina: { minHeight:"100vh", backgroundColor:"#f0f0e8", fontFamily:"'Segoe UI','Roboto',sans-serif" },
  topbar: { backgroundColor:"#FFD600", height:52, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 20px" },
  topbarLogo: { display:"flex", alignItems:"center", gap:8 },
  topbarNome: { fontWeight:"700", fontSize:13, color:"#1a1a1a" },
  topbarBemVindo: { fontSize:13, color:"#1a1a1a", fontWeight:"500" },
  botaoSair: { backgroundColor:"#1a2a5e", color:"#fff", border:"none", borderRadius:4, padding:"7px 16px", cursor:"pointer", fontWeight:"600", fontSize:13 },
  conteudo: { padding:"40px 24px", display:"flex", flexDirection:"column", alignItems:"center" },
  titulo: { color:"#1a2a5e", fontSize:22, fontWeight:"700", marginBottom:28, margin:"0 0 28px 0" },
  grid: { display:"flex", gap:20, flexWrap:"wrap", justifyContent:"center" },
  card: {
    backgroundColor:"#d6d6c8", borderRadius:10, padding:"32px 28px",
    width:160, display:"flex", flexDirection:"column", alignItems:"center", gap:10,
    cursor:"pointer", boxShadow:"0 2px 10px rgba(0,0,0,0.1)",
    transition:"transform 0.15s, box-shadow 0.15s",
    border:"2px solid transparent",
  },
  cardIcon: { fontSize:36 },
  cardLabel: { fontWeight:"700", fontSize:16, color:"#1a2a5e", textAlign:"center" },
  cardSub: { fontSize:12, color:"#666", textAlign:"center" },
};

export default Dashboard;