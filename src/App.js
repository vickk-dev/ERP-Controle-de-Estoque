import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./pages/Menu"; // tirar
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu />} /> //////tirar
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;