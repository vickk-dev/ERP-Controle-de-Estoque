import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

// Importações
import Topbar from "./components/Topbar";
import Menu from "./pages/Menu"; // <-- O seu Menu importado corretamente!
import Estoque from "./pages/Estoque";
import Clientes from "./pages/Clientes";
import Aluguel from "./pages/Aluguel";
import Pedidos from "./pages/Pedidos";
import Relatorios from "./pages/Relatorios";
import { AuthProvider } from "./pages/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="erp-fundo-global">
          <Topbar />
          
          <div className="erp-conteudo">
            <Routes>
              <Route path="/" element={<Menu />} /> {/* <-- Menu agora é a página inicial! */}
              <Route path="/aluguel" element={<Aluguel />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/estoque" element={<Estoque />} />
              <Route path="/pedidos" element={<Pedidos />} />
              <Route path="/relatorio" element={<Relatorios />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;