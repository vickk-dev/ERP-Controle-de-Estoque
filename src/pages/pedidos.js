import Topbar from "../components/Topbar";

function pedidos() {
  return (
    <div>
      <Topbar />

      <div style={styles.container}>
        <h1>Pedidos</h1>
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginTop: "100px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
    fontSize: "32px",
    fontWeight: "bold",
  },
};

export default pedidos;