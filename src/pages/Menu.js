import { Link } from "react-router-dom";

function Menu() {
  return (
    <div>

      <div style={styles.container}>

        <div style={styles.gridTop}>
        
        <Link to="/aluguel" style={styles.card}>
        <img src="/imagens/aluguel.png" style={styles.img} alt="Aluguel" />
        <span>Aluguel</span>
        </Link>

        <Link to="/clientes" style={styles.card}>
        <img src="/imagens/cliente.png" style={styles.img} alt="Cliente" />
        <span>Cadastro de Cliente</span>
        </Link>

        <Link to="/estoque" style={styles.card}>
        <img src="/imagens/estoque.png" style={styles.img} alt="Estoque" />
        <span>Consultar Estoque</span>
        </Link>
        </div>

        <div style={styles.gridBottom}>
        <Link to="/pedidos" style={styles.card}>
        <img src="/imagens/pedidos.png" style={styles.img} alt="Pedidos" />
        <span>Consultar Pedidos</span>
        </Link>

        <Link to="/relatorio" style={styles.card}>
        <img src="/imagens/relatorios.png" style={styles.img} alt="Relatório" />
        <span>Relatório de Locações</span>
        </Link>
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: {
    marginTop: "100px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "30px",
  },

  gridTop: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 240px)",
    gap: "30px",
    justifyContent: "center", 
  },

  gridBottom: {
    display: "flex",
    gap: "30px",
    justifyContent: "center", 
  },

  card: {
  backgroundColor: "#2D3277",
  color: "white",
  padding: "30px 20px",
  textAlign: "center",
  borderRadius: "10px",
  textDecoration: "none",
  fontWeight: "bold",
  width: "200px",

  display: "flex",        
  flexDirection: "column",    
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",                
},
img: {
  width: "80px",   
  height: "80px",
  objectFit: "contain",
}
};

export default Menu;