import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RotaProtegida from "./components/RotaProtegida";
import Login from "./pages/Login";
//import Dashboard from "./pages/Dashboard";
import CadastroCliente from "./pages/CadastroCliente";
import CadastroEstoque from "./pages/CadastroEstoque";

function CadastroClienteWrapper() {
  const navigate = useNavigate();
  return <CadastroCliente onCancelar={() => navigate(-1)} />;
}

function CadastroEstoqueWrapper() {
  const navigate = useNavigate();
  return <CadastroEstoque onCancelar={() => navigate(-1)} />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
                    
          <Route
            path="/clientes/cadastro"
            element={
              <RotaProtegida>
                <CadastroClienteWrapper />
              </RotaProtegida>
            }
          />

          <Route
            path="/estoque/cadastro"
            element={
              <RotaProtegida>
                <CadastroEstoqueWrapper />
              </RotaProtegida>
            }
          />

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;