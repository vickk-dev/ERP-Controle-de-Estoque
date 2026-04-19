import Topbar from "../components/Topbar";

function estoque() {
  return (
    <div>
      <Topbar />

      <div style={styles.container}>
        <h1>Estoque</h1>
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

export default estoque;