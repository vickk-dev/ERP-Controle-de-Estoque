import Topbar from "../components/Topbar";

function clientes() {
  return (
    <div>
      <Topbar />

      <div style={styles.container}>
        <h1>Clientes</h1>
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

export default clientes;