import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CadastroCliente from "./pages/CadastroCliente";
import CadastroEstoque from "./pages/CadastroEstoque";
import RelatorioFaturamento from "./pages/RelatorioFaturamento";

function CadastroClienteWrapper() {
  const navigate = useNavigate();

  return <CadastroCliente onCancelar={() => navigate("/dashboard")} />;
}

function CadastroEstoqueWrapper() {
  const navigate = useNavigate();

  return <CadastroEstoque onCancelar={() => navigate("/dashboard")} />;
}

// wrapper do relatório
function RelatorioWrapper() {
  const navigate = useNavigate();

  return <RelatorioFaturamento onVoltar={() => navigate("/dashboard")} />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route
            path="/clientes/cadastro"
            element={<CadastroClienteWrapper />}
          />

          <Route
            path="/estoque/cadastro"
            element={<CadastroEstoqueWrapper />}
          />

          {/* rota do relatório */}
          <Route
            path="/relatorio"
            element={<RelatorioWrapper />}
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;