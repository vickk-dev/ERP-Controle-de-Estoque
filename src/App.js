import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./pages/Menu";
import Aluguel from "./pages/aluguel";
import Clientes from "./pages/clientes";
import Estoque from "./pages/estoque";
import Pedidos from "./pages/pedidos";
import Relatorio from "./pages/relatorio";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/aluguel" element={<Aluguel />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/estoque" element={<Estoque />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/relatorio" element={<Relatorio />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;