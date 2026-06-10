import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Topbar from "./components/Topbar";
import Login from "./pages/Login"; 
import Menu from "./pages/Menu"; 
import Estoque from "./pages/Estoque";
import Clientes from "./pages/Clientes";
import Aluguel from "./pages/Aluguel";
import Pedidos from "./pages/Pedidos";
import Relatorios from "./pages/Relatorios";
import { AuthProvider } from "./pages/AuthContext";

function LayoutSistema({ children }) {
  return (
    <div className="erp-fundo-global">
      <Topbar />
      <div className="erp-conteudo">
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rota inicial agora é o Login (completamente limpo, sem Topbar) */}
          <Route path="/" element={<Login />} />

          {/* Rotas do sistema (Envolvidas no LayoutSistema para ter a Topbar) */}
          <Route path="/menu" element={<LayoutSistema><Menu /></LayoutSistema>} />
          <Route path="/aluguel" element={<LayoutSistema><Aluguel /></LayoutSistema>} />
          <Route path="/clientes" element={<LayoutSistema><Clientes /></LayoutSistema>} />
          <Route path="/estoque" element={<LayoutSistema><Estoque /></LayoutSistema>} />
          <Route path="/pedidos" element={<LayoutSistema><Pedidos /></LayoutSistema>} />
          <Route path="/relatorio" element={<LayoutSistema><Relatorios /></LayoutSistema>} />
          
          {/* Se tentarem acessar uma rota que não existe, joga de volta pro Login */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;